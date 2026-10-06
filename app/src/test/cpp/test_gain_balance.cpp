#include "test_framework.h"
#include "../../main/cpp/dsp/PreGain.h"
#include "../../main/cpp/dsp/MasterGain.h"
#include "../../main/cpp/dsp/Balance.h"
#include <vector>

using namespace eqsb;
using namespace eqsb::dsp;
using namespace eqsb::test;

// PreGain tests
EQSB_TEST(PreGain_DbLevels) {
    PreGain pg;
    constexpr int frames = 256;

    // 1. +6 dB boost
    pg.setGainDb(6.0f);
    std::vector<float> buf(frames * 2, 0.5f);
    pg.process(buf.data(), frames, 2);
    // 0.5 * 10^(6/20) = 0.5 * 1.99526 = ~0.9976
    if (!assertNear(buf[0], 0.9976f, 0.02f, "+6 dB should double amplitude")) return false;

    // 2. -6 dB cut
    pg.setGainDb(-6.0f);
    std::vector<float> buf2(frames * 2, 0.5f);
    pg.process(buf2.data(), frames, 2);
    // 0.5 * 10^(-6/20) = 0.5 * 0.50118 = ~0.2505
    if (!assertNear(buf2[0], 0.2505f, 0.02f, "-6 dB should halve amplitude")) return false;

    // 3. 0 dB unity
    pg.setGainDb(0.0f);
    std::vector<float> buf3(frames * 2, 0.5f);
    pg.process(buf3.data(), frames, 2);
    return assertNear(buf3[0], 0.5f, 0.001f, "0 dB should preserve exact amplitude");
}

// Master Gain tests
EQSB_TEST(MasterGain_DbLevels) {
    MasterGain mg;
    constexpr int frames = 256;

    mg.setGainDb(-12.0f);
    std::vector<float> buf(frames * 2, 1.0f);
    mg.process(buf.data(), frames, 2);
    // 1.0 * 10^(-12/20) = 0.251188
    return assertNear(buf[0], 0.2512f, 0.01f, "Master gain -12 dB should scale amplitude to ~0.25");
}

// Balance test: L/R channel pan law verification
EQSB_TEST(Balance_LeftRightPanSeparation) {
    Balance bal;
    constexpr int frames = 256;

    // Pan Left: balance = -0.5f -> L = 1.0, R = 0.5
    bal.setBalance(-0.5f);
    std::vector<float> buf(frames * 2, 0.8f);
    bal.process(buf.data(), frames, 2);

    float leftSample = buf[0];
    float rightSample = buf[1];

    if (!assertNear(leftSample, 0.8f, 0.001f, "Left pan should keep Left full")) return false;
    if (!assertNear(rightSample, 0.4f, 0.001f, "Left pan should reduce Right")) return false;

    // Pan Full Right: balance = +1.0f -> L = 0.0, R = 1.0
    bal.setBalance(1.0f);
    std::vector<float> buf2(frames * 2, 0.8f);
    bal.process(buf2.data(), frames, 2);

    if (!assertNear(buf2[0], 0.0f, 0.001f, "Full Right pan should mute Left")) return false;
    if (!assertNear(buf2[1], 0.8f, 0.001f, "Full Right pan should keep Right full")) return false;

    return true;
}
