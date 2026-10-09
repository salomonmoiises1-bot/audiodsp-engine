package com.eqsb.backend

import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Native Oboe backend - Low Latency Path.
 * Owns its PCM stream and feeds callback buffers directly into C++ EQ32.h
 * via processDirect(). No capture, no mic.
 * AIDL Path (root) remains in platform/aidl/eqsb/libeqsb.so
 */
class OboeAudioBackend : IAudioBackend {
    override val type = AudioBackendType.OBOE
    override val name = "Oboe Low-Latency Native Audio Stream"
    private val running = AtomicBoolean(false)
    override val isRunning: Boolean get() = running.get()
    private var nativeDsp: EQsbNativeDsp? = null

    override fun start(dsp: EQsbNativeDsp): Boolean {
        if (running.get()) return true
        nativeDsp = dsp
        try {
            // BAJA LATENCIA: 128 frames = 2.6ms @ 48kHz
            // Tu C++ debe usar PerformanceMode::LowLatency + SharingMode::Exclusive
            if (dsp.isNativeReady()) {
                dsp.initialize(sampleRate = 48000, channels = 2, framesPerBlock = 128)
            }
            val ok = dsp.startOboeStream()
            running.set(ok)
            if (ok) Log.i("OboeAudioBackend", "Oboe low-latency 128f started")
            else Log.e("OboeAudioBackend", "Oboe failed")
            return ok
        } catch (e: Exception) {
            Log.e("OboeAudioBackend", "start error", e)
            running.set(false)
            return false
        }
    }

    override fun stop() {
        if (!running.getAndSet(false)) return
        try { nativeDsp?.stopOboeStream() } catch (_: Exception) {}
        nativeDsp = null
    }

    override fun applyConfig(config: DspConfig) {
        nativeDsp?.applyConfig(config)
    }
}
