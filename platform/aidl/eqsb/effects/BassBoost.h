#ifndef EQSB_BASS_BOOST_H
#define EQSB_BASS_BOOST_H

#include "../dsp/BiquadFilter.h"
#include <array>

namespace eqsb {
namespace effects {

class BassBoost {
public:
    BassBoost();
    ~BassBoost() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    void setEnabled(bool enabled) { enabled_ = enabled; updateFilters(); }
    bool isEnabled() const { return enabled_; }

    // strength: 0.0f (0%) to 1.0f (100%), maps to 0 dB to +12 dB boost
    void setStrength(float strength);
    float getStrength() const { return strength_; }
    float getBoostGainDb() const { return boostGainDb_; }

    void process(float* buffer, int frames, int channels);

private:
    void updateFilters();

    bool enabled_{false};
    float sampleRate_{48000.0f};
    int channelCount_{2};
    float strength_{0.0f};
    float boostGainDb_{0.0f};

    // Low-shelf filter centered at 80 Hz per channel
    std::array<dsp::BiquadFilter, 2> filters_;
};

} // namespace effects
} // namespace eqsb

#endif // EQSB_BASS_BOOST_H
