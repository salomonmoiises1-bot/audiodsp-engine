package com.eqsb

import com.eqsb.core.DspConfig
import com.eqsb.core.Presets
import com.eqsb.jni.EQsbNativeDsp
import org.junit.Assert.*
import org.junit.Test

class EQsbIntegrationTest {

    @Test
    fun testDspConfigToJniMapping() {
        val dsp = EQsbNativeDsp.create()
        dsp.initialize(48000, 2, 256)

        val preset = Presets.getById("bass_heavy")
        // Apply full config to native DSP
        dsp.applyConfig(preset.config)

        // Process dummy PCM buffer through pipeline
        val pcm = FloatArray(512) { 0.5f }
        dsp.processAudio(pcm, 256)

        // Native engine reset
        dsp.resetEngine()

        dsp.destroy()
    }
}
