#ifndef EQSB_MDRC_H
#define EQSB_MDRC_H

#include "../dsp/BiquadFilter.h"
#include "../dsp/DspUtils.h"
#include <array>

namespace eqsb {
namespace dynamics {

struct BandCompressorConfig {
    float thresholdDb{-18.0f};  // -40 to 0 dB
    float ratio{4.0f};          // 1.0 to 20.0
    float attackMs{15.0f};      // 1 to 200 ms
    float releaseMs{100.0f};    // 10 to 1000 ms
    float makeupGainDb{0.0f};   // -12 to +18 dB
};

class MDRC {
public:
    enum BandIndex {
        BAND_LOW = 0,
        BAND_MID = 1,
        BAND_HIGH = 2,
        NUM_BANDS = 3
    };

    MDRC();
    ~MDRC() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    void setEnabled(bool enabled) { enabled_ = enabled; }
    bool isEnabled() const { return enabled_; }

    void setBandConfig(BandIndex band, const BandCompressorConfig& config);
    BandCompressorConfig getBandConfig(BandIndex band) const;

    void setCrossoverFrequencies(float lowMidHz, float midHighHz);
    float getLowMidCrossover() const { return lowMidFreq_; }
    float getMidHighCrossover() const { return midHighFreq_; }

    // Interleaved PCM processing
    void process(float* buffer, int frames, int channels);

    // Query gain reduction in dB for metering
    float getGainReductionDb(BandIndex band) const { return lastGainReductionDb_[band]; }

private:
    void updateCrossoverFilters();
    void updateTimeConstants(BandIndex band);

    bool enabled_{true};
    float sampleRate_{48000.0f};
    int channelCount_{2};

    float lowMidFreq_{250.0f};
    float midHighFreq_{4000.0f};

    std::array<BandCompressorConfig, NUM_BANDS> configs_;
    std::array<float, NUM_BANDS> attackCoeffs_{};
    std::array<float, NUM_BANDS> releaseCoeffs_{};
    std::array<float, NUM_BANDS> lastGainReductionDb_{};

    // State per channel, per band
    // envelope_[channel][band]
    std::array<std::array<float, NUM_BANDS>, 2> envelopes_{};

    // Crossover biquads per channel
    // Low band: LP @ lowMidFreq
    std::array<dsp::BiquadFilter, 2> lowPass1_;
    // Mid band: HP @ lowMidFreq followed by LP @ midHighFreq
    std::array<dsp::BiquadFilter, 2> midHighPass_;
    std::array<dsp::BiquadFilter, 2> midLowPass_;
    // High band: HP @ midHighFreq
    std::array<dsp::BiquadFilter, 2> highPass1_;
};

} // namespace dynamics
} // namespace eqsb

#endif // EQSB_MDRC_H
