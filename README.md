# AudioDSP Engine Pro (Compatible con Android 14 / API 34+)

Motor de procesamiento de señal digital (DSP) por software en punto flotante de 32 bits para Android y flujos PCM.

## Características Principales
- **Cadena DSP de 10 Etapas**: Preamp, Bass Boost con armónicos tanh y filtro subsónico, Virtualizer estéreo 3D, Ecualizador paramétrico de 32 bandas ISO 266, Controles de tono (3 vías), MDRC multibanda Linkwitz-Riley, AutoGain RMS, Ganancia maestra/Balance, Soft Limiter Brickwall y Bypass maestro.
- **Cumplimiento Estricto Android 14 (API 34)**:
  - Definición de `foregroundServiceType="mediaPlayback|microphone"`
  - Servicio `AndroidDspForegroundService.kt` con `ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK`
  - Permisos `FOREGROUND_SERVICE_MEDIA_PLAYBACK` y `POST_NOTIFICATIONS`
  - Audio en punto flotante nativo (`AudioFormat.ENCODING_PCM_FLOAT`)
- **Suite de Pruebas**: 38 pruebas numéricas unitarias en tiempo real.

## Instrucciones de Compilación Web / PWA
```bash
npm install
npm run build
```
La carpeta resultante `dist/` contiene los binarios listos para publicar en GitHub Pages o desplegar.

## Integración con Android Studio (API 34+)
Los archivos fuente nativos están en la carpeta `src/android/`:
- `AndroidManifest.xml`
- `AndroidDspForegroundService.kt`
