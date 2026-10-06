cmake_minimum_required(VERSION 3.22.1)

project(eqsb_native_tests VERSION 1.0.0 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(MSVC)
    add_compile_options(/O2 /fp:fast)
else()
    add_compile_options(-O3 -ffast-math -Wall -Wextra -Wno-unused-parameter)
endif()

set(EQSB_CPP_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../../main/cpp")

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${EQSB_CPP_DIR}
    ${EQSB_CPP_DIR}/dsp
    ${EQSB_CPP_DIR}/eq
    ${EQSB_CPP_DIR}/dynamics
    ${EQSB_CPP_DIR}/effects
    ${EQSB_CPP_DIR}/backends
    ${EQSB_CPP_DIR}/jni
)

set(TEST_SOURCES
    test_main.cpp
    test_eq32.cpp
    test_dynamics.cpp
    test_tone_effects.cpp
    test_gain_balance.cpp
    test_integration.cpp
    test_benchmark.cpp
    ${EQSB_CPP_DIR}/EQsbDspEngine.cpp
    ${EQSB_CPP_DIR}/dsp/BiquadFilter.cpp
    ${EQSB_CPP_DIR}/eq/EQ32.cpp
    ${EQSB_CPP_DIR}/dynamics/MDRC.cpp
    ${EQSB_CPP_DIR}/dynamics/AutoGain.cpp
    ${EQSB_CPP_DIR}/dynamics/Limiter.cpp
    ${EQSB_CPP_DIR}/effects/BassBoost.cpp
    ${EQSB_CPP_DIR}/effects/ToneControl.cpp
    ${EQSB_CPP_DIR}/effects/SpatialVirtualizer.cpp
    ${EQSB_CPP_DIR}/backends/OboeBackend.cpp
    ${EQSB_CPP_DIR}/backends/AudioEffectBackend.cpp
)

add_executable(eqsb_native_tests ${TEST_SOURCES})
