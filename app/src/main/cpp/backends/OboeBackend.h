#ifndef EQSB_OBOE_BACKEND_H
#define EQSB_OBOE_BACKEND_H

#include "AudioBackend.h"
#include <atomic>
#include <vector>
#include <memory>

namespace eqsb {
namespace backends {

/**
 * OboeBackend provides high-performance, low-latency audio stream playback and processing
 * via AAudio (Android 8.0+) / OpenSL ES fallback.
 *
 * CRITICAL ARCHITECTURAL REALITY:
 * Oboe operates on streams that EQsb itself opens and owns.
 * An unprivileged Android APK CANNOT use Oboe or AAudio to arbitrarily tap into
 * PCM audio playing from other third-party apps (e.g. Spotify, YouTube) due to
 * Android AudioFlinger process boundaries and SELinux sandboxing.
 */
class OboeBackend : public AudioBackend {
public:
    OboeBackend();
    ~OboeBackend() override;

    BackendType getType() const override { return BackendType::OBOE_PLAYBACK_STREAM; }
    const char* getName() const override { return "Oboe Low-Latency Native Audio Stream"; }

    bool start() override;
    void stop() override;
    bool isRunning() const override { return running_.load(std::memory_order_relaxed); }

    // Audio stream configuration
    void setSampleRate(int sampleRate) { sampleRate_ = sampleRate; }
    void setChannelCount(int channels) { channelCount_ = channels; }
    void setFramesPerCallback(int frames) { framesPerCallback_ = frames; }

    // Real-time audio callback:
    // Raw PCM Buffer -> EQsbDspEngine::process() -> Output Stream Buffer
    void onAudioReady(float* audioData, int numFrames);

    // Opens/closes the actual native Oboe output stream.
    // The stream is owned by EQsb; Oboe never taps another application's AudioFlinger stream.
    bool startOboeStream();
    void stopOboeStream();

    // Test tone generator for direct PCM DSP verification without file dependencies
    void setTestSignal(bool enabled, float frequencyHz = 440.0f, float amplitude = 0.5f);

private:
    std::atomic<bool> running_{false};
    int sampleRate_{48000};
    int channelCount_{2};
    int framesPerCallback_{256};

    // Synthesizer state for testing / demo playback
    bool testSignalEnabled_{true};
    float testFreqHz_{440.0f};
    float testAmplitude_{0.5f};
    float phase_{0.0f};
    void* stream_{nullptr};
};

} // namespace backends
} // namespace eqsb

#endif // EQSB_OBOE_BACKEND_H
