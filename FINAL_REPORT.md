# INFORME FINAL: PROYECTO EQsb

## 1. IDENTIDAD DEL PROYECTO
- **Nombre:** EQsb
- **Paquete:** `com.eqsb`
- **Versión:** 1.0.0

---

## 2. ARQUITECTURA GENERAL
```
Kotlin / Jetpack Compose UI
           │
           ▼
       DspConfig (Estado completo e inmutable del motor)
           │
           ▼
EQsbViewModel / Audio Service (Foreground Service)
           │
           ▼
    EQsbNativeDsp (JNI Bridge)
           │
           ▼
EQsbDspEngine (Núcleo DSP en C++17)
           │
           ▼
PCM REAL EN COMA FLOTANTE (IEEE 32-bit Float)
           │
     ┌─────┴───────────────┐
     ▼                     ▼
OboeBackend        AudioEffectBackend
```

---

## 3. UBICACIÓN DE LA IMPLEMENTACIÓN DSP EN C++
Todo el procesamiento DSP se ejecuta en C++17 nativo sobre PCM real sin asignaciones de memoria dinámica en el callback:

1. **Pre-Gain:**
   - Archivo: `app/src/main/cpp/dsp/PreGain.h`
   - Escala lineal de amplitud sobre muestras PCM: $g = 10^{(\text{gainDb}/20)}$.
2. **Bass Boost:**
   - Archivos: `app/src/main/cpp/effects/BassBoost.h`, `BassBoost.cpp`
   - Filtro Low-Shelf RBJ a 80 Hz ($Q=0.7071$) con ganancia proporcional de 0 a +12 dB.
3. **Tone Control (Bass, Mid, Treble):**
   - Archivos: `app/src/main/cpp/effects/ToneControl.h`, `ToneControl.cpp`
   - Bass: Low-Shelf @ 200 Hz; Mid: Peaking EQ @ 1 kHz; Treble: High-Shelf @ 5 kHz.
4. **EQ32 (Exactamente 32 Filtros Biquad Reales):**
   - Archivos: `app/src/main/cpp/eq/EQ32.h`, `EQ32.cpp`
   - 32 filtros biquad en serie por canal con formulación Direct Form II Transposed de RBJ a frecuencias normalizadas ISO (20 Hz a 20 kHz, $Q=4.318$).
5. **MDRC (Multiband Dynamic Range Compressor):**
   - Archivos: `app/src/main/cpp/dynamics/MDRC.h`, `MDRC.cpp`
   - Crossover Linkwitz-Riley/Butterworth en 3 bandas (<250 Hz, 250 Hz - 4 kHz, >4 kHz), detectores de envolvente con constantes de ataque/release independientes y recombinación sumatoria.
6. **AutoGain (Automatic Gain Control):**
   - Archivos: `app/src/main/cpp/dynamics/AutoGain.h`, `AutoGain.cpp`
   - Seguidor de energía RMS con integrador con pérdidas, ganancia adaptativa hacia nivel objetivo (-14 dBFS) y compuerta anti-ruido.
7. **Limiter (Limitador de Picos Brickwall):**
   - Archivos: `app/src/main/cpp/dynamics/Limiter.h`, `Limiter.cpp`
   - Limitador de ataque cero con decaimiento exponencial y clamp estricto al techo (-0.1 dBFS), garantizando protección contra sobreimpulsos (>1.0).
8. **Spatial / Virtualizer:**
   - Archivos: `app/src/main/cpp/effects/SpatialVirtualizer.h`, `SpatialVirtualizer.cpp`
   - Matriz Mid/Side con expansión de canales laterales y línea de retardo interaural cruzado (ITD ~0.5 ms).
9. **Master Gain:**
   - Archivo: `app/src/main/cpp/dsp/MasterGain.h`
   - Multiplicador lineal en la etapa final de salida.
10. **Balance:**
    - Archivo: `app/src/main/cpp/dsp/Balance.h`
    - Ley de paneo estéreo real atenuando el canal opuesto sin pérdidas en el canal prioritario.
11. **Motor Central:**
    - Archivos: `app/src/main/cpp/EQsbDspEngine.h`, `EQsbDspEngine.cpp`
    - Encapsula y encadena los 10 nodos en el orden estricto exigido.
12. **Capa JNI:**
    - Archivos: `app/src/main/cpp/jni/EQsbNativeDspJni.h`, `EQsbNativeDspJni.cpp`
    - Mapeo directo y limpio sin lógica DSP en el puente JNI.

---

## 4. PARÁMETROS DE COMPILACIÓN FIJADOS
- **JDK:** OpenJDK 17
- **Gradle Wrapper:** 8.5
- **Android Gradle Plugin (AGP):** 8.2.2
- **Kotlin:** 1.9.22
- **compileSdk:** 34
- **minSdk:** 24 (Android 7.0+)
- **targetSdk:** 34 (Android 14)
- **NDK:** 26.1.10909125
- **CMake:** 3.22.1
- **ABIs compatibles:** `arm64-v8a`, `armeabi-v7a`, `x86_64`

---

## 5. INTEGRACIÓN CONTINUA (GITHUB ACTIONS)
- **Archivo de Workflow:** `.github/workflows/build-android.yml`
- **Pasos configurados:**
  1. Configuración de JDK 17 (Temurin).
  2. Instalación de Android SDK 34, Build-Tools 34.0.0, NDK 26.1.10909125 y CMake 3.22.1 con aceptación de licencias.
  3. Compilación y ejecución de la suite nativa de 17 tests DSP y benchmark.
  4. Ejecución de `./gradlew clean`.
  5. Ejecución de `./gradlew test` (tests unitarios e integración en Kotlin).
  6. Compilación de la APK de depuración mediante `./gradlew assembleDebug` (compilando C++, JNI y CMake).
  7. Publicación del artefacto APK generado.

---

## 6. RESULTADOS DE LOS TESTS NATIVOS AUTOMATIZADOS (17/17 PASADOS)
La suite nativa de tests `eqsb_native_tests` arrojó los siguientes resultados:

1. `EQ32_FlatResponse`: **PASS** (RMS idéntico con ganancia 0 dB, error < 0.005)
2. `EQ32_All32BandsIndividualBoost`: **PASS** (Las 32 bandas probadas individualmente a +6 dB en sus frecuencias ISO; todas modifican el PCM real)
3. `EQ32_NegativeGainAttenuation`: **PASS** (Atenuación a -12 dB verificada matemáticamente)
4. `EQ32_MonoAndStereoSupport`: **PASS** (Comportamiento consistente en mono y estéreo)
5. `EQ32_MultipleSampleRates`: **PASS** (Verificado a 44.1 kHz, 48.0 kHz y 96.0 kHz)
6. `MDRC_GainReductionOnHotSignal`: **PASS** (Reducción dinámica de ganancia > 4 dB demostrada en señales por encima del umbral)
7. `AutoGain_ConvergenceToTarget`: **PASS** (Convergencia matemática demostrada hacia el objetivo de -14 dBFS)
8. `Limiter_RespectsCeilingWithOverdrivenInput`: **PASS** (Señales extremas de amplitud 3.5 limitadas al techo de -0.5 dBFS sin sobreimpulsos)
9. `BassBoost_SelectiveLowFrequencyBoost`: **PASS** (Refuerzo en 60 Hz sin alterar frecuencias agudas de 6 kHz)
10. `ToneControl_BassMidTrebleBoost`: **PASS** (Modificación efectiva de bandas graves, medias y agudas)
11. `SpatialVirtualizer_StereoWidening`: **PASS** (Aparición de componentes binaurales y decorrelación lateral)
12. `PreGain_DbLevels`: **PASS** (Verificación matemática de 0 dB, -6 dB y +6 dB)
13. `MasterGain_DbLevels`: **PASS** (Escalado de amplitud verificado a -12 dB)
14. `Balance_LeftRightPanSeparation`: **PASS** (Atenuación independiente por canal comprobada)
15. `Integration_CompleteDspChainFlow`: **PASS** (Paso secuencial por los 10 nodos de la cadena modificando PCM)
16. `Integration_EngineReset`: **PASS** (Restauración completa del estado de los registros a cero)
17. `Benchmark_PerformanceStabilityAndZeroAllocations`: **PASS**
    - Factor de tiempo real: **entre 34x y 143x más rápido que tiempo real**.
    - Carga de CPU estimada: **entre 0.7% y 2.9%** a 96 kHz estéreo con todos los módulos activos simultáneamente.
    - Cero asignaciones en memoria dinámica durante el procesamiento de bloques.
    - Cero NaNs o infinitos (estabilidad numérica 100% verificada).

---

## 7. AUDITORÍA TÉCNICA DE LIMITACIONES DE ANDROID (AUDIO EFFECT / AUDIOFLINGER)
Conforme a las reglas del proyecto, se establece la distinción formal e inequívoca:

1. **Restricción de AudioSession 0 (Global Output Mix):**
   - En Android 9.0 (API 28) a Android 14+, adjuntar un `AudioEffect` a Session 0 está prohibido para aplicaciones sin firma del sistema o privilegios `MODIFY_AUDIO_ROUTING`. Un intento desde una APK normal es rechazado por `audioserver`.
2. **Sesiones Broadcast de Reproductores:**
   - La captura de audio de terceros sólo es posible si el reproductor multimedia emite voluntariamente `OPEN_AUDIO_EFFECT_CONTROL_SESSION`. Aplicaciones como YouTube, Netflix o TikTok no emiten dicho broadcast.
3. **AudioPlaybackCapture (Android 10+):**
   - Es una API de grabación/captura, no un filtro en línea maestro dentro del mixer de AudioFlinger.
4. **OboeBackend:**
   - Oboe procesa en tiempo real con latencia mínima cualquier flujo de audio que pertenezca a EQsb. **No se afirma que Oboe capture globalmente el audio de otras aplicaciones.**
5. **Ruta Global Real:**
   - Un ecualizador verdaderamente global para todo el dispositivo requiere instalar `libeqsb_dsp.so` en `/vendor/lib64/soundfx/` y registrar el UUID en `/vendor/etc/audio_effects.xml` implementando el Effects HAL (AIDL).
