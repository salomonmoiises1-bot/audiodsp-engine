#include "EQsbNativeDspJni.h"
#include "../EQsbDspEngine.h"
#include "../backends/OboeBackend.h"
#include <string>
#include <vector>
#include <mutex>
#include <memory>
#include <sstream>

using namespace eqsb;

struct NativeContext {
    EQsbDspEngine engine;
    backends::OboeBackend oboe;
};

static inline NativeContext* getContext(jlong handle) {
    return reinterpret_cast<NativeContext*>(handle);
}
static inline EQsbDspEngine* getEngine(jlong handle) {
    auto* ctx = getContext(handle);
    return ctx ? &ctx->engine : nullptr;
}
#define EQSB_LOCK_ENGINE(engine) std::lock_guard<std::mutex> eqsbEngineLock((engine)->configMutex())

extern "C" {

JNIEXPORT jlong JNICALL Java_com_eqsb_jni_EQsbNativeDsp_createEngine(JNIEnv* /*env*/, jclass /*clazz*/) {
    auto* ctx = new NativeContext();
    ctx->oboe.setDspEngine(&ctx->engine);
    return reinterpret_cast<jlong>(ctx);
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_destroyEngine(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle) {
    auto* ctx = getContext(handle);
    if (ctx) { ctx->oboe.stop(); delete ctx; }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_initialize(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                 jint sampleRate, jint channelCount, jint framesPerBlock) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->initialize(sampleRate, channelCount, framesPerBlock);
    }
}

JNIEXPORT jboolean JNICALL Java_com_eqsb_jni_EQsbNativeDsp_startOboe(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle) {
    auto* ctx = getContext(handle);
    if (!ctx) return JNI_FALSE;
    ctx->oboe.setSampleRate(ctx->engine.getSampleRate());
    ctx->oboe.setChannelCount(ctx->engine.getChannelCount());
    ctx->oboe.setFramesPerCallback(ctx->engine.getFramesPerBlock());
    return ctx->oboe.start() ? JNI_TRUE : JNI_FALSE;
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_stopOboe(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle) {
    auto* ctx = getContext(handle);
    if (ctx) ctx->oboe.stop();
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_reset(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->reset();
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_process(JNIEnv* env, jclass /*clazz*/, jlong handle,
                                                              jfloatArray inBuffer, jint frames) {
    auto* engine = getEngine(handle);
    if (!engine || !inBuffer || frames <= 0) return;

#ifdef EQSB_HAS_SYSTEM_JNI
    jfloat* pcm = env->GetFloatArrayElements(inBuffer, nullptr);
    if (pcm) {
        engine->process(pcm, frames);
        env->ReleaseFloatArrayElements(inBuffer, pcm, 0);
    }
#else
    (void)env;
#endif
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_processDirect(JNIEnv* env, jclass /*clazz*/, jlong handle,
                                                                    jobject byteBuffer, jint frames) {
    auto* engine = getEngine(handle);
    if (!engine || !byteBuffer || frames <= 0) return;

#ifdef EQSB_HAS_SYSTEM_JNI
    float* pcm = static_cast<float*>(env->GetDirectBufferAddress(byteBuffer));
    if (pcm) {
        engine->process(pcm, frames);
    }
#else
    (void)env;
#endif
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setPreGain(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jfloat gainDb) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getPreGain().setGainDb(gainDb);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBassBoost(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                   jboolean enabled, jfloat strength) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getBassBoost().setEnabled(enabled);
        engine->getBassBoost().setStrength(strength);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setTone(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                              jboolean enabled, jfloat bassDb, jfloat midDb, jfloat trebleDb) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getToneControl().setEnabled(enabled);
        engine->getToneControl().setBassDb(bassDb);
        engine->getToneControl().setMidDb(midDb);
        engine->getToneControl().setTrebleDb(trebleDb);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setEQ32Enabled(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jboolean enabled) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getEQ32().setEnabled(enabled);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBandGain(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                  jint bandIndex, jfloat gainDb) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getEQ32().setBandGain(bandIndex, gainDb);
    }
}

JNIEXPORT jfloat JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getBandGain(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jint bandIndex) {
    auto* engine = getEngine(handle);
    if (engine) {
        return engine->getEQ32().getBandGain(bandIndex);
    }
    return 0.0f;
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setAllBandGains(JNIEnv* env, jclass /*clazz*/, jlong handle, jfloatArray gains) {
    auto* engine = getEngine(handle);
    if (!engine || !gains) return;

#ifdef EQSB_HAS_SYSTEM_JNI
    jsize len = env->GetArrayLength(gains);
    jfloat* p = env->GetFloatArrayElements(gains, nullptr);
    if (p) {
        engine->getEQ32().setAllBandGains(p, len);
        env->ReleaseFloatArrayElements(gains, p, JNI_ABORT);
    }
#else
    (void)env;
#endif
}

JNIEXPORT jfloatArray JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getAllBandGains(JNIEnv* env, jclass /*clazz*/, jlong handle) {
#ifdef EQSB_HAS_SYSTEM_JNI
    auto* engine = getEngine(handle);
    jfloatArray result = env->NewFloatArray(eq::NUM_EQ32_BANDS);
    if (engine && result) {
        float gains[eq::NUM_EQ32_BANDS];
        engine->getEQ32().getAllBandGains(gains, eq::NUM_EQ32_BANDS);
        env->SetFloatArrayRegion(result, 0, eq::NUM_EQ32_BANDS, gains);
    }
    return result;
#else
    (void)env;
    (void)handle;
    return nullptr;
#endif
}

JNIEXPORT jfloat JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getCenterFrequency(JNIEnv* /*env*/, jclass /*clazz*/, jint bandIndex) {
    return eq::EQ32::getCenterFrequency(bandIndex);
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setMdrcEnabled(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jboolean enabled) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getMDRC().setEnabled(enabled);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setMdrcBand(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                  jint bandIndex, jfloat threshDb, jfloat ratio,
                                                                  jfloat attackMs, jfloat releaseMs, jfloat makeupDb) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        dynamics::BandCompressorConfig cfg;
        cfg.thresholdDb = threshDb;
        cfg.ratio = ratio;
        cfg.attackMs = attackMs;
        cfg.releaseMs = releaseMs;
        cfg.makeupGainDb = makeupDb;
        engine->getMDRC().setBandConfig(static_cast<dynamics::MDRC::BandIndex>(bandIndex), cfg);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setAutoGain(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                  jboolean enabled, jfloat targetDb, jfloat maxGainDb, jfloat minGainDb) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getAutoGain().setEnabled(enabled);
        engine->getAutoGain().setTargetDb(targetDb);
        engine->getAutoGain().setMaxGainDb(maxGainDb);
        engine->getAutoGain().setMinGainDb(minGainDb);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setLimiter(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                 jboolean enabled, jfloat ceilingDb, jfloat releaseMs) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getLimiter().setEnabled(enabled);
        engine->getLimiter().setCeilingDb(ceilingDb);
        engine->getLimiter().setReleaseMs(releaseMs);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setSpatial(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle,
                                                                 jboolean enabled, jfloat width) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getSpatial().setEnabled(enabled);
        engine->getSpatial().setWidth(width);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setMasterGain(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jfloat gainDb) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getMasterGain().setGainDb(gainDb);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBalance(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jfloat balance) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->getBalance().setBalance(balance);
    }
}

JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBypass(JNIEnv* /*env*/, jclass /*clazz*/, jlong handle, jboolean bypass) {
    auto* engine = getEngine(handle);
    if (engine) {
        EQSB_LOCK_ENGINE(engine);
        engine->setBypass(bypass);
    }
}

JNIEXPORT jstring JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getTechnicalAuditReport(JNIEnv* env, jclass /*clazz*/) {
#ifdef EQSB_HAS_SYSTEM_JNI
    std::string report = "EQsb native DSP core: AudioEffect integration is provided by platform/eqsb_effect; this APK JNI library does not intercept external audio by itself.";
    return env->NewStringUTF(report.c_str());
#else
    (void)env;
    return nullptr;
#endif
}

#undef EQSB_LOCK_ENGINE

} // extern "C"
