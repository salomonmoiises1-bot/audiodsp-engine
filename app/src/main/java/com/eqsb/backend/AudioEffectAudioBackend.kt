package com.eqsb.backend

import android.media.audiofx.AudioEffect
import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.UUID

class AudioEffectAudioBackend : IAudioBackend {
    override val type: AudioBackendType = AudioBackendType.AUDIO_EFFECT
    override val name: String = "Android AIDL AudioEffect / AudioFlinger Global Mix"
    private var running = false
    override val isRunning: Boolean get() = running
    private var effect: AudioEffect? = null

    companion object {
        private const val TAG = "EQsbAudioEffect"
        val EQSB_EFFECT_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002")
        private const val MAGIC = 0x42535145
        private const val VERSION: Short = 1
    }

    override fun start(dsp: EQsbNativeDsp): Boolean {
        stop()
        return try {
            effect = AudioEffect(
                AudioEffect.EFFECT_TYPE_NULL,
                EQSB_EFFECT_UUID,
                0,
                0
            )
            running = effect?.id != 0
            Log.i(TAG, "EQsb AudioEffect instance created: running=$running id=${effect?.id}")
            running
        } catch (t: Throwable) {
            Log.e(TAG, "EQsb AIDL AudioEffect is not registered by the device Effects HAL", t)
            effect = null
            running = false
            false
        }
    }

    override fun stop() {
        running = false
        effect?.release()
        effect = null
    }

    override fun applyConfig(config: DspConfig) {
        val fx = effect ?: return
        if (!running) return
        try {
            val packet = encodeConfig(config)
            // Vendor extension transport: the AIDL Effects HAL receives the raw
            // parameter/value payload through DefaultExtension.
            fx.setParameter(packet, ByteArray(0))
        } catch (t: Throwable) {
            Log.e(TAG, "Failed to send EQsb DSP configuration to AudioFlinger", t)
        }
    }

    private fun encodeConfig(c: DspConfig): ByteArray {
        val bb = ByteBuffer.allocate(512)
            .order(ByteOrder.LITTLE_ENDIAN)
        bb.putInt(MAGIC)
        bb.putShort(VERSION)
        bb.putShort(0)
        bb.put(if (c.bypass) 1 else 0); bb.putFloat(c.preGainDb)
        bb.put(if (c.bassBoostEnabled) 1 else 0); bb.putFloat(c.bassBoostStrength)
        bb.put(if (c.toneEnabled) 1 else 0); bb.putFloat(c.toneBassDb); bb.putFloat(c.toneMidDb); bb.putFloat(c.toneTrebleDb)
        bb.put(if (c.eq32Enabled) 1 else 0); c.eq32Bands.forEach { bb.putFloat(it) }
        bb.put(if (c.mdrcEnabled) 1 else 0)
        bb.putFloat(c.mdrcLowThresholdDb); bb.putFloat(c.mdrcLowRatio); bb.putFloat(20f); bb.putFloat(120f); bb.putFloat(0f)
        bb.putFloat(c.mdrcMidThresholdDb); bb.putFloat(c.mdrcMidRatio); bb.putFloat(15f); bb.putFloat(80f); bb.putFloat(0f)
        bb.putFloat(c.mdrcHighThresholdDb); bb.putFloat(c.mdrcHighRatio); bb.putFloat(10f); bb.putFloat(60f); bb.putFloat(0f)
        bb.putFloat(250f); bb.putFloat(4000f)
        bb.put(if (c.autoGainEnabled) 1 else 0); bb.putFloat(c.autoGainTargetDb); bb.putFloat(c.autoGainMaxGainDb); bb.putFloat(c.autoGainMinGainDb)
        bb.put(if (c.limiterEnabled) 1 else 0); bb.putFloat(c.limiterCeilingDb); bb.putFloat(c.limiterReleaseMs)
        bb.put(if (c.spatialEnabled) 1 else 0); bb.putFloat(c.spatialWidth); bb.putFloat(c.masterGainDb); bb.putFloat(c.balance)
        return bb.array().copyOf(bb.position())
    }
}
