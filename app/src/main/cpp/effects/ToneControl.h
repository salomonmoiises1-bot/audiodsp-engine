#ifndef EQSB_TONE_CONTROL_H
#define EQSB_TONE_CONTROL_H

#include "../dsp/BiquadFilter.h"
#include <array>

namespace eqsb {
namespace effects {

class ToneControl {
public:
    ToneControl();
    ~ToneControl() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    void setEnabled(bool enabled) {
        enabled_ = enabled;
        updateBassFilter();
        updateMidFilter();
        updateTrebleFilter();
    }
    bool isEnabled() const { return enabled_; }

    void setBassDb(float bassDb);
    float getBassDb() const { return bassDb_; }

    void setMidDb(float midDb);
    float getMidDb() const { return midDb_; }

    void setTrebleDb(float trebleDb);
    float getTrebleDb() const { return trebleDb_; }

    void process(float* buffer, int frames, int channels);

private:
    void updateBassFilter();
    void updateMidFilter();
    void updateTrebleFilter();

    bool enabled_{true};
    float sampleRate_{48000.0f};
    int channelCount_{2};

    float bassDb_{0.0f};    // Low Shelf @ 200 Hz
    float midDb_{0.0f};     // Peaking @ 1000 Hz
    float trebleDb_{0.0f};  // High Shelf @ 5000 Hz

    // 3 filters per channel
    std::array<dsp::BiquadFilter, 2> bassFilters_;
    std::array<dsp::BiquadFilter, 2> midFilters_;
    std::array<dsp::BiquadFilter, 2> trebleFilters_;
};

} // namespace effects
} // namespace eqsb

#endif // EQSB_TONE_CONTROL_H
