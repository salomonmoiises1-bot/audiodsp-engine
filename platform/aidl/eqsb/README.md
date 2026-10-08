# EQsb native AIDL effect

This directory is the platform-side integration required for Android 14+ AIDL Effects HAL.

AOSP maps HIDL `IEffectsFactory` to AIDL `IFactory`; `queryEffects`, `queryProcessing`, and `createEffect` are provided by the platform factory. EQsb supplies the actual `IEffect` implementation and effect-library entry points. The factory discovers it from the AIDL effects configuration.

The implementation is intentionally separate from Oboe. Oboe remains only an optional internal PCM backend for the APK and is not used to obtain external application audio.
