#ifndef EQSB_DSP_UTILS_H
#define EQSB_DSP_UTILS_H

#include <cmath>
#include <algorithm>
#include <cstdint>

namespace eqsb {
namespace dsp {

constexpr float PI = 3.14159265358979323846f;
constexpr float TWO_PI = 6.28318530717958647692f;
constexpr float MIN_GAIN_DB = -96.0f;
constexpr float EPSILON = 1e-9f;

inline float dbToLinear(float db) {
    if (db <= MIN_GAIN_DB) return 0.0f;
    return std::pow(10.0f, db * 0.05f);
}

inline float linearToDb(float linear) {
    if (linear <= EPSILON) return MIN_GAIN_DB;
    return 20.0f * std::log10(linear);
}

inline float clamp(float value, float minVal, float maxVal) {
    return std::max(minVal, std::min(value, maxVal));
}

inline float sanitize(float v) {
    if (std::isnan(v) || std::isinf(v)) return 0.0f;
    return v;
}

} // namespace dsp
} // namespace eqsb

#endif // EQSB_DSP_UTILS_H
