package com.eqsb.backend

import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp

interface IAudioBackend {
    val type: AudioBackendType
    val name: String
    val isRunning: Boolean

    fun start(dsp: EQsbNativeDsp): Boolean
    fun stop()
    fun applyConfig(config: DspConfig)
}
