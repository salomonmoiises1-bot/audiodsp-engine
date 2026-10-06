package com.eqsb.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.audiofx.AudioEffect
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

    private var oboeBackend = OboeAudioBackend()
    private var effectBackend = AudioEffectAudioBackend()
    private var activeBackend: IAudioBackend = oboeBackend

    private val _configFlow = MutableStateFlow(DspConfig())
    val configFlow: StateFlow<DspConfig> = _configFlow.asStateFlow()

    private val _isServiceActive = MutableStateFlow(false)
    val isServiceActive: StateFlow<Boolean> = _isServiceActive.asStateFlow()

    private val sessionReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent == null) return
            val action = intent.action
            val sessionId = intent.getIntExtra(AudioEffect.EXTRA_AUDIO_SESSION, 0)
            if (action == AudioEffect.ACTION_OPEN_AUDIO_EFFECT_CONTROL_SESSION) {
                Log.i(TAG, "Received OPEN_AUDIO_EFFECT_CONTROL_SESSION for session: $sessionId")
                effectBackend.onSessionOpened(sessionId)
            } else if (action == AudioEffect.ACTION_CLOSE_AUDIO_EFFECT_CONTROL_SESSION) {
                Log.i(TAG, "Received CLOSE_AUDIO_EFFECT_CONTROL_SESSION for session: $sessionId")
                effectBackend.onSessionClosed(sessionId)
            }
        }
    }

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
        nativeDsp.initialize(sampleRate = 48000, channels = 2, framesPerBlock = 256)

        val initialConfig = repository.loadConfig()
        _configFlow.value = initialConfig
        nativeDsp.applyConfig(initialConfig)

        // Register for media session broadcasts
        val filter = IntentFilter().apply {
            addAction(AudioEffect.ACTION_OPEN_AUDIO_EFFECT_CONTROL_SESSION)
            addAction(AudioEffect.ACTION_CLOSE_AUDIO_EFFECT_CONTROL_SESSION)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(sessionReceiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(sessionReceiver, filter)
        }

        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                stopEngine()
                stopSelf()
            }
            ACTION_TOGGLE_BYPASS -> {
                val current = _configFlow.value
                updateConfig(current.copy(bypass = !current.bypass))
            }
            else -> {
                startEngine()
            }
        }
        return START_STICKY
    }

    private fun startEngine() {
        if (!nativeDsp.isNativeReady()) {
            _isServiceActive.value = false
            Log.e(TAG, "Native DSP library is unavailable; refusing to start audio service")
            stopSelf()
            return
        }
        startForeground(NOTIFICATION_ID, buildNotification())
        activeBackend = when (_configFlow.value.backendType) {
            AudioBackendType.OBOE -> oboeBackend
            AudioBackendType.AUDIO_EFFECT -> effectBackend
        }
        val started = activeBackend.start(nativeDsp)
        if (!started) {
            _isServiceActive.value = false
            Log.e(TAG, "Audio backend failed to start: ${activeBackend.name}")
            stopSelf()
            return
        }
        activeBackend.applyConfig(_configFlow.value)
        _isServiceActive.value = true
        Log.i(TAG, "Audio Service started with backend: ${activeBackend.name}")
    }

    private fun stopEngine() {
        activeBackend.stop()
        _isServiceActive.value = false
        Log.i(TAG, "Audio Service stopped.")
    }

    fun updateConfig(newConfig: DspConfig) {
        _configFlow.value = newConfig
        repository.saveConfig(newConfig)
        nativeDsp.applyConfig(newConfig)

        if (newConfig.backendType != activeBackend.type) {
            activeBackend.stop()
            activeBackend = when (newConfig.backendType) {
                AudioBackendType.OBOE -> oboeBackend
                AudioBackendType.AUDIO_EFFECT -> effectBackend
            }
            if (_isServiceActive.value) {
                val started = activeBackend.start(nativeDsp)
                if (started) {
                    activeBackend.applyConfig(newConfig)
                } else {
                    _isServiceActive.value = false
                    Log.e(TAG, "Audio backend switch failed: ${activeBackend.name}")
                }
            }
        }
    }

    fun getNativeDsp(): EQsbNativeDsp = nativeDsp

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onDestroy() {
        super.onDestroy()
        stopEngine()
        try {
            unregisterReceiver(sessionReceiver)
        } catch (e: Exception) {
            Log.w(TAG, "Error unregistering receiver: ${e.message}")
        }
        nativeDsp.destroy()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "EQsb DSP Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "EQsb Real C++ Audio DSP Service Active"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
                .setContentTitle("EQsb 32-Band Native C++ DSP Active")
                .setContentText("Real PCM audio processing active")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build()
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
                .setContentTitle("EQsb 32-Band Native C++ DSP Active")
                .setContentText("Real PCM audio processing active")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build()
        }
    }
}
