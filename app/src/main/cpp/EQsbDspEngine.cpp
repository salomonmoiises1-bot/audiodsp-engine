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
    if (!interleavedPcm || frames <= 0) return;
    if (bypass_.load(std::memory_order_relaxed)) return;

    // Never block the realtime callback on a configuration update. A control-thread
    // update may make this block pass through unchanged for one callback, which is
    // preferable to priority inversion/jitter on the audio thread.
    std::unique_lock<std::mutex> lock(configMutex_, std::try_to_lock);
    if (!lock.owns_lock()) return;

    preGain_.process(interleavedPcm, frames, channelCount_);
    bassBoost_.process(interleavedPcm, frames, channelCount_);
    toneControl_.process(interleavedPcm, frames, channelCount_);
    eq32_.process(interleavedPcm, frames, channelCount_);
    mdrc_.process(interleavedPcm, frames, channelCount_);
    autoGain_.process(interleavedPcm, frames, channelCount_);
    spatial_.process(interleavedPcm, frames, channelCount_);
    masterGain_.process(interleavedPcm, frames, channelCount_);
    balance_.process(interleavedPcm, frames, channelCount_);
    // Limiter is deliberately last so later gain/spatial stages cannot recreate peaks.
    limiter_.process(interleavedPcm, frames, channelCount_);
}

bool EQsbDspEngine::startOboe() {
    oboeBackend_.setDspEngine(this);
    oboeBackend_.setSampleRate(sampleRate_);
    oboeBackend_.setChannelCount(channelCount_);
    oboeBackend_.setFramesPerCallback(framesPerBlock_);
    return oboeBackend_.start();
}

void EQsbDspEngine::stopOboe() {
    oboeBackend_.stop();
}

} // namespace eqsb
