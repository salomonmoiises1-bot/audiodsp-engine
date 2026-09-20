package com.audiodsp.engine.dsp

import kotlin.math.*

/**
 * Filtro Biquad en Cascada de Robert Bristow-Johnson (Cookbook)
 * Cálculo matemático de punto flotante de 32 bits (Direct Form I / Transposed Direct Form II)
 * Sin asignaciones dinámicas en el bucle de procesamiento de audio para latencia ultra baja.
 */
class BiquadFilter {

    enum class Type {
        PEAKING,
        LOW_SHELF,
        HIGH_SHELF,
        LOW_PASS,
        HIGH_PASS,
        NOTCH,
        BAND_PASS
    }

    private var b0 = 1.0f
    private var b1 = 0.0f
    private var b2 = 0.0f
    private var a1 = 0.0f
    private var a2 = 0.0f

    // Estado de retardos temporales canal Izquierdo
    private var x1L = 0.0f
    private var x2L = 0.0f
    private var y1L = 0.0f
    private var y2L = 0.0f

    // Estado de retardos temporales canal Derecho
    private var x1R = 0.0f
    private var x2R = 0.0f
    private var y1R = 0.0f
    private var y2R = 0.0f

    var isEnabled: Boolean = true

    fun reset() {
        x1L = 0.0f; x2L = 0.0f; y1L = 0.0f; y2L = 0.0f
        x1R = 0.0f; x2R = 0.0f; y1R = 0.0f; y2R = 0.0f
    }

    fun configure(type: Type, frequencyHz: Float, gainDb: Float, q: Float, sampleRate: Float) {
        val safeFreq = frequencyHz.coerceIn(10.0f, (sampleRate * 0.49f))
        val safeQ = q.coerceIn(0.1f, 20.0f)
        val aLinear = 10.0f.pow(gainDb / 40.0f)
        val w0 = (2.0f * Math.PI.toFloat() * safeFreq) / sampleRate
        val cosW0 = cos(w0)
        val sinW0 = sin(w0)
        val alpha = sinW0 / (2.0f * safeQ)

        var rawB0 = 1.0f
        var rawB1 = 0.0f
        var rawB2 = 0.0f
        var rawA0 = 1.0f
        var rawA1 = 0.0f
        var rawA2 = 0.0f

        when (type) {
            Type.PEAKING -> {
                rawB0 = 1.0f + alpha * aLinear
                rawB1 = -2.0f * cosW0
                rawB2 = 1.0f - alpha * aLinear
                rawA0 = 1.0f + alpha / aLinear
                rawA1 = -2.0f * cosW0
                rawA2 = 1.0f - alpha / aLinear
            }
            Type.LOW_SHELF -> {
                val sqrtA = sqrt(aLinear)
                val twoSqrtAAlpha = 2.0f * sqrtA * alpha
                rawB0 = aLinear * ((aLinear + 1.0f) - (aLinear - 1.0f) * cosW0 + twoSqrtAAlpha)
                rawB1 = 2.0f * aLinear * ((aLinear - 1.0f) - (aLinear + 1.0f) * cosW0)
                rawB2 = aLinear * ((aLinear + 1.0f) - (aLinear - 1.0f) * cosW0 - twoSqrtAAlpha)
                rawA0 = (aLinear + 1.0f) + (aLinear - 1.0f) * cosW0 + twoSqrtAAlpha
                rawA1 = -2.0f * ((aLinear - 1.0f) + (aLinear + 1.0f) * cosW0)
                rawA2 = (aLinear + 1.0f) + (aLinear - 1.0f) * cosW0 - twoSqrtAAlpha
            }
            Type.HIGH_SHELF -> {
                val sqrtA = sqrt(aLinear)
                val twoSqrtAAlpha = 2.0f * sqrtA * alpha
                rawB0 = aLinear * ((aLinear + 1.0f) + (aLinear - 1.0f) * cosW0 + twoSqrtAAlpha)
                rawB1 = -2.0f * aLinear * ((aLinear - 1.0f) + (aLinear + 1.0f) * cosW0)
                rawB2 = aLinear * ((aLinear + 1.0f) + (aLinear - 1.0f) * cosW0 - twoSqrtAAlpha)
                rawA0 = (aLinear + 1.0f) - (aLinear - 1.0f) * cosW0 + twoSqrtAAlpha
                rawA1 = 2.0f * ((aLinear - 1.0f) - (aLinear + 1.0f) * cosW0)
                rawA2 = (aLinear + 1.0f) - (aLinear - 1.0f) * cosW0 - twoSqrtAAlpha
            }
            Type.LOW_PASS -> {
                rawB0 = (1.0f - cosW0) / 2.0f
                rawB1 = 1.0f - cosW0
                rawB2 = (1.0f - cosW0) / 2.0f
                rawA0 = 1.0f + alpha
                rawA1 = -2.0f * cosW0
                rawA2 = 1.0f - alpha
            }
            Type.HIGH_PASS -> {
                rawB0 = (1.0f + cosW0) / 2.0f
                rawB1 = -(1.0f + cosW0)
                rawB2 = (1.0f + cosW0) / 2.0f
                rawA0 = 1.0f + alpha
                rawA1 = -2.0f * cosW0
                rawA2 = 1.0f - alpha
            }
            Type.BAND_PASS -> {
                rawB0 = alpha
                rawB1 = 0.0f
                rawB2 = -alpha
                rawA0 = 1.0f + alpha
                rawA1 = -2.0f * cosW0
                rawA2 = 1.0f - alpha
            }
            Type.NOTCH -> {
                rawB0 = 1.0f
                rawB1 = -2.0f * cosW0
                rawB2 = 1.0f
                rawA0 = 1.0f + alpha
                rawA1 = -2.0f * cosW0
                rawA2 = 1.0f - alpha
            }
        }

        // Normalización respecto de a0
        val invA0 = 1.0f / rawA0
        b0 = rawB0 * invA0
        b1 = rawB1 * invA0
        b2 = rawB2 * invA0
        a1 = rawA1 * invA0
        a2 = rawA2 * invA0
    }

    @Suppress("NOTHING_TO_INLINE")
    inline fun processLeft(input: Float): Float {
        if (!isEnabled) return input
        val out = b0 * input + b1 * x1L + b2 * x2L - a1 * y1L - a2 * y2L
        x2L = x1L
        x1L = input
        y2L = y1L
        y1L = out
        return out
    }

    @Suppress("NOTHING_TO_INLINE")
    inline fun processRight(input: Float): Float {
        if (!isEnabled) return input
        val out = b0 * input + b1 * x1R + b2 * x2R - a1 * y1R - a2 * y2R
        x2R = x1R
        x1R = input
        y2R = y1R
        y1R = out
        return out
    }
}
