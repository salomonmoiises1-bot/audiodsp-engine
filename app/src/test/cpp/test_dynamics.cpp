#include "test_framework.h"
#include "../../main/cpp/dynamics/MDRC.h"
#include "../../main/cpp/dynamics/AutoGain.h"
#include "../../main/cpp/dynamics/Limiter.h"
#include <vector>

using namespace eqsb;
using namespace eqsb::dynamics;
using namespace eqsb::test;

// MDRC: Verify gain reduction occurs on hot signals exceeding threshold
EQSB_TEST(MDRC_GainReductionOnHotSignal) {
    MDRC mdrc;
    mdrc.initialize(48000.0f, 2);

    BandCompressorConfig cfg;
    cfg.thresholdDb = -12.0f;
    cfg.ratio = 4.0f;
    cfg.attackMs = 10.0f;
    cfg.releaseMs = 80.0f;
    cfg.makeupGainDb = 0.0f;
    mdrc.setBandConfig(MDRC::BAND_MID, cfg);

    // Send a 1 kHz sine at 0 dBFS (peak 1.0) -> exceeds -12 dBFS threshold
    constexpr int frames = 2048;
    std::vector<float> buf(frames * 2);
    generateSine(buf.data(), frames, 2, 1000.0f, 48000.0f, 1.0f);

    mdrc.process(buf.data(), frames, 2);

    // After attack, gain reduction should be positive (> 0 dB reduction)
    float gr = mdrc.getGainReductionDb(MDRC::BAND_MID);
    return assertTrue(gr > 4.0f, "MDRC should apply substantial gain reduction to hot signals");
}

// AutoGain: Verify convergence towards target level
EQSB_TEST(AutoGain_ConvergenceToTarget) {
    AutoGain agc;
    agc.initialize(48000.0f, 2);
    agc.setTargetDb(-14.0f);
    agc.setAttackMs(20.0f);
    agc.setReleaseMs(50.0f);

    // Quiet signal: sine with amp 0.05 (-26 dBFS peak, ~ -29 dBFS RMS)
    constexpr int frames = 48000; // 1 full second to allow convergence
    std::vector<float> buf(frames * 2);
    generateSine(buf.data(), frames, 2, 440.0f, 48000.0f, 0.05f);

    agc.process(buf.data(), frames, 2);

    // Measure RMS of the final 200 ms
    int finalFrames = 9600;
    float finalRms = calculateRms(buf.data() + (frames - finalFrames) * 2, finalFrames, 2, 0);
    float finalRmsDb = dsp::linearToDb(finalRms);

    // AGC should have boosted it close to -14 dBFS (within +/- 3 dB)
    return assertTrue(finalRmsDb > -18.0f && finalRmsDb < -11.0f,
                      "AutoGain should converge quiet audio close to target level");
}

// Limiter: Ceiling safety test with extreme signal (> 1.0)
EQSB_TEST(Limiter_RespectsCeilingWithOverdrivenInput) {
    Limiter limiter;
    limiter.initialize(48000.0f, 2);
    limiter.setCeilingDb(-0.5f); // Ceiling linear is ~0.944f
    float ceilingLinear = limiter.getCeilingLinear();

    // Hot overdriven signal with amplitude 3.5 (+11 dB over 0 dBFS!)
    constexpr int frames = 2048;
    std::vector<float> buf(frames * 2);
    generateSine(buf.data(), frames, 2, 500.0f, 48000.0f, 3.5f);

    limiter.process(buf.data(), frames, 2);

    float peakAfterLimiter = calculatePeak(buf.data(), frames, 2);

    return assertTrue(peakAfterLimiter <= ceilingLinear + 0.0001f,
                      "Limiter MUST guarantee output NEVER exceeds ceiling linear limit");
}
