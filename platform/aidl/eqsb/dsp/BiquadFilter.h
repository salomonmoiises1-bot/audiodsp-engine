#ifndef EQSB_BIQUAD_FILTER_H
#define EQSB_BIQUAD_FILTER_H

#include "DspUtils.h"

namespace eqsb {
namespace dsp {

enum class FilterType {
    PEAKING_EQ,
    LOW_SHELF,
    HIGH_SHELF,
    LOW_PASS,
    HIGH_PASS,
    BAND_PASS
};

class BiquadFilter {
public:
    BiquadFilter();
    ~BiquadFilter() = default;

    void configure(FilterType type, float frequency, float sampleRate, float gainDb, float Q);
    void reset();

    // In-place sample processing: Direct Form II Transposed
    inline float processSample(float input) {
        // y[n] = b0*x[n] + s1
        // s1   = b1*x[n] - a1*y[n] + s2
        // s2   = b2*x[n] - a2*y[n]
        float output = b0 * input + s1;
        s1 = b1 * input - a1 * output + s2;
        s2 = b2 * input - a2 * output;
        return sanitize(output);
    }

    float getGainDb() const { return gainDb_; }
    float getFrequency() const { return frequency_; }
    float getQ() const { return Q_; }
    FilterType getType() const { return type_; }

private:
    void computeCoefficients();

    FilterType type_{FilterType::PEAKING_EQ};
    float frequency_{1000.0f};
    float sampleRate_{48000.0f};
    float gainDb_{0.0f};
    float Q_{1.0f};

    // Normalized coefficients (a0 is normalized to 1.0)
    float b0{1.0f};
    float b1{0.0f};
    float b2{0.0f};
    float a1{0.0f};
    float a2{0.0f};

    // State registers (Direct Form II Transposed)
    float s1{0.0f};
    float s2{0.0f};
};

} // namespace dsp
} // namespace eqsb

#endif // EQSB_BIQUAD_FILTER_H
