#pragma once

#include <aidl/android/hardware/audio/effect/DefaultExtension.h>
#include <aidl/android/hardware/audio/effect/IEffect.h>
#include <memory>
#include <vector>
#include "effect-impl/EffectImpl.h"
#include "../../../app/src/main/cpp/EQsbDspEngine.h"

namespace aidl::android::hardware::audio::effect {

class EQsbEffectContext final : public EffectContext {
public:
    EQsbEffectContext(int statusDepth, const Parameter::Common& common)
            : EffectContext(statusDepth, common) {}

    RetCode setParams(const std::vector<uint8_t>& params) {
        mParams = params;
        return RetCode::SUCCESS;
    }

    const std::vector<uint8_t>& getParams() const { return mParams; }

private:
    std::vector<uint8_t> mParams;
};

class EQsbEffect final : public EffectImpl {
public:
    static const std::string kEffectName;
    static const Descriptor kDescriptor;

    EQsbEffect();
    ~EQsbEffect() override;

    ndk::ScopedAStatus getDescriptor(Descriptor* ret) override;
    ndk::ScopedAStatus setParameterSpecific(const Parameter::Specific& specific)
            REQUIRES(mImplMutex) override;
    ndk::ScopedAStatus getParameterSpecific(const Parameter::Id& id,
                                             Parameter::Specific* specific)
            REQUIRES(mImplMutex) override;
    std::shared_ptr<EffectContext> createContext(const Parameter::Common& common)
            REQUIRES(mImplMutex) override;
    std::shared_ptr<EffectContext> getContext() override;
    RetCode releaseContext() REQUIRES(mImplMutex) override;
    std::string getEffectName() override { return kEffectName; }

    IEffect::Status effectProcessImpl(float* in, float* out, int samples)
            REQUIRES(mImplMutex) override;

private:
    std::shared_ptr<EQsbEffectContext> mContext GUARDED_BY(mImplMutex);
    std::unique_ptr<eqsb::EQsbDspEngine> mEngine GUARDED_BY(mImplMutex);
    int mChannels GUARDED_BY(mImplMutex) = 2;
    int mSampleRate GUARDED_BY(mImplMutex) = 48000;

    bool applyConfigBytes(const std::vector<uint8_t>& bytes) REQUIRES(mImplMutex);
    std::vector<uint8_t> makeConfigBytes() const REQUIRES(mImplMutex);
};

} // namespace aidl::android::hardware::audio::effect
