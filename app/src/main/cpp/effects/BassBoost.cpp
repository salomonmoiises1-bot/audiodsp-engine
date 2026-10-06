#include "BassBoost.h"
#include "../dsp/DspUtils.h"
#include <algorithm>

namespace eqsb {
namespace effects {

BassBoost::BassBoost() {
    initialize(48000.0f, 2);
}

void BassBoost::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = std::min(channelCount, 2);
    updateFilters();
    reset();
}

void BassBoost::reset() {
    for (int ch = 0; ch < 2; ++ch) {
        filters_[ch].reset();
    }
}

void BassBoost::setStrength(float strength) {
    strength_ = dsp::clamp(strength, 0.0f, 1.0f);
    // Maps 0.0 - 1.0 to 0.0 dB - 12.0 dB of low shelf boost
    boostGainDb_ = strength_ * 12.0f;
    updateFilters();
}

void BassBoost::updateFilters() {
    // 80 Hz Low-Shelf filter with Q = 0.707 (Butterworth shelf)
    float effectiveGain = enabled_ ? boostGainDb_ : 0.0f;
    for (int ch = 0; ch < 2; ++ch) {
        filters_[ch].configure(dsp::FilterType::LOW_SHELF, 80.0f, sampleRate_, effectiveGain, 0.7071f);
    }
}

void BassBoost::process(float* buffer, int frames, int channels) {
    if (!enabled_ || boostGainDb_ <= 0.001f) return;

    int activeChannels = std::min(channels, 2);
    for (int f = 0; f < frames; ++f) {
        int offset = f * channels;
        for (int ch = 0; ch < activeChannels; ++ch) {
            buffer[offset + ch] = filters_[ch].processSample(buffer[offset + ch]);
        }
    }
}

} // namespace effects
} // namespace eqsb
