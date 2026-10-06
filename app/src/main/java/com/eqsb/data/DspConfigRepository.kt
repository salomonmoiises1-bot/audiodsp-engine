package com.eqsb.data

import android.content.Context
import android.content.SharedPreferences
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.core.EQ32Frequencies
import com.eqsb.core.Preset
import com.eqsb.core.Presets

class DspConfigRepository(context: Context) {

    private val prefs: SharedPreferences =
        context.getSharedPreferences("eqsb_dsp_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_PRE_GAIN = "pre_gain_db"
        private const val KEY_BASS_ENABLED = "bass_boost_enabled"
        private const val KEY_BASS_STRENGTH = "bass_boost_strength"
        private const val KEY_TONE_ENABLED = "tone_enabled"
        private const val KEY_TONE_BASS = "tone_bass_db"
        private const val KEY_TONE_MID = "tone_mid_db"
        private const val KEY_TONE_TREBLE = "tone_treble_db"
        private const val KEY_EQ32_ENABLED = "eq32_enabled"
        private const val KEY_EQ32_BAND_PREFIX = "eq32_band_"
        private const val KEY_MDRC_ENABLED = "mdrc_enabled"
        private const val KEY_MDRC_LOW_THRESH = "mdrc_low_thresh"
        private const val KEY_MDRC_LOW_RATIO = "mdrc_low_ratio"
        private const val KEY_MDRC_MID_THRESH = "mdrc_mid_thresh"
        private const val KEY_MDRC_MID_RATIO = "mdrc_mid_ratio"
        private const val KEY_MDRC_HIGH_THRESH = "mdrc_high_thresh"
        private const val KEY_MDRC_HIGH_RATIO = "mdrc_high_ratio"
        private const val KEY_AUTOGAIN_ENABLED = "autogain_enabled"
        private const val KEY_AUTOGAIN_TARGET = "autogain_target"
        private const val KEY_AUTOGAIN_MAX = "autogain_max_gain"
        private const val KEY_AUTOGAIN_MIN = "autogain_min_gain"
        private const val KEY_LIMITER_ENABLED = "limiter_enabled"
        private const val KEY_LIMITER_CEILING = "limiter_ceiling"
        private const val KEY_LIMITER_RELEASE = "limiter_release_ms"
        private const val KEY_SPATIAL_ENABLED = "spatial_enabled"
        private const val KEY_SPATIAL_WIDTH = "spatial_width"
        private const val KEY_MASTER_GAIN = "master_gain_db"
        private const val KEY_BALANCE = "balance"
        private const val KEY_BYPASS = "bypass"
        private const val KEY_BACKEND_TYPE = "backend_type"
        private const val KEY_CURRENT_PRESET_ID = "current_preset_id"
    }

    fun loadConfig(): DspConfig {
        val bands = FloatArray(EQ32Frequencies.NUM_BANDS)
        for (i in 0 until EQ32Frequencies.NUM_BANDS) {
            bands[i] = prefs.getFloat("$KEY_EQ32_BAND_PREFIX$i", 0.0f)
        }

        val backendTypeName = prefs.getString(KEY_BACKEND_TYPE, AudioBackendType.OBOE.name)
        val backendType = try {
            AudioBackendType.valueOf(backendTypeName ?: AudioBackendType.OBOE.name)
        } catch (e: Exception) {
            AudioBackendType.OBOE
        }

        return DspConfig(
            preGainDb = prefs.getFloat(KEY_PRE_GAIN, 0.0f),
            bassBoostEnabled = prefs.getBoolean(KEY_BASS_ENABLED, false),
            bassBoostStrength = prefs.getFloat(KEY_BASS_STRENGTH, 0.0f),
            toneEnabled = prefs.getBoolean(KEY_TONE_ENABLED, false),
            toneBassDb = prefs.getFloat(KEY_TONE_BASS, 0.0f),
            toneMidDb = prefs.getFloat(KEY_TONE_MID, 0.0f),
            toneTrebleDb = prefs.getFloat(KEY_TONE_TREBLE, 0.0f),
            eq32Enabled = prefs.getBoolean(KEY_EQ32_ENABLED, true),
            eq32Bands = bands,
            mdrcEnabled = prefs.getBoolean(KEY_MDRC_ENABLED, false),
            mdrcLowThresholdDb = prefs.getFloat(KEY_MDRC_LOW_THRESH, -16.0f),
            mdrcLowRatio = prefs.getFloat(KEY_MDRC_LOW_RATIO, 3.0f),
            mdrcMidThresholdDb = prefs.getFloat(KEY_MDRC_MID_THRESH, -18.0f),
            mdrcMidRatio = prefs.getFloat(KEY_MDRC_MID_RATIO, 2.5f),
            mdrcHighThresholdDb = prefs.getFloat(KEY_MDRC_HIGH_THRESH, -20.0f),
            mdrcHighRatio = prefs.getFloat(KEY_MDRC_HIGH_RATIO, 3.5f),
            autoGainEnabled = prefs.getBoolean(KEY_AUTOGAIN_ENABLED, false),
            autoGainTargetDb = prefs.getFloat(KEY_AUTOGAIN_TARGET, -14.0f),
            autoGainMaxGainDb = prefs.getFloat(KEY_AUTOGAIN_MAX, 12.0f),
            autoGainMinGainDb = prefs.getFloat(KEY_AUTOGAIN_MIN, -18.0f),
            limiterEnabled = prefs.getBoolean(KEY_LIMITER_ENABLED, true),
            limiterCeilingDb = prefs.getFloat(KEY_LIMITER_CEILING, -0.1f),
            limiterReleaseMs = prefs.getFloat(KEY_LIMITER_RELEASE, 80.0f),
            spatialEnabled = prefs.getBoolean(KEY_SPATIAL_ENABLED, false),
            spatialWidth = prefs.getFloat(KEY_SPATIAL_WIDTH, 0.0f),
            masterGainDb = prefs.getFloat(KEY_MASTER_GAIN, 0.0f),
            balance = prefs.getFloat(KEY_BALANCE, 0.0f),
            bypass = prefs.getBoolean(KEY_BYPASS, false),
            backendType = backendType
        )
    }

    fun saveConfig(config: DspConfig) {
        val editor = prefs.edit()
        editor.putFloat(KEY_PRE_GAIN, config.preGainDb)
        editor.putBoolean(KEY_BASS_ENABLED, config.bassBoostEnabled)
        editor.putFloat(KEY_BASS_STRENGTH, config.bassBoostStrength)
        editor.putBoolean(KEY_TONE_ENABLED, config.toneEnabled)
        editor.putFloat(KEY_TONE_BASS, config.toneBassDb)
        editor.putFloat(KEY_TONE_MID, config.toneMidDb)
        editor.putFloat(KEY_TONE_TREBLE, config.toneTrebleDb)
        editor.putBoolean(KEY_EQ32_ENABLED, config.eq32Enabled)

        for (i in config.eq32Bands.indices) {
            editor.putFloat("$KEY_EQ32_BAND_PREFIX$i", config.eq32Bands[i])
        }

        editor.putBoolean(KEY_MDRC_ENABLED, config.mdrcEnabled)
        editor.putFloat(KEY_MDRC_LOW_THRESH, config.mdrcLowThresholdDb)
        editor.putFloat(KEY_MDRC_LOW_RATIO, config.mdrcLowRatio)
        editor.putFloat(KEY_MDRC_MID_THRESH, config.mdrcMidThresholdDb)
        editor.putFloat(KEY_MDRC_MID_RATIO, config.mdrcMidRatio)
        editor.putFloat(KEY_MDRC_HIGH_THRESH, config.mdrcHighThresholdDb)
        editor.putFloat(KEY_MDRC_HIGH_RATIO, config.mdrcHighRatio)

        editor.putBoolean(KEY_AUTOGAIN_ENABLED, config.autoGainEnabled)
        editor.putFloat(KEY_AUTOGAIN_TARGET, config.autoGainTargetDb)
        editor.putFloat(KEY_AUTOGAIN_MAX, config.autoGainMaxGainDb)
        editor.putFloat(KEY_AUTOGAIN_MIN, config.autoGainMinGainDb)

        editor.putBoolean(KEY_LIMITER_ENABLED, config.limiterEnabled)
        editor.putFloat(KEY_LIMITER_CEILING, config.limiterCeilingDb)
        editor.putFloat(KEY_LIMITER_RELEASE, config.limiterReleaseMs)

        editor.putBoolean(KEY_SPATIAL_ENABLED, config.spatialEnabled)
        editor.putFloat(KEY_SPATIAL_WIDTH, config.spatialWidth)

        editor.putFloat(KEY_MASTER_GAIN, config.masterGainDb)
        editor.putFloat(KEY_BALANCE, config.balance)
        editor.putBoolean(KEY_BYPASS, config.bypass)
        editor.putString(KEY_BACKEND_TYPE, config.backendType.name)
        editor.apply()
    }

    fun saveCurrentPresetId(presetId: String) {
        prefs.edit().putString(KEY_CURRENT_PRESET_ID, presetId).apply()
    }

    fun getCurrentPresetId(): String {
        return prefs.getString(KEY_CURRENT_PRESET_ID, "flat") ?: "flat"
    }
}
