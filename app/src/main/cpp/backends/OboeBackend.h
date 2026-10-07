#ifndef EQSB_OBOE_BACKEND_H
#define EQSB_OBOE_BACKEND_H
#include "AudioBackend.h"
#include <atomic>
#include <memory>
namespace eqsb { namespace backends {
class OboeBackend : public AudioBackend {
public:
    OboeBackend(); ~OboeBackend() override;
    BackendType getType() const override { return BackendType::OBOE_PLAYBACK_STREAM; }
    const char* getName() const override { return "Oboe Low-Latency Native Audio Stream"; }
    bool start() override; void stop() override;
    bool isRunning() const override { return running_.load(std::memory_order_relaxed); }
    void setSampleRate(int v) { sampleRate_=v; }
    void setChannelCount(int v) { channelCount_=v; }
    void setFramesPerCallback(int v) { framesPerCallback_=v; }
    void onAudioReady(float* audioData, int numFrames);
    bool startOboeStream(); void stopOboeStream();
    void setTestSignal(bool enabled, float frequencyHz=440.0f, float amplitude=0.5f);
private:
    std::atomic<bool> running_{false};
    int sampleRate_{48000}, channelCount_{2}, framesPerCallback_{256};
    bool testSignalEnabled_{false};
    float testFreqHz_{440.0f}, testAmplitude_{0.0f}, phase_{0.0f};
    void* stream_{nullptr};
};
}}
#endif
