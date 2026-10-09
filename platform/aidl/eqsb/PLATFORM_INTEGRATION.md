# EQsb registration in AudioFlinger / AIDL Effects HAL

This is a **platform/vendor integration**, not an APK-only feature. It becomes active only after the target ROM/vendor image is built and flashed with the EQsb library and the merged effects configuration.

## 1. Add the effect library to the device build

Copy `platform/aidl/eqsb/` into the device/AOSP source tree, keeping the directory structure. Include `eqsb_product.mk` from the target product makefile (or add `libeqsb_aidl_effect` to that product's `PRODUCT_PACKAGES`). Build the vendor image. `Android.bp` builds `libeqsb_aidl_effect` for the AIDL effect-library ABI and installs it in `vendor/lib[64]/soundfx`.

## 2. Merge the registration without deleting OEM effects

The device's active `audio_effects_config.xml` is authoritative. Do not install `audio_effects_config_eqsb.xml` over it: that would discard existing vendor effects. Back up the active source XML, then run:

```sh
python3 merge_audio_effects_config.py /path/to/device/audio_effects_config.xml audio_effects_config_eqsb.xml
```

The script merges the EQsb library, implementation UUID/type, and `music` postprocess entry into existing sections, preserving other effects. Review the diff and validate the XML before building. If the device uses a different config format/schema, merge the equivalent entries manually into the config actually consumed by its AIDL Effects HAL.

The required entries are:

- library name `eqsb_aidl` → `libeqsb_aidl_effect.so`
- effect name `eqsb_global`, implementation UUID `7421cb80-5a33-4f9e-a89a-0242ac120002`
- effect type UUID `7421cb80-5a33-4f9e-a89a-0242ac120001`
- postprocess `stream type="music"` → `eqsb_global`

Do not create a second `IFactory/default` service. EQsb is a library loaded by the device's existing AIDL Effects HAL factory.

## 3. Build, flash, and verify

Build and flash the vendor/system image for the actual device. Installing the APK or copying the `.so` onto a production phone is not sufficient: SELinux, linker namespaces, HAL configuration, ABI, and signature/partition rules must all match the ROM.

After boot, inspect audio service logs and `dumpsys media.audio_flinger`; confirm the EQsb implementation UUID is discovered and the music postprocess chain instantiates it. Play a test tone/music from YouTube, AIMP, or Spotify and compare enabled/disabled output. If the effect is not shown by the factory, the device is not yet registered, regardless of whether the library compiled.

## Control limitation

The current normal APK intentionally does not use hidden `android.media.audiofx.AudioEffect` constructors. This platform package registers the processing effect, but live controls from the APK still require a supported privileged Binder/system-service bridge that sends the vendor `DefaultExtension` packet to the effect. Registration alone does not make APK sliders control the HAL instance. Do not claim that end-to-end UI control is complete until that bridge is implemented and tested.

## Audio path

The platform effect receives PCM from the AIDL Effects HAL processing path and runs the EQsb DSP engine. It does not use microphone capture and does not open an Oboe playback stream, so it does not create a second audible output route.
