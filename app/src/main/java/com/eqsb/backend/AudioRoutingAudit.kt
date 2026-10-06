package com.eqsb.backend

data class AuditSection(
    val title: String,
    val summary: String,
    val technicalDetails: String,
    val apkAllowed: Boolean
)

object AudioRoutingAudit {

    val SECTIONS: List<AuditSection> = listOf(
        AuditSection(
            title = "1. AudioFlinger & Session 0 (Global Output Mix)",
            summary = "Deprecated in Android 9 (Pie) and blocked for normal APKs in modern Android.",
            technicalDetails = """
In older Android versions (<= 8.1), an application could instantiate an AudioEffect with audioSession = 0 (AUDIO_SESSION_OUTPUT_MIX). AudioFlinger would insert the effect chain globally on the fast/normal mixer thread.

Starting with Android 9.0 (API 28) and Android 10+:
- Session 0 is explicitly deprecated.
- AudioFlinger enforces signature/system permission checks (android.permission.MODIFY_AUDIO_ROUTING).
- Third-party unprivileged applications calling new AudioEffect(..., 0) receive an UnsupportedOperationException ("Effect library not found") or silent failure.
- Security boundary: Prevents malicious background applications from eavesdropping or tampering with confidential system audio (e.g. notifications, private VoIP calls).
            """.trimIndent(),
            apkAllowed = false
        ),
        AuditSection(
            title = "2. Specific Media Player Audio Sessions",
            summary = "Permitted when third-party media players explicitly broadcast session IDs.",
            technicalDetails = """
When compliant media players (e.g. VLC, Poweramp, certain podcast players) initialize an AudioTrack or MediaPlayer, they can broadcast:
Action: android.media.action.OPEN_AUDIO_EFFECT_CONTROL_SESSION
Extra: EXTRA_AUDIO_SESSION (integer session ID)

EQsb registers a BroadcastReceiver to capture these session IDs and attach an AudioEffect instance directly to that playback session.
However:
- Major streaming apps (YouTube, Netflix, TikTok, Spotify) frequently omit session broadcasts or set audio attributes with private flags.
- Therefore, a standard APK cannot reliably capture all audio on modern Android devices through session IDs alone.
            """.trimIndent(),
            apkAllowed = true
        ),
        AuditSection(
            title = "3. Oboe / AAudio Direct PCM Ownership",
            summary = "100% functional, real-time zero-latency DSP on all audio owned and played by EQsb.",
            technicalDetails = """
Oboe bypasses high-level Java frameworks, opening native AAudio (Android 8.0+) or OpenSL ES streams with low-latency flags:
- Direction: Output
- SharingMode: Exclusive (or Shared)
- Format: PCM Float / PCM 16-bit
- Audio Callback: onAudioReady() runs on real-time thread SCHED_FIFO.

In EQsb:
- Raw audio or test signals are fed directly into EQsbDspEngine::process(float* interleavedPcm, int frames).
- All 10 DSP nodes (PreGain -> Bass -> Tone -> EQ32 -> MDRC -> AutoGain -> Limiter -> Spatial -> Master -> Balance) execute on real PCM float samples in C++.
- NO false claims: Oboe operates on streams owned by EQsb, not on external apps' streams.
            """.trimIndent(),
            apkAllowed = true
        ),
        AuditSection(
            title = "4. Android 10+ AudioPlaybackCapture API",
            summary = "Recording/Capture stream API, not an in-line filter for AudioFlinger.",
            technicalDetails = """
Android 10 introduced AudioPlaybackCaptureConfiguration via MediaProjection:
- Requires user consent dialog (Screen / Audio capture).
- Apps being captured must allow capture (allowAudioPlaybackCapture=true in manifest or USAGE_MEDIA / USAGE_GAME).
- Critical limitation: AudioPlaybackCapture is an INPUT (recording) stream, NOT an in-line filter. Captured audio cannot be transparently replaced back into AudioFlinger without causing duplicated echo/latency unless the original stream is muted (which requires system privileges).
            """.trimIndent(),
            apkAllowed = false
        ),
        AuditSection(
            title = "5. System / Vendor Partition Integration (Root / OEM / ROM)",
            summary = "The only legitimate route for true universal system-wide DSP filtering.",
            technicalDetails = """
To insert an arbitrary DSP engine globally across all system audio on Android:
1. Compile libeqsb_dsp.so for the target device ABI (arm64-v8a).
2. Install the library into /vendor/lib64/soundfx/ or /system/lib64/soundfx/.
3. Register the UUID in /vendor/etc/audio_effects.xml or /system/etc/audio_effects.xml:
   <effect name="eqsb" library="eqsb_dsp" uuid="7421cb80-5a33-4f9e-a89a-0242ac120002"/>
4. Implement the Effects HAL interface:
   - HIDL: android.hardware.audio.effect@6.0 / 7.0
   - AIDL: android.hardware.audio.effect (Android 13+)
5. AudioFlinger will load the library at boot and insert it into the master audio pipeline for all streams.
            """.trimIndent(),
            apkAllowed = false
        )
    )

    fun getFullAuditReport(): String {
        val sb = StringBuilder()
        sb.append("EQsb SYSTEM & AUDIOFLINGER ROUTING AUDIT\n")
        sb.append("=========================================\n\n")
        for (section in SECTIONS) {
            sb.append(section.title).append("\n")
            sb.append("Summary: ").append(section.summary).append("\n")
            sb.append("APK Allowed: ").append(if (section.apkAllowed) "YES" else "REQUIRES SYSTEM/VENDOR PRIVILEGES").append("\n")
            sb.append(section.technicalDetails).append("\n\n")
        }
        return sb.toString()
    }
}
