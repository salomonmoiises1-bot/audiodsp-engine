#ifndef EQSB_JNI_COMPAT_H
#define EQSB_JNI_COMPAT_H

#if defined(__has_include)
  #if __has_include(<jni.h>)
    #include <jni.h>
    #define EQSB_HAS_SYSTEM_JNI 1
  #endif
#endif

#ifndef EQSB_HAS_SYSTEM_JNI
#include <cstdint>
#include <cstddef>

#define JNIEXPORT
#define JNICALL

typedef uint8_t  jboolean;
typedef int8_t   jbyte;
typedef uint16_t jchar;
typedef int16_t  jshort;
typedef int32_t  jint;
typedef int64_t  jlong;
typedef float    jfloat;
typedef double   jdouble;
typedef jint     jsize;

typedef void* jobject;
typedef jobject jclass;
typedef jobject jstring;
typedef jobject jarray;
typedef jobject jfloatArray;

#define JNI_FALSE 0
#define JNI_TRUE 1

struct JNINativeInterface_;
typedef const struct JNINativeInterface_* JNIEnv;

struct JNINativeInterface_ {
    void* reserved0;
    void* reserved1;
    void* reserved2;
    void* reserved3;

    jfloat* (*GetFloatArrayElements)(JNIEnv*, jfloatArray, jboolean*);
    void    (*ReleaseFloatArrayElements)(JNIEnv*, jfloatArray, jfloat*, jint);
    jsize   (*GetArrayLength)(JNIEnv*, jarray);
    jfloatArray (*NewFloatArray)(JNIEnv*, jsize);
    void    (*SetFloatArrayRegion)(JNIEnv*, jfloatArray, jsize, jsize, const jfloat*);
    void*   (*GetDirectBufferAddress)(JNIEnv*, jobject);
    jstring (*NewStringUTF)(JNIEnv*, const char*);
};
#endif

#endif // EQSB_JNI_COMPAT_H
