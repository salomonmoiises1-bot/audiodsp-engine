# Platform installation

## Legacy / HIDL EffectsFactory
1. Build `libeqsb_effect.so` with Soong.
2. Install it to the vendor soundfx directory (`/vendor/lib64/soundfx` on a 64-bit device).
3. Merge `audio_effects.xml` into the vendor audio effects configuration.
4. Ensure the vendor EffectsFactory can load `libeqsb_effect.so`.

The `music` postprocess entry makes AudioPolicyEffects request the EQsb effect
for music output streams. The framework then creates the effect instance and
calls its native `process()` with the AudioFlinger PCM buffer. This is the real
inline PCM path; Oboe is not involved. AOSP documents the postprocess XML model
and the soundfx library search path in its effects configuration.

## Android 14+ AIDL Effects HAL
Android's AIDL Effects HAL exposes `IFactory.queryEffects`, `queryProcessing`
and `createEffect`; on an AIDL device the vendor Effects HAL must expose the
EQsb implementation through that factory. The legacy `audio_effects.xml` is not
itself a substitute for an AIDL factory registration. The EQsb DSP core is
already isolated so an AIDL `IEffect` adapter can link the same `libeqsb_dsp_core`
without Oboe.
