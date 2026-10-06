#ifndef EQSB_AUDIO_EFFECT_BACKEND_H
#define EQSB_AUDIO_EFFECT_BACKEND_H

#include "AudioBackend.h"
#include <string>
#include <cstdint>

namespace eqsb {
namespace backends {

// Custom UUID for EQsb AudioEffect registration:
// 7421cb80-5a33-4f9e-a89a-0242ac120002
struct EffectUuid {
    uint32_t timeLow;
    uint16_t timeMid;
    uint16_t timeHiAndVersion;
    uint16_t clockSeq;
    uint8_t  node[6];
};

struct EffectDescriptor {
    EffectUuid type;
    EffectUuid uuid;
    uint32_t apiVersion;
    uint32_t flags;
    uint16_t cpuLoad;
    uint16_t memoryUsage;
    char name[64];
    char implementor[64];
};

class AudioEffectBackend : public AudioBackend {
public:
    AudioEffectBackend();
    ~AudioEffectBackend() override;

    BackendType getType() const override { return BackendType::AUDIO_EFFECT_SESSION; }
    const char* getName() const override { return "Android AudioEffect / AudioFlinger Session Bridge"; }

    bool start() override;
    void stop() override;
    bool isRunning() const override { return running_; }

    void setAudioSessionId(int sessionId) { sessionId_ = sessionId; }
    int getAudioSessionId() const { return sessionId_; }

    // Direct process buffer hook for AudioEffect process(audio_buffer_t* in, audio_buffer_t* out)
    void processEffect(float* inBuffer, float* outBuffer, int frames, int channels);

    // Effect Command Handlers
    int32_t command(uint32_t cmdCode, uint32_t cmdSize, void* pCmdData, uint32_t* pReplySize, void* pReplyData);

    // Technical audit & capabilities analysis
    static std::string getTechnicalAuditReport();

    static EffectDescriptor getDescriptor();

private:
    bool running_{false};
    int sessionId_{0}; // 0 = Global mix (deprecated/restricted), >0 = specific app session
};

} // namespace backends
} // namespace eqsb

#endif // EQSB_AUDIO_EFFECT_BACKEND_H
