#include "EQsbEffect.h"
#include <algorithm>
#include <cerrno>
#include <cstring>
#include <cmath>
#include <mutex>

using eqsb::EQsbDspEngine;
using eqsb::platform::EffectContext;
using eqsb::platform::ParamId;
using namespace eqsb::platform;

namespace {

constexpr uint32_t kPcm16 = 1u;
constexpr uint32_t kPcmFloat = 5u;
constexpr uint32_t kStereoMask = 0x3u;

static int channelCount(uint32_t mask) {
    if (mask == 0) return 2;
    uint32_t x = mask;
    int n = 0;
    while (x) { n += static_cast<int>(x & 1u); x >>= 1u; }
    return std::max(1, std::min(n, 2));
}

static void replyStatus(uint32_t* replySize, void* replyData, int32_t status) {
    if (replySize && replyData && *replySize >= sizeof(int32_t)) {
        *static_cast<int32_t*>(replyData) = status;
        *replySize = sizeof(int32_t);
    }
}

static const char* paramData(const effect_param_t* p) {
    return p->data + ((p->psize + 3u) & ~3u);
}

static int32_t setParameter(EffectContext* c, uint32_t id, const void* value, uint32_t size) {
    if (!c || !value) return -EINVAL;
    std::lock_guard<std::mutex> lock(c->engine.configMutex());
    const auto f = [&](float& out) -> bool { if (size != sizeof(float)) return false; std::memcpy(&out, value, sizeof(out)); return std::isfinite(out); };
    const auto b = [&](bool& out) -> bool { if (size != sizeof(uint32_t)) return false; uint32_t v; std::memcpy(&v,value,sizeof(v)); out = v != 0; return true; };
    float f32 = 0; bool bv = false;
    switch (id) {
        case PARAM_BYPASS: if (!b(bv)) return -EINVAL; c->engine.setBypass(bv); return 0;
        case PARAM_PRE_GAIN_DB: if (!f(f32)) return -EINVAL; c->engine.getPreGain().setGainDb(f32); return 0;
        case PARAM_BASS_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getBassBoost().setEnabled(bv); return 0;
        case PARAM_BASS_STRENGTH: if (!f(f32)) return -EINVAL; c->engine.getBassBoost().setStrength(f32); return 0;
        case PARAM_TONE_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getToneControl().setEnabled(bv); return 0;
        case PARAM_TONE_BASS_DB: if (!f(f32)) return -EINVAL; c->engine.getToneControl().setBassDb(f32); return 0;
        case PARAM_TONE_MID_DB: if (!f(f32)) return -EINVAL; c->engine.getToneControl().setMidDb(f32); return 0;
        case PARAM_TONE_TREBLE_DB: if (!f(f32)) return -EINVAL; c->engine.getToneControl().setTrebleDb(f32); return 0;
        case PARAM_EQ32_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getEQ32().setEnabled(bv); return 0;
        case PARAM_MDRC_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getMDRC().setEnabled(bv); return 0;
        case PARAM_MDRC_CROSSOVER_LOW_MID: if (!f(f32)) return -EINVAL; c->engine.getMDRC().setCrossoverFrequencies(f32, c->engine.getMDRC().getMidHighCrossover()); return 0;
        case PARAM_MDRC_CROSSOVER_MID_HIGH: if (!f(f32)) return -EINVAL; c->engine.getMDRC().setCrossoverFrequencies(c->engine.getMDRC().getLowMidCrossover(), f32); return 0;
        case PARAM_AUTOGAIN_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getAutoGain().setEnabled(bv); return 0;
        case PARAM_AUTOGAIN_TARGET_DB: if (!f(f32)) return -EINVAL; c->engine.getAutoGain().setTargetDb(f32); return 0;
        case PARAM_AUTOGAIN_MAX_DB: if (!f(f32)) return -EINVAL; c->engine.getAutoGain().setMaxGainDb(f32); return 0;
        case PARAM_AUTOGAIN_MIN_DB: if (!f(f32)) return -EINVAL; c->engine.getAutoGain().setMinGainDb(f32); return 0;
        case PARAM_LIMITER_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getLimiter().setEnabled(bv); return 0;
        case PARAM_LIMITER_CEILING_DB: if (!f(f32)) return -EINVAL; c->engine.getLimiter().setCeilingDb(f32); return 0;
        case PARAM_LIMITER_RELEASE_MS: if (!f(f32)) return -EINVAL; c->engine.getLimiter().setReleaseMs(f32); return 0;
        case PARAM_SPATIAL_ENABLED: if (!b(bv)) return -EINVAL; c->engine.getSpatial().setEnabled(bv); return 0;
        case PARAM_SPATIAL_WIDTH: if (!f(f32)) return -EINVAL; c->engine.getSpatial().setWidth(f32); return 0;
        case PARAM_MASTER_GAIN_DB: if (!f(f32)) return -EINVAL; c->engine.getMasterGain().setGainDb(f32); return 0;
        case PARAM_BALANCE: if (!f(f32)) return -EINVAL; c->engine.getBalance().setBalance(f32); return 0;
        default: break;
    }
    if (id >= PARAM_EQ32_BAND_DB_BASE && id < PARAM_EQ32_BAND_DB_BASE + eqsb::eq::NUM_EQ32_BANDS) {
        if (!f(f32)) return -EINVAL;
        c->engine.getEQ32().setBandGain(static_cast<int>(id - PARAM_EQ32_BAND_DB_BASE), f32);
        return 0;
    }
    if (id >= PARAM_MDRC_BAND_BASE && id < PARAM_MDRC_BAND_BASE + 3) {
        if (size != sizeof(eqsb::dynamics::BandCompressorConfig)) return -EINVAL;
        eqsb::dynamics::BandCompressorConfig cfg{}; std::memcpy(&cfg, value, sizeof(cfg));
        c->engine.getMDRC().setBandConfig(static_cast<eqsb::dynamics::MDRC::BandIndex>(id - PARAM_MDRC_BAND_BASE), cfg);
        return 0;
    }
    return -EINVAL;
}

static int32_t process( effect_handle_t self, audio_buffer_t* inBuffer, audio_buffer_t* outBuffer) {
    if (!self || !*self) return -EINVAL;
    auto* c = reinterpret_cast<EffectContext*>(self);
    if (!c->enabled) return -ENODATA;
    if (!inBuffer) inBuffer = &c->config.inputCfg.buffer;
    if (!outBuffer) outBuffer = &c->config.outputCfg.buffer;
    if (!inBuffer || !outBuffer || !inBuffer->raw || !outBuffer->raw || inBuffer->frameCount == 0) return -EINVAL;
    const int channels = channelCount(c->config.inputCfg.channels);
    const size_t frames = inBuffer->frameCount;
    const uint32_t format = c->config.inputCfg.format;
    if (format == kPcmFloat) {
        float* in = static_cast<float*>(inBuffer->raw);
        float* out = static_cast<float*>(outBuffer->raw);
        if (in != out) std::memcpy(out, in, frames * channels * sizeof(float));
        c->engine.process(out, static_cast<int>(frames), channels);
        return 0;
    }
    if (format == kPcm16) {
        const int16_t* in = inBuffer->s16;
        int16_t* out = outBuffer->s16;
        const size_t samples = frames * channels;
        if (c->scratch.size() < samples) return -EINVAL;
        for (size_t i=0;i<samples;++i) c->scratch[i] = static_cast<float>(in[i]) / 32768.0f;
        c->engine.process(c->scratch.data(), static_cast<int>(frames), channels);
        for (size_t i=0;i<samples;++i) {
            float v = std::max(-1.0f, std::min(0.9999695f, c->scratch[i]));
            out[i] = static_cast<int16_t>(std::lrintf(v * 32768.0f));
        }
        return 0;
    }
    return -ENOSYS;
}

static int32_t command(effect_handle_t self, uint32_t cmdCode, uint32_t cmdSize, void* cmdData, uint32_t* replySize, void* replyData) {
    if (!self || !*self) return -EINVAL;
    auto* c = reinterpret_cast<EffectContext*>(self);
    int32_t status = 0;
    switch (cmdCode) {
        case EFFECT_CMD_INIT: c->enabled=false; c->engine.reset(); break;
        case EFFECT_CMD_SET_CONFIG:
            if (cmdSize != sizeof(effect_config_t) || !cmdData) { status=-EINVAL; break; }
            c->config = *static_cast<effect_config_t*>(cmdData);
            {
                int sr = static_cast<int>(c->config.inputCfg.samplingRate ? c->config.inputCfg.samplingRate : 48000);
                int ch = channelCount(c->config.inputCfg.channels);
                int frames = static_cast<int>(c->config.inputCfg.buffer.frameCount ? c->config.inputCfg.buffer.frameCount : 256);
                std::lock_guard<std::mutex> lock(c->engine.configMutex());
                c->engine.initialize(sr, ch, frames);
                c->scratch.resize(static_cast<size_t>(frames) * ch);
            }
            break;
        case EFFECT_CMD_RESET: { std::lock_guard<std::mutex> lock(c->engine.configMutex()); c->engine.reset(); break; }
        case EFFECT_CMD_ENABLE: c->enabled=true; break;
        case EFFECT_CMD_DISABLE: c->enabled=false; break;
        case EFFECT_CMD_SET_PARAM:
            if (!cmdData || cmdSize < sizeof(effect_param_t)) { status=-EINVAL; break; }
            { auto* p=static_cast<effect_param_t*>(cmdData); if (p->psize != sizeof(uint32_t)) { status=-EINVAL; break; } uint32_t id; std::memcpy(&id,p->data,sizeof(id)); status=setParameter(c,id,paramData(p),p->vsize); }
            break;
        default: status = -ENOSYS; break;
    }
    replyStatus(replySize, replyData, status);
    return status;
}

static int32_t fillDescriptor(effect_descriptor_t* d) {
    if (!d) return -EINVAL;
    std::memset(d,0,sizeof(*d));
    d->type=kTypeUuid; d->uuid=kImplUuid; d->apiVersion=EFFECT_CONTROL_API_VERSION;
    d->flags=EFFECT_FLAG_TYPE_POST_PROC | EFFECT_FLAG_INSERT_LAST | EFFECT_FLAG_INPUT_DIRECT | EFFECT_FLAG_OUTPUT_DIRECT;
    d->cpuLoad=50; d->memoryUsage=256;
    std::strncpy(d->name,"EQsb Native 32-Band DSP",sizeof(d->name)-1);
    std::strncpy(d->implementor,"EQsb Engineering",sizeof(d->implementor)-1);
    return 0;
}

static int32_t getDescriptor(effect_handle_t self, effect_descriptor_t* d) {
    if (!self || !*self) return -EINVAL;
    return fillDescriptor(d);
}

static const effect_interface_s kInterface = { process, command, getDescriptor, nullptr };

static int32_t createEffect(const effect_uuid_t* uuid, int32_t sessionId, int32_t ioId, effect_handle_t* handle) {
    if (!uuid || !handle) return -EINVAL;
    if (std::memcmp(uuid,&kImplUuid,sizeof(kImplUuid)) != 0) return -ENOENT;
    auto* c = new EffectContext(); c->sessionId=sessionId; c->ioId=ioId;
    c->itfe = const_cast<effect_interface_s*>(&kInterface);
    *handle = &c->itfe;
    return 0;
}

static int32_t releaseEffect(effect_handle_t handle) {
    if (!handle) return -EINVAL;
    auto* c=reinterpret_cast<EffectContext*>(handle); delete c; return 0;
}

static int32_t getLibraryDescriptor(const effect_uuid_t* uuid, effect_descriptor_t* d) {
    if (!uuid || !d) return -EINVAL;
    if (std::memcmp(uuid,&kImplUuid,sizeof(kImplUuid)) != 0) return -ENOENT;
    return fillDescriptor(d);
}

static audio_effect_library_t kLibrary = {
    AUDIO_EFFECT_LIBRARY_TAG,
    EFFECT_LIBRARY_API_VERSION,
    "EQsb Native Effects",
    "EQsb Engineering",
    createEffect,
    releaseEffect,
    getLibraryDescriptor
};

} // namespace

extern "C" audio_effect_library_t AUDIO_EFFECT_LIBRARY_INFO_SYM = kLibrary;
