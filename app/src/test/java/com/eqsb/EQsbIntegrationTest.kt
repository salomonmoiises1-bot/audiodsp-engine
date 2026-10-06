package com.eqsb

import com.eqsb.core.Presets
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class EQsbIntegrationTest {

    @Test
    fun testDspConfigToJniMapping() {
        val preset = Presets.getById("bass_heavy")
        val config = preset.config

        // JVM unit tests do not load Android native .so files. Validate the complete
        // configuration contract here; JNI execution belongs to an Android/instrumented test.
        assertTrue(config.eq32Bands.size == 32)
        assertEquals(config.preGainDb, -2f, 0.0001f)
        assertTrue(config.bassBoostEnabled)
        assertTrue(config.toneEnabled)
        assertTrue(config.eq32Enabled)
        assertTrue(config.mdrcEnabled)
        assertTrue(!config.autoGainEnabled)
        assertTrue(config.limiterEnabled)
        assertTrue(config.spatialEnabled)
    }
}
