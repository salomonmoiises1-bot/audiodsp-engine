#include "EQsbDspEngine.h"
#include <algorithm>

namespace eqsb {

EQsbDspEngine::EQsbDspEngine() { initialize(48000, 2, 256); }

void EQsbDspEngine::initialize(int sampleRate, int channelCount, int framesPerBlock) {
    sampleRate_ = sampleRate > 0 ? sampleRate : 48000;
    channelCount_ = channelCount > 0 ? std::min(channelCount, 2) : 2;
    framesPerBlock_ = framesPerBlock > 0 ? framesPerBlock : 256;
    const float fs = static_cast<float>(sampleRate_);
    bassBoost_.initialize(fs, channelCount_);
    toneControl_.initialize(fs, channelCount_);
    eq32_.initialize(fs, channelCount_);
    mdrc_.initialize(fs, channelCount_);
    autoGain_.initialize(fs, channelCount_);
    limiter_.initialize(fs, channelCount_);
    spatial_.initialize(fs, channelCount_);
    reset();
}

void EQsbDspEngine::reset() {
    preGain_.reset(); bassBoost_.reset(); toneControl_.reset(); eq32_.reset();
    mdrc_.reset(); autoGain_.reset(); limiter_.reset(); spatial_.reset();
    masterGain_.reset(); balance_.reset();
}

void EQsbDspEngine::process(float* pcm, int frames) { process(pcm, frames, channelCount_); }

void EQsbDspEngine::process(float* pcm, int frames, int channels) {
    if (!pcm || frames <= 0 || bypass_.load(std::memory_order_relaxed)) return;
    const int activeChannels = std::min(std::max(channels, 1), 2);
    // Non-blocking synchronization is intentional: AudioFlinger/Oboe realtime threads
    // must never wait behind a control-thread configuration transaction.
    std::unique_lock<std::mutex> lock(configMutex_, std::try_to_lock);
    if (!lock.owns_lock()) return;

    preGain_.process(pcm, frames, activeChannels);
    bassBoost_.process(pcm, frames, activeChannels);
    toneControl_.process(pcm, frames, activeChannels);
    eq32_.process(pcm, frames, activeChannels);
    mdrc_.process(pcm, frames, activeChannels);
    autoGain_.process(pcm, frames, activeChannels);
    spatial_.process(pcm, frames, activeChannels);
    masterGain_.process(pcm, frames, activeChannels);
    balance_.process(pcm, frames, activeChannels);
    limiter_.process(pcm, frames, activeChannels);
}

} // namespace eqsb
