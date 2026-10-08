#ifndef EQSB_AUTOGAIN_H
#define EQSB_AUTOGAIN_H

#include "../dsp/DspUtils.h"

namespace eqsb {
namespace dynamics {

class AutoGain {
public:
    AutoGain();
    ~AutoGain() = default;

    void initialize(float sampleRate, int channelCount);
    void reset();

    void setEnabled(bool enabled) { enabled_ = enabled; }
    bool isEnabled() const { return enabled_; }

    void setTargetDb(float targetDb) { targetDb_ = targetDb; }
    float getTargetDb() const { return targetDb_; }

    void setMaxGainDb(float maxGainDb) { maxGainDb_ = maxGainDb; }
    float getMaxGainDb() const { return maxGainDb_; }

    void setMinGainDb(float minGainDb) { minGainDb_ = minGainDb; }
    float getMinGainDb() const { return minGainDb_; }

    void setAttackMs(float ms);
    void setReleaseMs(float ms);

    float getCurrentGainDb() const { return currentGainDb_; }
    float getCurrentRmsDb() const { return currentRmsDb_; }

    void process(float* buffer, int frames, int channels);

private:
    void updateCoefficients();

    bool enabled_{true};
    float sampleRate_{48000.0f};
    int channelCount_{2};

    float targetDb_{-14.0f};     // Target level in dBFS
    float maxGainDb_{12.0f};     // Max boost
    float minGainDb_{-18.0f};    // Max attenuation
    float gateThresholdDb_{-50.0f}; // Don't boost silence

    float attackMs_{60.0f};      // Speed to clamp down
    float releaseMs_{350.0f};    // Speed to bring up quiet audio

    float attackCoeff_{0.999f};
    float releaseCoeff_{0.9999f};
    float rmsDetectorCoeff_{0.995f};

    float rmsEnergy_{0.0f};
    float currentGainDb_{0.0f};
    float currentRmsDb_{-60.0f};
};

} // namespace dynamics
} // namespace eqsb

#endif // EQSB_AUTOGAIN_H
