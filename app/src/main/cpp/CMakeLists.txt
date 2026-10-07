cmake_minimum_required(VERSION 3.22.1)
project(eqsb_native_dsp VERSION 1.0.0 LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
if(MSVC)
    add_compile_options(/O2 /fp:fast)
else()
    add_compile_options(-O3 -ffast-math -Wall -Wextra -Wno-unused-parameter)
endif()

set(EQSB_DSP_CORE_SOURCES
    EQsbDspEngine.cpp
    dsp/BiquadFilter.cpp
    eq/EQ32.cpp
    dynamics/MDRC.cpp
    dynamics/AutoGain.cpp
    dynamics/Limiter.cpp
    effects/BassBoost.cpp
    effects/ToneControl.cpp
    effects/SpatialVirtualizer.cpp
)

add_library(eqsb_dsp_core STATIC ${EQSB_DSP_CORE_SOURCES})
target_include_directories(eqsb_dsp_core PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/dsp
    ${CMAKE_CURRENT_SOURCE_DIR}/eq
    ${CMAKE_CURRENT_SOURCE_DIR}/dynamics
    ${CMAKE_CURRENT_SOURCE_DIR}/effects
)

add_library(eqsb_dsp SHARED
    jni/EQsbNativeDspJni.cpp
    backends/OboeBackend.cpp
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
target_link_libraries(eqsb_dsp PRIVATE eqsb_dsp_core)

if(ANDROID)
    find_library(log-lib log)
    find_package(oboe REQUIRED CONFIG)
    target_link_libraries(eqsb_dsp PRIVATE ${log-lib} oboe::oboe)
endif()

add_library(eqsb_dsp_static ALIAS eqsb_dsp_core)
