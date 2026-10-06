package com.eqsb.backend

import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.util.UUID

class AudioEffectAudioBackend : IAudioBackend {

    override val type: AudioBackendType = AudioBackendType.AUDIO_EFFECT
    override val name: String = "Android AudioEffect / AudioFlinger Session Bridge"

    private var running = false
    override val isRunning: Boolean get() = running

    private var nativeDsp: EQsbNativeDsp? = null
    private val activeSessions = mutableSetOf<Int>()

    companion object {
        private const val TAG = "AudioEffectBackend"
        // Custom EQsb Effect UUID
        val EQSB_EFFECT_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002")
    }

    override fun start(dsp: EQsbNativeDsp): Boolean {
        nativeDsp = dsp
        // A normal APK cannot register a custom native effect UUID with AudioFlinger.
        // Do not report this backend as active without the system/vendor effect.
        running = false
        Log.e(TAG, "AudioEffect backend unavailable in a normal APK: install/register the EQsb Effects HAL to use this route.")
        return false
    }

    override fun stop() {
        running = false
        activeSessions.clear()
        Log.i(TAG, "AudioEffect session bridge stopped.")
    }

    fun onSessionOpened(sessionId: Int) {
        if (!running) return
        activeSessions.add(sessionId)
        Log.i(TAG, "Attached to audio session $sessionId")
    }

    fun onSessionClosed(sessionId: Int) {
        activeSessions.remove(sessionId)
        Log.i(TAG, "Detached from audio session $sessionId")
    }

    override fun applyConfig(config: DspConfig) {
        nativeDsp?.applyConfig(config)
    }
}
