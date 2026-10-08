#ifndef EQSB_LIMITER_H
#define EQSB_LIMITER_H

#include "../dsp/DspUtils.h"

namespace eqsb {
namespace dynamics {

class Limiter {
public:
    Limiter();
    ~Limiter() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    void setEnabled(bool enabled) { enabled_ = enabled; }
    bool isEnabled() const { return enabled_; }

    void setCeilingDb(float ceilingDb);
    float getCeilingDb() const { return ceilingDb_; }
    float getCeilingLinear() const { return ceilingLinear_; }

    void setReleaseMs(float releaseMs);
    float getReleaseMs() const { return releaseMs_; }

    float getCurrentGainReductionDb() const;

    void process(float* buffer, int frames, int channels);

private:
    void updateReleaseCoeff();

    bool enabled_{true};
    float sampleRate_{48000.0f};
    int channelCount_{2};

    float ceilingDb_{-0.1f};
    float ceilingLinear_{0.988553f};
    float releaseMs_{80.0f};
    float releaseCoeff_{0.999f};

    float currentGain_{1.0f};
};

} // namespace dynamics
} // namespace eqsb

#endif // EQSB_LIMITER_H
