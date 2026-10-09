package com.eqsb.backend

import android.content.Context
import android.content.pm.PackageManager
import android.media.*
import android.media.projection.MediaProjection
import android.os.Process
import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import kotlinx.coroutines.*
import java.util.UUID

class AudioEffectAudioBackend(private val context: Context? = null) : IAudioBackend {
    override val type = AudioBackendType.AUDIO_EFFECT
    override val name = "Android AIDL AudioEffect / AudioFlinger Global Mix"
    override val isRunning get() = running
    private var running = false

    companion object {
        private const val TAG = "EQsbAudioEffect"
        val EQSB_EFFECT_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002")
    }

    private var projection: MediaProjection? = null
    private var record: AudioRecord? = null
    private var track: AudioTrack? = null
    private var job: Job? = null
    private var nativeDsp: EQsbNativeDsp? = null

    fun setMediaProjection(mp: MediaProjection) {
        projection = mp
        if (running) { stopInternal(); startInternal() }
    }

    override fun start(dsp: EQsbNativeDsp): Boolean {
        nativeDsp = dsp
        nativeDsp?.initialize(48000, 2, 128)
        running = true
        if (projection != null) startInternal()
        return true
    }

    private fun startInternal() {
        if (projection == null) return
        try {
            val builder = AudioPlaybackCaptureConfiguration.Builder(projection!!)
                .addMatchingUsage(AudioAttributes.USAGE_MEDIA)
                .excludeUid(Process.myUid())

            context?.let { ctx ->
                try {
                    val pm = ctx.packageManager
                    val pkgs = listOf("com.google.android.youtube","com.spotify.music","com.aimp.player","com.aimp.player2")
                    pkgs.forEach { pkg ->
                        try {
                            val uid = if (android.os.Build.VERSION.SDK_INT >= 33) {
                                pm.getPackageUid(pkg, PackageManager.PackageInfoFlags.of(0))
                            } else {
                                @Suppress("DEPRECATION") pm.getPackageUid(pkg, 0)
                            }
                            builder.addMatchingUid(uid)
                        } catch (_: Exception) {}
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
                .setBufferSizeInBytes(minBuf * 2)
                .build()

            track = AudioTrack.Builder()
                .setAudioAttributes(AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_GAME)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build())
                .setAudioFormat(format)
                .setBufferSizeInBytes(minBuf * 2)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .setPerformanceMode(AudioTrack.PERFORMANCE_MODE_LOW_LATENCY)
                .build()

            record?.startRecording()
            track?.play()

            job = CoroutineScope(Dispatchers.Default).launch {
                val buf = FloatArray(128 * 2)
                while (isActive) {
                    val readFloats = record?.read(buf, 0, buf.size, AudioRecord.READ_BLOCKING) ?: 0
                    if (readFloats > 0) {
                        val frames = readFloats / 2
                        nativeDsp?.processAudio(buf, frames)
                        track?.write(buf, 0, readFloats, AudioTrack.WRITE_BLOCKING)
                    }
                }
            }
            Log.i(TAG, "EQ activo low-latency 128f para YouTube/Spotify/AIMP")
        } catch (e: Exception) {
            Log.e(TAG, "Error captura", e)
        }
    }

    private fun stopInternal() {
        job?.cancel(); job = null
        try { record?.stop() } catch (_: Exception) {}
        try { record?.release() } catch (_: Exception) {}
        try { track?.stop() } catch (_: Exception) {}
        try { track?.release() } catch (_: Exception) {}
        record = null; track = null
    }

    override fun stop() { stopInternal(); running = false }
    override fun applyConfig(config: DspConfig) { nativeDsp?.applyConfig(config) }
}
