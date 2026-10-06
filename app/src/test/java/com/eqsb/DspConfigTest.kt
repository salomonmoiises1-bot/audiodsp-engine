package com.eqsb

import com.eqsb.core.DspConfig
import com.eqsb.core.EQ32Frequencies
import org.junit.Assert.*
import org.junit.Test

class DspConfigTest {

    @Test
    fun testDefaultConfigHas32Bands() {
        val config = DspConfig()
        assertEquals(EQ32Frequencies.NUM_BANDS, config.eq32Bands.size)
        assertEquals(32, config.eq32Bands.size)
        for (gain in config.eq32Bands) {
            assertEquals(0.0f, gain, 0.0001f)
        }
    }

    @Test
    fun testCopySingleBand() {
        val config = DspConfig()
        val updated = config.copyWithBand(17, 6.0f) // 1 kHz band
        assertEquals(6.0f, updated.eq32Bands[17], 0.0001f)
        assertEquals(0.0f, updated.eq32Bands[16], 0.0001f)
    }

    @Test
    fun testFrequenciesCountAndValues() {
        assertEquals(32, EQ32Frequencies.CENTER_FREQUENCIES_HZ.size)
        assertEquals(20.0f, EQ32Frequencies.CENTER_FREQUENCIES_HZ[0], 0.001f)
        assertEquals(1000.0f, EQ32Frequencies.CENTER_FREQUENCIES_HZ[17], 0.001f)
        assertEquals(20000.0f, EQ32Frequencies.CENTER_FREQUENCIES_HZ[31], 0.001f)
    }
}
