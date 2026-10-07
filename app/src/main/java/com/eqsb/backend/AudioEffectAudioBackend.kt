package com.eqsb.backend

import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp

class AudioEffectAudioBackend : IAudioBackend {
    override val type = AudioBackendType.AUDIO_EFFECT
    override val name = "Android AudioEffect / AudioFlinger Session Bridge"
    private var running = false
    override val isRunning: Boolean get() = running
    private val controllers = mutableMapOf<Int, EQsbEffectController>()
    private var currentConfig = DspConfig()

    override fun start(dsp: EQsbNativeDsp): Boolean {
        running = true
        Log.i(TAG, "AudioEffect controller started; PCM remains owned by AudioFlinger")
        controllers.values.forEach { attachConfig(it) }
        return true
    }

    override fun stop() {
        controllers.values.forEach { it.close() }
        controllers.clear()
        running = false
    }

    fun onSessionOpened(sessionId: Int) {
        if (!running || sessionId <= 0) return
        controllers.remove(sessionId)?.close()
        runCatching { EQsbEffectController(sessionId) }
            .onSuccess { controller ->
                controllers[sessionId] = controller
                attachConfig(controller)
                controller.setEnabled(!currentConfig.bypass)
                Log.i(TAG, "EQsb AudioEffect attached to session $sessionId")
            }
            .onFailure { Log.e(TAG, "Could not attach EQsb effect to session $sessionId", it) }
    }

    fun onSessionClosed(sessionId: Int) {
        controllers.remove(sessionId)?.close()
        Log.i(TAG, "EQsb AudioEffect detached from session $sessionId")
    }

    override fun applyConfig(config: DspConfig) {
        currentConfig = config
        controllers.values.forEach { attachConfig(it) }
    }

    private fun attachConfig(controller: EQsbEffectController) {
        runCatching {
            controller.apply(currentConfig)
            controller.setEnabled(!currentConfig.bypass)
        }.onFailure { Log.e(TAG, "Failed to apply EQsb AudioEffect configuration", it) }
    }

    companion object { private const val TAG = "EQsbAudioEffect" }
}
