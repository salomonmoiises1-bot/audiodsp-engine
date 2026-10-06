#ifndef EQSB_BALANCE_H
#define EQSB_BALANCE_H

#include "DspUtils.h"

namespace eqsb {
namespace dsp {

class Balance {
public:
    Balance() = default;
    ~Balance() = default;

    // balance in range [-1.0f (Full Left), 1.0f (Full Right)]
    void setBalance(float balance) {
        balance_ = clamp(balance, -1.0f, 1.0f);
        if (balance_ < 0.0f) {
            // Panned left: Left unchanged, Right reduced
            leftGain_ = 1.0f;
            rightGain_ = 1.0f + balance_; // e.g. -0.5 -> 0.5, -1.0 -> 0.0
        } else if (balance_ > 0.0f) {
            // Panned right: Left reduced, Right unchanged
            leftGain_ = 1.0f - balance_; // e.g. +0.5 -> 0.5, +1.0 -> 0.0
            rightGain_ = 1.0f;
        } else {
            leftGain_ = 1.0f;
            rightGain_ = 1.0f;
        }
    }

    float getBalance() const { return balance_; }
    float getLeftGain() const { return leftGain_; }
    float getRightGain() const { return rightGain_; }

    void reset() {}

    inline void process(float* buffer, int frames, int channels) {
        if (channels < 2 || std::abs(balance_) < 0.0001f) {
            return; // Mono or center balance: no attenuation
        }
        for (int i = 0; i < frames; ++i) {
            int leftIdx = i * channels;
            int rightIdx = leftIdx + 1;
            buffer[leftIdx] = sanitize(buffer[leftIdx] * leftGain_);
            buffer[rightIdx] = sanitize(buffer[rightIdx] * rightGain_);
        }
    }

private:
    float balance_{0.0f};
    float leftGain_{1.0f};
    float rightGain_{1.0f};
};

} // namespace dsp
} // namespace eqsb

#endif // EQSB_BALANCE_H
