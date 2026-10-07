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
#include <mutex>

namespace eqsb {

class EQsbDspEngine {
public:
    EQsbDspEngine();
    ~EQsbDspEngine() = default;

    void initialize(int sampleRate, int channelCount, int framesPerBlock);
    void reset();

    void process(float* interleavedPcm, int frames);
    void process(float* interleavedPcm, int frames, int channels);

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

    void setBypass(bool bypass) { bypass_.store(bypass, std::memory_order_relaxed); }
    bool isBypass() const { return bypass_.load(std::memory_order_relaxed); }

    std::mutex& configMutex() { return configMutex_; }

private:
    int sampleRate_{48000};
    int channelCount_{2};
    int framesPerBlock_{256};
    std::atomic<bool> bypass_{false};
    mutable std::mutex configMutex_;

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
#endif
