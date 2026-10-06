#include "EQsbDspEngine.h"

namespace eqsb {

EQsbDspEngine::EQsbDspEngine() {
    initialize(48000, 2, 256);
}

void EQsbDspEngine::initialize(int sampleRate, int channelCount, int framesPerBlock) {
    sampleRate_ = (sampleRate > 0) ? sampleRate : 48000;
    channelCount_ = (channelCount > 0) ? channelCount : 2;
    framesPerBlock_ = (framesPerBlock > 0) ? framesPerBlock : 256;

    float fs = static_cast<float>(sampleRate_);

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

    // Strict fixed DSP chain execution:
    // 1. Pre-Gain
    preGain_.process(interleavedPcm, frames, channelCount_);

    // 2. Bass Boost
    bassBoost_.process(interleavedPcm, frames, channelCount_);

    // 3. Tone (Bass, Mid, Treble)
    toneControl_.process(interleavedPcm, frames, channelCount_);

    // 4. EQ32 (32 real biquad filters in sequence)
    eq32_.process(interleavedPcm, frames, channelCount_);

    // 5. MDRC (Multiband Dynamic Range Compressor)
    mdrc_.process(interleavedPcm, frames, channelCount_);

    // 6. AutoGain (RMS/Energy AGC)
    autoGain_.process(interleavedPcm, frames, channelCount_);

    // 7. Limiter (Brickwall peak ceiling clamp)
    limiter_.process(interleavedPcm, frames, channelCount_);

    // 8. Spatial / Virtualizer
    spatial_.process(interleavedPcm, frames, channelCount_);

    // 9. Master Gain
    masterGain_.process(interleavedPcm, frames, channelCount_);

    // 10. Balance (L/R pan law)
    balance_.process(interleavedPcm, frames, channelCount_);
}

} // namespace eqsb
