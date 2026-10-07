package com.eqsb.backend

import android.media.audiofx.AudioEffect
import com.eqsb.core.DspConfig
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.UUID

/** Controls one EQsb native AudioEffect instance attached to an AudioFlinger session. */
class EQsbEffectController(sessionId: Int) : AutoCloseable {
    companion object {
        val TYPE_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120001")
        val IMPLEMENTATION_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002")
        private const val EQ32_BASE = 100
        private const val MDRC_ENABLED = 200
        private const val MDRC_LOW_MID = 201
        private const val MDRC_MID_HIGH = 202
        private const val MDRC_BAND_BASE = 220
        private const val AUTOGAIN_ENABLED = 300
        private const val AUTOGAIN_TARGET = 301
        private const val AUTOGAIN_MAX = 302
        private const val AUTOGAIN_MIN = 303
        private const val LIMITER_ENABLED = 320
        private const val LIMITER_CEILING = 321
        private const val LIMITER_RELEASE = 322
        private const val SPATIAL_ENABLED = 340
        private const val SPATIAL_WIDTH = 341
        private const val MASTER_GAIN = 360
        private const val BALANCE = 361
    }

    private val effect = AudioEffect(TYPE_UUID, IMPLEMENTATION_UUID, 0, sessionId)

    fun apply(config: DspConfig) {
        setBoolean(1, config.bypass)
        setFloat(2, config.preGainDb)
        setBoolean(3, config.bassBoostEnabled)
        setFloat(4, config.bassBoostStrength)
        setBoolean(5, config.toneEnabled)
        setFloat(6, config.toneBassDb)
        setFloat(7, config.toneMidDb)
        setFloat(8, config.toneTrebleDb)
        setBoolean(9, config.eq32Enabled)
        config.eq32Bands.forEachIndexed { index, gain -> setFloat(EQ32_BASE + index, gain) }
        setBoolean(MDRC_ENABLED, config.mdrcEnabled)
        setFloat(MDRC_LOW_MID, 250f)
        setFloat(MDRC_MID_HIGH, 4000f)
        setMdrcBand(MDRC_BAND_BASE, config.mdrcLowThresholdDb, config.mdrcLowRatio)
        setMdrcBand(MDRC_BAND_BASE + 1, config.mdrcMidThresholdDb, config.mdrcMidRatio)
        setMdrcBand(MDRC_BAND_BASE + 2, config.mdrcHighThresholdDb, config.mdrcHighRatio)
        setBoolean(AUTOGAIN_ENABLED, config.autoGainEnabled)
        setFloat(AUTOGAIN_TARGET, config.autoGainTargetDb)
        setFloat(AUTOGAIN_MAX, config.autoGainMaxGainDb)
        setFloat(AUTOGAIN_MIN, config.autoGainMinGainDb)
        setBoolean(LIMITER_ENABLED, config.limiterEnabled)
        setFloat(LIMITER_CEILING, config.limiterCeilingDb)
        setFloat(LIMITER_RELEASE, config.limiterReleaseMs)
        setBoolean(SPATIAL_ENABLED, config.spatialEnabled)
        setFloat(SPATIAL_WIDTH, config.spatialWidth)
        setFloat(MASTER_GAIN, config.masterGainDb)
        setFloat(BALANCE, config.balance)
    }

    fun setEnabled(enabled: Boolean) {
        effect.enabled = enabled
    }

    private fun setMdrcBand(id: Int, threshold: Float, ratio: Float) {
        // BandCompressorConfig is five native floats; keep the wire format explicit and stable.
        val value = ByteBuffer.allocate(20).order(ByteOrder.nativeOrder())
            .putFloat(threshold).putFloat(ratio).putFloat(15f).putFloat(100f).putFloat(0f).array()
        setParameter(id, value)
    }

    private fun setBoolean(id: Int, value: Boolean) = setParameter(id, intBytes(if (value) 1 else 0))
    private fun setFloat(id: Int, value: Float) = setParameter(id, floatBytes(value))

    private fun setParameter(id: Int, value: ByteArray) {
        val status = effect.setParameter(intBytes(id), value)
        check(status == AudioEffect.SUCCESS) { "EQsb AudioEffect parameter $id failed: $status" }
    }

    private fun intBytes(value: Int): ByteArray =
        ByteBuffer.allocate(4).order(ByteOrder.nativeOrder()).putInt(value).array()

    private fun floatBytes(value: Float): ByteArray =
        ByteBuffer.allocate(4).order(ByteOrder.nativeOrder()).putFloat(value).array()

    override fun close() {
        effect.release()
    }
}
