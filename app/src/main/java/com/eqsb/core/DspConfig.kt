package com.eqsb.core

import java.util.Arrays

data class DspConfig(
    // 1. Pre-Gain (-24 dB to +24 dB)
    val preGainDb: Float = 0.0f,

    // 2. Bass Boost (0% to 100% -> 0 dB to +12 dB @ 80 Hz Low Shelf)
    val bassBoostEnabled: Boolean = false,
    val bassBoostStrength: Float = 0.0f,

    // 3. Tone Control (Bass @ 200 Hz, Mid @ 1 kHz, Treble @ 5 kHz)
    val toneEnabled: Boolean = false,
    val toneBassDb: Float = 0.0f,
    val toneMidDb: Float = 0.0f,
    val toneTrebleDb: Float = 0.0f,

    // 4. EQ32: Exactly 32 real biquad filter gains (-15 dB to +15 dB)
    val eq32Enabled: Boolean = true,
    val eq32Bands: FloatArray = FloatArray(EQ32Frequencies.NUM_BANDS),

    // 5. MDRC: Multiband Dynamic Range Compressor
    val mdrcEnabled: Boolean = false,
    val mdrcLowThresholdDb: Float = -16.0f,
    val mdrcLowRatio: Float = 3.0f,
    val mdrcMidThresholdDb: Float = -18.0f,
    val mdrcMidRatio: Float = 2.5f,
    val mdrcHighThresholdDb: Float = -20.0f,
    val mdrcHighRatio: Float = 3.5f,

    // 6. AutoGain (RMS AGC)
    val autoGainEnabled: Boolean = false,
    val autoGainTargetDb: Float = -14.0f,
    val autoGainMaxGainDb: Float = 12.0f,
    val autoGainMinGainDb: Float = -18.0f,

    // 7. Limiter (Brickwall peak ceiling)
    val limiterEnabled: Boolean = true,
    val limiterCeilingDb: Float = -0.1f,
    val limiterReleaseMs: Float = 80.0f,

    // 8. Spatial / Virtualizer (Mid/Side stereo widen + cross-feed)
    val spatialEnabled: Boolean = false,
    val spatialWidth: Float = 0.0f,

    // 9. Master Gain (-48 dB to +12 dB)
    val masterGainDb: Float = 0.0f,

    // 10. Balance (-1.0 Full Left to +1.0 Full Right)
    val balance: Float = 0.0f,

    // Global bypass
    val bypass: Boolean = false,

    // Active Backend
    val backendType: AudioBackendType = AudioBackendType.AUDIO_EFFECT
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as DspConfig

        if (preGainDb != other.preGainDb) return false
        if (bassBoostEnabled != other.bassBoostEnabled) return false
        if (bassBoostStrength != other.bassBoostStrength) return false
        if (toneEnabled != other.toneEnabled) return false
        if (toneBassDb != other.toneBassDb) return false
        if (toneMidDb != other.toneMidDb) return false
        if (toneTrebleDb != other.toneTrebleDb) return false
        if (eq32Enabled != other.eq32Enabled) return false
        if (!eq32Bands.contentEquals(other.eq32Bands)) return false
        if (mdrcEnabled != other.mdrcEnabled) return false
        if (mdrcLowThresholdDb != other.mdrcLowThresholdDb) return false
        if (mdrcLowRatio != other.mdrcLowRatio) return false
        if (mdrcMidThresholdDb != other.mdrcMidThresholdDb) return false
        if (mdrcMidRatio != other.mdrcMidRatio) return false
        if (mdrcHighThresholdDb != other.mdrcHighThresholdDb) return false
        if (mdrcHighRatio != other.mdrcHighRatio) return false
        if (autoGainEnabled != other.autoGainEnabled) return false
        if (autoGainTargetDb != other.autoGainTargetDb) return false
        if (autoGainMaxGainDb != other.autoGainMaxGainDb) return false
        if (autoGainMinGainDb != other.autoGainMinGainDb) return false
        if (limiterEnabled != other.limiterEnabled) return false
        if (limiterCeilingDb != other.limiterCeilingDb) return false
        if (limiterReleaseMs != other.limiterReleaseMs) return false
        if (spatialEnabled != other.spatialEnabled) return false
        if (spatialWidth != other.spatialWidth) return false
        if (masterGainDb != other.masterGainDb) return false
        if (balance != other.balance) return false
        if (bypass != other.bypass) return false
        if (backendType != other.backendType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = preGainDb.hashCode()
        result = 31 * result + bassBoostEnabled.hashCode()
        result = 31 * result + bassBoostStrength.hashCode()
        result = 31 * result + toneEnabled.hashCode()
        result = 31 * result + toneBassDb.hashCode()
        result = 31 * result + toneMidDb.hashCode()
        result = 31 * result + toneTrebleDb.hashCode()
        result = 31 * result + eq32Enabled.hashCode()
        result = 31 * result + eq32Bands.contentHashCode()
        result = 31 * result + mdrcEnabled.hashCode()
        result = 31 * result + mdrcLowThresholdDb.hashCode()
        result = 31 * result + mdrcLowRatio.hashCode()
        result = 31 * result + mdrcMidThresholdDb.hashCode()
        result = 31 * result + mdrcMidRatio.hashCode()
        result = 31 * result + mdrcHighThresholdDb.hashCode()
        result = 31 * result + mdrcHighRatio.hashCode()
        result = 31 * result + autoGainEnabled.hashCode()
        result = 31 * result + autoGainTargetDb.hashCode()
        result = 31 * result + autoGainMaxGainDb.hashCode()
        result = 31 * result + autoGainMinGainDb.hashCode()
        result = 31 * result + limiterEnabled.hashCode()
        result = 31 * result + limiterCeilingDb.hashCode()
        result = 31 * result + limiterReleaseMs.hashCode()
        result = 31 * result + spatialEnabled.hashCode()
        result = 31 * result + spatialWidth.hashCode()
        result = 31 * result + masterGainDb.hashCode()
        result = 31 * result + balance.hashCode()
        result = 31 * result + bypass.hashCode()
        result = 31 * result + backendType.hashCode()
        return result
    }

    fun copyWithBand(index: Int, gainDb: Float): DspConfig {
        val newBands = eq32Bands.copyOf()
        if (index in newBands.indices) {
            newBands[index] = gainDb
        }
        return copy(eq32Bands = newBands)
    }

    fun copyWithAllBands(gains: FloatArray): DspConfig {
        val newBands = FloatArray(EQ32Frequencies.NUM_BANDS)
        System.arraycopy(gains, 0, newBands, 0, Math.min(gains.size, EQ32Frequencies.NUM_BANDS))
        return copy(eq32Bands = newBands)
    }
}
