#include "OboeBackend.h"
#include <cmath>

namespace eqsb {
namespace backends {

OboeBackend::OboeBackend() = default;

OboeBackend::~OboeBackend() {
    stop();
}

bool OboeBackend::start() {
    running_.store(true, std::memory_order_release);
    return true;
}

void OboeBackend::stop() {
    running_.store(false, std::memory_order_release);
}

void OboeBackend::setTestSignal(bool enabled, float frequencyHz, float amplitude) {
    testSignalEnabled_ = enabled;
    testFreqHz_ = frequencyHz;
    testAmplitude_ = amplitude;
}

void OboeBackend::onAudioReady(float* audioData, int numFrames) {
    if (!running_.load(std::memory_order_relaxed) || !audioData) {
        return;
    }

    // 1. Generate or receive raw input PCM
    if (testSignalEnabled_) {
        float phaseInc = (2.0f * 3.14159265f * testFreqHz_) / static_cast<float>(sampleRate_);
        for (int i = 0; i < numFrames; ++i) {
            float sample = std::sin(phase_) * testAmplitude_;
            phase_ += phaseInc;
            if (phase_ >= 2.0f * 3.14159265f) phase_ -= 2.0f * 3.14159265f;

            for (int ch = 0; ch < channelCount_; ++ch) {
                audioData[i * channelCount_ + ch] = sample;
            }
        }
    }

    // 2. Feed directly into the real C++ DSP Engine!
    // PCM Raw -> EQsbDspEngine (PreGain -> Bass -> Tone -> EQ32 -> MDRC -> AGC -> Limiter -> Master -> Balance) -> Processed PCM
    if (dspEngine_) {
        dspEngine_->process(audioData, numFrames);
    }
}

} // namespace backends
} // namespace eqsb
