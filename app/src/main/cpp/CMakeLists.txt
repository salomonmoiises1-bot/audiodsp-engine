cmake_minimum_required(VERSION 3.22.1)

project(eqsb_native_dsp VERSION 1.0.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Optimization flags for real-time audio DSP
if(MSVC)
    add_compile_options(/O2 /fp:fast)
else()
    add_compile_options(-O3 -ffast-math -Wall -Wextra -Wno-unused-parameter)
endif()

# Core DSP and Engine Source Files
set(EQSB_CORE_SOURCES
    EQsbDspEngine.cpp
    dsp/BiquadFilter.cpp
    eq/EQ32.cpp
    dynamics/MDRC.cpp
    dynamics/AutoGain.cpp
    dynamics/Limiter.cpp
    effects/BassBoost.cpp
    effects/ToneControl.cpp
    effects/SpatialVirtualizer.cpp
    backends/OboeBackend.cpp
    backends/AudioEffectBackend.cpp
)

# 1. Static DSP Library (for unit tests, benchmarks, and embedding)
add_library(eqsb_dsp_static STATIC
    ${EQSB_CORE_SOURCES}
)

target_include_directories(eqsb_dsp_static PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/eq
    ${CMAKE_CURRENT_SOURCE_DIR}/dynamics
    ${CMAKE_CURRENT_SOURCE_DIR}/effects
    ${CMAKE_CURRENT_SOURCE_DIR}/backends
)

# 2. Shared JNI Library for Android: libeqsb_dsp.so
add_library(eqsb_dsp SHARED
    ${EQSB_CORE_SOURCES}
    jni/EQsbNativeDspJni.cpp
)

target_include_directories(eqsb_dsp PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/eq
    ${CMAKE_CURRENT_SOURCE_DIR}/dynamics
    ${CMAKE_CURRENT_SOURCE_DIR}/effects
    ${CMAKE_CURRENT_SOURCE_DIR}/backends
    ${CMAKE_CURRENT_SOURCE_DIR}/jni
)

# Link Android system libraries when targeting Android
if(ANDROID)
    find_library(log-lib log)
    find_package(oboe REQUIRED CONFIG)
    target_link_libraries(eqsb_dsp PRIVATE ${log-lib} oboe::oboe)
endif()
