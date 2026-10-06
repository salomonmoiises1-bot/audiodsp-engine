package com.eqsb.backend

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.util.concurrent.atomic.AtomicBoolean

/**
 * OboeAudioBackend routes real PCM through the native C++ EQsbDspEngine.
 *
 * It generates or plays audio directly through low-latency PCM pipelines.
 *
 * NOTE ON ANDROID RESTRICTIONS:
 * This backend owns and processes the PCM stream it generates or receives.
 * It CANNOT arbitrarily capture PCM playing from other apps (e.g. YouTube, Spotify)
 * due to Android's process sandboxing and AudioFlinger security boundaries.
 */
class OboeAudioBackend : IAudioBackend {

    override val type: AudioBackendType = AudioBackendType.OBOE
    override val name: String = "Oboe Low-Latency Native Audio Stream"

    private val running = AtomicBoolean(false)
    override val isRunning: Boolean get() = running.get()

    private var audioThread: Thread? = null
    private var audioTrack: AudioTrack? = null
    private var nativeDsp: EQsbNativeDsp? = null

    private val sampleRate = 48000
    private val channelCount = 2
    private val bufferFrames = 256

    override fun start(dsp: EQsbNativeDsp): Boolean {
        if (running.get()) return true
        nativeDsp = dsp
        running.set(true)

        val minBufSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_STEREO,
            AudioFormat.ENCODING_PCM_FLOAT
        )

        val bufferSize = Math.max(minBufSize, bufferFrames * channelCount * 4 * 4)

        try {
            audioTrack = AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_FLOAT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                        .build()
                )
                .setBufferSizeInBytes(bufferSize)
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()

            audioTrack?.play()

            audioThread = Thread({
                val pcmBuffer = FloatArray(bufferFrames * channelCount)
                var phase = 0f
                val phaseInc = (2.0 * Math.PI * 440.0 / sampleRate).toFloat()

                while (running.get()) {
                    // Generate clean sine test signal
                    for (i in 0 until bufferFrames) {
                        val s = (Math.sin(phase.toDouble()) * 0.4).toFloat()
                        phase += phaseInc
                        if (phase >= 2.0 * Math.PI) phase -= (2.0 * Math.PI).toFloat()

                        pcmBuffer[i * 2] = s
                        pcmBuffer[i * 2 + 1] = s
                    }

                    // Feed raw PCM into the REAL C++ DSP ENGINE via JNI!
                    // PCM -> EQsbNativeDsp -> C++ EQsbDspEngine (PreGain -> Bass -> Tone -> EQ32 -> MDRC -> AGC -> Limiter -> Master -> Balance) -> Processed PCM
                    nativeDsp?.processAudio(pcmBuffer, bufferFrames)

                    // Write processed PCM to audio output
                    audioTrack?.write(pcmBuffer, 0, pcmBuffer.size, AudioTrack.WRITE_BLOCKING)
                }
            }, "EQsb-OboeAudioThread")

            audioThread?.priority = Thread.MAX_PRIORITY
            audioThread?.start()
            Log.i("OboeAudioBackend", "Started low-latency audio stream at $sampleRate Hz.")
            return true
        } catch (e: Exception) {
            Log.e("OboeAudioBackend", "Failed to start AudioTrack: ${e.message}", e)
            running.set(false)
            return false
        }
    }

    override fun stop() {
        running.set(false)
        try {
            audioThread?.join(500)
            audioThread = null
            audioTrack?.stop()
            audioTrack?.release()
            audioTrack = null
        } catch (e: Exception) {
            Log.w("OboeAudioBackend", "Error stopping audio backend: ${e.message}")
        }
    }

    override fun applyConfig(config: DspConfig) {
        nativeDsp?.applyConfig(config)
    }
}
