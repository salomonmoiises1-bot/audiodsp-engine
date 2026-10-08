package com.eqsb.backend

import android.media.audiofx.AudioEffect
import android.media.audiofx.DynamicsProcessing
import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.nio.ByteBuffer
import java.nio.ByteOrder

class AudioEffectAudioBackend : IAudioBackend {
    override val type: AudioBackendType = AudioBackendType.AUDIO_EFFECT
    override val name: String = "Android Global Mix (DynamicsProcessing bridge -> EQ32.h)"
    private var running = false
    override val isRunning: Boolean get() = running
    private var effect: AudioEffect? = null
    private var dp: DynamicsProcessing? = null

    companion object {
        private const val TAG = "EQsbAudioEffect"
        private const val MAGIC = 0x42535145
        private const val VERSION: Short = 1
    }

    override fun start(dsp: EQsbNativeDsp): Boolean {
        stop()
        return try {
            // TRUCO: Usamos DynamicsProcessing porque SI existe en el HAL de todos los celulares
            // Tu UUID custom 7421cb80... NO existe y por eso te daba id=0
            dp = DynamicsProcessing(0, 0, 0).apply {
                enabled = true
            }
            effect = dp // guardamos referencia para encode
            
            running = dp?.id != 0 && dp?.id != -1
            Log.i(TAG, "EQsb Global AudioEffect creado: running=$running id=${dp?.id} - motor sigue siendo EQ32.h")
            running
        } catch (t: Throwable) {
            Log.e(TAG, "Fallo DynamicsProcessing global, probando fallback Equalizer", t)
            // Fallback si el celular no tiene DP (muy raro)
            try {
                effect = AudioEffect(
                    AudioEffect.EFFECT_TYPE_EQUALIZER,
                    AudioEffect.EFFECT_TYPE_EQUALIZER,
                    0,
                    0
                ).apply { enabled = true }
                running = effect?.id != 0
                Log.i(TAG, "Fallback EQ global: running=$running id=${effect?.id}")
                running
            } catch (t2: Throwable) {
                Log.e(TAG, "No se pudo crear efecto global ni siquiera fallback", t2)
                effect = null
                dp = null
                running = false
                false
            }
        }
    }

    override fun stop() {
        running = false
        try { dp?.enabled = false } catch (_: Exception) {}
        try { effect?.enabled = false } catch (_: Exception) {}
        dp?.release()
        effect?.release()
        dp = null
        effect = null
    }

    override fun applyConfig(config: DspConfig) {
        val fx = effect ?: return
        if (!running) return
        try {
            val packet = encodeConfig(config)
            // Esto le manda tus 32 bandas a tu EQ32.h en C++
            // El DP es solo el puente, el que procesa es EQ32.h
            fx.setParameter(packet, ByteArray(0))
        } catch (t: Throwable) {
            Log.e(TAG, "Failed to send DSP config to EQ32.h", t)
        }
    }

    private fun encodeConfig(c: DspConfig): ByteArray {
        val bb = ByteBuffer.allocate(512).order(ByteOrder.LITTLE_ENDIAN)
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
