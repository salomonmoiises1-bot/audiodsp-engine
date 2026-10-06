package com.eqsb

import com.eqsb.core.Presets
import org.junit.Assert.*
import org.junit.Test

class PresetsTest {

    @Test
    fun testFactoryPresetsIntegrity() {
        val presets = Presets.FACTORY_PRESETS
        assertTrue(presets.isNotEmpty())

        for (preset in presets) {
            assertNotNull(preset.id)
            assertNotNull(preset.name)
            assertNotNull(preset.config)
            assertEquals(32, preset.config.eq32Bands.size)
        }
    }

    @Test
    fun testFlatPresetAllZeroGains() {
        val flat = Presets.getById("flat")
        assertEquals("flat", flat.id)
        for (g in flat.config.eq32Bands) {
            assertEquals(0.0f, g, 0.0001f)
        }
        assertEquals(0.0f, flat.config.preGainDb, 0.0001f)
        assertEquals(0.0f, flat.config.masterGainDb, 0.0001f)
        assertEquals(0.0f, flat.config.balance, 0.0001f)
    }

    @Test
    fun testBassHeavyPresetHasBoost() {
        val bass = Presets.getById("bass_heavy")
        assertTrue(bass.config.bassBoostEnabled)
        assertTrue(bass.config.bassBoostStrength > 0.5f)
        assertTrue(bass.config.eq32Bands[0] > 0.0f) // 20 Hz boost
    }
}
