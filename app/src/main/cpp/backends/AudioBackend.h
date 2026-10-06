#ifndef EQSB_AUDIO_BACKEND_H
#define EQSB_AUDIO_BACKEND_H

#include "../EQsbDspEngine.h"
#include <string>

namespace eqsb {
namespace backends {

enum class BackendType {
    OBOE_PLAYBACK_STREAM,      // Stream owned directly by EQsb via Oboe (High performance, low latency AAudio/OpenSL ES)
    AUDIO_EFFECT_SESSION       // Android AudioEffect session (Session 0 or targeted session ID)
};

class AudioBackend {
public:
    virtual ~AudioBackend() = default;

    virtual BackendType getType() const = 0;
    virtual const char* getName() const = 0;

    virtual bool start() = 0;
    virtual void stop() = 0;
    virtual bool isRunning() const = 0;

    virtual void setDspEngine(EQsbDspEngine* engine) {
        dspEngine_ = engine;
    }

    EQsbDspEngine* getDspEngine() const {
        return dspEngine_;
    }

protected:
    EQsbDspEngine* dspEngine_{nullptr};
};

} // namespace backends
} // namespace eqsb

#endif // EQSB_AUDIO_BACKEND_H
