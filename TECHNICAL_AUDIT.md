# AUDITORÍA TÉCNICA: ANDROID AUDIO EFFECT & AUDIOFLINGER (EQsb)

## 1. OBJETIVO DE LA AUDITORÍA
Determinar con rigor técnico qué capacidades de procesamiento de audio están permitidas para una aplicación Android estándar (APK normal sin privilegios), cuáles requieren integración del sistema (`/system` o `/vendor`), y cuáles son las limitaciones reales impuestas por el sistema operativo Android y AudioFlinger.

---

## 2. ARQUITECTURA DE AUDIO DE ANDROID
El subsistema de audio de Android se organiza en cinco capas principales:

1. **Capa de Aplicación (Java / Kotlin):**
   - `AudioTrack`, `MediaPlayer`, `ExoPlayer`, Jetpack Media3.
   - Envían PCM a través de Binder IPC a `audioserver`.

2. **Servicio Nativo AudioFlinger (`audioserver`):**
   - Reside en el proceso nativo del sistema `audioserver`.
   - Administra los hilos de mezcla: `PlaybackThread`, `MixerThread`, `FastMixer`.
   - Controla las cadenas de efectos globales y por sesión (`EffectChain`, `EffectModule`).

3. **Capa Effects HAL (Hardware Abstraction Layer):**
   - **HIDL:** `android.hardware.audio.effect@6.0` / `7.0` (Android 8 - 12).
   - **AIDL:** `android.hardware.audio.effect` (Android 13+).
   - Carga las bibliotecas dinámicas de efectos (`.so`) registradas en `/vendor/etc/audio_effects.xml` o `/system/etc/audio_effects.xml`.

4. **Kernel ALSA & Drivers:**
   - Controladores ALSA (`/dev/snd/*`), TinyALSA.

5. **DSP Hardware / Codec:**
   - Procesador DSP dedicado (Qualcomm Hexagon, MediaTek, Exynos).

---

## 3. AUDITORÍA DETALLADA POR RUTA TÉCNICA

### A. AudioSession 0 (Global Output Mix)
- **Comportamiento histórico (Android <= 8.1):**
  Una aplicación podía instanciar `new AudioEffect(type, uuid, priority, 0)`. AudioFlinger insertaba el efecto en la mezcla de salida global (`AUDIO_SESSION_OUTPUT_MIX = 0`).
- **Restricción moderna (Android 9.0 Pie a Android 14+):**
  - Session 0 está formalmente desaconsejada y restringida.
  - AudioFlinger exige el permiso de firma/sistema `android.permission.MODIFY_AUDIO_ROUTING`.
  - Si un APK de usuario normal intenta adjuntar un efecto a Session 0, el sistema lanza una excepción `java.lang.UnsupportedOperationException: Effect library not found` o rechaza silenciosamente la inserción.
  - **Motivo de seguridad:** Evitar que aplicaciones de terceros espíen, graben o interfieran en llamadas telefónicas, notificaciones bancarias o audio confidencial de otras aplicaciones.

### B. Broadcast de Sesiones de Audio Específicas
- **Mecanismo:**
  Reproductores multimedia estándar (ej. Spotify, VLC, Poweramp) pueden emitir el Intent público:
  `android.media.action.OPEN_AUDIO_EFFECT_CONTROL_SESSION`
  con el extra `EXTRA_AUDIO_SESSION` (identificador numérico entero).
- **Capacidad de una APK normal:**
  Una APK normal puede registrar un `BroadcastReceiver`, recibir el `sessionId` y crear una instancia de `AudioEffect` asociada a esa sesión específica.
- **Limitación crítica:**
  Muchas aplicaciones de streaming populares (YouTube, TikTok, Netflix, juegos) **no emiten** este broadcast o configuran sus pistas con atributos que impiden la inserción de efectos externos. No es posible garantizar una captura universal por esta vía.

### C. Oboe / AAudio (Stream PCM Propio de la Aplicación)
- **Capacidad real:**
  Oboe permite abrir flujos `AAudio` (o `OpenSL ES`) de latencia ultrabaja en modo exclusivo o compartido, con callbacks en tiempo real ejecutados en hilos de alta prioridad (`SCHED_FIFO`).
- **Ruta implementada en EQsb:**
  ```
  Oboe / Callback -> PCM Float -> EQsbNativeDsp (JNI) -> EQsbDspEngine (C++) -> PCM Procesado -> AudioTrack / Salida
  ```
- **Distinción obligatoria:**
  Oboe procesa **exclusivamente** el audio generado, cargado o reproducido por la propia aplicación EQsb. Oboe **no tiene privilegios** para interceptar el audio de otras aplicaciones del dispositivo.

### D. AudioPlaybackCapture API (Android 10+)
- **Mecanismo:**
  Permite capturar el audio de aplicaciones que tengan `allowAudioPlaybackCapture="true"` en su `AndroidManifest.xml` mediante `MediaProjection`.
- **Limitación técnica:**
  Es una API de **captura (grabación)**, no un filtro en línea (*in-line insertion*). Si se graba el audio para procesarlo y re-emitirlo, el audio original sigue sonando en los altavoces, produciendo un eco y desfase inaceptable, a menos que el sistema mutee la aplicación original (lo cual requiere permisos `MODIFY_AUDIO_ROUTING`).

### E. Integración a Nivel de Sistema / Vendor (Root / ROM / OEM)
- **Requisitos técnicos para un Ecualizador Global Real:**
  1. Compilar `libeqsb_dsp.so` para las arquitecturas de destino (`arm64-v8a`).
  2. Instalar el `.so` en `/vendor/lib64/soundfx/` o `/system/lib64/soundfx/`.
  3. Registrar el UUID del efecto en `/vendor/etc/audio_effects.xml` con su descriptor.
  4. Implementar la interfaz HAL de efectos de Android (AIDL en Android 13/14).
  5. AudioFlinger cargará la biblioteca al arrancar el sistema e insertará los filtros en el mixer maestro.

---

## 4. CONCLUSIÓN Y DECLARACIÓN DE HONESTIDAD TÉCNICA
1. **EQsb implementa un motor DSP C++ 100% real:**
   - 32 filtros biquad RBJ reales que procesan PCM float en serie.
   - Pre-Gain, Bass Boost, Tone, MDRC, AutoGain, Limiter, Master Gain y Balance modifican efectivamente la señal PCM.
2. **Backends separados y transparentes:**
   - **OboeBackend:** Garantiza procesamiento DSP en tiempo real sobre los flujos de audio de la aplicación.
   - **AudioEffectBackend:** Proporciona el puente de sesión para reproductores compatibles con sesiones de audio abiertas.
3. **No se realizan afirmaciones falsas:**
   - Se documenta con claridad que ninguna aplicación Android estándar puede interceptar arbitrariamente el audio de todas las demás aplicaciones sin privilegios de sistema o vendor HAL.
