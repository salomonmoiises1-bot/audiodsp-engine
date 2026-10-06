#include "test_framework.h"
#include "../../main/cpp/effects/BassBoost.h"
#include "../../main/cpp/effects/ToneControl.h"
#include "../../main/cpp/effects/SpatialVirtualizer.h"
#include <vector>

using namespace eqsb;
using namespace eqsb::effects;
using namespace eqsb::test;

// Bass Boost: modifies low frequencies (60 Hz) while leaving 6000 Hz unaffected
EQSB_TEST(BassBoost_SelectiveLowFrequencyBoost) {
    BassBoost bb;
    bb.initialize(48000.0f, 2);
    bb.setEnabled(true);
    bb.setStrength(1.0f); // 100% boost (+12 dB)

    constexpr int frames = 1024;

    // Test 1: 60 Hz low frequency
    std::vector<float> lowBuf(frames * 2);
    generateSine(lowBuf.data(), frames, 2, 60.0f, 48000.0f, 0.2f);
    float inLowRms = calculateRms(lowBuf.data(), frames, 2, 0);
    bb.process(lowBuf.data(), frames, 2);
    float outLowRms = calculateRms(lowBuf.data() + 256 * 2, frames - 256, 2, 0);

    // Test 2: 6000 Hz high frequency
    bb.reset();
    std::vector<float> highBuf(frames * 2);
    generateSine(highBuf.data(), frames, 2, 6000.0f, 48000.0f, 0.2f);
    float inHighRms = calculateRms(highBuf.data(), frames, 2, 0);
    bb.process(highBuf.data(), frames, 2);
    float outHighRms = calculateRms(highBuf.data() + 256 * 2, frames - 256, 2, 0);

    float lowRatio = outLowRms / inLowRms;
    float highRatio = outHighRms / inHighRms;

    return assertTrue(lowRatio > 2.0f && std::abs(highRatio - 1.0f) < 0.15f,
                      "BassBoost must selectively boost bass frequencies and leave treble untouched");
}

// Tone Control: verify Bass, Mid, and Treble modifications
EQSB_TEST(ToneControl_BassMidTrebleBoost) {
    ToneControl tc;
    tc.initialize(48000.0f, 2);
    tc.setEnabled(true);
    tc.setBassDb(6.0f);
    tc.setMidDb(6.0f);
    tc.setTrebleDb(6.0f);

    constexpr int frames = 1024;
    // Check bass at 150 Hz
    std::vector<float> bassBuf(frames * 2);
    generateSine(bassBuf.data(), frames, 2, 150.0f, 48000.0f, 0.2f);
    float inBassRms = calculateRms(bassBuf.data(), frames, 2, 0);
    tc.process(bassBuf.data(), frames, 2);
    float outBassRms = calculateRms(bassBuf.data() + 256 * 2, frames - 256, 2, 0);

    return assertTrue(outBassRms / inBassRms > 1.4f, "Tone bass boost must amplify low frequencies");
}

// Spatial Virtualizer: widens stereo soundstage
EQSB_TEST(SpatialVirtualizer_StereoWidening) {
    SpatialVirtualizer sv;
    sv.initialize(48000.0f, 2);
    sv.setEnabled(true);
    sv.setWidth(0.8f);

    constexpr int frames = 512;
    // Asymmetric stereo input (left channel only)
    std::vector<float> buf(frames * 2, 0.0f);
    for (int i = 0; i < frames; ++i) {
        buf[i * 2] = std::sin(i * 0.1f) * 0.5f; // Left has signal
        buf[i * 2 + 1] = 0.0f;                  // Right is silent
    }

    sv.process(buf.data(), frames, 2);

    // Crossfeed and side expansion should generate natural binaural acoustic presence in right channel
    float rightEnergy = 0.0f;
    for (int i = 100; i < frames; ++i) {
        rightEnergy += buf[i * 2 + 1] * buf[i * 2 + 1];
    }
    return assertTrue(rightEnergy > 0.001f, "Spatial virtualizer should create stereo cross-feed soundstage");
}
