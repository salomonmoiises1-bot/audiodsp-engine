# EQsb native AudioEffect layer

This directory is the platform/vendor integration layer. It is not an APK-only
capture mechanism. `libeqsb_effect.so` implements Android's legacy native
Effect API (`audio_effect_library_t` / `effect_interface_s`) and calls the
shared `EQsbDspEngine` directly on the PCM buffers supplied by AudioFlinger.

The DSP core deliberately does not link Oboe. Oboe remains an independent APK
adapter for PCM streams owned by EQsb and is never used to capture another
application's output.

For legacy EffectsFactory integration, install `libeqsb_effect.so` under the
vendor soundfx directory and merge `audio_effects.xml` into the device audio
effects configuration. Android 14+ devices using the AIDL Effects HAL may
require the equivalent AIDL `IFactory`/`IEffect` integration instead; the legacy
library alone does not replace an AIDL vendor implementation.
