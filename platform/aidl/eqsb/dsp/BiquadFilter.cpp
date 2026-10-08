#include "BiquadFilter.h"
#include <cmath>

namespace eqsb {
namespace dsp {

BiquadFilter::BiquadFilter() {
    reset();
    computeCoefficients();
}

void BiquadFilter::configure(FilterType type, float frequency, float sampleRate, float gainDb, float Q) {
    type_ = type;
    frequency_ = frequency;
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    gainDb_ = gainDb;
    Q_ = (Q > 0.001f) ? Q : 0.707f;
    computeCoefficients();
}

void BiquadFilter::reset() {
    s1 = 0.0f;
    s2 = 0.0f;
}

void BiquadFilter::computeCoefficients() {
    // Clamp frequency to Nyquist limit
    float nyquist = sampleRate_ * 0.499f;
    float f0 = clamp(frequency_, 10.0f, nyquist);

    // If gain is 0 dB for peaking/shelf, make it flat bypass to save computation distortion
    if (std::abs(gainDb_) < 0.001f && 
        (type_ == FilterType::PEAKING_EQ || type_ == FilterType::LOW_SHELF || type_ == FilterType::HIGH_SHELF)) {
        b0 = 1.0f;
        b1 = 0.0f;
        b2 = 0.0f;
        a1 = 0.0f;
        a2 = 0.0f;
        return;
    }

    float A = std::pow(10.0f, gainDb_ / 40.0f); // sqrt of linear power
    float omega0 = TWO_PI * f0 / sampleRate_;
    float cosOmega0 = std::cos(omega0);
    float sinOmega0 = std::sin(omega0);
    float alpha = sinOmega0 / (2.0f * Q_);

    float raw_a0 = 1.0f;
    float raw_a1 = 0.0f;
    float raw_a2 = 0.0f;
    float raw_b0 = 1.0f;
    float raw_b1 = 0.0f;
    float raw_b2 = 0.0f;

    switch (type_) {
        case FilterType::PEAKING_EQ: {
            raw_b0 = 1.0f + alpha * A;
            raw_b1 = -2.0f * cosOmega0;
            raw_b2 = 1.0f - alpha * A;
            raw_a0 = 1.0f + alpha / A;
            raw_a1 = -2.0f * cosOmega0;
            raw_a2 = 1.0f - alpha / A;
            break;
        }
        case FilterType::LOW_SHELF: {
            float sqrtA2 = 2.0f * std::sqrt(A) * alpha;
            raw_b0 = A * ((A + 1.0f) - (A - 1.0f) * cosOmega0 + sqrtA2);
            raw_b1 = 2.0f * A * ((A - 1.0f) - (A + 1.0f) * cosOmega0);
            raw_b2 = A * ((A + 1.0f) - (A - 1.0f) * cosOmega0 - sqrtA2);
            raw_a0 = (A + 1.0f) + (A - 1.0f) * cosOmega0 + sqrtA2;
            raw_a1 = -2.0f * ((A - 1.0f) + (A + 1.0f) * cosOmega0);
            raw_a2 = (A + 1.0f) + (A - 1.0f) * cosOmega0 - sqrtA2;
            break;
        }
        case FilterType::HIGH_SHELF: {
            float sqrtA2 = 2.0f * std::sqrt(A) * alpha;
            raw_b0 = A * ((A + 1.0f) + (A - 1.0f) * cosOmega0 + sqrtA2);
            raw_b1 = -2.0f * A * ((A - 1.0f) + (A + 1.0f) * cosOmega0);
            raw_b2 = A * ((A + 1.0f) + (A - 1.0f) * cosOmega0 - sqrtA2);
            raw_a0 = (A + 1.0f) - (A - 1.0f) * cosOmega0 + sqrtA2;
            raw_a1 = 2.0f * ((A - 1.0f) - (A + 1.0f) * cosOmega0);
            raw_a2 = (A + 1.0f) - (A - 1.0f) * cosOmega0 - sqrtA2;
            break;
        }
        case FilterType::LOW_PASS: {
            raw_b0 = (1.0f - cosOmega0) * 0.5f;
            raw_b1 = 1.0f - cosOmega0;
            raw_b2 = (1.0f - cosOmega0) * 0.5f;
            raw_a0 = 1.0f + alpha;
            raw_a1 = -2.0f * cosOmega0;
            raw_a2 = 1.0f - alpha;
            break;
        }
        case FilterType::HIGH_PASS: {
            raw_b0 = (1.0f + cosOmega0) * 0.5f;
            raw_b1 = -(1.0f + cosOmega0);
            raw_b2 = (1.0f + cosOmega0) * 0.5f;
            raw_a0 = 1.0f + alpha;
            raw_a1 = -2.0f * cosOmega0;
            raw_a2 = 1.0f - alpha;
            break;
        }
        case FilterType::BAND_PASS: {
            raw_b0 = alpha;
            raw_b1 = 0.0f;
            raw_b2 = -alpha;
            raw_a0 = 1.0f + alpha;
            raw_a1 = -2.0f * cosOmega0;
            raw_a2 = 1.0f - alpha;
            break;
        }
    }

    if (std::abs(raw_a0) > EPSILON) {
        float inv_a0 = 1.0f / raw_a0;
        b0 = raw_b0 * inv_a0;
        b1 = raw_b1 * inv_a0;
        b2 = raw_b2 * inv_a0;
        a1 = raw_a1 * inv_a0;
        a2 = raw_a2 * inv_a0;
    } else {
        b0 = 1.0f;
        b1 = 0.0f;
        b2 = 0.0f;
        a1 = 0.0f;
        a2 = 0.0f;
    }
}

} // namespace dsp
} // namespace eqsb
