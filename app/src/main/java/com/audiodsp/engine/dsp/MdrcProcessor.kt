package com.audiodsp.engine.dsp

import kotlin.math.*

/**
 * Procesador Dinámico Multibanda (MDRC) de 3 bandas: Low, Mid, High
 * Utiliza crossovers Linkwitz-Riley de 2do orden y detección de envolvente peak/RMS
 */
class MdrcProcessor(private val sampleRate: Float) {

    class BandCompressor {
        var isEnabled = true
        var thresholdDb = -18.0f
        var ratio = 2.5f
        var attackMs = 20.0f
        var releaseMs = 120.0f
        var makeupDb = 0.0f

        // Coeficientes de ataque/relajación
        private var attackCoeff = 0.0f
        private var releaseCoeff = 0.0f
        private var envelope = 0.0f
        var currentGainReductionDb = 0.0f
            private set

        fun updateCoefficients(sampleRate: Float) {
            val safeAttack = max(1.0f, attackMs) / 1000.0f
            val safeRelease = max(5.0f, releaseMs) / 1000.0f
            attackCoeff = exp(-1.0f / (sampleRate * safeAttack))
            releaseCoeff = exp(-1.0f / (sampleRate * safeRelease))
        }

        fun process(sample: Float): Float {
            if (!isEnabled) return sample
            val absSample = abs(sample)
            
            // Seguidor de envolvente
            envelope = if (absSample > envelope) {
                attackCoeff * envelope + (1.0f - attackCoeff) * absSample
            } else {
                releaseCoeff * envelope + (1.0f - releaseCoeff) * absSample
            }

            val envDb = if (envelope > 1e-5f) 20.0f * log10(envelope) else -100.0f
            var gainDb = 0.0f
            if (envDb > thresholdDb) {
                val excess = envDb - thresholdDb
                gainDb = -(excess * (1.0f - (1.0f / max(1.0f, ratio))))
            }
            currentGainReductionDb = gainDb

            val totalGain = 10.0f.pow((gainDb + makeupDb) / 20.0f)
            return sample * totalGain
        }
    }

    val lowComp = BandCompressor()
    val midComp = BandCompressor()
    val highComp = BandCompressor()

    // Filtros de cruce Linkwitz-Riley a 250 Hz y 4000 Hz
    private val lowLpfL = BiquadFilter()
    private val lowLpfR = BiquadFilter()
    private val midHpfL = BiquadFilter()
    private val midHpfR = BiquadFilter()
    private val midLpfL = BiquadFilter()
    private val midLpfR = BiquadFilter()
    private val highHpfL = BiquadFilter()
    private val highHpfR = BiquadFilter()

    var isEnabled = true

    init {
        updateFilters()
    }

    fun updateFilters() {
        lowComp.updateCoefficients(sampleRate)
        midComp.updateCoefficients(sampleRate)
        highComp.updateCoefficients(sampleRate)

        lowLpfL.configure(BiquadFilter.Type.LOW_PASS, 250.0f, 0.0f, 0.707f, sampleRate)
        lowLpfR.configure(BiquadFilter.Type.LOW_PASS, 250.0f, 0.0f, 0.707f, sampleRate)

        midHpfL.configure(BiquadFilter.Type.HIGH_PASS, 250.0f, 0.0f, 0.707f, sampleRate)
        midHpfR.configure(BiquadFilter.Type.HIGH_PASS, 250.0f, 0.0f, 0.707f, sampleRate)
        midLpfL.configure(BiquadFilter.Type.LOW_PASS, 4000.0f, 0.0f, 0.707f, sampleRate)
        midLpfR.configure(BiquadFilter.Type.LOW_PASS, 4000.0f, 0.0f, 0.707f, sampleRate)

        highHpfL.configure(BiquadFilter.Type.HIGH_PASS, 4000.0f, 0.0f, 0.707f, sampleRate)
        highHpfR.configure(BiquadFilter.Type.HIGH_PASS, 4000.0f, 0.0f, 0.707f, sampleRate)
    }

    fun processStereo(left: Float, right: Float): Pair<Float, Float> {
        if (!isEnabled) return Pair(left, right)

        // División en 3 bandas
        val lowL = lowComp.process(lowLpfL.processLeft(left))
        val lowR = lowComp.process(lowLpfR.processRight(right))

        val midL = midComp.process(midLpfL.processLeft(midHpfL.processLeft(left)))
        val midR = midComp.process(midLpfR.processRight(midHpfR.processRight(right)))

        val highL = highComp.process(highHpfL.processLeft(left))
        val highR = highComp.process(highHpfR.processRight(right))

        // Suma de bandas
        return Pair(lowL + midL + highL, lowR + midR + highR)
    }
}
