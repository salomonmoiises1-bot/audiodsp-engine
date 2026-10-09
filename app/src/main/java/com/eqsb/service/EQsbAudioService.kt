package com.eqsb.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.media.projection.MediaProjection
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.util.Log
import com.eqsb.backend.AudioEffectAudioBackend
import com.eqsb.backend.IAudioBackend
import com.eqsb.backend.OboeAudioBackend
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.data.DspConfigRepository
import com.eqsb.jni.EQsbNativeDsp
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class EQsbAudioService : Service() {

    private val binder = LocalBinder()
    private lateinit var repository: DspConfigRepository
    private lateinit var nativeDsp: EQsbNativeDsp
    private lateinit var oboeBackend: OboeAudioBackend
    private lateinit var effectBackend: AudioEffectAudioBackend
    private lateinit var activeBackend: IAudioBackend

    private val _configFlow = MutableStateFlow(DspConfig())
    val configFlow: StateFlow<DspConfig> = _configFlow.asStateFlow()
    private val _isServiceActive = MutableStateFlow(false)
    val isServiceActive: StateFlow<Boolean> = _isServiceActive.asStateFlow()

    inner class LocalBinder : Binder() {
        fun getService(): EQsbAudioService = this@EQsbAudioService
    }

    companion object {
        private const val TAG = "EQsbAudioService"
        private const val NOTIFICATION_ID = 1001
        private const val CHANNEL_ID = "eqsb_dsp_channel"
        const val ACTION_START = "com.eqsb.action.START"
        const val ACTION_STOP = "com.eqsb.action.STOP"
        const val ACTION_TOGGLE_BYPASS = "com.eqsb.action.TOGGLE_BYPASS"
    }

    override fun onCreate() {
        super.onCreate()
        repository = DspConfigRepository(this)
        nativeDsp = EQsbNativeDsp.create()
        nativeDsp.initialize(sampleRate = 48000, channels = 2, framesPerBlock = 128)

        oboeBackend = OboeAudioBackend()
        effectBackend = AudioEffectAudioBackend(this)

        val initialConfig = repository.loadConfig().copy(backendType = AudioBackendType.AUDIO_EFFECT)
        _configFlow.value = initialConfig
        nativeDsp.applyConfig(initialConfig)
        activeBackend = effectBackend
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> { stopEngine(); stopSelf() }
            ACTION_TOGGLE_BYPASS -> {
                val current = _configFlow.value
                updateConfig(current.copy(bypass = !current.bypass))
            }
            else -> startEngine()
        }
        return START_STICKY
    }

    private fun startEngine() {
        if (!nativeDsp.isNativeReady()) {
            _isServiceActive.value = false
            stopSelf(); return
        }
        startForeground(NOTIFICATION_ID, buildNotification())
        activeBackend = when (_configFlow.value.backendType) {
            AudioBackendType.OBOE -> oboeBackend
            AudioBackendType.AUDIO_EFFECT -> effectBackend
        }
        val started = activeBackend.start(nativeDsp)
        if (!started) { _isServiceActive.value = false; stopSelf(); return }
        activeBackend.applyConfig(_configFlow.value)
        _isServiceActive.value = true
    }

    private fun stopEngine() {
        if (::activeBackend.isInitialized) activeBackend.stop()
        _isServiceActive.value = false
    }

    fun updateConfig(newConfig: DspConfig) {
        _configFlow.value = newConfig
        repository.saveConfig(newConfig)
        nativeDsp.applyConfig(newConfig)
        activeBackend.applyConfig(newConfig)
        if (newConfig.backendType != activeBackend.type) {
            activeBackend.stop()
            activeBackend = when (newConfig.backendType) {
                AudioBackendType.OBOE -> oboeBackend
                AudioBackendType.AUDIO_EFFECT -> effectBackend
            }
            if (_isServiceActive.value) {
                if (activeBackend.start(nativeDsp)) activeBackend.applyConfig(newConfig)
                else _isServiceActive.value = false
            }
        }
    }

    fun getBackend(): IAudioBackend = activeBackend
    
    fun injectMediaProjection(mp: MediaProjection) {
        effectBackend.setMediaProjection(mp)
        if (_isServiceActive.value && activeBackend.type == AudioBackendType.AUDIO_EFFECT) {
            activeBackend.stop()
            activeBackend.start(nativeDsp)
            activeBackend.applyConfig(_configFlow.value)
        }
    }

    fun getNativeDsp(): EQsbNativeDsp = nativeDsp
    override fun onBind(intent: Intent?): IBinder = binder
    override fun onDestroy() { super.onDestroy(); stopEngine(); nativeDsp.destroy() }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "EQsb DSP Service", NotificationManager.IMPORTANCE_LOW)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(this, 0, launchIntent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("EQsb 32-Band Native C++ DSP Active")
                .setContentText("Real PCM processing - YouTube/Spotify/AIMP")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent).setOngoing(true).build()
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
                .setContentTitle("EQsb 32-Band Native C++ DSP Active")
                .setContentText("Real PCM processing - YouTube/Spotify/AIMP")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent).setOngoing(true).build()
        }
    }
}
