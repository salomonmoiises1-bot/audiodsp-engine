# Include this from the target device's product makefile for an AOSP/vendor build.
# This builds and installs the effect library. The EQsb XML fragment must be merged
# into the device's EXISTING audio_effects_config.xml; do not replace OEM entries.
PRODUCT_PACKAGES += libeqsb_aidl_effect
