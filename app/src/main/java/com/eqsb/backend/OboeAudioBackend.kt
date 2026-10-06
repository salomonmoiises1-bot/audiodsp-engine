package com.eqsb.backend

import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Native Oboe backend. It owns its PCM stream and feeds callback buffers directly
 * into the C++ DSP engine. It does not capture arbitrary third-party app audio.
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
        val ok = dsp.startOboeStream()
        running.set(ok)
        if (ok) Log.i("OboeAudioBackend", "Native Oboe stream started")
        else Log.e("OboeAudioBackend", "Native Oboe stream failed to start")
        return ok
    }

    override fun stop() {
        if (!running.getAndSet(false)) return
        nativeDsp?.stopOboeStream()
        nativeDsp = null
    }

    override fun applyConfig(config: DspConfig) {
        nativeDsp?.applyConfig(config)
    }
}
