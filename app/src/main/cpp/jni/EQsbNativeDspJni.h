#ifndef EQSB_NATIVE_DSP_JNI_H
#define EQSB_NATIVE_DSP_JNI_H

#include "jni_compat.h"

#ifdef __cplusplus
extern "C" {
#endif

// Engine lifecycle
JNIEXPORT jlong JNICALL Java_com_eqsb_jni_EQsbNativeDsp_createEngine(JNIEnv* env, jclass clazz);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_destroyEngine(JNIEnv* env, jclass clazz, jlong handle);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_initialize(JNIEnv* env, jclass clazz, jlong handle, jint sampleRate, jint channelCount, jint framesPerBlock);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_reset(JNIEnv* env, jclass clazz, jlong handle);

// Real PCM processing
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_process(JNIEnv* env, jclass clazz, jlong handle, jfloatArray inBuffer, jint frames);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_processDirect(JNIEnv* env, jclass clazz, jlong handle, jobject byteBuffer, jint frames);

// Pre-Gain
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setPreGain(JNIEnv* env, jclass clazz, jlong handle, jfloat gainDb);

// Bass Boost
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBassBoost(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled, jfloat strength);

// Tone Control
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setTone(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled, jfloat bassDb, jfloat midDb, jfloat trebleDb);

// EQ32
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setEQ32Enabled(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBandGain(JNIEnv* env, jclass clazz, jlong handle, jint bandIndex, jfloat gainDb);
JNIEXPORT jfloat JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getBandGain(JNIEnv* env, jclass clazz, jlong handle, jint bandIndex);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setAllBandGains(JNIEnv* env, jclass clazz, jlong handle, jfloatArray gains);
JNIEXPORT jfloatArray JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getAllBandGains(JNIEnv* env, jclass clazz, jlong handle);
JNIEXPORT jfloat JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getCenterFrequency(JNIEnv* env, jclass clazz, jint bandIndex);

// MDRC
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setMdrcEnabled(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setMdrcBand(JNIEnv* env, jclass clazz, jlong handle, jint bandIndex, jfloat threshDb, jfloat ratio, jfloat attackMs, jfloat releaseMs, jfloat makeupDb);

// AutoGain
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setAutoGain(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled, jfloat targetDb, jfloat maxGainDb, jfloat minGainDb);

// Limiter
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setLimiter(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled, jfloat ceilingDb, jfloat releaseMs);

// Spatial Virtualizer
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setSpatial(JNIEnv* env, jclass clazz, jlong handle, jboolean enabled, jfloat width);

// Master Gain & Balance
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setMasterGain(JNIEnv* env, jclass clazz, jlong handle, jfloat gainDb);
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBalance(JNIEnv* env, jclass clazz, jlong handle, jfloat balance);

// Global bypass
JNIEXPORT void JNICALL Java_com_eqsb_jni_EQsbNativeDsp_setBypass(JNIEnv* env, jclass clazz, jlong handle, jboolean bypass);

// Technical Audit
JNIEXPORT jstring JNICALL Java_com_eqsb_jni_EQsbNativeDsp_getTechnicalAuditReport(JNIEnv* env, jclass clazz);

#ifdef __cplusplus
}
#endif

#endif // EQSB_NATIVE_DSP_JNI_H
