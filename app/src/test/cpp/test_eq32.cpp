#include "test_framework.h"
#include "../../main/cpp/eq/EQ32.h"
#include <vector>
#include <string>

using namespace eqsb;
using namespace eqsb::eq;
using namespace eqsb::test;

// 1. Verify EQ32 Flat response: when all gains are 0 dB, output equals input
EQSB_TEST(EQ32_FlatResponse) {
    EQ32 eq;
    eq.initialize(48000.0f, 2);

    constexpr int frames = 512;
    std::vector<float> inBuffer(frames * 2);
    generateSine(inBuffer.data(), frames, 2, 1000.0f, 48000.0f, 0.5f);
    std::vector<float> original = inBuffer;

    eq.process(inBuffer.data(), frames, 2);

    float origRms = calculateRms(original.data(), frames, 2, 0);
    float procRms = calculateRms(inBuffer.data(), frames, 2, 0);

    return assertNear(origRms, procRms, 0.005f, "EQ32 flat response should preserve RMS");
}

// 2. Test every single one of the 32 bands individually with +6 dB boost!
EQSB_TEST(EQ32_All32BandsIndividualBoost) {
    bool allPassed = true;

    for (int band = 0; band < NUM_EQ32_BANDS; ++band) {
        EQ32 eq;
        eq.initialize(48000.0f, 2);

        float centerFreq = EQ32::getCenterFrequency(band);
        // Set exactly this band to +6.0 dB, others remain 0.0 dB
        eq.setBandGain(band, 6.0f);

        // For ultra-low sub-bass (20-40 Hz), one period takes 2400 frames at 48 kHz.
        // Biquad resonance requires multiple cycles (~10,000 frames) to reach steady state.
        constexpr int frames = 48000;
        std::vector<float> inBuffer(frames * 2);
        generateSine(inBuffer.data(), frames, 2, centerFreq, 48000.0f, 0.2f);
        float inRms = calculateRms(inBuffer.data(), frames, 2, 0);

        eq.process(inBuffer.data(), frames, 2);

        // Measure steady state in the final 12,000 frames (250 ms)
        float outRms = calculateRms(inBuffer.data() + (frames - 12000) * 2, 12000, 2, 0);

        // Expected ratio for +6 dB is ~1.995 linear
        float ratio = outRms / inRms;
        if (ratio < 1.4f || ratio > 2.5f) {
            std::cerr << "\nBand " << band << " (" << centerFreq << " Hz) boost ratio=" 
                      << ratio << " outside expected range [1.4, 2.5]\n";
            allPassed = false;
        }
    }
    return allPassed;
}

// 3. Test negative gain attenuation on a band (e.g. Band 17: 800 Hz at -12 dB)
EQSB_TEST(EQ32_NegativeGainAttenuation) {
    EQ32 eq;
    eq.initialize(48000.0f, 2);
    int testBand = 17; // 800 Hz
    float centerFreq = EQ32::getCenterFrequency(testBand);

    eq.setBandGain(testBand, -12.0f);

    constexpr int frames = 1024;
    std::vector<float> buffer(frames * 2);
    generateSine(buffer.data(), frames, 2, centerFreq, 48000.0f, 0.5f);
    float inRms = calculateRms(buffer.data(), frames, 2, 0);

    eq.process(buffer.data(), frames, 2);
    float outRms = calculateRms(buffer.data() + 256 * 2, frames - 256, 2, 0);

    float ratio = outRms / inRms;
    // -12 dB is linear ~0.25
    return assertTrue(ratio < 0.45f, "Negative gain must attenuate signal at center frequency");
}

// 4. Test mono (1 channel) and stereo (2 channels)
EQSB_TEST(EQ32_MonoAndStereoSupport) {
    EQ32 eqMono;
    eqMono.initialize(48000.0f, 1);
    eqMono.setBandGain(10, 6.0f); // 200 Hz
    std::vector<float> monoBuf(512);
    generateSine(monoBuf.data(), 512, 1, 200.0f, 48000.0f, 0.4f);
    eqMono.process(monoBuf.data(), 512, 1);
    float monoPeak = calculatePeak(monoBuf.data(), 512, 1);

    EQ32 eqStereo;
    eqStereo.initialize(48000.0f, 2);
    eqStereo.setBandGain(10, 6.0f);
    std::vector<float> stereoBuf(512 * 2);
    generateSine(stereoBuf.data(), 512, 2, 200.0f, 48000.0f, 0.4f);
    eqStereo.process(stereoBuf.data(), 512, 2);
    float stereoPeak = calculatePeak(stereoBuf.data(), 512, 2);

    return assertNear(monoPeak, stereoPeak, 0.05f, "Mono and stereo peak responses should match");
}

// 5. Test multiple sample rates (44100, 48000, 96000)
EQSB_TEST(EQ32_MultipleSampleRates) {
    float sampleRates[] = {44100.0f, 48000.0f, 96000.0f};
    for (float sr : sampleRates) {
        EQ32 eq;
        eq.initialize(sr, 2);
        eq.setBandGain(17, 6.0f); // 1000 Hz
        std::vector<float> buf(1024 * 2);
        generateSine(buf.data(), 1024, 2, 1000.0f, sr, 0.3f);
        eq.process(buf.data(), 1024, 2);
        float peak = calculatePeak(buf.data(), 1024, 2);
        if (peak < 0.4f) {
            std::cerr << "Failed at sample rate: " << sr << "\n";
            return false;
        }
    }
    return true;
}
