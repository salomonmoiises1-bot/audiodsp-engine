#include "test_framework.h"
#include "../../main/cpp/EQsbDspEngine.h"
#include <vector>

using namespace eqsb;
using namespace eqsb::test;

EQSB_TEST(Integration_CompleteDspChainFlow) {
    EQsbDspEngine engine;
    engine.initialize(48000, 2, 256);

    // Configure various modules across the entire chain
    engine.getPreGain().setGainDb(-1.0f);
    engine.getBassBoost().setEnabled(true);
    engine.getBassBoost().setStrength(0.5f);
    engine.getToneControl().setEnabled(true);
    engine.getToneControl().setBassDb(2.0f);
    engine.getToneControl().setTrebleDb(2.0f);
    engine.getEQ32().setBandGain(17, 4.0f); // 1 kHz
    engine.getLimiter().setEnabled(true);
    engine.getLimiter().setCeilingDb(-0.5f);
    engine.getMasterGain().setGainDb(-2.0f);
    engine.getBalance().setBalance(0.2f); // slight right pan

    constexpr int frames = 1024;
    std::vector<float> pcm(frames * 2);
    generateSine(pcm.data(), frames, 2, 1000.0f, 48000.0f, 0.5f);

    std::vector<float> original = pcm;

    engine.process(pcm.data(), frames);

    // Verify PCM has been processed and modified
    bool modified = false;
    for (size_t i = 0; i < pcm.size(); ++i) {
        if (std::abs(pcm[i] - original[i]) > 0.01f) {
            modified = true;
            break;
        }
    }
    if (!assertTrue(modified, "Engine must modify PCM across the chain")) return false;

    // Verify ceiling compliance
    float peak = calculatePeak(pcm.data(), frames, 2);
    float ceilingLin = engine.getLimiter().getCeilingLinear();
    return assertTrue(peak <= ceilingLin + 0.001f, "Full chain must respect limiter ceiling");
}

EQSB_TEST(Integration_EngineReset) {
    EQsbDspEngine engine;
    engine.initialize(48000, 2, 256);

    // Push audio through
    constexpr int frames = 512;
    std::vector<float> pcm(frames * 2, 0.8f);
    engine.process(pcm.data(), frames);

    // Reset should clear internal filter registers
    engine.reset();

    // Pass flat audio, should output clean audio without filter residual tails
    std::vector<float> silence(frames * 2, 0.0f);
    engine.process(silence.data(), frames);

    float postPeak = calculatePeak(silence.data(), frames, 2);
    return assertNear(postPeak, 0.0f, 0.00001f, "After reset, silent input must produce silent output");
}
