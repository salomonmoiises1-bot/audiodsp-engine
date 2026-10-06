#ifndef EQSB_MASTER_GAIN_H
#define EQSB_MASTER_GAIN_H

#include "DspUtils.h"

namespace eqsb {
namespace dsp {

class MasterGain {
public:
    MasterGain() = default;
    ~MasterGain() = default;

    void setGainDb(float gainDb) {
        gainDb_ = gainDb;
        gainLinear_ = dbToLinear(gainDb);
    }

    float getGainDb() const { return gainDb_; }
    float getGainLinear() const { return gainLinear_; }

    void reset() {}

    inline void process(float* buffer, int frames, int channels) {
        if (std::abs(gainDb_) < 0.001f) {
            return; // 0 dB flat bypass
        }
        int totalSamples = frames * channels;
        for (int i = 0; i < totalSamples; ++i) {
            buffer[i] = sanitize(buffer[i] * gainLinear_);
        }
    }

private:
    float gainDb_{0.0f};
    float gainLinear_{1.0f};
};

} // namespace dsp
} // namespace eqsb

#endif // EQSB_MASTER_GAIN_H
