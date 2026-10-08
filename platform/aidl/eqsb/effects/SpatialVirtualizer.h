#ifndef EQSB_SPATIAL_VIRTUALIZER_H
#define EQSB_SPATIAL_VIRTUALIZER_H

#include "../dsp/DspUtils.h"
#include <vector>

namespace eqsb {
namespace effects {

class SpatialVirtualizer {
public:
    SpatialVirtualizer();
    ~SpatialVirtualizer() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    void setEnabled(bool enabled) { enabled_ = enabled; }
    bool isEnabled() const { return enabled_; }

    // width: 0.0f (Normal stereo) to 1.0f (Wide 3D soundstage)
    void setWidth(float width);
    float getWidth() const { return width_; }

    void process(float* buffer, int frames, int channels);

private:
    bool enabled_{false};
    float sampleRate_{48000.0f};
    int channelCount_{2};
    float width_{0.0f};

    // Cross-feed delay buffer for binaural simulation (~0.6 ms)
    static constexpr int MAX_DELAY_SAMPLES = 256;
    float delayBufferL_[MAX_DELAY_SAMPLES]{};
    float delayBufferR_[MAX_DELAY_SAMPLES]{};
    int delayIndex_{0};
    int delaySamples_{32};
};

} // namespace effects
} // namespace eqsb

#endif // EQSB_SPATIAL_VIRTUALIZER_H
