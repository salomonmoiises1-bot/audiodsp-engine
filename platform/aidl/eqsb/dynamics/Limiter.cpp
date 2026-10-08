#include "Limiter.h"
#include <cmath>
#include <algorithm>

namespace eqsb {
namespace dynamics {

Limiter::Limiter() {
    setCeilingDb(-0.1f);
    setReleaseMs(80.0f);
    initialize(48000.0f, 2);
}

void Limiter::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = channelCount;
    updateReleaseCoeff();
    reset();
}

void Limiter::reset() {
    currentGain_ = 1.0f;
}

void Limiter::setCeilingDb(float ceilingDb) {
    ceilingDb_ = dsp::clamp(ceilingDb, -24.0f, 0.0f);
    ceilingLinear_ = dsp::dbToLinear(ceilingDb_);
}

void Limiter::setReleaseMs(float releaseMs) {
    releaseMs_ = dsp::clamp(releaseMs, 5.0f, 1000.0f);
    updateReleaseCoeff();
}

void Limiter::updateReleaseCoeff() {
    float relSec = releaseMs_ * 0.001f;
    releaseCoeff_ = std::exp(-1.0f / (relSec * sampleRate_));
}

float Limiter::getCurrentGainReductionDb() const {
    if (currentGain_ >= 0.999f) return 0.0f;
    return -dsp::linearToDb(currentGain_);
}

void Limiter::process(float* buffer, int frames, int channels) {
    if (!enabled_) return;

    for (int f = 0; f < frames; ++f) {
        int offset = f * channels;

        // Find max absolute sample across channels for this frame
        float maxAbs = 0.0f;
        for (int ch = 0; ch < channels; ++ch) {
            float a = std::abs(buffer[offset + ch]);
            if (a > maxAbs) maxAbs = a;
        }

        // Calculate required gain to prevent exceeding ceiling
        float targetGain = 1.0f;
        if (maxAbs > ceilingLinear_ && maxAbs > 1e-6f) {
            targetGain = ceilingLinear_ / maxAbs;
        }

        // Fast zero-delay attack, smooth exponential decay release
        if (targetGain < currentGain_) {
            currentGain_ = targetGain;
        } else {
            currentGain_ = releaseCoeff_ * currentGain_ + (1.0f - releaseCoeff_) * 1.0f;
        }

        // Apply gain and hard-clamp to ceiling to guarantee safety against denormals/precision
        for (int ch = 0; ch < channels; ++ch) {
            float s = buffer[offset + ch] * currentGain_;
            s = dsp::clamp(s, -ceilingLinear_, ceilingLinear_);
            buffer[offset + ch] = dsp::sanitize(s);
        }
    }
}

} // namespace dynamics
} // namespace eqsb
