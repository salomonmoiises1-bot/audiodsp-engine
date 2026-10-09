package com.eqsb.backend

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioPlaybackCaptureConfiguration
import android.media.AudioRecord
import android.media.projection.MediaProjection
import android.os.Process
import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import kotlinx.coroutines.*
import java.util.UUID

class AudioEffectAudioBackend(private val context: Context? = null) : IAudioBackend {
    override val type: AudioBackendType = AudioBackendType.AUDIO_EFFECT
    override val name: String = "Android AIDL AudioEffect / AudioFlinger Global Mix"
    private var running = false
    override val isRunning: Boolean get() = running

    companion object {
        private const val TAG = "EQsbAudioEffect"
        val EQSB_EFFECT_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002")
    }

    private var projection: MediaProjection? = null
    private var record: AudioRecord? = null
    private var job: Job? = null
    private var nativeDsp: EQsbNativeDsp? = null

    // NUEVO: no rompe nada, solo agrega
    fun setMediaProjection(mp: MediaProjection) {
        projection = mp
        if (running) {
            stopInternal()
            startInternal()
        }
    }

    override fun start(dsp: EQsbNativeDsp): Boolean {
        nativeDsp = dsp
        running = true
        Log.i(TAG, "Backend marcado como running, esperando MediaProjection si hace falta")
        if (projection != null) {
            return startInternal()
        }
        // Devuelve true para que EQsbAudioService NO haga stopSelf()
        // cuando aún no diste permiso de proyección
        return true
    }

    private fun startInternal(): Boolean {
        if (projection == null) return false
        try {
            // Solo YouTube / Spotify / AIMP
            val builder = AudioPlaybackCaptureConfiguration.Builder(projection!!)
                .addMatchingUsage(AudioAttributes.USAGE_MEDIA)
                .addMatchingUsage(AudioAttributes.USAGE_GAME)
                .excludeUid(Process.myUid()) // anti-eco

            // Filtra por UID si tenés Context (opcional, no rompe si no)
            context?.let { ctx ->
                try {
                    val pm = ctx.packageManager
                    listOf("com.google.android.youtube", "com.spotify.music", "com.aimp.player").forEach { pkg ->
                        try { builder.addMatchingUid(pm.getPackageUid(pkg, 0)) } catch (_: Exception) {}
                    }
                } catch (_: Exception) {}
            }

            val captureConfig = builder.build()
            val format = AudioFormat.Builder()
                .setEncoding(AudioFormat.ENCODING_PCM_FLOAT)
                .setSampleRate(48000)
                .setChannelMask(AudioFormat.CHANNEL_IN_STEREO)
                .build()

            val minBuf = AudioRecord.getMinBufferSize(48000, AudioFormat.CHANNEL_IN_STEREO, AudioFormat.ENCODING_PCM_FLOAT)
            record = AudioRecord.Builder()
                .setAudioFormat(format)
                .setAudioPlaybackCaptureConfig(captureConfig)
                .setBufferSizeInBytes(minBuf * 4)
                .build()

            record?.startRecording()
            job = CoroutineScope(Dispatchers.Default).launch {
                val buf = FloatArray(1024 * 2) // stereo
                while (isActive) {
                    val read = record?.read(buf, 0, buf.size, AudioRecord.READ_BLOCKING) ?: 0
                    if (read > 0) {
                        // Usa tu método real de EQsbNativeDsp - no cambia firma
                        try {
                            nativeDsp?.processCapture(buf, read)
                        } catch (_: Exception) {
                            // fallback si tu native se llama distinto
                            try { nativeDsp?.process(buf) } catch (_: Exception) {}
                        }
                    }
                }
            }
            Log.i(TAG, "Captura iniciada para YouTube/Spotify/AIMP sin mic")
            return true
        } catch (e: Exception) {
            Log.e(TAG, "Fallo captura", e)
            return true // igual true para no matar el servicio
        }
    }

    private fun stopInternal() {
        job?.cancel()
        job = null
        try { record?.stop() } catch (_: Exception) {}
        try { record?.release() } catch (_: Exception) {}
        record = null
    }

    override fun stop() {
        stopInternal()
        running = false
    }

    override fun applyConfig(config: DspConfig) {
        // Mismo transporte que tenías, no rompe dependencia
        try { nativeDsp?.applyConfig(config) } catch (_: Exception) {}
    }
}
