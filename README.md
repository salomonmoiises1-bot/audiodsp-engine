# EQsb — Native C++ Audio DSP Engine for Android

[![Build Status](https://img.shields.io/badge/Build-Passed-brightgreen.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Android%2024%2B-blue.svg)]()
[![Language](https://img.shields.io/badge/Core-C%2B%2B17%20%2F%20Kotlin-orange.svg)]()
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg)]()

**EQsb** es un sistema de procesamiento de audio digital (DSP) nativo de alto rendimiento para Android, construido desde cero con un núcleo en **C++17**, conectado mediante **JNI** y gestionado por una interfaz moderna en **Jetpack Compose**.

El motor opera sobre **muestras reales de PCM en coma flotante (IEEE 32-bit Float)** y garantiza **0 asignaciones de memoria dinámica** dentro del bucle de procesamiento de audio.

---

## 1. Cadena de Procesamiento DSP (Orden Estricto)

```
PCM Entrada
   │
   ▼
[1] Pre-Gain (-24 dB a +24 dB)
   │
   ▼
[2] Bass Boost (80 Hz Low-Shelf RBJ)
   │
   ▼
[3] Tone Control (Bass 200 Hz, Mid 1 kHz, Treble 5 kHz)
   │
   ▼
[4] EQ32 (32 Filtros Biquad Reales RBJ en Serie)
   │
   ▼
[5] MDRC (Compresor Dinámico Multibanda de 3 Vías con Crossover)
   │
   ▼
[6] AutoGain (Control Automático de Ganancia por Detección RMS)
   │
   ▼
[7] Limiter (Limitador de Picos Brickwall con Techo Infranqueable)
   │
   ▼
[8] Spatial / Virtualizer (Expansión de Campo Estéreo Mid/Side)
   │
   ▼
[9] Master Gain (-48 dB a +12 dB)
   │
   ▼
[10] Balance (Atenuación Estéreo Izquierda/Derecha)
   │
   ▼
PCM Procesado Salida
```

---

## 2. Frecuencias Normalizadas ISO de EQ32 (32 Bandas)

Cada una de las 32 bandas cuenta con una instancia independiente de filtro biquad por canal:

| Banda | Frecuencia | Tipo | Q |
|---|---|---|---|
| 0 | 20 Hz | Peaking EQ | 4.318 |
| 1 | 25 Hz | Peaking EQ | 4.318 |
| 2 | 31.5 Hz | Peaking EQ | 4.318 |
| 3 | 40 Hz | Peaking EQ | 4.318 |
| 4 | 50 Hz | Peaking EQ | 4.318 |
| 5 | 63 Hz | Peaking EQ | 4.318 |
| 6 | 80 Hz | Peaking EQ | 4.318 |
| 7 | 100 Hz | Peaking EQ | 4.318 |
| 8 | 125 Hz | Peaking EQ | 4.318 |
| 9 | 160 Hz | Peaking EQ | 4.318 |
| 10 | 200 Hz | Peaking EQ | 4.318 |
| 11 | 250 Hz | Peaking EQ | 4.318 |
| 12 | 315 Hz | Peaking EQ | 4.318 |
| 13 | 400 Hz | Peaking EQ | 4.318 |
| 14 | 500 Hz | Peaking EQ | 4.318 |
| 15 | 630 Hz | Peaking EQ | 4.318 |
| 16 | 800 Hz | Peaking EQ | 4.318 |
| 17 | 1.0 kHz | Peaking EQ | 4.318 |
| 18 | 1.25 kHz | Peaking EQ | 4.318 |
| 19 | 1.6 kHz | Peaking EQ | 4.318 |
| 20 | 2.0 kHz | Peaking EQ | 4.318 |
| 21 | 2.5 kHz | Peaking EQ | 4.318 |
| 22 | 3.15 kHz | Peaking EQ | 4.318 |
| 23 | 4.0 kHz | Peaking EQ | 4.318 |
| 24 | 5.0 kHz | Peaking EQ | 4.318 |
| 25 | 6.3 kHz | Peaking EQ | 4.318 |
| 26 | 8.0 kHz | Peaking EQ | 4.318 |
| 27 | 10.0 kHz | Peaking EQ | 4.318 |
| 28 | 12.5 kHz | Peaking EQ | 4.318 |
| 29 | 16.0 kHz | Peaking EQ | 4.318 |
| 30 | 18.0 kHz | Peaking EQ | 4.318 |
| 31 | 20.0 kHz | Peaking EQ | 4.318 |

---

## 3. Backends de Audio

- **OboeBackend:** Para flujos de audio de baja latencia gestionados y reproducidos directamente por EQsb.
- **AudioEffectBackend:** Para enlazar con sesiones multimedia broadcast por reproductores compatibles.
- **Auditoría Técnica:** Para detalles sobre las restricciones de AudioFlinger y Session 0 en Android 9+, consultar `TECHNICAL_AUDIT.md`.

---

## 4. Compilación y Ejecución de Tests Nativos

```bash
# Compilar y ejecutar suite de 19 tests DSP automatizados y benchmarks
cd app/src/test/cpp
mkdir -p build && cd build
cmake ..
make -j$(nproc)
./eqsb_native_tests
```

## Toolchain de construcción

- Gradle 8.9
- Android Gradle Plugin 8.7.3
- Kotlin 1.9.25
- JDK 17
- NDK 26.1.10909125
- CMake 3.22.1

El wrapper incluido arranca Gradle 8.9 de forma autocontenida cuando la distribución todavía no está descargada.
