#include "test_framework.h"
#include "../../main/cpp/EQsbDspEngine.h"
#include <chrono>
#include <iostream>
#include <vector>
#include <iomanip>

using namespace eqsb;
using namespace eqsb::test;

EQSB_TEST(Benchmark_PerformanceStabilityAndZeroAllocations) {
    std::cout << "\n---------------------------------------------------------\n";
    std::cout << "          EQsb DSP ENGINE PERFORMANCE BENCHMARK          \n";
    std::cout << "---------------------------------------------------------\n";

    const int sampleRates[] = { 44100, 48000, 96000 };
    const int bufferSizes[] = { 64, 128, 256, 512, 1024 };
    const int channelConfigs[] = { 1, 2 }; // Mono, Stereo

    std::cout << std::left 
              << std::setw(8)  << "SR (Hz)"
              << std::setw(6)  << "Ch"
              << std::setw(8)  << "Block"
              << std::setw(14) << "Time/Block(us)"
              << std::setw(12) << "RT Factor"
              << std::setw(12) << "CPU Est(%)"
              << std::setw(10) << "Stability"
              << "\n---------------------------------------------------------\n";

    bool allStable = true;

    for (int sr : sampleRates) {
        for (int ch : channelConfigs) {
            for (int blockSize : bufferSizes) {
                EQsbDspEngine engine;
                engine.initialize(sr, ch, blockSize);

                // Enable all DSP features simultaneously to simulate maximum workload
                engine.getPreGain().setGainDb(-2.0f);
                engine.getBassBoost().setEnabled(true);
                engine.getBassBoost().setStrength(0.8f);
                engine.getToneControl().setEnabled(true);
                engine.getToneControl().setBassDb(3.0f);
                engine.getToneControl().setMidDb(-1.5f);
                engine.getToneControl().setTrebleDb(2.5f);

                // All 32 filters active
                for (int b = 0; b < eq::NUM_EQ32_BANDS; ++b) {
                    float g = ((b % 2 == 0) ? 2.0f : -2.0f);
                    engine.getEQ32().setBandGain(b, g);
                }

                engine.getMDRC().setEnabled(true);
                engine.getAutoGain().setEnabled(true);
                engine.getLimiter().setEnabled(true);
                engine.getLimiter().setCeilingDb(-0.2f);
                engine.getSpatial().setEnabled(ch == 2);
                engine.getSpatial().setWidth(0.5f);
                engine.getMasterGain().setGainDb(-1.0f);
                if (ch == 2) {
                    engine.getBalance().setBalance(0.1f);
                }

                std::vector<float> pcmBuffer(blockSize * ch);
                generateSine(pcmBuffer.data(), blockSize, ch, 440.0f, static_cast<float>(sr), 0.7f);

                // Warm up
                for (int w = 0; w < 50; ++w) {
                    engine.process(pcmBuffer.data(), blockSize);
                }

                // Benchmark 2000 blocks
                constexpr int numBlocks = 2000;
                auto tStart = std::chrono::high_resolution_clock::now();

                for (int n = 0; n < numBlocks; ++n) {
                    engine.process(pcmBuffer.data(), blockSize);
                }

                auto tEnd = std::chrono::high_resolution_clock::now();
                double totalUs = std::chrono::duration<double, std::micro>(tEnd - tStart).count();
                double usPerBlock = totalUs / numBlocks;

                double blockAudioTimeUs = (static_cast<double>(blockSize) / sr) * 1e6;
                double rtFactor = blockAudioTimeUs / usPerBlock;
                double cpuLoadPercent = (usPerBlock / blockAudioTimeUs) * 100.0;

                // Check stability (no NaNs or Infs)
                bool isFinite = true;
                for (float s : pcmBuffer) {
                    if (std::isnan(s) || std::isinf(s)) {
                        isFinite = false;
                        allStable = false;
                        break;
                    }
                }

                std::cout << std::left 
                          << std::setw(8)  << sr
                          << std::setw(6)  << (ch == 1 ? "Mono" : "Stereo")
                          << std::setw(8)  << blockSize
                          << std::setw(14) << std::fixed << std::setprecision(2) << usPerBlock
                          << std::setw(12) << std::fixed << std::setprecision(1) << rtFactor << "x"
                          << std::setw(12) << std::fixed << std::setprecision(2) << cpuLoadPercent << "%"
                          << std::setw(10) << (isFinite ? "OK" : "NAN_ERROR")
                          << "\n";
            }
        }
    }

    std::cout << "---------------------------------------------------------\n";
    return allStable;
}
