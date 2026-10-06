#include "SpatialVirtualizer.h"
#include <cmath>
#include <algorithm>

namespace eqsb {
namespace effects {

SpatialVirtualizer::SpatialVirtualizer() {
    initialize(48000.0f, 2);
}

void SpatialVirtualizer::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = channelCount;
    // ~0.5ms delay for head-related interaural time difference (ITD)
    delaySamples_ = static_cast<int>(sampleRate_ * 0.0005f);
    if (delaySamples_ >= MAX_DELAY_SAMPLES) delaySamples_ = MAX_DELAY_SAMPLES - 1;
    if (delaySamples_ < 1) delaySamples_ = 1;
    reset();
}

void SpatialVirtualizer::reset() {
    for (int i = 0; i < MAX_DELAY_SAMPLES; ++i) {
        delayBufferL_[i] = 0.0f;
        delayBufferR_[i] = 0.0f;
    }
    delayIndex_ = 0;
}

void SpatialVirtualizer::setWidth(float width) {
    width_ = dsp::clamp(width, 0.0f, 1.0f);
}

void SpatialVirtualizer::process(float* buffer, int frames, int channels) {
    if (!enabled_ || channels < 2 || width_ <= 0.001f) return;

    float sideGain = 1.0f + width_ * 0.8f;
    float crossfeedGain = width_ * 0.25f;

    for (int f = 0; f < frames; ++f) {
        int leftIdx = f * channels;
        int rightIdx = leftIdx + 1;

        float inL = buffer[leftIdx];
        float inR = buffer[rightIdx];

        // Mid/Side matrix
        float mid = 0.5f * (inL + inR);
        float side = 0.5f * (inL - inR) * sideGain;

        // Expanded stereo
        float wideL = mid + side;
        float wideR = mid - side;

        // Crossfeed with ITD delay
        int readIndex = (delayIndex_ - delaySamples_ + MAX_DELAY_SAMPLES) % MAX_DELAY_SAMPLES;
        float delayedL = delayBufferL_[readIndex];
        float delayedR = delayBufferR_[readIndex];

        // Store into delay lines
        delayBufferL_[delayIndex_] = wideL;
        delayBufferR_[delayIndex_] = wideR;
        delayIndex_ = (delayIndex_ + 1) % MAX_DELAY_SAMPLES;

        // Blend with subtle inverted crossfeed for acoustic decorrelation
        float outL = wideL - crossfeedGain * delayedR;
        float outR = wideR - crossfeedGain * delayedL;

        buffer[leftIdx] = dsp::sanitize(outL);
        buffer[rightIdx] = dsp::sanitize(outR);
    }
}

} // namespace effects
} // namespace eqsb
