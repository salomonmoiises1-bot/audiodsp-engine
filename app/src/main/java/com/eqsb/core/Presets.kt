package com.eqsb.core

data class Preset(
    val id: String,
    val name: String,
    val category: String,
    val description: String,
    val config: DspConfig
)

object Presets {
    val FACTORY_PRESETS: List<Preset> = listOf(
        Preset(
            id = "flat",
            name = "Flat / Reference",
            category = "Neutral",
            description = "True uncolored studio monitor frequency response. All 32 filters at 0 dB.",
            config = DspConfig(
                preGainDb = 0.0f,
                bassBoostEnabled = false,
                bassBoostStrength = 0.0f,
                toneEnabled = false,
                toneBassDb = 0.0f,
                toneMidDb = 0.0f,
                toneTrebleDb = 0.0f,
                eq32Enabled = true,
                eq32Bands = FloatArray(32) { 0.0f },
                mdrcEnabled = false,
                autoGainEnabled = false,
                limiterEnabled = true,
                limiterCeilingDb = -0.1f,
                spatialEnabled = false,
                spatialWidth = 0.0f,
                masterGainDb = 0.0f,
                balance = 0.0f
            )
        ),
        Preset(
            id = "bass_heavy",
            name = "Bass Heavy & Sub-Impact",
            category = "Bass",
            description = "Deep sub-bass extension (20-100 Hz boost) with active BassBoost and tight limiter.",
            config = DspConfig(
                preGainDb = -2.0f,
                bassBoostEnabled = true,
                bassBoostStrength = 0.75f,
                toneEnabled = true,
                toneBassDb = 4.0f,
                toneMidDb = -1.0f,
                toneTrebleDb = 1.0f,
                eq32Enabled = true,
                eq32Bands = FloatArray(32) { idx ->
                    when {
                        idx <= 4 -> 6.5f   // 20-50 Hz sub
                        idx <= 8 -> 4.5f   // 63-125 Hz punch
                        idx in 12..20 -> -1.0f // mid scoop
                        else -> 0.5f
                    }
                },
                mdrcEnabled = true,
                mdrcLowThresholdDb = -14.0f,
                mdrcLowRatio = 4.0f,
                autoGainEnabled = false,
                limiterEnabled = true,
                limiterCeilingDb = -0.2f,
                spatialEnabled = true,
                spatialWidth = 0.25f,
                masterGainDb = 0.0f,
                balance = 0.0f
            )
        ),
        Preset(
            id = "vocal_clarity",
            name = "Vocal Clarity & Presence",
            category = "Voice",
            description = "Enhanced intelligibility for speech, vocals, and podcasts with mid-band focus.",
            config = DspConfig(
                preGainDb = 0.0f,
                bassBoostEnabled = false,
                bassBoostStrength = 0.0f,
                toneEnabled = true,
                toneBassDb = -2.0f,
                toneMidDb = 3.5f,
                toneTrebleDb = 2.0f,
                eq32Enabled = true,
                eq32Bands = FloatArray(32) { idx ->
                    when {
                        idx <= 5 -> -4.0f  // Low cut (rumble suppression)
                        idx in 14..24 -> 3.5f // 500 Hz to 4 kHz vocal presence
                        else -> 0.0f
                    }
                },
                mdrcEnabled = true,
                mdrcMidThresholdDb = -20.0f,
                mdrcMidRatio = 3.0f,
                autoGainEnabled = true,
                autoGainTargetDb = -14.0f,
                limiterEnabled = true,
                limiterCeilingDb = -0.1f,
                spatialEnabled = false,
                masterGainDb = 0.0f,
                balance = 0.0f
            )
        ),
        Preset(
            id = "studio_master",
            name = "Studio Mastering Precision",
            category = "Studio",
            description = "Gentle mastering curve with active 3-band MDRC compression and brickwall peak protection.",
            config = DspConfig(
                preGainDb = -1.0f,
                bassBoostEnabled = false,
                bassBoostStrength = 0.0f,
                toneEnabled = false,
                eq32Enabled = true,
                eq32Bands = FloatArray(32) { idx ->
                    when (idx) {
                        3 -> 1.0f   // 40 Hz foundation
                        7 -> 0.5f   // 100 Hz warmth
                        17 -> -0.5f // 1 kHz slight dip
                        23 -> 1.0f  // 4 kHz clarity
                        28 -> 1.5f  // 10 kHz air
                        else -> 0.0f
                    }
                },
                mdrcEnabled = true,
                mdrcLowThresholdDb = -16.0f,
                mdrcLowRatio = 2.5f,
                mdrcMidThresholdDb = -18.0f,
                mdrcMidRatio = 2.0f,
                mdrcHighThresholdDb = -20.0f,
                mdrcHighRatio = 2.5f,
                autoGainEnabled = false,
                limiterEnabled = true,
                limiterCeilingDb = -0.3f,
                spatialEnabled = true,
                spatialWidth = 0.35f,
                masterGainDb = 0.0f,
                balance = 0.0f
            )
        ),
        Preset(
            id = "club_edm",
            name = "Club / EDM Energy",
            category = "Electronic",
            description = "V-shaped smile curve for electronic dance music, crisp highs, and pumping low-end.",
            config = DspConfig(
                preGainDb = -2.0f,
                bassBoostEnabled = true,
                bassBoostStrength = 0.6f,
                toneEnabled = true,
                toneBassDb = 3.0f,
                toneMidDb = -2.0f,
                toneTrebleDb = 3.5f,
                eq32Enabled = true,
                eq32Bands = FloatArray(32) { idx ->
                    when {
                        idx <= 6 -> 5.0f   // 20-80 Hz
                        idx in 13..19 -> -2.5f // scoop
                        idx >= 24 -> 4.5f  // 4k-20k highs
                        else -> 0.0f
                    }
                },
                mdrcEnabled = true,
                autoGainEnabled = false,
                limiterEnabled = true,
                limiterCeilingDb = -0.1f,
                spatialEnabled = true,
                spatialWidth = 0.5f,
                masterGainDb = 0.0f,
                balance = 0.0f
            )
        ),
        Preset(
            id = "acoustic_live",
            name = "Acoustic Live Concert",
            category = "Acoustic",
            description = "Warm organic low-mids with expansive spatial widening for immersive live acoustic instruments.",
            config = DspConfig(
                preGainDb = 0.0f,
                bassBoostEnabled = false,
                toneEnabled = true,
                toneBassDb = 1.0f,
                toneMidDb = 1.0f,
                toneTrebleDb = 1.5f,
                eq32Enabled = true,
                eq32Bands = FloatArray(32) { idx ->
                    when (idx) {
                        8, 9, 10 -> 2.0f  // 125-200 Hz warmth
                        20, 21, 22 -> 1.5f // 2k-3.15k string sparkle
                        29, 30 -> 2.0f     // 16k-18k atmosphere
                        else -> 0.0f
                    }
                },
                mdrcEnabled = false,
                autoGainEnabled = false,
                limiterEnabled = true,
                limiterCeilingDb = -0.2f,
                spatialEnabled = true,
                spatialWidth = 0.7f,
                masterGainDb = 0.0f,
                balance = 0.0f
            )
        )
    )

    fun getById(id: String): Preset {
        return FACTORY_PRESETS.find { it.id == id } ?: FACTORY_PRESETS[0]
    }
}
