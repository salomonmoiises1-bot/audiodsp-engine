package com.eqsb.core

enum class AudioBackendType(val displayName: String, val description: String) {
    OBOE(
        displayName = "Oboe PCM Engine",
        description = "High-performance low-latency stream owned directly by EQsb via AAudio / OpenSL ES."
    ),
    AUDIO_EFFECT(
        displayName = "Android AudioEffect Bridge",
        description = "AudioEffect session bridge for media players broadcasting open session IDs."
    )
}
