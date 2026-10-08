#include "MDRC.h"
#include <cmath>
#include <algorithm>

namespace eqsb {
namespace dynamics {

MDRC::MDRC() {
    // Standard multiband compressor defaults
    configs_[BAND_LOW]  = {-16.0f, 3.0f, 20.0f, 120.0f, 0.0f};
    configs_[BAND_MID]  = {-18.0f, 2.5f, 15.0f, 80.0f,  0.0f};
    configs_[BAND_HIGH] = {-20.0f, 3.5f, 10.0f, 60.0f,  0.0f};

    initialize(48000.0f, 2);
}

void MDRC::initialize(float sampleRate, int channelCount) {
    sampleRate_ = (sampleRate > 0.0f) ? sampleRate : 48000.0f;
    channelCount_ = std::min(channelCount, 2);

    for (int b = 0; b < NUM_BANDS; ++b) {
        updateTimeConstants(static_cast<BandIndex>(b));
        lastGainReductionDb_[b] = 0.0f;
    }

    updateCrossoverFilters();
    reset();
}

void MDRC::reset() {
    for (int ch = 0; ch < 2; ++ch) {
        for (int b = 0; b < NUM_BANDS; ++b) {
            envelopes_[ch][b] = 0.0f;
        }
        lowPass1_[ch].reset();
        midHighPass_[ch].reset();
        midLowPass_[ch].reset();
        highPass1_[ch].reset();
    }
}

void MDRC::setBandConfig(BandIndex band, const BandCompressorConfig& config) {
    if (band < 0 || band >= NUM_BANDS) return;
    configs_[band] = config;
    updateTimeConstants(band);
}

BandCompressorConfig MDRC::getBandConfig(BandIndex band) const {
    if (band < 0 || band >= NUM_BANDS) return {};
    return configs_[band];
}

void MDRC::setCrossoverFrequencies(float lowMidHz, float midHighHz) {
    lowMidFreq_ = dsp::clamp(lowMidHz, 40.0f, 1000.0f);
    midHighFreq_ = dsp::clamp(midHighHz, 1200.0f, 12000.0f);
    updateCrossoverFilters();
}

void MDRC::updateTimeConstants(BandIndex band) {
    float attSec = std::max(0.0005f, configs_[band].attackMs * 0.001f);
    float relSec = std::max(0.005f, configs_[band].releaseMs * 0.001f);

    // alpha = exp(-1.0 / (time * sampleRate))
    attackCoeffs_[band] = std::exp(-1.0f / (attSec * sampleRate_));
    releaseCoeffs_[band] = std::exp(-1.0f / (relSec * sampleRate_));
}

void MDRC::updateCrossoverFilters() {
    constexpr float BUTTERWORTH_Q = 0.70710678f;
    for (int ch = 0; ch < 2; ++ch) {
        lowPass1_[ch].configure(dsp::FilterType::LOW_PASS, lowMidFreq_, sampleRate_, 0.0f, BUTTERWORTH_Q);
        midHighPass_[ch].configure(dsp::FilterType::HIGH_PASS, lowMidFreq_, sampleRate_, 0.0f, BUTTERWORTH_Q);
        midLowPass_[ch].configure(dsp::FilterType::LOW_PASS, midHighFreq_, sampleRate_, 0.0f, BUTTERWORTH_Q);
        highPass1_[ch].configure(dsp::FilterType::HIGH_PASS, midHighFreq_, sampleRate_, 0.0f, BUTTERWORTH_Q);
    }
}

void MDRC::process(float* buffer, int frames, int channels) {
    if (!enabled_) return;

    int activeChannels = std::min(channels, 2);

    for (int f = 0; f < frames; ++f) {
        int offset = f * channels;
        for (int ch = 0; ch < activeChannels; ++ch) {
            float inSample = buffer[offset + ch];

            // 1. Crossover split
            float lowSample = lowPass1_[ch].processSample(inSample);
            float midSample = midLowPass_[ch].processSample(midHighPass_[ch].processSample(inSample));
            float highSample = highPass1_[ch].processSample(inSample);

            float bandSamples[NUM_BANDS] = { lowSample, midSample, highSample };
            float outRecombined = 0.0f;

            // 2. Compress each band
            for (int b = 0; b < NUM_BANDS; ++b) {
                float absVal = std::abs(bandSamples[b]);

                // Envelope follower
                float env = envelopes_[ch][b];
                float coeff = (absVal > env) ? attackCoeffs_[b] : releaseCoeffs_[b];
                env = coeff * env + (1.0f - coeff) * absVal;
                envelopes_[ch][b] = env;

                // Level in dB
                float envDb = dsp::linearToDb(env);
                float grDb = 0.0f;

                const auto& cfg = configs_[b];
                if (envDb > cfg.thresholdDb) {
                    float overshoot = envDb - cfg.thresholdDb;
                    float ratio = std::max(1.0f, cfg.ratio);
                    grDb = overshoot * (1.0f - 1.0f / ratio);
                }

                if (ch == 0) {
                    lastGainReductionDb_[b] = grDb;
                }

                // Apply makeup gain minus compression gain reduction
                float totalBandGainDb = cfg.makeupGainDb - grDb;
                float bandGainLin = dsp::dbToLinear(totalBandGainDb);

                outRecombined += bandSamples[b] * bandGainLin;
            }

            buffer[offset + ch] = dsp::sanitize(outRecombined);
        }
    }
}

} // namespace dynamics
} // namespace eqsb
