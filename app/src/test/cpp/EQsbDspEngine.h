#ifndef EQSB_DSP_ENGINE_H
#define EQSB_DSP_ENGINE_H

#include "dsp/DspUtils.h"
#include "dsp/PreGain.h"
#include "dsp/MasterGain.h"
#include "dsp/Balance.h"
#include "eq/EQ32.h"
#include "dynamics/MDRC.h"
#include "dynamics/AutoGain.h"
#include "dynamics/Limiter.h"
#include "effects/BassBoost.h"
#include "effects/ToneControl.h"
#include "effects/SpatialVirtualizer.h"
#include <atomic>
#include <memory>

namespace eqsb {

class EQsbDspEngine {
public:
    EQsbDspEngine();
    ~EQsbDspEngine() = default;

    // Lifecycle
    void initialize(int sampleRate, int channelCount, int framesPerBlock);
    void reset();

    // In-place real PCM processing (Zero heap allocations, zero I/O, lock-free)
    // Order: Pre-Gain -> Bass Boost -> Tone -> EQ32 -> MDRC -> AutoGain -> Limiter -> Master Gain -> Balance
    void process(float* interleavedPcm, int frames);

    // DSP Configuration Accessors
    dsp::PreGain& getPreGain() { return preGain_; }
    effects::BassBoost& getBassBoost() { return bassBoost_; }
    effects::ToneControl& getToneControl() { return toneControl_; }
    eq::EQ32& getEQ32() { return eq32_; }
    dynamics::MDRC& getMDRC() { return mdrc_; }
    dynamics::AutoGain& getAutoGain() { return autoGain_; }
    dynamics::Limiter& getLimiter() { return limiter_; }
    effects::SpatialVirtualizer& getSpatial() { return spatial_; }
    dsp::MasterGain& getMasterGain() { return masterGain_; }
    dsp::Balance& getBalance() { return balance_; }

    const dsp::PreGain& getPreGain() const { return preGain_; }
    const effects::BassBoost& getBassBoost() const { return bassBoost_; }
    const effects::ToneControl& getToneControl() const { return toneControl_; }
    const eq::EQ32& getEQ32() const { return eq32_; }
    const dynamics::MDRC& getMDRC() const { return mdrc_; }
    const dynamics::AutoGain& getAutoGain() const { return autoGain_; }
    const dynamics::Limiter& getLimiter() const { return limiter_; }
    const effects::SpatialVirtualizer& getSpatial() const { return spatial_; }
    const dsp::MasterGain& getMasterGain() const { return masterGain_; }
    const dsp::Balance& getBalance() const { return balance_; }

    int getSampleRate() const { return sampleRate_; }
    int getChannelCount() const { return channelCount_; }
    int getFramesPerBlock() const { return framesPerBlock_; }

    // Global bypass
    void setBypass(bool bypass) { bypass_.store(bypass, std::memory_order_relaxed); }
    bool isBypass() const { return bypass_.load(std::memory_order_relaxed); }

private:
    int sampleRate_{48000};
    int channelCount_{2};
    int framesPerBlock_{256};
    std::atomic<bool> bypass_{false};

    // The 10 DSP Chain Nodes in fixed order
    dsp::PreGain preGain_;
    effects::BassBoost bassBoost_;
    effects::ToneControl toneControl_;
    eq::EQ32 eq32_;
    dynamics::MDRC mdrc_;
    dynamics::AutoGain autoGain_;
    dynamics::Limiter limiter_;
    effects::SpatialVirtualizer spatial_;
    dsp::MasterGain masterGain_;
    dsp::Balance balance_;
};

} // namespace eqsb

#endif // EQSB_DSP_ENGINE_H
