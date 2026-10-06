#include "ToneControl.h"
#include "../dsp/DspUtils.h"
#include <algorithm>

namespace eqsb {
namespace effects {

ToneControl::ToneControl() {
    initialize(48000.0f, 2);
}

void ToneControl::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = std::min(channelCount, 2);
    updateBassFilter();
    updateMidFilter();
    updateTrebleFilter();
    reset();
}

void ToneControl::reset() {
    for (int ch = 0; ch < 2; ++ch) {
        bassFilters_[ch].reset();
        midFilters_[ch].reset();
        trebleFilters_[ch].reset();
    }
}

void ToneControl::setBassDb(float bassDb) {
    bassDb_ = dsp::clamp(bassDb, -15.0f, 15.0f);
    updateBassFilter();
}

void ToneControl::setMidDb(float midDb) {
    midDb_ = dsp::clamp(midDb, -15.0f, 15.0f);
    updateMidFilter();
}

void ToneControl::setTrebleDb(float trebleDb) {
    trebleDb_ = dsp::clamp(trebleDb, -15.0f, 15.0f);
    updateTrebleFilter();
}

void ToneControl::updateBassFilter() {
    float gain = enabled_ ? bassDb_ : 0.0f;
    for (int ch = 0; ch < 2; ++ch) {
        bassFilters_[ch].configure(dsp::FilterType::LOW_SHELF, 200.0f, sampleRate_, gain, 0.7071f);
    }
}

void ToneControl::updateMidFilter() {
    float gain = enabled_ ? midDb_ : 0.0f;
    for (int ch = 0; ch < 2; ++ch) {
        midFilters_[ch].configure(dsp::FilterType::PEAKING_EQ, 1000.0f, sampleRate_, gain, 1.0f);
    }
}

void ToneControl::updateTrebleFilter() {
    float gain = enabled_ ? trebleDb_ : 0.0f;
    for (int ch = 0; ch < 2; ++ch) {
        trebleFilters_[ch].configure(dsp::FilterType::HIGH_SHELF, 5000.0f, sampleRate_, gain, 0.7071f);
    }
}

void ToneControl::process(float* buffer, int frames, int channels) {
    if (!enabled_) return;

    bool hasBass = std::abs(bassDb_) > 0.001f;
    bool hasMid = std::abs(midDb_) > 0.001f;
    bool hasTreble = std::abs(trebleDb_) > 0.001f;

    if (!hasBass && !hasMid && !hasTreble) return;

    int activeChannels = std::min(channels, 2);

    for (int f = 0; f < frames; ++f) {
        int offset = f * channels;
        for (int ch = 0; ch < activeChannels; ++ch) {
            float s = buffer[offset + ch];
            if (hasBass) {
                s = bassFilters_[ch].processSample(s);
            }
            if (hasMid) {
                s = midFilters_[ch].processSample(s);
            }
            if (hasTreble) {
                s = trebleFilters_[ch].processSample(s);
            }
            buffer[offset + ch] = dsp::sanitize(s);
        }
    }
}

} // namespace effects
} // namespace eqsb
