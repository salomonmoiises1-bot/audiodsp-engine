package com.audiodsp.engine.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.*
import android.media.projection.MediaProjection
import android.os.Binder
import android.os.Build
import android.os.IBinder
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.audiodsp.engine.dsp.AudioDspEngine
import kotlinx.coroutines.*
import java.util.concurrent.atomic.AtomicBoolean

/**
 * AndroidDspForegroundService
 * 
 * Cumplimiento estricto de Android 14 (API 34) y Android 15:
 * - Ciclo de vida estricto con foregroundServiceType="mediaPlayback|microphone"
 * - Bucle de procesamiento de audio en tiempo real:
 *     AudioRecord (Captura PCM) -> AudioDspEngine (10 etapas DSP) -> AudioTrack (Salida PCM)
 */
class AndroidDspForegroundService : Service() {

    private val binder = LocalBinder()
    val dspEngine = AudioDspEngine(48000.0f)

    private val isRunning = AtomicBoolean(false)
    private var audioRecord: AudioRecord? = null
    private var audioTrack: AudioTrack? = null
    private var processingJob: Job? = null
    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    inner class LocalBinder : Binder() {
        fun getService(): AndroidDspForegroundService = this@AndroidDspForegroundService
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification()

        // En Android 14 (API 34) es obligatorio especificar el tipo de servicio
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        startAudioPipeline()
        return START_STICKY
    }

    private fun startAudioPipeline() {
        if (isRunning.get()) return
        isRunning.set(true)

        processingJob = serviceScope.launch(Dispatchers.IO) {
            val sampleRate = 48000
            val channelConfigIn = AudioFormat.CHANNEL_IN_STEREO
            val channelConfigOut = AudioFormat.CHANNEL_OUT_STEREO
            val audioFormat = AudioFormat.ENCODING_PCM_FLOAT

            val minBufferSizeIn = AudioRecord.getMinBufferSize(sampleRate, channelConfigIn, audioFormat)
            val bufferSize = maxOf(minBufferSizeIn, 2048)

            try {
                // Configurar AudioTrack de salida con AudioAttributes de baja latencia
                val audioAttributes = AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()

                val trackFormat = AudioFormat.Builder()
                    .setSampleRate(sampleRate)
                    .setChannelMask(channelConfigOut)
                    .setEncoding(audioFormat)
                    .build()

                audioTrack = AudioTrack.Builder()
                    .setAudioAttributes(audioAttributes)
                    .setAudioFormat(trackFormat)
                    .setBufferSizeInBytes(bufferSize * 4) // 4 bytes por float
                    .setTransferMode(AudioTrack.MODE_STREAM)
                    .setPerformanceMode(AudioTrack.PERFORMANCE_MODE_LOW_LATENCY)
                    .build()

                audioTrack?.play()

                // Si no se proveyó AudioRecord personalizado (por ej. desde MediaProjection), usar MIC como entrada por defecto
                if (audioRecord == null) {
                    audioRecord = AudioRecord(
                        MediaRecorder.AudioSource.MIC,
                        sampleRate,
                        channelConfigIn,
                        audioFormat,
                        bufferSize * 4
                    )
                }

                audioRecord?.startRecording()

                val floatBuffer = FloatArray(1024) // 512 frames estéreo
                while (isRunning.get() && isActive) {
                    val readCount = audioRecord?.read(floatBuffer, 0, floatBuffer.size, AudioRecord.READ_BLOCKING) ?: 0
                    if (readCount > 0) {
                        val frameCount = readCount / 2

                        // PROCESAMIENTO REAL: Los buffers capturados entran al motor DSP de 10 etapas
                        dspEngine.processInterleavedFloat(floatBuffer, frameCount)

                        // SALIDA REAL: El resultado procesado se escribe en el hardware de salida
                        audioTrack?.write(floatBuffer, 0, readCount, AudioTrack.WRITE_BLOCKING)
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            } finally {
                cleanupAudioHardware()
            }
        }
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    fun setupPlaybackCapture(mediaProjection: MediaProjection) {
        val captureConfig = AudioPlaybackCaptureConfiguration.Builder(mediaProjection)
            .addMatchingUsage(AudioAttributes.USAGE_MEDIA)
            .addMatchingUsage(AudioAttributes.USAGE_GAME)
            .build()

        val audioFormat = AudioFormat.Builder()
            .setEncoding(AudioFormat.ENCODING_PCM_FLOAT)
            .setSampleRate(48000)
            .setChannelMask(AudioFormat.CHANNEL_IN_STEREO)
            .build()

        audioRecord?.stop()
        audioRecord?.release()

        audioRecord = AudioRecord.Builder()
            .setAudioPlaybackCaptureConfig(captureConfig)
            .setAudioFormat(audioFormat)
            .setBufferSizeInBytes(4096)
            .build()

        audioRecord?.startRecording()
    }

    private fun cleanupAudioHardware() {
        try {
            audioRecord?.stop()
            audioRecord?.release()
            audioRecord = null

            audioTrack?.stop()
            audioTrack?.release()
            audioTrack = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("AudioDSP Engine Pro Activo")
            .setContentText("Procesamiento DSP PCM 32-bit en tiempo real (Android 14 API 34)")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Canal Audio DSP Engine",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notificación persistente para servicio en primer plano"
            }
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
                .createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        isRunning.set(false)
        processingJob?.cancel()
        cleanupAudioHardware()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    companion object {
        const val CHANNEL_ID = "audiodsp_playback_channel"
        const val NOTIFICATION_ID = 1001
    }
}
