package com.audiodsp.engine.dsp

import kotlin.math.*

/**
 * Motor de Procesamiento Digital de Señal (DSP) de 10 etapas en Kotlin
 * 
 * Flujo de Procesamiento Estricto:
 * 1. Pre-Gain & Inversión de Fase
 * 2. Bass Boost (Filtro Biquad Sub Low-Shelf + Saturación Armónica tanh)
 * 3. Virtualizer (Matriz Mid/Side con ensanchamiento estéreo)
 * 4. Ecualizador Paramétrico de 32 Bandas ISO 266 (Peaking Biquad)
 * 5. Controles de Tono (3 bandas: Bass Low-Shelf, Mid Peaking, Treble High-Shelf)
 * 6. MDRC (Control Dinámico Multibanda de 3 zonas con Crossover Linkwitz-Riley)
 * 7. Master Gain & Balance Estéreo
 * 8. Soft Limiter (Brickwall saturación suave no lineal tipo tanh)
 * 9. Medición Peak / RMS en tiempo real
 */
class AudioDspEngine(val sampleRate: Float = 48000.0f) {

    companion object {
        val ISO_32_FREQUENCIES = floatArrayOf(
            20f, 25f, 31.5f, 40f, 50f, 63f, 80f, 100f, 125f, 160f, 200f, 250f, 315f, 400f, 500f,
            630f, 800f, 1000f, 1250f, 1600f, 2000f, 2500f, 3150f, 4000f, 5000f, 6300f, 8000f,
            10000f, 12500f, 16000f, 18000f, 20000f
        )
    }

    var isMasterBypass: Boolean = false

    // 1. Pre-Gain
    var preGainDb: Float = 0.0f
    var invertPhase: Boolean = false

    // 2. Bass Boost
    var bassBoostEnabled: Boolean = false
    var bassBoostGainDb: Float = 6.0f
    var bassBoostFreqHz: Float = 80.0f
    var bassBoostHarmonics: Float = 0.3f
    private val bassFilter = BiquadFilter()

    // 3. Virtualizer
    var virtualizerEnabled: Boolean = false
    var virtualizerWidth: Float = 1.0f // 1.0 = normal, 1.5 = expanded
    var virtualizerStrength: Float = 0.5f

    // 4. Ecualizador 32 Bandas
    val eq32Filters = Array(32) { BiquadFilter() }
    val eq32Gains = FloatArray(32) { 0.0f }
    val eq32Enabled = BooleanArray(32) { true }

    // 5. Tone Controls
    var toneEnabled: Boolean = true
    var toneBassGainDb: Float = 0.0f
    var toneMidGainDb: Float = 0.0f
    var toneTrebleGainDb: Float = 0.0f
    private val toneBassFilter = BiquadFilter()
    private val toneMidFilter = BiquadFilter()
    private val toneTrebleFilter = BiquadFilter()

    // 6. MDRC
    val mdrcProcessor = MdrcProcessor(sampleRate)

    // 7. Master Gain & Balance
    var masterGainDb: Float = 0.0f
    var balance: Float = 0.0f // -1.0 a +1.0

    // 8. Soft Limiter
    var limiterEnabled: Boolean = true
    var limiterCeiling: Float = 0.98f

    // Telemetría en tiempo real
    var currentPeakLeft: Float = 0.0f
        private set
    var currentPeakRight: Float = 0.0f
        private set
    var currentRmsLeft: Float = 0.0f
        private set
    var currentRmsRight: Float = 0.0f
        private set

    init {
        // Inicializar filtros del EQ de 32 bandas
        for (i in 0 until 32) {
            val freq = ISO_32_FREQUENCIES[i]
            eq32Filters[i].configure(BiquadFilter.Type.PEAKING, freq, 0.0f, 1.414f, sampleRate)
        }

        // Inicializar Bass Boost
        updateBassBoost()

        // Inicializar Tone Controls
        updateToneControls()
    }

    fun updateBassBoost() {
        bassFilter.configure(
            BiquadFilter.Type.LOW_SHELF,
            bassBoostFreqHz,
            if (bassBoostEnabled) bassBoostGainDb else 0.0f,
            0.707f,
            sampleRate
        )
    }

    fun updateToneControls() {
        toneBassFilter.configure(
            BiquadFilter.Type.LOW_SHELF,
            120.0f,
            if (toneEnabled) toneBassGainDb else 0.0f,
            0.707f,
            sampleRate
        )
        toneMidFilter.configure(
            BiquadFilter.Type.PEAKING,
            1000.0f,
            if (toneEnabled) toneMidGainDb else 0.0f,
            1.0f,
            sampleRate
        )
        toneTrebleFilter.configure(
            BiquadFilter.Type.HIGH_SHELF,
            6000.0f,
            if (toneEnabled) toneTrebleGainDb else 0.0f,
            0.707f,
            sampleRate
        )
    }

    fun setEqBandGain(bandIndex: Int, gainDb: Float) {
        if (bandIndex in 0 until 32) {
            eq32Gains[bandIndex] = gainDb
            eq32Filters[bandIndex].configure(
                BiquadFilter.Type.PEAKING,
                ISO_32_FREQUENCIES[bandIndex],
                gainDb,
                1.414f,
                sampleRate
            )
        }
    }

    /**
     * Bucle de procesamiento de audio en tiempo real para búfer estéreo entrelazado [L0, R0, L1, R1, ...]
     * Cero asignaciones dentro del bucle de audio para garantizar latencia ultra baja.
     */
    fun processInterleavedFloat(buffer: FloatArray, frameCount: Int) {
        if (isMasterBypass) {
            // Bypass Maestro: El audio pasa directo sin alteración
            return
        }

        val preGainLinear = 10.0f.pow(preGainDb / 20.0f) * (if (invertPhase) -1.0f else 1.0f)
        val masterGainLinear = 10.0f.pow(masterGainDb / 20.0f)
        val leftGainFactor = (1.0f - max(0.0f, balance)) * masterGainLinear
        val rightGainFactor = (1.0f + min(0.0f, balance)) * masterGainLinear

        var sumSqL = 0.0f
        var sumSqR = 0.0f
        var maxPeakL = 0.0f
        var maxPeakR = 0.0f

        for (frame in 0 until frameCount) {
            val idx = frame * 2
            var left = buffer[idx]
            var right = buffer[idx + 1]

            // 1. Pre-Gain & Fase
            left *= preGainLinear
            right *= preGainLinear

            // 2. Bass Boost con armónicos tanh
            if (bassBoostEnabled) {
                val processedL = bassFilter.processLeft(left)
                val processedR = bassFilter.processRight(right)
                val harmonicsL = tanh(processedL * (1.0f + bassBoostHarmonics))
                val harmonicsR = tanh(processedR * (1.0f + bassBoostHarmonics))
                left = (processedL * 0.7f) + (harmonicsL * 0.3f)
                right = (processedR * 0.7f) + (harmonicsR * 0.3f)
            }

            // 3. Virtualizer (Matriz Mid/Side)
            if (virtualizerEnabled) {
                val mid = (left + right) * 0.5f
                var side = (left - right) * 0.5f
                side *= (1.0f + virtualizerWidth * virtualizerStrength)
                left = mid + side
                right = mid - side
            }

            // 4. Ecualizador de 32 Bandas ISO 266 en Cascada
            for (i in 0 until 32) {
                if (eq32Enabled[i] && abs(eq32Gains[i]) > 0.01f) {
                    left = eq32Filters[i].processLeft(left)
                    right = eq32Filters[i].processRight(right)
                }
            }

            // 5. Controles de Tono (Bass, Mid, Treble)
            if (toneEnabled) {
                left = toneBassFilter.processLeft(left)
                right = toneBassFilter.processRight(right)
                left = toneMidFilter.processLeft(left)
                right = toneMidFilter.processRight(right)
                left = toneTrebleFilter.processLeft(left)
                right = toneTrebleFilter.processRight(right)
            }

            // 6. MDRC (Multiband Dynamics)
            val mdrcOut = mdrcProcessor.processStereo(left, right)
            left = mdrcOut.first
            right = mdrcOut.second

            // 7. Master Gain & Balance Estéreo
            left *= leftGainFactor
            right *= rightGainFactor

            // 8. Soft Limiter (Brickwall Tanh Clipping para evitar sobrepaso digital de 0 dBFS)
            if (limiterEnabled) {
                if (abs(left) > limiterCeiling) {
                    left = limiterCeiling * tanh(left / limiterCeiling)
                }
                if (abs(right) > limiterCeiling) {
                    right = limiterCeiling * tanh(right / limiterCeiling)
                }
            }

            // Escribir muestra procesada al buffer
            buffer[idx] = left
            buffer[idx + 1] = right

            // Acumulación de estadísticas de niveles
            val absL = abs(left)
            val absR = abs(right)
            if (absL > maxPeakL) maxPeakL = absL
            if (absR > maxPeakR) maxPeakR = absR
            sumSqL += left * left
            sumSqR += right * right
        }

        // Actualizar telemetría atómica
        currentPeakLeft = maxPeakL
        currentPeakRight = maxPeakR
        currentRmsLeft = if (frameCount > 0) sqrt(sumSqL / frameCount) else 0.0f
        currentRmsRight = if (frameCount > 0) sqrt(sumSqR / frameCount) else 0.0f
    }
}
