#include "EQsbDspEngine.h"
#include <algorithm>

namespace eqsb {

EQsbDspEngine::EQsbDspEngine() {
    initialize(48000, 2, 256);
}

void EQsbDspEngine::initialize(int sampleRate, int channelCount, int framesPerBlock) {
    sampleRate_ = (sampleRate > 0) ? sampleRate : 48000;
    channelCount_ = (channelCount > 0) ? std::min(channelCount, 2) : 2;
    framesPerBlock_ = (framesPerBlock > 0) ? framesPerBlock : 256;

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
    preGain_.reset();
    bassBoost_.reset();
    toneControl_.reset();
    eq32_.reset();
    mdrc_.reset();
    autoGain_.reset();
    limiter_.reset();
    spatial_.reset();
    masterGain_.reset();
    balance_.reset();
}

void EQsbDspEngine::process(float* interleavedPcm, int frames) {
    process(interleavedPcm, frames, channelCount_);
}

void EQsbDspEngine::process(float* interleavedPcm, int frames, int channels) {
    if (!interleavedPcm || frames <= 0) return;
    if (bypass_.load(std::memory_order_relaxed)) return;

    const int activeChannels = std::min(std::max(channels, 1), 2);

    // Never block the realtime callback on a configuration update. A control-thread
    // update may make this block pass through unchanged for one callback, which is
    // preferable to priority inversion/jitter on the audio thread.
    std::unique_lock<std::mutex> lock(configMutex_, std::try_to_lock);
    if (!lock.owns_lock()) return;

    preGain_.process(interleavedPcm, frames, activeChannels);
    bassBoost_.process(interleavedPcm, frames, activeChannels);
    toneControl_.process(interleavedPcm, frames, activeChannels);
    eq32_.process(interleavedPcm, frames, activeChannels);
    mdrc_.process(interleavedPcm, frames, activeChannels);
    autoGain_.process(interleavedPcm, frames, activeChannels);
    spatial_.process(interleavedPcm, frames, activeChannels);
    masterGain_.process(interleavedPcm, frames, activeChannels);
    balance_.process(interleavedPcm, frames, activeChannels);
    // Limiter is deliberately last so later gain/spatial stages cannot recreate peaks.
    limiter_.process(interleavedPcm, frames, activeChannels);
}

} // namespace eqsb
