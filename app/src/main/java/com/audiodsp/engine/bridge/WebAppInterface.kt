package com.audiodsp.engine.bridge

import android.webkit.JavascriptInterface
import com.audiodsp.engine.dsp.AudioDspEngine
import org.json.JSONObject

/**
 * Puente JavaScriptInterface de Comunicación Bidireccional
 * Conecta los controles de la interfaz con los parámetros del motor de audio nativo.
 */
class WebAppInterface(private val engineProvider: () -> AudioDspEngine?) {

    @JavascriptInterface
    fun setMasterBypass(bypass: Boolean) {
        engineProvider()?.isMasterBypass = bypass
    }

    @JavascriptInterface
    fun setPreGain(gainDb: Float, invertPhase: Boolean) {
        engineProvider()?.let { engine ->
            engine.preGainDb = gainDb
            engine.invertPhase = invertPhase
        }
    }

    @JavascriptInterface
    fun setBassBoost(enabled: Boolean, gainDb: Float, freqHz: Float, harmonics: Float) {
        engineProvider()?.let { engine ->
            engine.bassBoostEnabled = enabled
            engine.bassBoostGainDb = gainDb
            engine.bassBoostFreqHz = freqHz
            engine.bassBoostHarmonics = harmonics
            engine.updateBassBoost()
        }
    }

    @JavascriptInterface
    fun setVirtualizer(enabled: Boolean, width: Float, strength: Float) {
        engineProvider()?.let { engine ->
            engine.virtualizerEnabled = enabled
            engine.virtualizerWidth = width
            engine.virtualizerStrength = strength
        }
    }

    @JavascriptInterface
    fun setEqBand(index: Int, gainDb: Float) {
        engineProvider()?.setEqBandGain(index, gainDb)
    }

    @JavascriptInterface
    fun setTone(enabled: Boolean, bassDb: Float, midDb: Float, trebleDb: Float) {
        engineProvider()?.let { engine ->
            engine.toneEnabled = enabled
            engine.toneBassGainDb = bassDb
            engine.toneMidGainDb = midDb
            engine.toneTrebleGainDb = trebleDb
            engine.updateToneControls()
        }
    }

    @JavascriptInterface
    fun setMdrcBand(band: String, thresholdDb: Float, ratio: Float, attackMs: Float, releaseMs: Float, makeupDb: Float) {
        engineProvider()?.let { engine ->
            val comp = when (band.lowercase()) {
                "low" -> engine.mdrcProcessor.lowComp
                "mid" -> engine.mdrcProcessor.midComp
                "high" -> engine.mdrcProcessor.highComp
                else -> null
            }
            comp?.let {
                it.thresholdDb = thresholdDb
                it.ratio = ratio
                it.attackMs = attackMs
                it.releaseMs = releaseMs
                it.makeupDb = makeupDb
                it.updateCoefficients(engine.sampleRate)
            }
        }
    }

    @JavascriptInterface
    fun setMasterGain(gainDb: Float, balance: Float) {
        engineProvider()?.let { engine ->
            engine.masterGainDb = gainDb
            engine.balance = balance
        }
    }

    @JavascriptInterface
    fun setLimiter(enabled: Boolean, ceiling: Float) {
        engineProvider()?.let { engine ->
            engine.limiterEnabled = enabled
            engine.limiterCeiling = ceiling
        }
    }

    @JavascriptInterface
    fun getTelemetry(): String {
        val engine = engineProvider() ?: return "{}"
        val json = JSONObject()
        json.put("peakLeft", engine.currentPeakLeft)
        json.put("peakRight", engine.currentPeakRight)
        json.put("rmsLeft", engine.currentRmsLeft)
        json.put("rmsRight", engine.currentRmsRight)
        json.put("bypass", engine.isMasterBypass)
        return json.toString()
    }
}
