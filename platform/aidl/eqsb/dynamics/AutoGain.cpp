#include "AutoGain.h"
#include <cmath>
#include <algorithm>

namespace eqsb {
namespace dynamics {

AutoGain::AutoGain() {
    initialize(48000.0f, 2);
}

void AutoGain::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = channelCount;
    updateCoefficients();
    reset();
}

void AutoGain::reset() {
    rmsEnergy_ = 0.0f;
    currentGainDb_ = 0.0f;
    currentRmsDb_ = -60.0f;
}

void AutoGain::setAttackMs(float ms) {
    attackMs_ = std::max(1.0f, ms);
    updateCoefficients();
}

void AutoGain::setReleaseMs(float ms) {
    releaseMs_ = std::max(5.0f, ms);
    updateCoefficients();
}

void AutoGain::updateCoefficients() {
    // Attack coefficient for gain reduction
    float attSec = attackMs_ * 0.001f;
    attackCoeff_ = std::exp(-1.0f / (attSec * sampleRate_));

    // Release coefficient for gain increase
    float relSec = releaseMs_ * 0.001f;
    releaseCoeff_ = std::exp(-1.0f / (relSec * sampleRate_));

    // RMS detector integration window (~50 ms)
    float rmsWindowSec = 0.05f;
    rmsDetectorCoeff_ = std::exp(-1.0f / (rmsWindowSec * sampleRate_));
}

void AutoGain::process(float* buffer, int frames, int channels) {
    if (!enabled_) return;

    for (int f = 0; f < frames; ++f) {
        int offset = f * channels;

        // Measure frame mean-square energy
        float sumSq = 0.0f;
        for (int ch = 0; ch < channels; ++ch) {
            float s = buffer[offset + ch];
            sumSq += s * s;
        }
        float frameEnergy = sumSq / static_cast<float>(channels);

        // Smooth energy over time
        rmsEnergy_ = rmsDetectorCoeff_ * rmsEnergy_ + (1.0f - rmsDetectorCoeff_) * frameEnergy;

        float rms = std::sqrt(rmsEnergy_ + 1e-12f);
        currentRmsDb_ = dsp::linearToDb(rms);

        // Compute desired gain
        float desiredGainDb = 0.0f;
        if (currentRmsDb_ > gateThresholdDb_) {
            desiredGainDb = targetDb_ - currentRmsDb_;
            desiredGainDb = dsp::clamp(desiredGainDb, minGainDb_, maxGainDb_);
        } else {
            // Below gate: smoothly return to 0 dB instead of boosting floor noise
            desiredGainDb = 0.0f;
        }

        // Smoothly adapt gain
        if (desiredGainDb < currentGainDb_) {
            // Hot signal -> reduce gain quickly (attack)
            currentGainDb_ = attackCoeff_ * currentGainDb_ + (1.0f - attackCoeff_) * desiredGainDb;
        } else {
            // Quiet signal -> increase gain gently (release)
            currentGainDb_ = releaseCoeff_ * currentGainDb_ + (1.0f - releaseCoeff_) * desiredGainDb;
        }

        float gainLinear = dsp::dbToLinear(currentGainDb_);

        // Apply gain to all channels
        for (int ch = 0; ch < channels; ++ch) {
            buffer[offset + ch] = dsp::sanitize(buffer[offset + ch] * gainLinear);
        }
    }
}

} // namespace dynamics
} // namespace eqsb
