# EQsb AIDL Effects HAL integration

Target: Android 14+ AIDL Effects HAL.

The AIDL Effects HAL entry point remains the platform `IFactory/default`. EQsb is a real `IEffect` implementation loaded by that factory through the effect-library ABI (`createEffect`, `queryEffect`, `destroyEffect`). AOSP's factory performs `queryEffects`, `queryProcessing` and `createEffect` and dynamically loads the configured effect library. The EQsb library therefore must be added to the device's AIDL effects configuration; it does not replace the platform factory.

## Integration

1. Add `platform/aidl/eqsb/` to the vendor/device source tree.
2. Add `libeqsb_aidl_effect` to the vendor build.
3. Merge `audio_effects_config_eqsb.xml` into the AIDL Effects HAL `audio_effects_config.xml` used by `IFactory/default` (or reproduce the same `<libraries>`, `<effects>`, and `<postprocess>` entries in the vendor configuration).
4. Keep the AIDL Effects HAL service manifest pointing to `IFactory/default`; do not create a second factory service.
5. Build/flash the vendor image. The library installs under `/vendor/lib64/soundfx/` (and `/vendor/lib/soundfx/` for 32-bit if the product builds that ABI).
6. Verify `dumpsys media.audio_flinger` / audio service logs show the EQsb implementation UUID and the effect is present in `queryEffects` and `queryProcessing`.

The postprocess entry attaches EQsb to the MUSIC stream processing chain. The effect receives float PCM through the AIDL FMQ and calls the existing `EQsbDspEngine` in-place. No microphone capture and no Oboe output stream are involved in this path.

## Parameters

The effect uses AOSP `DefaultExtension` vendor-effect bytes. The Android framework passes the legacy effect parameter payload through this extension mechanism; EQsb decodes the `EQSB` configuration packet and applies the complete DspConfig, including all 32 EQ bands.

The APK controls the global effect through `AudioEffect` using implementation UUID `7421cb80-5a33-4f9e-a89a-0242ac120002` and audio session `0`.
