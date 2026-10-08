#include "EQ32.h"
#include <algorithm>

namespace eqsb {
namespace eq {

EQ32::EQ32() {
    // Default Q factor for 1/3 octave is approximately 4.318
    // Using 4.31f provides accurate isolation between adjacent ISO 1/3-octave bands
    constexpr float DEFAULT_Q = 4.318f;
    for (int i = 0; i < NUM_EQ32_BANDS; ++i) {
        gains_[i] = 0.0f;
        qFactors_[i] = DEFAULT_Q;
    }
    initialize(48000.0f, 2);
}

void EQ32::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = std::min(channelCount, MAX_CHANNELS);
    for (int band = 0; band < NUM_EQ32_BANDS; ++band) {
        updateBandCoefficients(band);
    }
    reset();
}

void EQ32::reset() {
    for (int ch = 0; ch < MAX_CHANNELS; ++ch) {
        for (int band = 0; band < NUM_EQ32_BANDS; ++band) {
            filters_[ch][band].reset();
        }
    }
}

void EQ32::setBandGain(int bandIndex, float gainDb) {
    if (bandIndex < 0 || bandIndex >= NUM_EQ32_BANDS) return;
    gains_[bandIndex] = gainDb;
    updateBandCoefficients(bandIndex);
}

float EQ32::getBandGain(int bandIndex) const {
    if (bandIndex < 0 || bandIndex >= NUM_EQ32_BANDS) return 0.0f;
    return gains_[bandIndex];
}

void EQ32::setAllBandGains(const float* gains, int count) {
    int n = std::min(count, NUM_EQ32_BANDS);
    for (int i = 0; i < n; ++i) {
        gains_[i] = gains[i];
        updateBandCoefficients(i);
    }
}

void EQ32::getAllBandGains(float* outGains, int count) const {
    int n = std::min(count, NUM_EQ32_BANDS);
    for (int i = 0; i < n; ++i) {
        outGains[i] = gains_[i];
    }
}

void EQ32::setBandQ(int bandIndex, float Q) {
    if (bandIndex < 0 || bandIndex >= NUM_EQ32_BANDS) return;
    qFactors_[bandIndex] = (Q > 0.05f) ? Q : 0.707f;
    updateBandCoefficients(bandIndex);
}

float EQ32::getBandQ(int bandIndex) const {
    if (bandIndex < 0 || bandIndex >= NUM_EQ32_BANDS) return 1.0f;
    return qFactors_[bandIndex];
}

float EQ32::getCenterFrequency(int bandIndex) {
    if (bandIndex < 0 || bandIndex >= NUM_EQ32_BANDS) return 1000.0f;
    return EQ32_FREQUENCIES[bandIndex];
}

void EQ32::updateBandCoefficients(int bandIndex) {
    float freq = EQ32_FREQUENCIES[bandIndex];
    float gain = gains_[bandIndex];
    float q = qFactors_[bandIndex];

    for (int ch = 0; ch < MAX_CHANNELS; ++ch) {
        filters_[ch][bandIndex].configure(dsp::FilterType::PEAKING_EQ, freq, sampleRate_, gain, q);
    }
}

void EQ32::process(float* buffer, int frames, int channels) {
    if (!enabled_) return;

    int activeChannels = std::min(channels, MAX_CHANNELS);

    // Process each frame: pass sample through all 32 filters in sequence!
    // Signal route: PCM -> Filter 0 -> Filter 1 -> ... -> Filter 31 -> Output PCM
    for (int f = 0; f < frames; ++f) {
        int frameOffset = f * channels;
        for (int ch = 0; ch < activeChannels; ++ch) {
            float s = buffer[frameOffset + ch];
            for (int band = 0; band < NUM_EQ32_BANDS; ++band) {
                s = filters_[ch][band].processSample(s);
            }
            buffer[frameOffset + ch] = s;
        }
    }
}

} // namespace eq
} // namespace eqsb
