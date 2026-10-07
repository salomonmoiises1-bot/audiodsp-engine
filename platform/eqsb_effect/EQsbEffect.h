#pragma once
#include "../../app/src/main/cpp/EQsbDspEngine.h"
#include <hardware/audio_effect.h>
#include <atomic>
#include <cstdint>
#include <vector>

namespace eqsb::platform {

constexpr effect_uuid_t kTypeUuid = {
    0x7421cb80, 0x5a33, 0x4f9e, 0xa89a, {0x02, 0x42, 0xac, 0x12, 0x00, 0x01}
};
constexpr effect_uuid_t kImplUuid = {
    0x7421cb80, 0x5a33, 0x4f9e, 0xa89a, {0x02, 0x42, 0xac, 0x12, 0x00, 0x02}
};

enum ParamId : uint32_t {
    PARAM_BYPASS = 1,
    PARAM_PRE_GAIN_DB,
    PARAM_BASS_ENABLED,
    PARAM_BASS_STRENGTH,
    PARAM_TONE_ENABLED,
    PARAM_TONE_BASS_DB,
    PARAM_TONE_MID_DB,
    PARAM_TONE_TREBLE_DB,
    PARAM_EQ32_ENABLED,
    PARAM_EQ32_BAND_DB_BASE = 100,
    PARAM_MDRC_ENABLED = 200,
    PARAM_MDRC_CROSSOVER_LOW_MID,
    PARAM_MDRC_CROSSOVER_MID_HIGH,
    PARAM_MDRC_BAND_BASE = 220,
    PARAM_AUTOGAIN_ENABLED = 300,
    PARAM_AUTOGAIN_TARGET_DB,
    PARAM_AUTOGAIN_MAX_DB,
    PARAM_AUTOGAIN_MIN_DB,
    PARAM_LIMITER_ENABLED = 320,
    PARAM_LIMITER_CEILING_DB,
    PARAM_LIMITER_RELEASE_MS,
    PARAM_SPATIAL_ENABLED = 340,
    PARAM_SPATIAL_WIDTH,
    PARAM_MASTER_GAIN_DB = 360,
    PARAM_BALANCE = 361,
};

struct EffectContext {
    struct effect_interface_s* itfe;
    EQsbDspEngine engine;
    effect_config_t config{};
    bool enabled{false};
    int sessionId{0};
    int ioId{0};
    std::vector<float> scratch;
};

} // namespace eqsb::platform
