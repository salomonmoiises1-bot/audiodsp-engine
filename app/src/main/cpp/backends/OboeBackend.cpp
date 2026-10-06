#include "OboeBackend.h"
#include "../EQsbDspEngine.h"
#include <cmath>
#include <algorithm>
#include <mutex>
#include <unordered_map>
#include <cstring>

#if defined(__ANDROID__)
#include <oboe/Oboe.h>
#endif

namespace eqsb {
namespace backends {

#if defined(__ANDROID__)
class EqsbOboeCallback final : public oboe::AudioStreamDataCallback {
public:
    explicit EqsbOboeCallback(OboeBackend* owner) : owner_(owner) {}

    oboe::DataCallbackResult onAudioReady(
            oboe::AudioStream* /*audioStream*/, void* audioData, int32_t numFrames) override {
        owner_->onAudioReady(static_cast<float*>(audioData), static_cast<int>(numFrames));
        return oboe::DataCallbackResult::Continue;
    }

private:
    OboeBackend* owner_;
};

static std::mutex gCallbackMutex;
static std::unordered_map<OboeBackend*, std::shared_ptr<EqsbOboeCallback>> gCallbacks;
#endif

OboeBackend::OboeBackend() = default;

OboeBackend::~OboeBackend() {
    stop();
}

bool OboeBackend::start() {
    if (running_.load(std::memory_order_acquire)) return true;
#if defined(__ANDROID__)
    if (!startOboeStream()) return false;
#endif
    running_.store(true, std::memory_order_release);
    return true;
}

void OboeBackend::stop() {
    running_.store(false, std::memory_order_release);
#if defined(__ANDROID__)
    stopOboeStream();
#endif
}

bool OboeBackend::startOboeStream() {
#if defined(__ANDROID__)
    if (stream_ != nullptr) return true;

    auto callback = std::make_shared<EqsbOboeCallback>(this);
    oboe::AudioStreamBuilder builder;
    builder.setDirection(oboe::Direction::Output)
           ->setPerformanceMode(oboe::PerformanceMode::LowLatency)
           ->setUsage(oboe::Usage::Media)
           ->setContentType(oboe::ContentType::Music)
           ->setSharingMode(oboe::SharingMode::Shared)
           ->setFormat(oboe::AudioFormat::Float)
           ->setChannelCount(channelCount_)
           ->setSampleRate(sampleRate_)
           ->setDataCallback(callback.get());

    oboe::AudioStream* opened = nullptr;
    oboe::Result result = builder.openStream(&opened);
    if (result != oboe::Result::OK || opened == nullptr) {
        return false;
    }

    // Keep the callback object alive for the complete stream lifetime.
    {
        std::lock_guard<std::mutex> lock(gCallbackMutex);
        gCallbacks[this] = callback;
    }

    // Oboe may invoke the callback immediately during requestStart().
    running_.store(true, std::memory_order_release);
    result = opened->requestStart();
    if (result != oboe::Result::OK) {
        running_.store(false, std::memory_order_release);
        opened->close();
        std::lock_guard<std::mutex> lock(gCallbackMutex);
        gCallbacks.erase(this);
        return false;
    }
    stream_ = opened;
    return true;
#else
    return true;
#endif
}

void OboeBackend::stopOboeStream() {
#if defined(__ANDROID__)
    auto* stream = static_cast<oboe::AudioStream*>(stream_);
    if (stream) {
        stream->requestStop();
        stream->close();
        stream_ = nullptr;
    }
    std::lock_guard<std::mutex> lock(gCallbackMutex);
    gCallbacks.erase(this);
#endif
}

void OboeBackend::setTestSignal(bool enabled, float frequencyHz, float amplitude) {
    testSignalEnabled_ = enabled;
    testFreqHz_ = std::max(1.0f, frequencyHz);
    testAmplitude_ = std::max(0.0f, std::min(1.0f, amplitude));
}

void OboeBackend::onAudioReady(float* audioData, int numFrames) {
    if (!audioData || numFrames <= 0) return;
    if (!running_.load(std::memory_order_relaxed)) {
        std::fill(audioData, audioData + numFrames * channelCount_, 0.0f);
        return;
    }

    if (testSignalEnabled_) {
        const float phaseInc = (2.0f * 3.14159265f * testFreqHz_) /
                static_cast<float>(sampleRate_);
        for (int i = 0; i < numFrames; ++i) {
            const float sample = std::sin(phase_) * testAmplitude_;
            phase_ += phaseInc;
            if (phase_ >= 2.0f * 3.14159265f) phase_ -= 2.0f * 3.14159265f;
            for (int ch = 0; ch < channelCount_; ++ch) {
                audioData[i * channelCount_ + ch] = sample;
            }
        }
    } else {
        std::fill(audioData, audioData + numFrames * channelCount_, 0.0f);
    }

    if (dspEngine_) {
        dspEngine_->process(audioData, numFrames);
    }
}

} // namespace backends
} // namespace eqsb
