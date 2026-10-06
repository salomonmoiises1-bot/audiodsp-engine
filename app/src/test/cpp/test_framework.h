#ifndef EQSB_TEST_FRAMEWORK_H
#define EQSB_TEST_FRAMEWORK_H

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <functional>
#include <chrono>

namespace eqsb {
namespace test {

struct TestCase {
    std::string name;
    std::function<bool()> run;
};

class TestRegistry {
public:
    static TestRegistry& instance() {
        static TestRegistry reg;
        return reg;
    }

    void addTest(const std::string& name, std::function<bool()> testFn) {
        tests_.push_back({name, testFn});
    }

    int runAll() {
        int passed = 0;
        int failed = 0;
        std::cout << "=========================================================\n";
        std::cout << "       EQsb AUTOMATED DSP NATIVE VERIFICATION SUITE       \n";
        std::cout << "=========================================================\n";

        for (const auto& t : tests_) {
            std::cout << "[ RUN      ] " << t.name << "..." << std::flush;
            auto start = std::chrono::high_resolution_clock::now();
            bool ok = false;
            try {
                ok = t.run();
            } catch (const std::exception& e) {
                std::cout << " EXCEPTION: " << e.what() << "\n";
                ok = false;
            } catch (...) {
                std::cout << " UNKNOWN EXCEPTION\n";
                ok = false;
            }
            auto end = std::chrono::high_resolution_clock::now();
            double ms = std::chrono::duration<double, std::milli>(end - start).count();

            if (ok) {
                std::cout << " [ PASS ] (" << ms << " ms)\n";
                passed++;
            } else {
                std::cout << " [ FAIL ] (" << ms << " ms)\n";
                failed++;
            }
        }

        std::cout << "=========================================================\n";
        std::cout << " RESULTS: " << passed << " PASSED, " << failed << " FAILED (TOTAL: " << tests_.size() << ")\n";
        std::cout << "=========================================================\n";
        return failed == 0 ? 0 : 1;
    }

private:
    std::vector<TestCase> tests_;
};

#define EQSB_TEST(TestName) \
    bool TestName##_run(); \
    struct TestName##_Register { \
        TestName##_Register() { \
            ::eqsb::test::TestRegistry::instance().addTest(#TestName, TestName##_run); \
        } \
    } TestName##_reg; \
    bool TestName##_run()

inline bool assertNear(float a, float b, float tolerance, const std::string& msg = "") {
    if (std::abs(a - b) > tolerance) {
        std::cerr << "\nAssertion Failed: " << a << " != " << b << " (diff=" << std::abs(a - b)
                  << ", tol=" << tolerance << ") " << msg << std::endl;
        return false;
    }
    return true;
}

inline bool assertTrue(bool condition, const std::string& msg = "") {
    if (!condition) {
        std::cerr << "\nAssertion Failed: condition is false! " << msg << std::endl;
        return false;
    }
    return true;
}

// Generate pure sine wave into buffer
inline void generateSine(float* buffer, int frames, int channels, float freqHz, float sampleRate, float amp = 1.0f) {
    float phase = 0.0f;
    float phaseInc = (6.283185307f * freqHz) / sampleRate;
    for (int i = 0; i < frames; ++i) {
        float val = std::sin(phase) * amp;
        phase += phaseInc;
        if (phase >= 6.283185307f) phase -= 6.283185307f;
        for (int ch = 0; ch < channels; ++ch) {
            buffer[i * channels + ch] = val;
        }
    }
}

// Calculate RMS of a buffer
inline float calculateRms(const float* buffer, int frames, int channels, int channel = 0) {
    double sum = 0.0;
    int count = 0;
    for (int i = 0; i < frames; ++i) {
        float s = buffer[i * channels + channel];
        sum += s * s;
        count++;
    }
    if (count == 0) return 0.0f;
    return static_cast<float>(std::sqrt(sum / count));
}

// Calculate Peak of a buffer
inline float calculatePeak(const float* buffer, int frames, int channels) {
    float peak = 0.0f;
    int total = frames * channels;
    for (int i = 0; i < total; ++i) {
        float a = std::abs(buffer[i]);
        if (a > peak) peak = a;
    }
    return peak;
}

} // namespace test
} // namespace eqsb

#endif // EQSB_TEST_FRAMEWORK_H
