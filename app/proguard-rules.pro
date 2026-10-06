# Preserve JNI entry points for EQsb DSP Core
-keepclasseswithmembernames class * {
    native <methods>;
}

-keep class com.eqsb.jni.** { *; }
-keep class com.eqsb.core.** { *; }
