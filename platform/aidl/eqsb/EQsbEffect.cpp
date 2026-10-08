#include "EQsbEffect.h"

#include <algorithm>
#include <cstring>
#include <optional>
#include <system/audio_effects/effect_uuid.h>
#include <android-base/logging.h>

using aidl::android::hardware::audio::effect::DefaultExtension;
using aidl::android::hardware::audio::effect::Descriptor;
using aidl::android::hardware::audio::effect::EQsbEffect;
using aidl::android::hardware::audio::effect::IEffect;
using aidl::android::hardware::audio::effect::Parameter;
using aidl::android::hardware::audio::effect::VendorExtension;
using aidl::android::media::audio::common::AudioUuid;

namespace {
constexpr uint32_t kMagic = 0x42535145; // "EQSB" little endian
constexpr uint16_t kVersion = 1;
constexpr int kBandCount = 32;

const AudioUuid kTypeUuid = {
        0x7421cb80, 0x5a33, 0x4f9e, 0xa89a, {0x02, 0x42, 0xac, 0x12, 0x00, 0x01}};
const AudioUuid kImplUuid = {
        0x7421cb80, 0x5a33, 0x4f9e, 0xa89a, {0x02, 0x42, 0xac, 0x12, 0x00, 0x02}};

struct Reader {
    const std::vector<uint8_t>& b;
    size_t p = 0;
    bool readU32(uint32_t& v) {
        if (p + 4 > b.size()) return false;
        std::memcpy(&v, b.data() + p, 4); p += 4; return true;
    }
    bool readU16(uint16_t& v) {
        if (p + 2 > b.size()) return false;
        std::memcpy(&v, b.data() + p, 2); p += 2; return true;
    }
    bool readI32(int32_t& v) { uint32_t u; if (!readU32(u)) return false; std::memcpy(&v,&u,4); return true; }
    bool readF(float& v) { uint32_t u; if (!readU32(u)) return false; std::memcpy(&v,&u,4); return true; }
    bool readBool(bool& v) { uint8_t x; if (p >= b.size()) return false; x=b[p++]; v=x!=0; return true; }
};

static bool unwrapLegacyEffectParam(const std::vector<uint8_t>& in, std::vector<uint8_t>& payload) {
    if (in.size() >= 8) {
        uint32_t psize = 0, vsize = 0;
        std::memcpy(&psize, in.data(), 4);
        std::memcpy(&vsize, in.data() + 4, 4);
        const size_t pAligned = (psize + 3u) & ~3u;
        if (psize <= in.size() - 8 && pAligned <= in.size() - 8 && vsize <= in.size() - 8 - pAligned) {
            payload.assign(in.begin() + 8 + pAligned, in.begin() + 8 + pAligned + vsize);
            if (payload.size() >= 4) {
                uint32_t magic; std::memcpy(&magic, payload.data(), 4);
                if (magic == kMagic) return true;
            }
        }
    }
    payload = in;
    return payload.size() >= 4;
}

} // namespace

namespace aidl::android::hardware::audio::effect {

const std::string EQsbEffect::kEffectName = "EQsbNativeGlobalDSP";

const Descriptor EQsbEffect::kDescriptor = {
        .common = {
                .id = {.type = kTypeUuid, .uuid = kImplUuid, .proxy = std::nullopt},
                .flags = {.type = Flags::Type::INSERT, .insert = Flags::Insert::FIRST,
                          .volume = Flags::Volume::NONE, .offloadIndication = false,
                          .deviceIndication = false, .audioModeIndication = false,
                          .audioSourceIndication = false, .bypass = false},
                .cpuLoad = 100,
                .memoryUsage = 256,
                .name = "EQsb Native Global DSP",
                .implementor = "EQsb"},
        .capability = Capability{}};

EQsbEffect::EQsbEffect() = default;

EQsbEffect::~EQsbEffect() {
    cleanUp();
}

ndk::ScopedAStatus EQsbEffect::getDescriptor(Descriptor* ret) {
    if (!ret) return ndk::ScopedAStatus::fromExceptionCode(EX_NULL_POINTER);
    *ret = kDescriptor;
    return ndk::ScopedAStatus::ok();
}

std::shared_ptr<EffectContext> EQsbEffect::createContext(const Parameter::Common& common) {
    if (!mContext) {
        mContext = std::make_shared<EQsbEffectContext>(1, common);
        mSampleRate = static_cast<int>(common.input.base.sampleRate);
        if (mSampleRate <= 0) mSampleRate = 48000;
        mChannels = 2;
        mEngine = std::make_unique<eqsb::EQsbDspEngine>();
        mEngine->initialize(mSampleRate, mChannels,
                            common.input.frameCount > 0 ? static_cast<int>(common.input.frameCount) : 256);
    }
    return mContext;
}

std::shared_ptr<EffectContext> EQsbEffect::getContext() {
    return mContext;
}

RetCode EQsbEffect::releaseContext() {
    mEngine.reset();
    mContext.reset();
    return RetCode::SUCCESS;
}

bool EQsbEffect::applyConfigBytes(const std::vector<uint8_t>& bytes) {
    std::vector<uint8_t> payload;
    if (!unwrapLegacyEffectParam(bytes, payload)) return false;
    Reader r{payload};
    uint32_t magic; uint16_t version, reserved;
    if (!r.readU32(magic) || magic != kMagic || !r.readU16(version) || version != kVersion || !r.readU16(reserved)) return false;
    if (!mEngine) return false;

    bool bypass, bassEnabled, toneEnabled, eqEnabled, mdrcEnabled, agEnabled, limEnabled, spatialEnabled;
    float f;
    if (!r.readBool(bypass) || !r.readF(f)) return false;
    mEngine->setBypass(bypass);
    mEngine->getPreGain().setGainDb(f);

    if (!r.readBool(bassEnabled) || !r.readF(f)) return false;
    mEngine->getBassBoost().setEnabled(bassEnabled); mEngine->getBassBoost().setStrength(f);

    float tb, tm, tt;
    if (!r.readBool(toneEnabled) || !r.readF(tb) || !r.readF(tm) || !r.readF(tt)) return false;
    mEngine->getToneControl().setEnabled(toneEnabled);
    mEngine->getToneControl().setBassDb(tb); mEngine->getToneControl().setMidDb(tm); mEngine->getToneControl().setTrebleDb(tt);

    if (!r.readBool(eqEnabled)) return false;
    mEngine->getEQ32().setEnabled(eqEnabled);
    for (int i=0;i<kBandCount;i++) { if (!r.readF(f)) return false; mEngine->getEQ32().setBandGain(i,f); }

    if (!r.readBool(mdrcEnabled)) return false;
    mEngine->getMDRC().setEnabled(mdrcEnabled);
    for (int i=0;i<3;i++) {
        dynamics::BandCompressorConfig c;
        if (!r.readF(c.thresholdDb) || !r.readF(c.ratio) || !r.readF(c.attackMs) || !r.readF(c.releaseMs) || !r.readF(c.makeupGainDb)) return false;
        mEngine->getMDRC().setBandConfig(static_cast<dynamics::MDRC::BandIndex>(i), c);
    }
    if (!r.readF(f)) return false; float cross2; if (!r.readF(cross2)) return false;
    mEngine->getMDRC().setCrossoverFrequencies(f, cross2);

    if (!r.readBool(agEnabled)) return false;
    float agTarget, agMax, agMin;
    if (!r.readF(agTarget) || !r.readF(agMax) || !r.readF(agMin)) return false;
    mEngine->getAutoGain().setEnabled(agEnabled); mEngine->getAutoGain().setTargetDb(agTarget); mEngine->getAutoGain().setMaxGainDb(agMax); mEngine->getAutoGain().setMinGainDb(agMin);

    if (!r.readBool(limEnabled)) return false;
    float ceil, rel;
    if (!r.readF(ceil) || !r.readF(rel)) return false;
    mEngine->getLimiter().setEnabled(limEnabled); mEngine->getLimiter().setCeilingDb(ceil); mEngine->getLimiter().setReleaseMs(rel);

    if (!r.readBool(spatialEnabled) || !r.readF(f)) return false;
    mEngine->getSpatial().setEnabled(spatialEnabled); mEngine->getSpatial().setWidth(f);
    float master, balance;
    if (!r.readF(master) || !r.readF(balance)) return false;
    mEngine->getMasterGain().setGainDb(master); mEngine->getBalance().setBalance(balance);
    return true;
}

std::vector<uint8_t> EQsbEffect::makeConfigBytes() const {
    std::vector<uint8_t> b;
    auto u32=[&](uint32_t x){auto q=b.size();b.resize(q+4);std::memcpy(b.data()+q,&x,4);};
    auto u16=[&](uint16_t x){auto q=b.size();b.resize(q+2);std::memcpy(b.data()+q,&x,2);};
    auto f=[&](float x){u32(0);std::memcpy(b.data()+b.size()-4,&x,4);};
    auto bl=[&](bool x){b.push_back(x?1:0);};
    u32(kMagic);u16(kVersion);u16(0);
    bl(mEngine->isBypass());f(mEngine->getPreGain().getGainDb());
    bl(mEngine->getBassBoost().isEnabled());f(mEngine->getBassBoost().getStrength());
    bl(mEngine->getToneControl().isEnabled());f(mEngine->getToneControl().getBassDb());f(mEngine->getToneControl().getMidDb());f(mEngine->getToneControl().getTrebleDb());
    bl(mEngine->getEQ32().isEnabled()); for(int i=0;i<kBandCount;i++) f(mEngine->getEQ32().getBandGain(i));
    bl(mEngine->getMDRC().isEnabled()); for(int i=0;i<3;i++){auto c=mEngine->getMDRC().getBandConfig(static_cast<dynamics::MDRC::BandIndex>(i));f(c.thresholdDb);f(c.ratio);f(c.attackMs);f(c.releaseMs);f(c.makeupGainDb);} f(mEngine->getMDRC().getLowMidCrossover());f(mEngine->getMDRC().getMidHighCrossover());
    bl(mEngine->getAutoGain().isEnabled());f(mEngine->getAutoGain().getTargetDb());f(mEngine->getAutoGain().getMaxGainDb());f(mEngine->getAutoGain().getMinGainDb());
    bl(mEngine->getLimiter().isEnabled());f(mEngine->getLimiter().getCeilingDb());f(mEngine->getLimiter().getReleaseMs());
    bl(mEngine->getSpatial().isEnabled());f(mEngine->getSpatial().getWidth());f(mEngine->getMasterGain().getGainDb());f(mEngine->getBalance().getBalance());
    return b;
}

ndk::ScopedAStatus EQsbEffect::setParameterSpecific(const Parameter::Specific& specific) {
    if (specific.getTag() != Parameter::Specific::vendorEffect) return ndk::ScopedAStatus::fromExceptionCode(EX_ILLEGAL_ARGUMENT);
    const auto& vendor = specific.get<Parameter::Specific::vendorEffect>();
    std::optional<DefaultExtension> ext;
    if (vendor.extension.getParcelable(&ext) != STATUS_OK || !ext.has_value()) return ndk::ScopedAStatus::fromExceptionCode(EX_ILLEGAL_ARGUMENT);
    if (!applyConfigBytes(ext->bytes)) return ndk::ScopedAStatus::fromExceptionCode(EX_ILLEGAL_ARGUMENT);
    if (mContext) mContext->setParams(ext->bytes);
    return ndk::ScopedAStatus::ok();
}

ndk::ScopedAStatus EQsbEffect::getParameterSpecific(const Parameter::Id& id, Parameter::Specific* specific) {
    if (!specific || id.getTag() != Parameter::Id::vendorEffectTag || !mContext) return ndk::ScopedAStatus::fromExceptionCode(EX_ILLEGAL_ARGUMENT);
    DefaultExtension ext; ext.bytes = makeConfigBytes();
    VendorExtension vendor;
    if (vendor.extension.setParcelable(ext) != STATUS_OK) return ndk::ScopedAStatus::fromExceptionCode(EX_ILLEGAL_ARGUMENT);
    specific->set<Parameter::Specific::vendorEffect>(vendor);
    return ndk::ScopedAStatus::ok();
}

IEffect::Status EQsbEffect::effectProcessImpl(float* in, float* out, int samples) {
    if (!in || !out || samples <= 0 || !mEngine) return {STATUS_BAD_VALUE, 0, 0};
    if (out != in) std::memcpy(out, in, static_cast<size_t>(samples) * sizeof(float));
    const int frames = std::max(1, samples / std::max(1, mChannels));
    mEngine->process(out, frames, mChannels);
    return {STATUS_OK, static_cast<size_t>(samples), static_cast<size_t>(samples)};
}

extern "C" binder_exception_t createEffect(const AudioUuid* in_impl_uuid, std::shared_ptr<IEffect>* instanceSp) {
    if (!in_impl_uuid || *in_impl_uuid != kImplUuid || !instanceSp) return EX_ILLEGAL_ARGUMENT;
    *instanceSp = ndk::SharedRefBase::make<EQsbEffect>();
    return EX_NONE;
}

extern "C" binder_exception_t queryEffect(const AudioUuid* in_impl_uuid, Descriptor* ret) {
    if (!in_impl_uuid || *in_impl_uuid != kImplUuid || !ret) return EX_ILLEGAL_ARGUMENT;
    *ret = EQsbEffect::kDescriptor;
    return EX_NONE;
}

extern "C" binder_exception_t destroyEffect(const std::shared_ptr<IEffect>& /*instanceSp*/) {
    return EX_NONE;
}

} // namespace aidl::android::hardware::audio::effect
