#ifndef EQSB_EQ32_H
#define EQSB_EQ32_H

#include "../dsp/BiquadFilter.h"
#include <array>
#include <vector>

namespace eqsb {
namespace eq {

constexpr int NUM_EQ32_BANDS = 32;
constexpr int MAX_CHANNELS = 2;

// The 32 ISO standardized 1/3-octave center frequencies (Hz)
const std::array<float, NUM_EQ32_BANDS> EQ32_FREQUENCIES = {
    20.0f,    25.0f,    31.5f,   40.0f,    50.0f,    63.0f,    80.0f,    100.0f,
    125.0f,   160.0f,   200.0f,  250.0f,   315.0f,   400.0f,   500.0f,   630.0f,
    800.0f,   1000.0f,  1250.0f, 1600.0f,  2000.0f,  2500.0f,  3150.0f,  4000.0f,
    5000.0f,  6300.0f,  8000.0f, 10000.0f, 12500.0f, 16000.0f, 18000.0f, 20000.0f
};

class EQ32 {
public:
    EQ32();
    ~EQ32() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    // Gain control
    void setBandGain(int bandIndex, float gainDb);
    float getBandGain(int bandIndex) const;
    void setAllBandGains(const float* gains, int count);
    void getAllBandGains(float* outGains, int count) const;

    // Q factor control
    void setBandQ(int bandIndex, float Q);
    float getBandQ(int bandIndex) const;

    // Enable/bypass
    void setEnabled(bool enabled) { enabled_ = enabled; }
    bool isEnabled() const { return enabled_; }

    // Interleaved PCM processing
    void process(float* buffer, int frames, int channels);

    static float getCenterFrequency(int bandIndex);

private:
    void updateBandCoefficients(int bandIndex);

    bool enabled_{true};
    float sampleRate_{48000.0f};
    int channelCount_{2};

    std::array<float, NUM_EQ32_BANDS> gains_{};
    std::array<float, NUM_EQ32_BANDS> qFactors_{};

    // Exactly 32 real biquad filter instances per channel
    // filters_[channel][bandIndex]
    std::array<std::array<dsp::BiquadFilter, NUM_EQ32_BANDS>, MAX_CHANNELS> filters_;
};

} // namespace eq
} // namespace eqsb

#endif // EQSB_EQ32_H
