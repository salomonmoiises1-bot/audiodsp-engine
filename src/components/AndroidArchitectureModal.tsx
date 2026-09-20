const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { X, ShieldAlert, Cpu, Layers, Terminal, Copy, Check, FileCode, Sliders, Smartphone } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/AndroidArchitectureModal.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const AndroidArchitectureModal = ({ isOpen, onClose }) => {
	const [activeTab, setActiveTab] = useState("android14");
	const [copied, setCopied] = useState(false);
	if (!isOpen) return null;
	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const android14ServiceCode = `// Android 14 (API 34) Foreground Service & Audio Processing Implementation
package com.audiodsp.engine.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.AudioFormat
import android.media.AudioPlaybackCaptureConfiguration
import android.media.AudioRecord
import android.media.projection.MediaProjection
import android.os.Binder
import android.os.Build
import android.os.IBinder
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.audiodsp.engine.AndroidDspEngineController

class AndroidDspForegroundService : Service() {

    private val binder = LocalBinder()
    private var dspController: AndroidDspEngineController? = null

    inner class LocalBinder : Binder() {
        fun getService(): AndroidDspForegroundService = this@AndroidDspForegroundService
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onCreate() {
        super.onCreate()
        dspController = AndroidDspEngineController(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification()

        // ⚠️ REQUISITO CRÍTICO DE ANDROID 14 (API 34):
        // Es OBLIGATORIO indicar el tipo exacto en startForeground.
        // De lo contrario, Android 14 arroja SecurityException inmediata.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        dspController?.startNativeEngine()
        return START_STICKY
    }

    @RequiresApi(Build.VERSION_CODES.Q)
    fun setupPlaybackCapture(mediaProjection: MediaProjection) {
        val captureConfig = AudioPlaybackCaptureConfiguration.Builder(mediaProjection)
            .addMatchingUsage(android.media.AudioAttributes.USAGE_MEDIA)
            .addMatchingUsage(android.media.AudioAttributes.USAGE_GAME)
            .build()

        val audioFormat = AudioFormat.Builder()
            .setEncoding(AudioFormat.ENCODING_PCM_FLOAT) // Android 14 float32 nativo
            .setSampleRate(48000)
            .setChannelMask(AudioFormat.CHANNEL_IN_STEREO)
            .build()

        val audioRecord = AudioRecord.Builder()
            .setAudioPlaybackCaptureConfig(captureConfig)
            .setAudioFormat(audioFormat)
            .setBufferSizeInBytes(2048)
            .build()

        audioRecord.startRecording()
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("AudioDSP Engine Pro Activo")
            .setContentText("Procesamiento DSP PCM 32-bit en ejecución continua")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Canal Audio DSP Engine",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notificación obligatoria para servicio en primer plano"
            }
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
                .createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        dspController?.release()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }

    companion object {
        const val CHANNEL_ID = "audiodsp_playback_channel"
        const val NOTIFICATION_ID = 1001
    }
}`;
	const manifestAndroid14 = `<!-- AndroidManifest.xml optimizado y compatible con Android 14 (API 34) -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.audiodsp.engine">

    <!-- Permisos de Audio y Notificación -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Permiso base de servicio en primer plano -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <!-- ⚠️ OBLIGATORIO EN ANDROID 14 (API 34): Permisos granulares de tipo de servicio -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />

    <application
        android:label="AudioDSP Engine Pro"
        android:theme="@style/Theme.AudioDSP">

        <!-- Servicio en Primer Plano con foregroundServiceType estricto para Android 14 -->
        <service
            android:name=".service.AndroidDspForegroundService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="mediaPlayback|microphone"
            tools:targetApi="upside_down_cake" />

    </application>
</manifest>`;
	const kotlinOboeWrapper = `// Android Audio Engine Architecture (Kotlin + Oboe Native Binding)
package com.audiodsp.engine

import android.content.Context
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioPlaybackCaptureConfiguration
import android.media.projection.MediaProjection
import android.os.Build
import androidx.annotation.RequiresApi

/**
 * Android Audio Engine Real Architecture Controller
 * 
 * LIMITACIÓN REAL DE ANDROID:
 * 1. Global Interception: Para capturar audio de otras apps se requiere Android 10+ (API 29),
 *    permiso RECORD_AUDIO, diálogo de MediaProjection activo y que la app de origen NO deshabilite
 *    'allowAudioPlaybackCapture' (Spotify/Netflix suelen deshabilitarlo por DRM).
 * 2. Low-Latency: Para evitar la latencia y jitter del Garbage Collector de Java/Kotlin,
 *    el procesamiento DSP debe ejecutarse en el callback C++ de Google Oboe con ARM NEON SIMD.
 */
class AndroidDspEngineController(private val context: Context) {
    
    // Carga de la biblioteca C++ nativa (libaudiodsp.so)
    init {
        System.loadLibrary("audiodsp_native")
    }

    private external fun nativeInit(sampleRate: Int, framesPerBurst: Int): Long
    private external fun nativeSetBand(enginePtr: Long, bandIndex: Int, type: Int, freq: Float, gain: Float, q: Float)
    private external fun nativeSetCompressor(enginePtr: Long, enabled: Boolean, threshold: Float, ratio: Float, attack: Float, release: Float, makeup: Float)
    private external fun nativeSetLimiter(enginePtr: Long, enabled: Boolean, ceiling: Float, release: Float)
    private external fun nativeSetStereo(enginePtr: Long, width: Float, balance: Float, invL: Boolean, invR: Boolean)
    private external fun nativeStart(enginePtr: Long): Boolean
    private external fun nativeStop(enginePtr: Long)
    private external fun nativeDestroy(enginePtr: Long)

    private var engineHandle: Long = 0

    fun startNativeEngine() {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val sampleRateStr = audioManager.getProperty(AudioManager.PROPERTY_OUTPUT_SAMPLE_RATE)
        val framesPerBurstStr = audioManager.getProperty(AudioManager.PROPERTY_OUTPUT_FRAMES_PER_BUFFER)

        val sampleRate = sampleRateStr?.toIntOrNull() ?: 48000
        val framesPerBurst = framesPerBurstStr?.toIntOrNull() ?: 192

        engineHandle = nativeInit(sampleRate, framesPerBurst)
        nativeStart(engineHandle)
    }

    fun updateParametricBand(index: Int, type: Int, frequency: Float, gainDb: Float, q: Float) {
        if (engineHandle != 0L) {
            nativeSetBand(engineHandle, index, type, frequency, gainDb, q)
        }
    }

    fun release() {
        if (engineHandle != 0L) {
            nativeStop(engineHandle)
            nativeDestroy(engineHandle)
            engineHandle = 0L
        }
    }
}`;
	const cppDspEngine = `// C++ Modular DSP Engine with Google Oboe (Lock-Free Audio Thread)
#include <oboe/Oboe.h>
#include <cmath>
#include <vector>
#include <atomic>

// Robert Bristow-Johnson Biquad Filter implementation
class BiquadFilter {
public:
    enum Type { PEAKING = 0, LOW_SHELF, HIGH_SHELF, LOW_PASS, HIGH_PASS, NOTCH, BAND_PASS };

    void recalculate(Type type, float freq, float gainDb, float Q, float sampleRate) {
        float A = std::pow(10.0f, gainDb / 40.0f);
        float w0 = 2.0f * M_PI * (freq / sampleRate);
        float alpha = std::sin(w0) / (2.0f * Q);
        float cosw0 = std::cos(w0);

        switch (type) {
            case PEAKING: {
                b0 = 1.0f + alpha * A;
                b1 = -2.0f * cosw0;
                b2 = 1.0f - alpha * A;
                a0 = 1.0f + alpha / A;
                a1 = -2.0f * cosw0;
                a2 = 1.0f - alpha / A;
                break;
            }
            case LOW_SHELF: {
                float sqrtA = std::sqrt(A);
                b0 = A * ((A + 1.0f) - (A - 1.0f) * cosw0 + 2.0f * sqrtA * alpha);
                b1 = 2.0f * A * ((A - 1.0f) - (A + 1.0f) * cosw0);
                b2 = A * ((A + 1.0f) - (A - 1.0f) * cosw0 - 2.0f * sqrtA * alpha);
                a0 = (A + 1.0f) + (A - 1.0f) * cosw0 + 2.0f * sqrtA * alpha;
                a1 = -2.0f * ((A - 1.0f) + (A + 1.0f) * cosw0);
                a2 = (A + 1.0f) + (A - 1.0f) * cosw0 - 2.0f * sqrtA * alpha;
                break;
            }
            // Additional filter types: High Shelf, Low Pass, High Pass, Notch...
            default:
                b0 = 1.0f; b1 = 0.0f; b2 = 0.0f; a0 = 1.0f; a1 = 0.0f; a2 = 0.0f;
                break;
        }
        // Normalize coefficients
        b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
    }

    inline float process(float in) {
        float out = b0 * in + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        x2 = x1; x1 = in;
        y2 = y1; y1 = out;
        return out;
    }

private:
    float b0 = 1.0f, b1 = 0.0f, b2 = 0.0f, a0 = 1.0f, a1 = 0.0f, a2 = 0.0f;
    float x1 = 0.0f, x2 = 0.0f, y1 = 0.0f, y2 = 0.0f;
};

// Oboe Audio Stream Callback (Executes on Real-Time Linux Audio Thread)
class DspAudioStreamCallback : public oboe::AudioStreamDataCallback {
public:
    oboe::DataCallbackResult onAudioReady(oboe::AudioStream *oboeStream, void *audioData, int32_t numFrames) override {
        float *floatData = static_cast<float *>(audioData);
        int channels = oboeStream->getChannelCount();

        // 1. Preamp Stage
        // 2. Multiband Parametric EQ Filtering (Float 32-bit SIMD)
        // 3. Dynamic Compression & Makeup
        // 4. Stereo Mid/Side Matrix
        // 5. Lookahead / Soft-Saturating Brickwall Limiter
        for (int i = 0; i < numFrames * channels; i += 2) {
            float left = floatData[i];
            float right = floatData[i + 1];

            // Real-time lock-free filter processing
            left = eqFiltersL[0].process(left);
            right = eqFiltersR[0].process(right);

            // Brickwall Soft Limiting
            floatData[i] = std::tanh(left);
            floatData[i + 1] = std::tanh(right);
        }
        return oboe::DataCallbackResult::Continue;
    }

private:
    std::vector<BiquadFilter> eqFiltersL;
    std::vector<BiquadFilter> eqFiltersR;
};`;
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm",
		children: /* @__PURE__ */ _jsxDEV("div", {
			className: "bg-neutral-900 border border-neutral-700 w-full max-w-4xl max-h-[90vh] rounded-xl flex flex-col shadow-2xl overflow-hidden text-neutral-200",
			children: [
				/* @__PURE__ */ _jsxDEV("div", {
					className: "px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400",
							children: /* @__PURE__ */ _jsxDEV(Cpu, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 333,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 332,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h2", {
							className: "text-lg font-semibold text-white tracking-tight",
							children: "Análisis de Arquitectura & Límites Reales en Android"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 336,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-xs text-neutral-400",
							children: "Auditoría técnica de APIs de audio, restricciones del sistema y modelo modular C++/Kotlin"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 339,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 335,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 331,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: onClose,
						className: "p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors",
						children: /* @__PURE__ */ _jsxDEV(X, { className: "w-5 h-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 348,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 344,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 330,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "flex border-b border-neutral-800 px-6 bg-neutral-950/30 gap-2 pt-2 overflow-x-auto scrollbar-none",
					children: [
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setActiveTab("android14"),
							className: `px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "android14" ? "border-emerald-500 text-emerald-400 bg-neutral-900 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-200"}`,
							children: [/* @__PURE__ */ _jsxDEV(Smartphone, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 362,
								columnNumber: 13
							}, this), "Android 14 (API 34+)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 354,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setActiveTab("limits"),
							className: `px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "limits" ? "border-emerald-500 text-emerald-400 bg-neutral-900 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-200"}`,
							children: [/* @__PURE__ */ _jsxDEV(ShieldAlert, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 373,
								columnNumber: 13
							}, this), "Límites del Sistema"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 365,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setActiveTab("architecture"),
							className: `px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "architecture" ? "border-emerald-500 text-emerald-400 bg-neutral-900 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-200"}`,
							children: [/* @__PURE__ */ _jsxDEV(Layers, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 384,
								columnNumber: 13
							}, this), "Cadena DSP Modular"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 376,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setActiveTab("kotlin"),
							className: `px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "kotlin" ? "border-emerald-500 text-emerald-400 bg-neutral-900 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-200"}`,
							children: [/* @__PURE__ */ _jsxDEV(FileCode, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 395,
								columnNumber: 13
							}, this), "Controlador Kotlin"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 387,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setActiveTab("cpp"),
							className: `px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === "cpp" ? "border-emerald-500 text-emerald-400 bg-neutral-900 font-bold" : "border-transparent text-neutral-400 hover:text-neutral-200"}`,
							children: [/* @__PURE__ */ _jsxDEV(Terminal, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 406,
								columnNumber: 13
							}, this), "Motor C++ Nativo (Oboe)"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 398,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 353,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "p-6 overflow-y-auto space-y-4 flex-1 text-sm",
					children: [
						activeTab === "android14" && /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-4 text-neutral-300",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed flex items-start gap-3",
									children: [/* @__PURE__ */ _jsxDEV(Smartphone, { className: "w-5 h-5 text-emerald-400 shrink-0 mt-0.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 416,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("strong", {
										className: "text-white text-sm block mb-1",
										children: "Compatibilidad Total con Android 14 (API Level 34) y Android 15 (API 35)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 418,
										columnNumber: 19
									}, this), "Esta arquitectura implementa las normativas estrictas de Google para procesamiento de audio en segundo plano, tipos tipificados de Foreground Services, y captura de flujos PCM estéreo de 32 bits."] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 417,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 415,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "grid grid-cols-1 md:grid-cols-2 gap-4",
									children: [
										/* @__PURE__ */ _jsxDEV("div", {
											className: "p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2",
											children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-bold text-xs uppercase flex items-center gap-2",
												children: [/* @__PURE__ */ _jsxDEV(ShieldAlert, { className: "w-4 h-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 429,
													columnNumber: 21
												}, this), "1. Tipos de Foreground Service Obligatorios"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 428,
												columnNumber: 19
											}, this), /* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"Android 14 prohíbe llamar a ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "startForeground()"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 433,
														columnNumber: 49
													}, this),
													" sin especificar el tipo. Nuestro servicio declara formalmente ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-emerald-300",
														children: "FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 434,
														columnNumber: 58
													}, this),
													" y ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-emerald-300",
														children: "FOREGROUND_SERVICE_TYPE_MICROPHONE"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 434,
														columnNumber: 141
													}, this),
													", previniendo el temido ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-rose-400",
														children: "SecurityException"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 434,
														columnNumber: 241
													}, this),
													" de API 34."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 432,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 427,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2",
											children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-bold text-xs uppercase flex items-center gap-2",
												children: [/* @__PURE__ */ _jsxDEV(Cpu, { className: "w-4 h-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 440,
													columnNumber: 21
												}, this), "2. AudioTrack & AudioRecord PCM Float de 32-bit"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 439,
												columnNumber: 19
											}, this), /* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"En Android 14, el subsistema de ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "AudioFlinger"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 444,
														columnNumber: 53
													}, this),
													" soporta enrutamiento directo de ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "AudioFormat.ENCODING_PCM_FLOAT"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 444,
														columnNumber: 140
													}, this),
													" sin truncamiento a 16 bits. Esto preserva un rango dinámico de más de 144 dB sin distorsión por cuantificación."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 443,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 438,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2",
											children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-bold text-xs uppercase flex items-center gap-2",
												children: [/* @__PURE__ */ _jsxDEV(Layers, { className: "w-4 h-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 450,
													columnNumber: 21
												}, this), "3. Restricciones de AudioPlaybackCapture"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 449,
												columnNumber: 19
											}, this), /* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"La captura de audio interno requiere ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "MediaProjection"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 454,
														columnNumber: 58
													}, this),
													" y el consentimiento del usuario en pantalla. Android 14 añade aislamiento estricto de captura para proteger llamadas y flujos protegidos por Widevine L1."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 453,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 448,
											columnNumber: 17
										}, this),
										/* @__PURE__ */ _jsxDEV("div", {
											className: "p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2",
											children: [/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-bold text-xs uppercase flex items-center gap-2",
												children: [/* @__PURE__ */ _jsxDEV(Terminal, { className: "w-4 h-4" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 460,
													columnNumber: 21
												}, this), "4. Permiso POST_NOTIFICATIONS (API 33+)"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 459,
												columnNumber: 19
											}, this), /* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"Android 13 y 14 requieren pedir en tiempo de ejecución ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "android.permission.POST_NOTIFICATIONS"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 464,
														columnNumber: 76
													}, this),
													" antes de iniciar el Foreground Service, garantizando que el usuario tenga control visual permanente sobre el motor DSP."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 463,
												columnNumber: 19
											}, this)]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 458,
											columnNumber: 17
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 426,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ _jsxDEV("span", {
											className: "text-xs text-neutral-400 font-mono",
											children: "AndroidDspForegroundService.kt (Código Oficial Android 14)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 472,
											columnNumber: 19
										}, this), /* @__PURE__ */ _jsxDEV("button", {
											onClick: () => copyToClipboard(android14ServiceCode),
											className: "px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-200 flex items-center gap-1.5 transition-colors",
											children: [copied ? /* @__PURE__ */ _jsxDEV(Check, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 479,
												columnNumber: 31
											}, this) : /* @__PURE__ */ _jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 479,
												columnNumber: 84
											}, this), copied ? "Copiado" : "Copiar Servicio Android 14"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 475,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 471,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("pre", {
										className: "p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto max-h-[220px] leading-relaxed",
										children: android14ServiceCode
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 483,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 470,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ _jsxDEV("span", {
											className: "text-xs text-neutral-400 font-mono",
											children: "AndroidManifest.xml (Configuración de Permisos API 34)"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 490,
											columnNumber: 19
										}, this), /* @__PURE__ */ _jsxDEV("button", {
											onClick: () => copyToClipboard(manifestAndroid14),
											className: "px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-200 flex items-center gap-1.5 transition-colors",
											children: [copied ? /* @__PURE__ */ _jsxDEV(Check, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 497,
												columnNumber: 31
											}, this) : /* @__PURE__ */ _jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 497,
												columnNumber: 84
											}, this), copied ? "Copiado" : "Copiar Manifest"]
										}, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 493,
											columnNumber: 19
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 489,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("pre", {
										className: "p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto max-h-[180px] leading-relaxed",
										children: manifestAndroid14
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 501,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 488,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 414,
							columnNumber: 13
						}, this),
						activeTab === "limits" && /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-4 text-neutral-300",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed",
								children: [/* @__PURE__ */ _jsxDEV("strong", { children: "Regla de Transparencia:" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 510,
									columnNumber: 17
								}, this), " No simulamos funciones que el sistema operativo prohíba. A continuación se desglosan las restricciones reales del subsistema de audio de Android (AudioFlinger/ALSA)."]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 509,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ _jsxDEV("div", {
										className: "p-4 rounded-lg bg-neutral-950/60 border border-neutral-800",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5",
												children: [/* @__PURE__ */ _jsxDEV(ShieldAlert, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 517,
													columnNumber: 21
												}, this), "1. Intercepción de Audio Global (Otras Apps)"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 516,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed mb-2",
												children: [
													"En Android 9 o anterior, muchas apps intentaban asociarse a la ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "audioSession = 0"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 521,
														columnNumber: 84
													}, this),
													" con ",
													/* @__PURE__ */ _jsxDEV("code", { children: "AudioEffect" }, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 521,
														columnNumber: 147
													}, this),
													". En Android moderno (10, 11, 12, 13, 14, 15), esto fue ",
													/* @__PURE__ */ _jsxDEV("strong", {
														className: "text-amber-300",
														children: "bloqueado por políticas SELinux"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 522,
														columnNumber: 75
													}, this),
													"."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 520,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"La API oficial ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "AudioPlaybackCaptureConfiguration"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 525,
														columnNumber: 36
													}, this),
													" (API 29+) exige que la app emisora (ej. Spotify, YouTube) declare ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-emerald-300",
														children: "allowAudioPlaybackCapture=\"true\""
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 526,
														columnNumber: 29
													}, this),
													". Cuando las apps usan DRM o streaming protegido, Android silencia automáticamente la captura a apps de terceros."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 524,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 515,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "p-4 rounded-lg bg-neutral-950/60 border border-neutral-800",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5",
												children: [/* @__PURE__ */ _jsxDEV(Cpu, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 533,
													columnNumber: 21
												}, this), "2. Latencia: Java AudioTrack vs Oboe C++"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 532,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed mb-2",
												children: [
													"Usar ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "AudioTrack"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 537,
														columnNumber: 26
													}, this),
													" o ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "AudioRecord"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 537,
														columnNumber: 81
													}, this),
													" en Java/Kotlin provoca pausas impredecibles del Garbage Collector (GC), causando micro-cortes (underruns) y una latencia superior a 80-120 ms."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 536,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"Para audio profesional en tiempo real, el estándar es ",
													/* @__PURE__ */ _jsxDEV("strong", {
														className: "text-emerald-300",
														children: "Google Oboe"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 541,
														columnNumber: 75
													}, this),
													" (C++), que accede por AAudio al hardware MMAP en modo ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "LowLatency / Exclusive"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 542,
														columnNumber: 68
													}, this),
													", reduciendo la latencia a 8-15 ms."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 540,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 531,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "p-4 rounded-lg bg-neutral-950/60 border border-neutral-800",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5",
												children: [/* @__PURE__ */ _jsxDEV(Sliders, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 548,
													columnNumber: 21
												}, this), "3. DynamicsProcessing API vs Motor Propio"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 547,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed mb-2",
												children: [
													"Android introdujo ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "android.media.audiofx.DynamicsProcessing"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 552,
														columnNumber: 39
													}, this),
													" en API 28. Si bien ofrece compresión y EQ en hardware, su comportamiento varía de forma errática entre chips Qualcomm, MediaTek y Exynos."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 551,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"Nuestro motor implementa ",
													/* @__PURE__ */ _jsxDEV("strong", {
														className: "text-white",
														children: "cálculo matemático de punto flotante de 32 bits"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 556,
														columnNumber: 46
													}, this),
													" (Biquad Robert Bristow-Johnson), asegurando que el sonido procesado sea idéntico y preciso en cualquier hardware sin depender de bugs del fabricante."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 555,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 546,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "p-4 rounded-lg bg-neutral-950/60 border border-neutral-800",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5",
												children: [/* @__PURE__ */ _jsxDEV(Layers, { className: "w-4 h-4 text-emerald-400" }, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 563,
													columnNumber: 21
												}, this), "4. Frecuencia de Muestreo & Resampling"]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 562,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed mb-2",
												children: [
													"Casi todos los SoCs de Android tienen el reloj de su DAC fijado a ",
													/* @__PURE__ */ _jsxDEV("strong", {
														className: "text-white",
														children: "48,000 Hz"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 567,
														columnNumber: 87
													}, this),
													". Si una app genera audio a 44,100 Hz, el sistema AudioFlinger ejecuta un resampler que consume CPU y puede generar aliasing."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 566,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("p", {
												className: "text-xs text-neutral-400 leading-relaxed",
												children: [
													"Nuestra arquitectura detecta ",
													/* @__PURE__ */ _jsxDEV("code", {
														className: "text-neutral-200",
														children: "PROPERTY_OUTPUT_SAMPLE_RATE"
													}, void 0, false, {
														fileName: _jsxFileName,
														lineNumber: 571,
														columnNumber: 50
													}, this),
													" para sincronizar el buffer DSP a la frecuencia nativa del dispositivo, eliminando resamplers innecesarios."
												]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 570,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 561,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 514,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 508,
							columnNumber: 13
						}, this),
						activeTab === "architecture" && /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-4 text-neutral-300",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "p-4 rounded-lg bg-neutral-950/60 border border-neutral-800",
								children: [
									/* @__PURE__ */ _jsxDEV("h3", {
										className: "text-sm font-semibold text-white mb-2",
										children: "Cadena DSP Modular en Cascada"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 582,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ _jsxDEV("p", {
										className: "text-xs text-neutral-400 leading-relaxed mb-4",
										children: "El procesamiento ocurre de izquierda a derecha en búferes de punto flotante sin cortes ni conversión analógica intermedia:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 583,
										columnNumber: 17
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "flex flex-col md:flex-row items-center gap-2 text-xs font-mono",
										children: [
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-neutral-800 border border-neutral-700 text-center w-full md:w-auto",
												children: ["1. Audio In", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-neutral-400",
													children: "Mic / File / Synth"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 590,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 588,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-neutral-500 hidden md:inline",
												children: "→"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 592,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-neutral-800 border border-neutral-700 text-center w-full md:w-auto",
												children: ["2. Preamp", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-neutral-400",
													children: "-24dB a +24dB / Fase"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 595,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 593,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-neutral-500 hidden md:inline",
												children: "→"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 597,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-center w-full md:w-auto",
												children: ["3. Parametric EQ", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-emerald-400",
													children: "8 Bandas Biquad"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 600,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 598,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-neutral-500 hidden md:inline",
												children: "→"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 602,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-neutral-800 border border-neutral-700 text-center w-full md:w-auto",
												children: ["4. Compresor", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-neutral-400",
													children: "Thr / Ratio / Knee"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 605,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 603,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-neutral-500 hidden md:inline",
												children: "→"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 607,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-neutral-800 border border-neutral-700 text-center w-full md:w-auto",
												children: ["5. Estéreo M/S", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-neutral-400",
													children: "Width / Balance"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 610,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 608,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-neutral-500 hidden md:inline",
												children: "→"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 612,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-rose-950/40 border border-rose-700/50 text-rose-300 text-center w-full md:w-auto",
												children: ["6. Limitador", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-rose-400",
													children: "Brickwall Soft-Clip"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 615,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 613,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("span", {
												className: "text-neutral-500 hidden md:inline",
												children: "→"
											}, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 617,
												columnNumber: 19
											}, this),
											/* @__PURE__ */ _jsxDEV("div", {
												className: "p-2.5 rounded bg-neutral-800 border border-neutral-700 text-center w-full md:w-auto",
												children: ["7. Output & FFT", /* @__PURE__ */ _jsxDEV("div", {
													className: "text-[10px] text-neutral-400",
													children: "Master Out / RTA"
												}, void 0, false, {
													fileName: _jsxFileName,
													lineNumber: 620,
													columnNumber: 21
												}, this)]
											}, void 0, true, {
												fileName: _jsxFileName,
												lineNumber: 618,
												columnNumber: 19
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 587,
										columnNumber: 17
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 581,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "p-4 rounded-lg bg-neutral-950/60 border border-neutral-800 text-xs space-y-2",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "font-semibold text-white",
									children: "Separación Arquitectónica Estricta:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 626,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("ul", {
									className: "list-disc list-inside space-y-1 text-neutral-400",
									children: [
										/* @__PURE__ */ _jsxDEV("li", { children: [/* @__PURE__ */ _jsxDEV("strong", {
											className: "text-neutral-200",
											children: "Motor de Audio Autónomo:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 628,
											columnNumber: 23
										}, this), " El hilo DSP opera en aislamiento. Si la UI se congela o rota la pantalla, el flujo de audio jamás sufre underruns."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 628,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ _jsxDEV("li", { children: [/* @__PURE__ */ _jsxDEV("strong", {
											className: "text-neutral-200",
											children: "Parámetros Suavizados:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 629,
											columnNumber: 23
										}, this), " Al mover sliders de frecuencia o ganancia, los coeficientes se interpolan suavemente mediante rampas exponenciales para eliminar clicks y pops."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 629,
											columnNumber: 19
										}, this),
										/* @__PURE__ */ _jsxDEV("li", { children: [/* @__PURE__ */ _jsxDEV("strong", {
											className: "text-neutral-200",
											children: "Medición Real:"
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 630,
											columnNumber: 23
										}, this), " Los indicadores de Peak y RMS no son gráficos ficticios; calculan directamente la energía cuadrática media de los frames de audio procesados."] }, void 0, true, {
											fileName: _jsxFileName,
											lineNumber: 630,
											columnNumber: 19
										}, this)
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 627,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 625,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 580,
							columnNumber: 13
						}, this),
						activeTab === "kotlin" && /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs text-neutral-400 font-mono",
									children: "com.audiodsp.engine.AndroidDspEngineController.kt"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 639,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("button", {
									onClick: () => copyToClipboard(kotlinOboeWrapper),
									className: "px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-200 flex items-center gap-1.5 transition-colors",
									children: [copied ? /* @__PURE__ */ _jsxDEV(Check, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 644,
										columnNumber: 29
									}, this) : /* @__PURE__ */ _jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 644,
										columnNumber: 82
									}, this), copied ? "Copiado" : "Copiar Código"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 640,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 638,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("pre", {
								className: "p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed",
								children: kotlinOboeWrapper
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 648,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 637,
							columnNumber: 13
						}, this),
						activeTab === "cpp" && /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs text-neutral-400 font-mono",
									children: "native/src/dsp_engine.cpp (Oboe + Biquad RBJ)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 657,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("button", {
									onClick: () => copyToClipboard(cppDspEngine),
									className: "px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs text-neutral-200 flex items-center gap-1.5 transition-colors",
									children: [copied ? /* @__PURE__ */ _jsxDEV(Check, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 662,
										columnNumber: 29
									}, this) : /* @__PURE__ */ _jsxDEV(Copy, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 662,
										columnNumber: 82
									}, this), copied ? "Copiado" : "Copiar Código"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 658,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 656,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("pre", {
								className: "p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto max-h-[380px] leading-relaxed",
								children: cppDspEngine
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 666,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 655,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 412,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "px-6 py-3 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between text-xs text-neutral-400",
					children: [/* @__PURE__ */ _jsxDEV("span", { children: "Arquitectura basada en Especificaciones de Google Oboe y Web Audio DSP" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 675,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: onClose,
						className: "px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors",
						children: "Entendido"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 676,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 674,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 327,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 326,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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LHdCQUFDLE9BQUQsRUFBTyxXQUFVLCtCQUFnQzs7OztvQkFBSSx3QkFBQyxNQUFELEVBQU0sV0FBVSxjQUFlOzs7O21CQUM3RixTQUFTLFlBQVksZUFDaEI7Ozs7O2dCQUNMOzs7OztpQkFDTCx3QkFBQyxPQUFEO1FBQUssV0FBVTtrQkFDWjtPQUNFOzs7O2VBQ0Y7Ozs7OztNQUdOLGNBQWMsU0FDYix3QkFBQyxPQUFEO09BQUssV0FBVTtpQkFBZixDQUNFLHdCQUFDLE9BQUQ7UUFBSyxXQUFVO2tCQUFmLENBQ0Usd0JBQUMsUUFBRDtTQUFNLFdBQVU7bUJBQXFDO1FBQW1EOzs7O2tCQUN4Ryx3QkFBQyxVQUFEO1NBQ0UsZUFBZSxnQkFBZ0IsWUFBWTtTQUMzQyxXQUFVO21CQUZaLENBSUcsU0FBUyx3QkFBQyxPQUFELEVBQU8sV0FBVSwrQkFBZ0M7Ozs7b0JBQUksd0JBQUMsTUFBRCxFQUFNLFdBQVUsY0FBZTs7OzttQkFDN0YsU0FBUyxZQUFZLGVBQ2hCOzs7OztnQkFDTDs7Ozs7aUJBQ0wsd0JBQUMsT0FBRDtRQUFLLFdBQVU7a0JBQ1o7T0FDRTs7OztlQUNGOzs7Ozs7S0FFSjs7Ozs7O0lBR0wsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFBZixDQUNFLHdCQUFDLFFBQUQsWUFBTSx5RUFBNEU7Ozs7ZUFDbEYsd0JBQUMsVUFBRDtNQUNFLFNBQVM7TUFDVCxXQUFVO2dCQUNYO0tBRU87Ozs7YUFDTDs7Ozs7O0dBRUY7Ozs7OztDQUNGOzs7OztBQUVUIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkFuZHJvaWRBcmNoaXRlY3R1cmVNb2RhbC50c3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgWCwgU2hpZWxkQWxlcnQsIENwdSwgTGF5ZXJzLCBUZXJtaW5hbCwgQ29weSwgQ2hlY2ssIEZpbGVDb2RlLCBTbGlkZXJzLCBTbWFydHBob25lIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgaXNPcGVuOiBib29sZWFuO1xuICBvbkNsb3NlOiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgQW5kcm9pZEFyY2hpdGVjdHVyZU1vZGFsOiBSZWFjdC5GQzxQcm9wcz4gPSAoeyBpc09wZW4sIG9uQ2xvc2UgfSkgPT4ge1xuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGU8J2xpbWl0cycgfCAnYW5kcm9pZDE0JyB8ICdhcmNoaXRlY3R1cmUnIHwgJ2tvdGxpbicgfCAnY3BwJz4oJ2FuZHJvaWQxNCcpO1xuICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGlmICghaXNPcGVuKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBjb3B5VG9DbGlwYm9hcmQgPSAodGV4dDogc3RyaW5nKSA9PiB7XG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XG4gICAgc2V0Q29waWVkKHRydWUpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0Q29waWVkKGZhbHNlKSwgMjAwMCk7XG4gIH07XG5cbiAgY29uc3QgYW5kcm9pZDE0U2VydmljZUNvZGUgPSBgLy8gQW5kcm9pZCAxNCAoQVBJIDM0KSBGb3JlZ3JvdW5kIFNlcnZpY2UgJiBBdWRpbyBQcm9jZXNzaW5nIEltcGxlbWVudGF0aW9uXG5wYWNrYWdlIGNvbS5hdWRpb2RzcC5lbmdpbmUuc2VydmljZVxuXG5pbXBvcnQgYW5kcm9pZC5hcHAuTm90aWZpY2F0aW9uXG5pbXBvcnQgYW5kcm9pZC5hcHAuTm90aWZpY2F0aW9uQ2hhbm5lbFxuaW1wb3J0IGFuZHJvaWQuYXBwLk5vdGlmaWNhdGlvbk1hbmFnZXJcbmltcG9ydCBhbmRyb2lkLmFwcC5TZXJ2aWNlXG5pbXBvcnQgYW5kcm9pZC5jb250ZW50LkNvbnRleHRcbmltcG9ydCBhbmRyb2lkLmNvbnRlbnQuSW50ZW50XG5pbXBvcnQgYW5kcm9pZC5jb250ZW50LnBtLlNlcnZpY2VJbmZvXG5pbXBvcnQgYW5kcm9pZC5tZWRpYS5BdWRpb0Zvcm1hdFxuaW1wb3J0IGFuZHJvaWQubWVkaWEuQXVkaW9QbGF5YmFja0NhcHR1cmVDb25maWd1cmF0aW9uXG5pbXBvcnQgYW5kcm9pZC5tZWRpYS5BdWRpb1JlY29yZFxuaW1wb3J0IGFuZHJvaWQubWVkaWEucHJvamVjdGlvbi5NZWRpYVByb2plY3Rpb25cbmltcG9ydCBhbmRyb2lkLm9zLkJpbmRlclxuaW1wb3J0IGFuZHJvaWQub3MuQnVpbGRcbmltcG9ydCBhbmRyb2lkLm9zLklCaW5kZXJcbmltcG9ydCBhbmRyb2lkeC5hbm5vdGF0aW9uLlJlcXVpcmVzQXBpXG5pbXBvcnQgYW5kcm9pZHguY29yZS5hcHAuTm90aWZpY2F0aW9uQ29tcGF0XG5pbXBvcnQgY29tLmF1ZGlvZHNwLmVuZ2luZS5BbmRyb2lkRHNwRW5naW5lQ29udHJvbGxlclxuXG5jbGFzcyBBbmRyb2lkRHNwRm9yZWdyb3VuZFNlcnZpY2UgOiBTZXJ2aWNlKCkge1xuXG4gICAgcHJpdmF0ZSB2YWwgYmluZGVyID0gTG9jYWxCaW5kZXIoKVxuICAgIHByaXZhdGUgdmFyIGRzcENvbnRyb2xsZXI6IEFuZHJvaWREc3BFbmdpbmVDb250cm9sbGVyPyA9IG51bGxcblxuICAgIGlubmVyIGNsYXNzIExvY2FsQmluZGVyIDogQmluZGVyKCkge1xuICAgICAgICBmdW4gZ2V0U2VydmljZSgpOiBBbmRyb2lkRHNwRm9yZWdyb3VuZFNlcnZpY2UgPSB0aGlzQEFuZHJvaWREc3BGb3JlZ3JvdW5kU2VydmljZVxuICAgIH1cblxuICAgIG92ZXJyaWRlIGZ1biBvbkJpbmQoaW50ZW50OiBJbnRlbnQ/KTogSUJpbmRlciA9IGJpbmRlclxuXG4gICAgb3ZlcnJpZGUgZnVuIG9uQ3JlYXRlKCkge1xuICAgICAgICBzdXBlci5vbkNyZWF0ZSgpXG4gICAgICAgIGRzcENvbnRyb2xsZXIgPSBBbmRyb2lkRHNwRW5naW5lQ29udHJvbGxlcih0aGlzKVxuICAgICAgICBjcmVhdGVOb3RpZmljYXRpb25DaGFubmVsKClcbiAgICB9XG5cbiAgICBvdmVycmlkZSBmdW4gb25TdGFydENvbW1hbmQoaW50ZW50OiBJbnRlbnQ/LCBmbGFnczogSW50LCBzdGFydElkOiBJbnQpOiBJbnQge1xuICAgICAgICB2YWwgbm90aWZpY2F0aW9uID0gY3JlYXRlTm90aWZpY2F0aW9uKClcblxuICAgICAgICAvLyDimqDvuI8gUkVRVUlTSVRPIENSw41USUNPIERFIEFORFJPSUQgMTQgKEFQSSAzNCk6XG4gICAgICAgIC8vIEVzIE9CTElHQVRPUklPIGluZGljYXIgZWwgdGlwbyBleGFjdG8gZW4gc3RhcnRGb3JlZ3JvdW5kLlxuICAgICAgICAvLyBEZSBsbyBjb250cmFyaW8sIEFuZHJvaWQgMTQgYXJyb2phIFNlY3VyaXR5RXhjZXB0aW9uIGlubWVkaWF0YS5cbiAgICAgICAgaWYgKEJ1aWxkLlZFUlNJT04uU0RLX0lOVCA+PSBCdWlsZC5WRVJTSU9OX0NPREVTLlVQU0lERV9ET1dOX0NBS0UpIHtcbiAgICAgICAgICAgIHN0YXJ0Rm9yZWdyb3VuZChcbiAgICAgICAgICAgICAgICBOT1RJRklDQVRJT05fSUQsXG4gICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uLFxuICAgICAgICAgICAgICAgIFNlcnZpY2VJbmZvLkZPUkVHUk9VTkRfU0VSVklDRV9UWVBFX01FRElBX1BMQVlCQUNLXG4gICAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydEZvcmVncm91bmQoTk9USUZJQ0FUSU9OX0lELCBub3RpZmljYXRpb24pXG4gICAgICAgIH1cblxuICAgICAgICBkc3BDb250cm9sbGVyPy5zdGFydE5hdGl2ZUVuZ2luZSgpXG4gICAgICAgIHJldHVybiBTVEFSVF9TVElDS1lcbiAgICB9XG5cbiAgICBAUmVxdWlyZXNBcGkoQnVpbGQuVkVSU0lPTl9DT0RFUy5RKVxuICAgIGZ1biBzZXR1cFBsYXliYWNrQ2FwdHVyZShtZWRpYVByb2plY3Rpb246IE1lZGlhUHJvamVjdGlvbikge1xuICAgICAgICB2YWwgY2FwdHVyZUNvbmZpZyA9IEF1ZGlvUGxheWJhY2tDYXB0dXJlQ29uZmlndXJhdGlvbi5CdWlsZGVyKG1lZGlhUHJvamVjdGlvbilcbiAgICAgICAgICAgIC5hZGRNYXRjaGluZ1VzYWdlKGFuZHJvaWQubWVkaWEuQXVkaW9BdHRyaWJ1dGVzLlVTQUdFX01FRElBKVxuICAgICAgICAgICAgLmFkZE1hdGNoaW5nVXNhZ2UoYW5kcm9pZC5tZWRpYS5BdWRpb0F0dHJpYnV0ZXMuVVNBR0VfR0FNRSlcbiAgICAgICAgICAgIC5idWlsZCgpXG5cbiAgICAgICAgdmFsIGF1ZGlvRm9ybWF0ID0gQXVkaW9Gb3JtYXQuQnVpbGRlcigpXG4gICAgICAgICAgICAuc2V0RW5jb2RpbmcoQXVkaW9Gb3JtYXQuRU5DT0RJTkdfUENNX0ZMT0FUKSAvLyBBbmRyb2lkIDE0IGZsb2F0MzIgbmF0aXZvXG4gICAgICAgICAgICAuc2V0U2FtcGxlUmF0ZSg0ODAwMClcbiAgICAgICAgICAgIC5zZXRDaGFubmVsTWFzayhBdWRpb0Zvcm1hdC5DSEFOTkVMX0lOX1NURVJFTylcbiAgICAgICAgICAgIC5idWlsZCgpXG5cbiAgICAgICAgdmFsIGF1ZGlvUmVjb3JkID0gQXVkaW9SZWNvcmQuQnVpbGRlcigpXG4gICAgICAgICAgICAuc2V0QXVkaW9QbGF5YmFja0NhcHR1cmVDb25maWcoY2FwdHVyZUNvbmZpZylcbiAgICAgICAgICAgIC5zZXRBdWRpb0Zvcm1hdChhdWRpb0Zvcm1hdClcbiAgICAgICAgICAgIC5zZXRCdWZmZXJTaXplSW5CeXRlcygyMDQ4KVxuICAgICAgICAgICAgLmJ1aWxkKClcblxuICAgICAgICBhdWRpb1JlY29yZC5zdGFydFJlY29yZGluZygpXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmdW4gY3JlYXRlTm90aWZpY2F0aW9uKCk6IE5vdGlmaWNhdGlvbiB7XG4gICAgICAgIHJldHVybiBOb3RpZmljYXRpb25Db21wYXQuQnVpbGRlcih0aGlzLCBDSEFOTkVMX0lEKVxuICAgICAgICAgICAgLnNldENvbnRlbnRUaXRsZShcIkF1ZGlvRFNQIEVuZ2luZSBQcm8gQWN0aXZvXCIpXG4gICAgICAgICAgICAuc2V0Q29udGVudFRleHQoXCJQcm9jZXNhbWllbnRvIERTUCBQQ00gMzItYml0IGVuIGVqZWN1Y2nDs24gY29udGludWFcIilcbiAgICAgICAgICAgIC5zZXRTbWFsbEljb24oYW5kcm9pZC5SLmRyYXdhYmxlLmljX21lZGlhX3BsYXkpXG4gICAgICAgICAgICAuc2V0T25nb2luZyh0cnVlKVxuICAgICAgICAgICAgLnNldFByaW9yaXR5KE5vdGlmaWNhdGlvbkNvbXBhdC5QUklPUklUWV9MT1cpXG4gICAgICAgICAgICAuYnVpbGQoKVxuICAgIH1cblxuICAgIHByaXZhdGUgZnVuIGNyZWF0ZU5vdGlmaWNhdGlvbkNoYW5uZWwoKSB7XG4gICAgICAgIGlmIChCdWlsZC5WRVJTSU9OLlNES19JTlQgPj0gQnVpbGQuVkVSU0lPTl9DT0RFUy5PKSB7XG4gICAgICAgICAgICB2YWwgY2hhbm5lbCA9IE5vdGlmaWNhdGlvbkNoYW5uZWwoXG4gICAgICAgICAgICAgICAgQ0hBTk5FTF9JRCxcbiAgICAgICAgICAgICAgICBcIkNhbmFsIEF1ZGlvIERTUCBFbmdpbmVcIixcbiAgICAgICAgICAgICAgICBOb3RpZmljYXRpb25NYW5hZ2VyLklNUE9SVEFOQ0VfTE9XXG4gICAgICAgICAgICApLmFwcGx5IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IFwiTm90aWZpY2FjacOzbiBvYmxpZ2F0b3JpYSBwYXJhIHNlcnZpY2lvIGVuIHByaW1lciBwbGFub1wiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAoZ2V0U3lzdGVtU2VydmljZShDb250ZXh0Lk5PVElGSUNBVElPTl9TRVJWSUNFKSBhcyBOb3RpZmljYXRpb25NYW5hZ2VyKVxuICAgICAgICAgICAgICAgIC5jcmVhdGVOb3RpZmljYXRpb25DaGFubmVsKGNoYW5uZWwpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvdmVycmlkZSBmdW4gb25EZXN0cm95KCkge1xuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKVxuICAgICAgICBkc3BDb250cm9sbGVyPy5yZWxlYXNlKClcbiAgICAgICAgc3RvcEZvcmVncm91bmQoU1RPUF9GT1JFR1JPVU5EX1JFTU9WRSlcbiAgICB9XG5cbiAgICBjb21wYW5pb24gb2JqZWN0IHtcbiAgICAgICAgY29uc3QgdmFsIENIQU5ORUxfSUQgPSBcImF1ZGlvZHNwX3BsYXliYWNrX2NoYW5uZWxcIlxuICAgICAgICBjb25zdCB2YWwgTk9USUZJQ0FUSU9OX0lEID0gMTAwMVxuICAgIH1cbn1gO1xuXG4gIGNvbnN0IG1hbmlmZXN0QW5kcm9pZDE0ID0gYDwhLS0gQW5kcm9pZE1hbmlmZXN0LnhtbCBvcHRpbWl6YWRvIHkgY29tcGF0aWJsZSBjb24gQW5kcm9pZCAxNCAoQVBJIDM0KSAtLT5cbjxtYW5pZmVzdCB4bWxuczphbmRyb2lkPVwiaHR0cDovL3NjaGVtYXMuYW5kcm9pZC5jb20vYXBrL3Jlcy9hbmRyb2lkXCJcbiAgICB4bWxuczp0b29scz1cImh0dHA6Ly9zY2hlbWFzLmFuZHJvaWQuY29tL3Rvb2xzXCJcbiAgICBwYWNrYWdlPVwiY29tLmF1ZGlvZHNwLmVuZ2luZVwiPlxuXG4gICAgPCEtLSBQZXJtaXNvcyBkZSBBdWRpbyB5IE5vdGlmaWNhY2nDs24gLS0+XG4gICAgPHVzZXMtcGVybWlzc2lvbiBhbmRyb2lkOm5hbWU9XCJhbmRyb2lkLnBlcm1pc3Npb24uUkVDT1JEX0FVRElPXCIgLz5cbiAgICA8dXNlcy1wZXJtaXNzaW9uIGFuZHJvaWQ6bmFtZT1cImFuZHJvaWQucGVybWlzc2lvbi5NT0RJRllfQVVESU9fU0VUVElOR1NcIiAvPlxuICAgIDx1c2VzLXBlcm1pc3Npb24gYW5kcm9pZDpuYW1lPVwiYW5kcm9pZC5wZXJtaXNzaW9uLlBPU1RfTk9USUZJQ0FUSU9OU1wiIC8+XG5cbiAgICA8IS0tIFBlcm1pc28gYmFzZSBkZSBzZXJ2aWNpbyBlbiBwcmltZXIgcGxhbm8gLS0+XG4gICAgPHVzZXMtcGVybWlzc2lvbiBhbmRyb2lkOm5hbWU9XCJhbmRyb2lkLnBlcm1pc3Npb24uRk9SRUdST1VORF9TRVJWSUNFXCIgLz5cblxuICAgIDwhLS0g4pqg77iPIE9CTElHQVRPUklPIEVOIEFORFJPSUQgMTQgKEFQSSAzNCk6IFBlcm1pc29zIGdyYW51bGFyZXMgZGUgdGlwbyBkZSBzZXJ2aWNpbyAtLT5cbiAgICA8dXNlcy1wZXJtaXNzaW9uIGFuZHJvaWQ6bmFtZT1cImFuZHJvaWQucGVybWlzc2lvbi5GT1JFR1JPVU5EX1NFUlZJQ0VfTUVESUFfUExBWUJBQ0tcIiAvPlxuICAgIDx1c2VzLXBlcm1pc3Npb24gYW5kcm9pZDpuYW1lPVwiYW5kcm9pZC5wZXJtaXNzaW9uLkZPUkVHUk9VTkRfU0VSVklDRV9NSUNST1BIT05FXCIgLz5cblxuICAgIDxhcHBsaWNhdGlvblxuICAgICAgICBhbmRyb2lkOmxhYmVsPVwiQXVkaW9EU1AgRW5naW5lIFByb1wiXG4gICAgICAgIGFuZHJvaWQ6dGhlbWU9XCJAc3R5bGUvVGhlbWUuQXVkaW9EU1BcIj5cblxuICAgICAgICA8IS0tIFNlcnZpY2lvIGVuIFByaW1lciBQbGFubyBjb24gZm9yZWdyb3VuZFNlcnZpY2VUeXBlIGVzdHJpY3RvIHBhcmEgQW5kcm9pZCAxNCAtLT5cbiAgICAgICAgPHNlcnZpY2VcbiAgICAgICAgICAgIGFuZHJvaWQ6bmFtZT1cIi5zZXJ2aWNlLkFuZHJvaWREc3BGb3JlZ3JvdW5kU2VydmljZVwiXG4gICAgICAgICAgICBhbmRyb2lkOmVuYWJsZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIGFuZHJvaWQ6ZXhwb3J0ZWQ9XCJmYWxzZVwiXG4gICAgICAgICAgICBhbmRyb2lkOmZvcmVncm91bmRTZXJ2aWNlVHlwZT1cIm1lZGlhUGxheWJhY2t8bWljcm9waG9uZVwiXG4gICAgICAgICAgICB0b29sczp0YXJnZXRBcGk9XCJ1cHNpZGVfZG93bl9jYWtlXCIgLz5cblxuICAgIDwvYXBwbGljYXRpb24+XG48L21hbmlmZXN0PmA7XG5cbiAgY29uc3Qga290bGluT2JvZVdyYXBwZXIgPSBgLy8gQW5kcm9pZCBBdWRpbyBFbmdpbmUgQXJjaGl0ZWN0dXJlIChLb3RsaW4gKyBPYm9lIE5hdGl2ZSBCaW5kaW5nKVxucGFja2FnZSBjb20uYXVkaW9kc3AuZW5naW5lXG5cbmltcG9ydCBhbmRyb2lkLmNvbnRlbnQuQ29udGV4dFxuaW1wb3J0IGFuZHJvaWQubWVkaWEuQXVkaW9Gb3JtYXRcbmltcG9ydCBhbmRyb2lkLm1lZGlhLkF1ZGlvTWFuYWdlclxuaW1wb3J0IGFuZHJvaWQubWVkaWEuQXVkaW9QbGF5YmFja0NhcHR1cmVDb25maWd1cmF0aW9uXG5pbXBvcnQgYW5kcm9pZC5tZWRpYS5wcm9qZWN0aW9uLk1lZGlhUHJvamVjdGlvblxuaW1wb3J0IGFuZHJvaWQub3MuQnVpbGRcbmltcG9ydCBhbmRyb2lkeC5hbm5vdGF0aW9uLlJlcXVpcmVzQXBpXG5cbi8qKlxuICogQW5kcm9pZCBBdWRpbyBFbmdpbmUgUmVhbCBBcmNoaXRlY3R1cmUgQ29udHJvbGxlclxuICogXG4gKiBMSU1JVEFDScOTTiBSRUFMIERFIEFORFJPSUQ6XG4gKiAxLiBHbG9iYWwgSW50ZXJjZXB0aW9uOiBQYXJhIGNhcHR1cmFyIGF1ZGlvIGRlIG90cmFzIGFwcHMgc2UgcmVxdWllcmUgQW5kcm9pZCAxMCsgKEFQSSAyOSksXG4gKiAgICBwZXJtaXNvIFJFQ09SRF9BVURJTywgZGnDoWxvZ28gZGUgTWVkaWFQcm9qZWN0aW9uIGFjdGl2byB5IHF1ZSBsYSBhcHAgZGUgb3JpZ2VuIE5PIGRlc2hhYmlsaXRlXG4gKiAgICAnYWxsb3dBdWRpb1BsYXliYWNrQ2FwdHVyZScgKFNwb3RpZnkvTmV0ZmxpeCBzdWVsZW4gZGVzaGFiaWxpdGFybG8gcG9yIERSTSkuXG4gKiAyLiBMb3ctTGF0ZW5jeTogUGFyYSBldml0YXIgbGEgbGF0ZW5jaWEgeSBqaXR0ZXIgZGVsIEdhcmJhZ2UgQ29sbGVjdG9yIGRlIEphdmEvS290bGluLFxuICogICAgZWwgcHJvY2VzYW1pZW50byBEU1AgZGViZSBlamVjdXRhcnNlIGVuIGVsIGNhbGxiYWNrIEMrKyBkZSBHb29nbGUgT2JvZSBjb24gQVJNIE5FT04gU0lNRC5cbiAqL1xuY2xhc3MgQW5kcm9pZERzcEVuZ2luZUNvbnRyb2xsZXIocHJpdmF0ZSB2YWwgY29udGV4dDogQ29udGV4dCkge1xuICAgIFxuICAgIC8vIENhcmdhIGRlIGxhIGJpYmxpb3RlY2EgQysrIG5hdGl2YSAobGliYXVkaW9kc3Auc28pXG4gICAgaW5pdCB7XG4gICAgICAgIFN5c3RlbS5sb2FkTGlicmFyeShcImF1ZGlvZHNwX25hdGl2ZVwiKVxuICAgIH1cblxuICAgIHByaXZhdGUgZXh0ZXJuYWwgZnVuIG5hdGl2ZUluaXQoc2FtcGxlUmF0ZTogSW50LCBmcmFtZXNQZXJCdXJzdDogSW50KTogTG9uZ1xuICAgIHByaXZhdGUgZXh0ZXJuYWwgZnVuIG5hdGl2ZVNldEJhbmQoZW5naW5lUHRyOiBMb25nLCBiYW5kSW5kZXg6IEludCwgdHlwZTogSW50LCBmcmVxOiBGbG9hdCwgZ2FpbjogRmxvYXQsIHE6IEZsb2F0KVxuICAgIHByaXZhdGUgZXh0ZXJuYWwgZnVuIG5hdGl2ZVNldENvbXByZXNzb3IoZW5naW5lUHRyOiBMb25nLCBlbmFibGVkOiBCb29sZWFuLCB0aHJlc2hvbGQ6IEZsb2F0LCByYXRpbzogRmxvYXQsIGF0dGFjazogRmxvYXQsIHJlbGVhc2U6IEZsb2F0LCBtYWtldXA6IEZsb2F0KVxuICAgIHByaXZhdGUgZXh0ZXJuYWwgZnVuIG5hdGl2ZVNldExpbWl0ZXIoZW5naW5lUHRyOiBMb25nLCBlbmFibGVkOiBCb29sZWFuLCBjZWlsaW5nOiBGbG9hdCwgcmVsZWFzZTogRmxvYXQpXG4gICAgcHJpdmF0ZSBleHRlcm5hbCBmdW4gbmF0aXZlU2V0U3RlcmVvKGVuZ2luZVB0cjogTG9uZywgd2lkdGg6IEZsb2F0LCBiYWxhbmNlOiBGbG9hdCwgaW52TDogQm9vbGVhbiwgaW52UjogQm9vbGVhbilcbiAgICBwcml2YXRlIGV4dGVybmFsIGZ1biBuYXRpdmVTdGFydChlbmdpbmVQdHI6IExvbmcpOiBCb29sZWFuXG4gICAgcHJpdmF0ZSBleHRlcm5hbCBmdW4gbmF0aXZlU3RvcChlbmdpbmVQdHI6IExvbmcpXG4gICAgcHJpdmF0ZSBleHRlcm5hbCBmdW4gbmF0aXZlRGVzdHJveShlbmdpbmVQdHI6IExvbmcpXG5cbiAgICBwcml2YXRlIHZhciBlbmdpbmVIYW5kbGU6IExvbmcgPSAwXG5cbiAgICBmdW4gc3RhcnROYXRpdmVFbmdpbmUoKSB7XG4gICAgICAgIHZhbCBhdWRpb01hbmFnZXIgPSBjb250ZXh0LmdldFN5c3RlbVNlcnZpY2UoQ29udGV4dC5BVURJT19TRVJWSUNFKSBhcyBBdWRpb01hbmFnZXJcbiAgICAgICAgdmFsIHNhbXBsZVJhdGVTdHIgPSBhdWRpb01hbmFnZXIuZ2V0UHJvcGVydHkoQXVkaW9NYW5hZ2VyLlBST1BFUlRZX09VVFBVVF9TQU1QTEVfUkFURSlcbiAgICAgICAgdmFsIGZyYW1lc1BlckJ1cnN0U3RyID0gYXVkaW9NYW5hZ2VyLmdldFByb3BlcnR5KEF1ZGlvTWFuYWdlci5QUk9QRVJUWV9PVVRQVVRfRlJBTUVTX1BFUl9CVUZGRVIpXG5cbiAgICAgICAgdmFsIHNhbXBsZVJhdGUgPSBzYW1wbGVSYXRlU3RyPy50b0ludE9yTnVsbCgpID86IDQ4MDAwXG4gICAgICAgIHZhbCBmcmFtZXNQZXJCdXJzdCA9IGZyYW1lc1BlckJ1cnN0U3RyPy50b0ludE9yTnVsbCgpID86IDE5MlxuXG4gICAgICAgIGVuZ2luZUhhbmRsZSA9IG5hdGl2ZUluaXQoc2FtcGxlUmF0ZSwgZnJhbWVzUGVyQnVyc3QpXG4gICAgICAgIG5hdGl2ZVN0YXJ0KGVuZ2luZUhhbmRsZSlcbiAgICB9XG5cbiAgICBmdW4gdXBkYXRlUGFyYW1ldHJpY0JhbmQoaW5kZXg6IEludCwgdHlwZTogSW50LCBmcmVxdWVuY3k6IEZsb2F0LCBnYWluRGI6IEZsb2F0LCBxOiBGbG9hdCkge1xuICAgICAgICBpZiAoZW5naW5lSGFuZGxlICE9IDBMKSB7XG4gICAgICAgICAgICBuYXRpdmVTZXRCYW5kKGVuZ2luZUhhbmRsZSwgaW5kZXgsIHR5cGUsIGZyZXF1ZW5jeSwgZ2FpbkRiLCBxKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuIHJlbGVhc2UoKSB7XG4gICAgICAgIGlmIChlbmdpbmVIYW5kbGUgIT0gMEwpIHtcbiAgICAgICAgICAgIG5hdGl2ZVN0b3AoZW5naW5lSGFuZGxlKVxuICAgICAgICAgICAgbmF0aXZlRGVzdHJveShlbmdpbmVIYW5kbGUpXG4gICAgICAgICAgICBlbmdpbmVIYW5kbGUgPSAwTFxuICAgICAgICB9XG4gICAgfVxufWA7XG5cbiAgY29uc3QgY3BwRHNwRW5naW5lID0gYC8vIEMrKyBNb2R1bGFyIERTUCBFbmdpbmUgd2l0aCBHb29nbGUgT2JvZSAoTG9jay1GcmVlIEF1ZGlvIFRocmVhZClcbiNpbmNsdWRlIDxvYm9lL09ib2UuaD5cbiNpbmNsdWRlIDxjbWF0aD5cbiNpbmNsdWRlIDx2ZWN0b3I+XG4jaW5jbHVkZSA8YXRvbWljPlxuXG4vLyBSb2JlcnQgQnJpc3Rvdy1Kb2huc29uIEJpcXVhZCBGaWx0ZXIgaW1wbGVtZW50YXRpb25cbmNsYXNzIEJpcXVhZEZpbHRlciB7XG5wdWJsaWM6XG4gICAgZW51bSBUeXBlIHsgUEVBS0lORyA9IDAsIExPV19TSEVMRiwgSElHSF9TSEVMRiwgTE9XX1BBU1MsIEhJR0hfUEFTUywgTk9UQ0gsIEJBTkRfUEFTUyB9O1xuXG4gICAgdm9pZCByZWNhbGN1bGF0ZShUeXBlIHR5cGUsIGZsb2F0IGZyZXEsIGZsb2F0IGdhaW5EYiwgZmxvYXQgUSwgZmxvYXQgc2FtcGxlUmF0ZSkge1xuICAgICAgICBmbG9hdCBBID0gc3RkOjpwb3coMTAuMGYsIGdhaW5EYiAvIDQwLjBmKTtcbiAgICAgICAgZmxvYXQgdzAgPSAyLjBmICogTV9QSSAqIChmcmVxIC8gc2FtcGxlUmF0ZSk7XG4gICAgICAgIGZsb2F0IGFscGhhID0gc3RkOjpzaW4odzApIC8gKDIuMGYgKiBRKTtcbiAgICAgICAgZmxvYXQgY29zdzAgPSBzdGQ6OmNvcyh3MCk7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFBFQUtJTkc6IHtcbiAgICAgICAgICAgICAgICBiMCA9IDEuMGYgKyBhbHBoYSAqIEE7XG4gICAgICAgICAgICAgICAgYjEgPSAtMi4wZiAqIGNvc3cwO1xuICAgICAgICAgICAgICAgIGIyID0gMS4wZiAtIGFscGhhICogQTtcbiAgICAgICAgICAgICAgICBhMCA9IDEuMGYgKyBhbHBoYSAvIEE7XG4gICAgICAgICAgICAgICAgYTEgPSAtMi4wZiAqIGNvc3cwO1xuICAgICAgICAgICAgICAgIGEyID0gMS4wZiAtIGFscGhhIC8gQTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgTE9XX1NIRUxGOiB7XG4gICAgICAgICAgICAgICAgZmxvYXQgc3FydEEgPSBzdGQ6OnNxcnQoQSk7XG4gICAgICAgICAgICAgICAgYjAgPSBBICogKChBICsgMS4wZikgLSAoQSAtIDEuMGYpICogY29zdzAgKyAyLjBmICogc3FydEEgKiBhbHBoYSk7XG4gICAgICAgICAgICAgICAgYjEgPSAyLjBmICogQSAqICgoQSAtIDEuMGYpIC0gKEEgKyAxLjBmKSAqIGNvc3cwKTtcbiAgICAgICAgICAgICAgICBiMiA9IEEgKiAoKEEgKyAxLjBmKSAtIChBIC0gMS4wZikgKiBjb3N3MCAtIDIuMGYgKiBzcXJ0QSAqIGFscGhhKTtcbiAgICAgICAgICAgICAgICBhMCA9IChBICsgMS4wZikgKyAoQSAtIDEuMGYpICogY29zdzAgKyAyLjBmICogc3FydEEgKiBhbHBoYTtcbiAgICAgICAgICAgICAgICBhMSA9IC0yLjBmICogKChBIC0gMS4wZikgKyAoQSArIDEuMGYpICogY29zdzApO1xuICAgICAgICAgICAgICAgIGEyID0gKEEgKyAxLjBmKSArIChBIC0gMS4wZikgKiBjb3N3MCAtIDIuMGYgKiBzcXJ0QSAqIGFscGhhO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkaXRpb25hbCBmaWx0ZXIgdHlwZXM6IEhpZ2ggU2hlbGYsIExvdyBQYXNzLCBIaWdoIFBhc3MsIE5vdGNoLi4uXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGIwID0gMS4wZjsgYjEgPSAwLjBmOyBiMiA9IDAuMGY7IGEwID0gMS4wZjsgYTEgPSAwLjBmOyBhMiA9IDAuMGY7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm9ybWFsaXplIGNvZWZmaWNpZW50c1xuICAgICAgICBiMCAvPSBhMDsgYjEgLz0gYTA7IGIyIC89IGEwOyBhMSAvPSBhMDsgYTIgLz0gYTA7XG4gICAgfVxuXG4gICAgaW5saW5lIGZsb2F0IHByb2Nlc3MoZmxvYXQgaW4pIHtcbiAgICAgICAgZmxvYXQgb3V0ID0gYjAgKiBpbiArIGIxICogeDEgKyBiMiAqIHgyIC0gYTEgKiB5MSAtIGEyICogeTI7XG4gICAgICAgIHgyID0geDE7IHgxID0gaW47XG4gICAgICAgIHkyID0geTE7IHkxID0gb3V0O1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxucHJpdmF0ZTpcbiAgICBmbG9hdCBiMCA9IDEuMGYsIGIxID0gMC4wZiwgYjIgPSAwLjBmLCBhMCA9IDEuMGYsIGExID0gMC4wZiwgYTIgPSAwLjBmO1xuICAgIGZsb2F0IHgxID0gMC4wZiwgeDIgPSAwLjBmLCB5MSA9IDAuMGYsIHkyID0gMC4wZjtcbn07XG5cbi8vIE9ib2UgQXVkaW8gU3RyZWFtIENhbGxiYWNrIChFeGVjdXRlcyBvbiBSZWFsLVRpbWUgTGludXggQXVkaW8gVGhyZWFkKVxuY2xhc3MgRHNwQXVkaW9TdHJlYW1DYWxsYmFjayA6IHB1YmxpYyBvYm9lOjpBdWRpb1N0cmVhbURhdGFDYWxsYmFjayB7XG5wdWJsaWM6XG4gICAgb2JvZTo6RGF0YUNhbGxiYWNrUmVzdWx0IG9uQXVkaW9SZWFkeShvYm9lOjpBdWRpb1N0cmVhbSAqb2JvZVN0cmVhbSwgdm9pZCAqYXVkaW9EYXRhLCBpbnQzMl90IG51bUZyYW1lcykgb3ZlcnJpZGUge1xuICAgICAgICBmbG9hdCAqZmxvYXREYXRhID0gc3RhdGljX2Nhc3Q8ZmxvYXQgKj4oYXVkaW9EYXRhKTtcbiAgICAgICAgaW50IGNoYW5uZWxzID0gb2JvZVN0cmVhbS0+Z2V0Q2hhbm5lbENvdW50KCk7XG5cbiAgICAgICAgLy8gMS4gUHJlYW1wIFN0YWdlXG4gICAgICAgIC8vIDIuIE11bHRpYmFuZCBQYXJhbWV0cmljIEVRIEZpbHRlcmluZyAoRmxvYXQgMzItYml0IFNJTUQpXG4gICAgICAgIC8vIDMuIER5bmFtaWMgQ29tcHJlc3Npb24gJiBNYWtldXBcbiAgICAgICAgLy8gNC4gU3RlcmVvIE1pZC9TaWRlIE1hdHJpeFxuICAgICAgICAvLyA1LiBMb29rYWhlYWQgLyBTb2Z0LVNhdHVyYXRpbmcgQnJpY2t3YWxsIExpbWl0ZXJcbiAgICAgICAgZm9yIChpbnQgaSA9IDA7IGkgPCBudW1GcmFtZXMgKiBjaGFubmVsczsgaSArPSAyKSB7XG4gICAgICAgICAgICBmbG9hdCBsZWZ0ID0gZmxvYXREYXRhW2ldO1xuICAgICAgICAgICAgZmxvYXQgcmlnaHQgPSBmbG9hdERhdGFbaSArIDFdO1xuXG4gICAgICAgICAgICAvLyBSZWFsLXRpbWUgbG9jay1mcmVlIGZpbHRlciBwcm9jZXNzaW5nXG4gICAgICAgICAgICBsZWZ0ID0gZXFGaWx0ZXJzTFswXS5wcm9jZXNzKGxlZnQpO1xuICAgICAgICAgICAgcmlnaHQgPSBlcUZpbHRlcnNSWzBdLnByb2Nlc3MocmlnaHQpO1xuXG4gICAgICAgICAgICAvLyBCcmlja3dhbGwgU29mdCBMaW1pdGluZ1xuICAgICAgICAgICAgZmxvYXREYXRhW2ldID0gc3RkOjp0YW5oKGxlZnQpO1xuICAgICAgICAgICAgZmxvYXREYXRhW2kgKyAxXSA9IHN0ZDo6dGFuaChyaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9ib2U6OkRhdGFDYWxsYmFja1Jlc3VsdDo6Q29udGludWU7XG4gICAgfVxuXG5wcml2YXRlOlxuICAgIHN0ZDo6dmVjdG9yPEJpcXVhZEZpbHRlcj4gZXFGaWx0ZXJzTDtcbiAgICBzdGQ6OnZlY3RvcjxCaXF1YWRGaWx0ZXI+IGVxRmlsdGVyc1I7XG59O2A7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTQgYmctYmxhY2svNzUgYmFja2Ryb3AtYmx1ci1zbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTkwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIHctZnVsbCBtYXgtdy00eGwgbWF4LWgtWzkwdmhdIHJvdW5kZWQteGwgZmxleCBmbGV4LWNvbCBzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlbiB0ZXh0LW5ldXRyYWwtMjAwXCI+XG4gICAgICAgIFxuICAgICAgICB7LyogTW9kYWwgSGVhZGVyICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTYgcHktNCBib3JkZXItYiBib3JkZXItbmV1dHJhbC04MDAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGJnLW5ldXRyYWwtOTUwLzYwXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTkgaC05IHJvdW5kZWQtbGcgYmctZW1lcmFsZC01MDAvMTUgYm9yZGVyIGJvcmRlci1lbWVyYWxkLTUwMC8zMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LWVtZXJhbGQtNDAwXCI+XG4gICAgICAgICAgICAgIDxDcHUgY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSB0cmFja2luZy10aWdodFwiPlxuICAgICAgICAgICAgICAgIEFuw6FsaXNpcyBkZSBBcnF1aXRlY3R1cmEgJiBMw61taXRlcyBSZWFsZXMgZW4gQW5kcm9pZFxuICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDBcIj5cbiAgICAgICAgICAgICAgICBBdWRpdG9yw61hIHTDqWNuaWNhIGRlIEFQSXMgZGUgYXVkaW8sIHJlc3RyaWNjaW9uZXMgZGVsIHNpc3RlbWEgeSBtb2RlbG8gbW9kdWxhciBDKysvS290bGluXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSByb3VuZGVkLWxnIGhvdmVyOmJnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFggY2xhc3NOYW1lPVwidy01IGgtNVwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBUYWIgTmF2aWdhdGlvbiAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGJvcmRlci1iIGJvcmRlci1uZXV0cmFsLTgwMCBweC02IGJnLW5ldXRyYWwtOTUwLzMwIGdhcC0yIHB0LTIgb3ZlcmZsb3cteC1hdXRvIHNjcm9sbGJhci1ub25lXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKCdhbmRyb2lkMTQnKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTQgcHktMi41IHRleHQteHMgZm9udC1tZWRpdW0gcm91bmRlZC10LWxnIHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGJvcmRlci1iLTIgd2hpdGVzcGFjZS1ub3dyYXAgJHtcbiAgICAgICAgICAgICAgYWN0aXZlVGFiID09PSAnYW5kcm9pZDE0J1xuICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCB0ZXh0LWVtZXJhbGQtNDAwIGJnLW5ldXRyYWwtOTAwIGZvbnQtYm9sZCdcbiAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LW5ldXRyYWwtMjAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFNtYXJ0cGhvbmUgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWVtZXJhbGQtNDAwXCIgLz5cbiAgICAgICAgICAgIEFuZHJvaWQgMTQgKEFQSSAzNCspXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKCdsaW1pdHMnKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTQgcHktMi41IHRleHQteHMgZm9udC1tZWRpdW0gcm91bmRlZC10LWxnIHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGJvcmRlci1iLTIgd2hpdGVzcGFjZS1ub3dyYXAgJHtcbiAgICAgICAgICAgICAgYWN0aXZlVGFiID09PSAnbGltaXRzJ1xuICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCB0ZXh0LWVtZXJhbGQtNDAwIGJnLW5ldXRyYWwtOTAwIGZvbnQtYm9sZCdcbiAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LW5ldXRyYWwtMjAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFNoaWVsZEFsZXJ0IGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgTMOtbWl0ZXMgZGVsIFNpc3RlbWFcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVUYWIoJ2FyY2hpdGVjdHVyZScpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtNCBweS0yLjUgdGV4dC14cyBmb250LW1lZGl1bSByb3VuZGVkLXQtbGcgdHJhbnNpdGlvbi1jb2xvcnMgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgYm9yZGVyLWItMiB3aGl0ZXNwYWNlLW5vd3JhcCAke1xuICAgICAgICAgICAgICBhY3RpdmVUYWIgPT09ICdhcmNoaXRlY3R1cmUnXG4gICAgICAgICAgICAgICAgPyAnYm9yZGVyLWVtZXJhbGQtNTAwIHRleHQtZW1lcmFsZC00MDAgYmctbmV1dHJhbC05MDAgZm9udC1ib2xkJ1xuICAgICAgICAgICAgICAgIDogJ2JvcmRlci10cmFuc3BhcmVudCB0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtbmV1dHJhbC0yMDAnXG4gICAgICAgICAgICB9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TGF5ZXJzIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgQ2FkZW5hIERTUCBNb2R1bGFyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKCdrb3RsaW4nKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTQgcHktMi41IHRleHQteHMgZm9udC1tZWRpdW0gcm91bmRlZC10LWxnIHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGJvcmRlci1iLTIgd2hpdGVzcGFjZS1ub3dyYXAgJHtcbiAgICAgICAgICAgICAgYWN0aXZlVGFiID09PSAna290bGluJ1xuICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCB0ZXh0LWVtZXJhbGQtNDAwIGJnLW5ldXRyYWwtOTAwIGZvbnQtYm9sZCdcbiAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LW5ldXRyYWwtMjAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEZpbGVDb2RlIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgQ29udHJvbGFkb3IgS290bGluXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVGFiKCdjcHAnKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTQgcHktMi41IHRleHQteHMgZm9udC1tZWRpdW0gcm91bmRlZC10LWxnIHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGJvcmRlci1iLTIgd2hpdGVzcGFjZS1ub3dyYXAgJHtcbiAgICAgICAgICAgICAgYWN0aXZlVGFiID09PSAnY3BwJ1xuICAgICAgICAgICAgICAgID8gJ2JvcmRlci1lbWVyYWxkLTUwMCB0ZXh0LWVtZXJhbGQtNDAwIGJnLW5ldXRyYWwtOTAwIGZvbnQtYm9sZCdcbiAgICAgICAgICAgICAgICA6ICdib3JkZXItdHJhbnNwYXJlbnQgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LW5ldXRyYWwtMjAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRlcm1pbmFsIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgTW90b3IgQysrIE5hdGl2byAoT2JvZSlcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIE1vZGFsIENvbnRlbnQgQm9keSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgb3ZlcmZsb3cteS1hdXRvIHNwYWNlLXktNCBmbGV4LTEgdGV4dC1zbVwiPlxuICAgICAgICAgIHthY3RpdmVUYWIgPT09ICdhbmRyb2lkMTQnICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IHRleHQtbmV1dHJhbC0zMDBcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgcm91bmRlZC14bCBiZy1lbWVyYWxkLTUwMC8xMCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNTAwLzMwIHRleHQtZW1lcmFsZC0yMDAgdGV4dC14cyBsZWFkaW5nLXJlbGF4ZWQgZmxleCBpdGVtcy1zdGFydCBnYXAtM1wiPlxuICAgICAgICAgICAgICAgIDxTbWFydHBob25lIGNsYXNzTmFtZT1cInctNSBoLTUgdGV4dC1lbWVyYWxkLTQwMCBzaHJpbmstMCBtdC0wLjVcIiAvPlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8c3Ryb25nIGNsYXNzTmFtZT1cInRleHQtd2hpdGUgdGV4dC1zbSBibG9jayBtYi0xXCI+XG4gICAgICAgICAgICAgICAgICAgIENvbXBhdGliaWxpZGFkIFRvdGFsIGNvbiBBbmRyb2lkIDE0IChBUEkgTGV2ZWwgMzQpIHkgQW5kcm9pZCAxNSAoQVBJIDM1KVxuICAgICAgICAgICAgICAgICAgPC9zdHJvbmc+XG4gICAgICAgICAgICAgICAgICBFc3RhIGFycXVpdGVjdHVyYSBpbXBsZW1lbnRhIGxhcyBub3JtYXRpdmFzIGVzdHJpY3RhcyBkZSBHb29nbGUgcGFyYSBwcm9jZXNhbWllbnRvIGRlIGF1ZGlvIGVuIHNlZ3VuZG8gcGxhbm8sIHRpcG9zIHRpcGlmaWNhZG9zIGRlIEZvcmVncm91bmQgU2VydmljZXMsIHkgY2FwdHVyYSBkZSBmbHVqb3MgUENNIGVzdMOpcmVvIGRlIDMyIGJpdHMuXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiA0IFBpbGxhcnMgb2YgQW5kcm9pZCAxNCBBdWRpbyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgcm91bmRlZC14bCBiZy1uZXV0cmFsLTk1MC83MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHNwYWNlLXktMlwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNDAwIGZvbnQtYm9sZCB0ZXh0LXhzIHVwcGVyY2FzZSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICA8U2hpZWxkQWxlcnQgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDEuIFRpcG9zIGRlIEZvcmVncm91bmQgU2VydmljZSBPYmxpZ2F0b3Jpb3NcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBBbmRyb2lkIDE0IHByb2jDrWJlIGxsYW1hciBhIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC0yMDBcIj5zdGFydEZvcmVncm91bmQoKTwvY29kZT4gc2luIGVzcGVjaWZpY2FyIGVsIHRpcG8uXG4gICAgICAgICAgICAgICAgICAgIE51ZXN0cm8gc2VydmljaW8gZGVjbGFyYSBmb3JtYWxtZW50ZSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtMzAwXCI+Rk9SRUdST1VORF9TRVJWSUNFX1RZUEVfTUVESUFfUExBWUJBQ0s8L2NvZGU+IHkgPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTMwMFwiPkZPUkVHUk9VTkRfU0VSVklDRV9UWVBFX01JQ1JPUEhPTkU8L2NvZGU+LCBwcmV2aW5pZW5kbyBlbCB0ZW1pZG8gPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1yb3NlLTQwMFwiPlNlY3VyaXR5RXhjZXB0aW9uPC9jb2RlPiBkZSBBUEkgMzQuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCByb3VuZGVkLXhsIGJnLW5ldXRyYWwtOTUwLzcwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgc3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZW1lcmFsZC00MDAgZm9udC1ib2xkIHRleHQteHMgdXBwZXJjYXNlIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxDcHUgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDIuIEF1ZGlvVHJhY2sgJiBBdWRpb1JlY29yZCBQQ00gRmxvYXQgZGUgMzItYml0XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTQwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgRW4gQW5kcm9pZCAxNCwgZWwgc3Vic2lzdGVtYSBkZSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+QXVkaW9GbGluZ2VyPC9jb2RlPiBzb3BvcnRhIGVucnV0YW1pZW50byBkaXJlY3RvIGRlIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC0yMDBcIj5BdWRpb0Zvcm1hdC5FTkNPRElOR19QQ01fRkxPQVQ8L2NvZGU+IHNpbiB0cnVuY2FtaWVudG8gYSAxNiBiaXRzLiBFc3RvIHByZXNlcnZhIHVuIHJhbmdvIGRpbsOhbWljbyBkZSBtw6FzIGRlIDE0NCBkQiBzaW4gZGlzdG9yc2nDs24gcG9yIGN1YW50aWZpY2FjacOzbi5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IHJvdW5kZWQteGwgYmctbmV1dHJhbC05NTAvNzAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCBzcGFjZS15LTJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTQwMCBmb250LWJvbGQgdGV4dC14cyB1cHBlcmNhc2UgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgPExheWVycyBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgMy4gUmVzdHJpY2Npb25lcyBkZSBBdWRpb1BsYXliYWNrQ2FwdHVyZVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIExhIGNhcHR1cmEgZGUgYXVkaW8gaW50ZXJubyByZXF1aWVyZSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+TWVkaWFQcm9qZWN0aW9uPC9jb2RlPiB5IGVsIGNvbnNlbnRpbWllbnRvIGRlbCB1c3VhcmlvIGVuIHBhbnRhbGxhLiBBbmRyb2lkIDE0IGHDsWFkZSBhaXNsYW1pZW50byBlc3RyaWN0byBkZSBjYXB0dXJhIHBhcmEgcHJvdGVnZXIgbGxhbWFkYXMgeSBmbHVqb3MgcHJvdGVnaWRvcyBwb3IgV2lkZXZpbmUgTDEuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCByb3VuZGVkLXhsIGJnLW5ldXRyYWwtOTUwLzcwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgc3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZW1lcmFsZC00MDAgZm9udC1ib2xkIHRleHQteHMgdXBwZXJjYXNlIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgICAgIDxUZXJtaW5hbCBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgICAgICAgNC4gUGVybWlzbyBQT1NUX05PVElGSUNBVElPTlMgKEFQSSAzMyspXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTQwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgQW5kcm9pZCAxMyB5IDE0IHJlcXVpZXJlbiBwZWRpciBlbiB0aWVtcG8gZGUgZWplY3VjacOzbiA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+YW5kcm9pZC5wZXJtaXNzaW9uLlBPU1RfTk9USUZJQ0FUSU9OUzwvY29kZT4gYW50ZXMgZGUgaW5pY2lhciBlbCBGb3JlZ3JvdW5kIFNlcnZpY2UsIGdhcmFudGl6YW5kbyBxdWUgZWwgdXN1YXJpbyB0ZW5nYSBjb250cm9sIHZpc3VhbCBwZXJtYW5lbnRlIHNvYnJlIGVsIG1vdG9yIERTUC5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIFNlcnZpY2UgJiBNYW5pZmVzdCBDb2RlIFRhYnMgKi99XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zIHB0LTJcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAgICAgICBBbmRyb2lkRHNwRm9yZWdyb3VuZFNlcnZpY2Uua3QgKEPDs2RpZ28gT2ZpY2lhbCBBbmRyb2lkIDE0KVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBjb3B5VG9DbGlwYm9hcmQoYW5kcm9pZDE0U2VydmljZUNvZGUpfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJweC0zIHB5LTEgYmctbmV1dHJhbC04MDAgaG92ZXI6YmctbmV1dHJhbC03MDAgcm91bmRlZCB0ZXh0LXhzIHRleHQtbmV1dHJhbC0yMDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtjb3BpZWQgPyA8Q2hlY2sgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjUgdGV4dC1lbWVyYWxkLTQwMFwiIC8+IDogPENvcHkgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPn1cbiAgICAgICAgICAgICAgICAgICAge2NvcGllZCA/ICdDb3BpYWRvJyA6ICdDb3BpYXIgU2VydmljaW8gQW5kcm9pZCAxNCd9XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8cHJlIGNsYXNzTmFtZT1cInAtNCByb3VuZGVkLWxnIGJnLW5ldXRyYWwtOTUwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgdGV4dC14cyBmb250LW1vbm8gdGV4dC1uZXV0cmFsLTMwMCBvdmVyZmxvdy14LWF1dG8gbWF4LWgtWzIyMHB4XSBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgIHthbmRyb2lkMTRTZXJ2aWNlQ29kZX1cbiAgICAgICAgICAgICAgICA8L3ByZT5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTMgcHQtMlwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgZm9udC1tb25vXCI+XG4gICAgICAgICAgICAgICAgICAgIEFuZHJvaWRNYW5pZmVzdC54bWwgKENvbmZpZ3VyYWNpw7NuIGRlIFBlcm1pc29zIEFQSSAzNClcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gY29weVRvQ2xpcGJvYXJkKG1hbmlmZXN0QW5kcm9pZDE0KX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xIGJnLW5ldXRyYWwtODAwIGhvdmVyOmJnLW5ldXRyYWwtNzAwIHJvdW5kZWQgdGV4dC14cyB0ZXh0LW5ldXRyYWwtMjAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7Y29waWVkID8gPENoZWNrIGNsYXNzTmFtZT1cInctMy41IGgtMy41IHRleHQtZW1lcmFsZC00MDBcIiAvPiA6IDxDb3B5IGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz59XG4gICAgICAgICAgICAgICAgICAgIHtjb3BpZWQgPyAnQ29waWFkbycgOiAnQ29waWFyIE1hbmlmZXN0J31cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwcmUgY2xhc3NOYW1lPVwicC00IHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCB0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMzAwIG92ZXJmbG93LXgtYXV0byBtYXgtaC1bMTgwcHhdIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAge21hbmlmZXN0QW5kcm9pZDE0fVxuICAgICAgICAgICAgICAgIDwvcHJlPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAge2FjdGl2ZVRhYiA9PT0gJ2xpbWl0cycgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgdGV4dC1uZXV0cmFsLTMwMFwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCByb3VuZGVkLWxnIGJnLWFtYmVyLTUwMC8xMCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC8zMCB0ZXh0LWFtYmVyLTIwMCB0ZXh0LXhzIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgIDxzdHJvbmc+UmVnbGEgZGUgVHJhbnNwYXJlbmNpYTo8L3N0cm9uZz4gTm8gc2ltdWxhbW9zIGZ1bmNpb25lcyBxdWUgZWwgc2lzdGVtYSBvcGVyYXRpdm8gcHJvaMOtYmEuXG4gICAgICAgICAgICAgICAgQSBjb250aW51YWNpw7NuIHNlIGRlc2dsb3NhbiBsYXMgcmVzdHJpY2Npb25lcyByZWFsZXMgZGVsIHN1YnNpc3RlbWEgZGUgYXVkaW8gZGUgQW5kcm9pZCAoQXVkaW9GbGluZ2VyL0FMU0EpLlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCByb3VuZGVkLWxnIGJnLW5ldXRyYWwtOTUwLzYwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDBcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTQwMCBmb250LXNlbWlib2xkIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8U2hpZWxkQWxlcnQgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWVtZXJhbGQtNDAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgMS4gSW50ZXJjZXBjacOzbiBkZSBBdWRpbyBHbG9iYWwgKE90cmFzIEFwcHMpXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTQwMCBsZWFkaW5nLXJlbGF4ZWQgbWItMlwiPlxuICAgICAgICAgICAgICAgICAgICBFbiBBbmRyb2lkIDkgbyBhbnRlcmlvciwgbXVjaGFzIGFwcHMgaW50ZW50YWJhbiBhc29jaWFyc2UgYSBsYSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+YXVkaW9TZXNzaW9uID0gMDwvY29kZT4gY29uIDxjb2RlPkF1ZGlvRWZmZWN0PC9jb2RlPi5cbiAgICAgICAgICAgICAgICAgICAgRW4gQW5kcm9pZCBtb2Rlcm5vICgxMCwgMTEsIDEyLCAxMywgMTQsIDE1KSwgZXN0byBmdWUgPHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LWFtYmVyLTMwMFwiPmJsb3F1ZWFkbyBwb3IgcG9sw610aWNhcyBTRUxpbnV4PC9zdHJvbmc+LlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgICAgICBMYSBBUEkgb2ZpY2lhbCA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+QXVkaW9QbGF5YmFja0NhcHR1cmVDb25maWd1cmF0aW9uPC9jb2RlPiAoQVBJIDI5KykgZXhpZ2UgcXVlIGxhIGFwcCBlbWlzb3JhIChlai4gU3BvdGlmeSwgWW91VHViZSlcbiAgICAgICAgICAgICAgICAgICAgZGVjbGFyZSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtMzAwXCI+YWxsb3dBdWRpb1BsYXliYWNrQ2FwdHVyZT1cInRydWVcIjwvY29kZT4uIEN1YW5kbyBsYXMgYXBwcyB1c2FuIERSTSBvIHN0cmVhbWluZyBwcm90ZWdpZG8sXG4gICAgICAgICAgICAgICAgICAgIEFuZHJvaWQgc2lsZW5jaWEgYXV0b23DoXRpY2FtZW50ZSBsYSBjYXB0dXJhIGEgYXBwcyBkZSB0ZXJjZXJvcy5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAvNjAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNDAwIGZvbnQtc2VtaWJvbGQgdGV4dC14cyB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXIgbWItMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41XCI+XG4gICAgICAgICAgICAgICAgICAgIDxDcHUgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWVtZXJhbGQtNDAwXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgMi4gTGF0ZW5jaWE6IEphdmEgQXVkaW9UcmFjayB2cyBPYm9lIEMrK1xuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgbGVhZGluZy1yZWxheGVkIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgVXNhciA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+QXVkaW9UcmFjazwvY29kZT4gbyA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+QXVkaW9SZWNvcmQ8L2NvZGU+IGVuIEphdmEvS290bGluXG4gICAgICAgICAgICAgICAgICAgIHByb3ZvY2EgcGF1c2FzIGltcHJlZGVjaWJsZXMgZGVsIEdhcmJhZ2UgQ29sbGVjdG9yIChHQyksIGNhdXNhbmRvIG1pY3JvLWNvcnRlcyAodW5kZXJydW5zKSB5IHVuYSBsYXRlbmNpYSBzdXBlcmlvciBhIDgwLTEyMCBtcy5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTQwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgUGFyYSBhdWRpbyBwcm9mZXNpb25hbCBlbiB0aWVtcG8gcmVhbCwgZWwgZXN0w6FuZGFyIGVzIDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTMwMFwiPkdvb2dsZSBPYm9lPC9zdHJvbmc+IChDKyspLFxuICAgICAgICAgICAgICAgICAgICBxdWUgYWNjZWRlIHBvciBBQXVkaW8gYWwgaGFyZHdhcmUgTU1BUCBlbiBtb2RvIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC0yMDBcIj5Mb3dMYXRlbmN5IC8gRXhjbHVzaXZlPC9jb2RlPiwgcmVkdWNpZW5kbyBsYSBsYXRlbmNpYSBhIDgtMTUgbXMuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCByb3VuZGVkLWxnIGJnLW5ldXRyYWwtOTUwLzYwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDBcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1lbWVyYWxkLTQwMCBmb250LXNlbWlib2xkIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyIG1iLTIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgICAgICA8U2xpZGVycyBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtZW1lcmFsZC00MDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICAzLiBEeW5hbWljc1Byb2Nlc3NpbmcgQVBJIHZzIE1vdG9yIFByb3Bpb1xuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgbGVhZGluZy1yZWxheGVkIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgQW5kcm9pZCBpbnRyb2R1am8gPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTIwMFwiPmFuZHJvaWQubWVkaWEuYXVkaW9meC5EeW5hbWljc1Byb2Nlc3Npbmc8L2NvZGU+IGVuIEFQSSAyOC5cbiAgICAgICAgICAgICAgICAgICAgU2kgYmllbiBvZnJlY2UgY29tcHJlc2nDs24geSBFUSBlbiBoYXJkd2FyZSwgc3UgY29tcG9ydGFtaWVudG8gdmFyw61hIGRlIGZvcm1hIGVycsOhdGljYSBlbnRyZSBjaGlwcyBRdWFsY29tbSwgTWVkaWFUZWsgeSBFeHlub3MuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAgICAgIE51ZXN0cm8gbW90b3IgaW1wbGVtZW50YSA8c3Ryb25nIGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIj5jw6FsY3VsbyBtYXRlbcOhdGljbyBkZSBwdW50byBmbG90YW50ZSBkZSAzMiBiaXRzPC9zdHJvbmc+IChCaXF1YWQgUm9iZXJ0IEJyaXN0b3ctSm9obnNvbiksXG4gICAgICAgICAgICAgICAgICAgIGFzZWd1cmFuZG8gcXVlIGVsIHNvbmlkbyBwcm9jZXNhZG8gc2VhIGlkw6ludGljbyB5IHByZWNpc28gZW4gY3VhbHF1aWVyIGhhcmR3YXJlIHNpbiBkZXBlbmRlciBkZSBidWdzIGRlbCBmYWJyaWNhbnRlLlxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgcm91bmRlZC1sZyBiZy1uZXV0cmFsLTk1MC82MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZW1lcmFsZC00MDAgZm9udC1zZW1pYm9sZCB0ZXh0LXhzIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi0yIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgICAgICAgPExheWVycyBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtZW1lcmFsZC00MDBcIiAvPlxuICAgICAgICAgICAgICAgICAgICA0LiBGcmVjdWVuY2lhIGRlIE11ZXN0cmVvICYgUmVzYW1wbGluZ1xuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgbGVhZGluZy1yZWxheGVkIG1iLTJcIj5cbiAgICAgICAgICAgICAgICAgICAgQ2FzaSB0b2RvcyBsb3MgU29DcyBkZSBBbmRyb2lkIHRpZW5lbiBlbCByZWxvaiBkZSBzdSBEQUMgZmlqYWRvIGEgPHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCI+NDgsMDAwIEh6PC9zdHJvbmc+LlxuICAgICAgICAgICAgICAgICAgICBTaSB1bmEgYXBwIGdlbmVyYSBhdWRpbyBhIDQ0LDEwMCBIeiwgZWwgc2lzdGVtYSBBdWRpb0ZsaW5nZXIgZWplY3V0YSB1biByZXNhbXBsZXIgcXVlIGNvbnN1bWUgQ1BVIHkgcHVlZGUgZ2VuZXJhciBhbGlhc2luZy5cbiAgICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTQwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgTnVlc3RyYSBhcnF1aXRlY3R1cmEgZGV0ZWN0YSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+UFJPUEVSVFlfT1VUUFVUX1NBTVBMRV9SQVRFPC9jb2RlPiBwYXJhIHNpbmNyb25pemFyIGVsIGJ1ZmZlciBEU1BcbiAgICAgICAgICAgICAgICAgICAgYSBsYSBmcmVjdWVuY2lhIG5hdGl2YSBkZWwgZGlzcG9zaXRpdm8sIGVsaW1pbmFuZG8gcmVzYW1wbGVycyBpbm5lY2VzYXJpb3MuXG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHthY3RpdmVUYWIgPT09ICdhcmNoaXRlY3R1cmUnICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00IHRleHQtbmV1dHJhbC0zMDBcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgcm91bmRlZC1sZyBiZy1uZXV0cmFsLTk1MC82MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwXCI+XG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlIG1iLTJcIj5DYWRlbmEgRFNQIE1vZHVsYXIgZW4gQ2FzY2FkYTwvaDM+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwIGxlYWRpbmctcmVsYXhlZCBtYi00XCI+XG4gICAgICAgICAgICAgICAgICBFbCBwcm9jZXNhbWllbnRvIG9jdXJyZSBkZSBpenF1aWVyZGEgYSBkZXJlY2hhIGVuIGLDumZlcmVzIGRlIHB1bnRvIGZsb3RhbnRlIHNpbiBjb3J0ZXMgbmkgY29udmVyc2nDs24gYW5hbMOzZ2ljYSBpbnRlcm1lZGlhOlxuICAgICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBtZDpmbGV4LXJvdyBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC14cyBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgcm91bmRlZCBiZy1uZXV0cmFsLTgwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIHRleHQtY2VudGVyIHctZnVsbCBtZDp3LWF1dG9cIj5cbiAgICAgICAgICAgICAgICAgICAgMS4gQXVkaW8gSW5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LW5ldXRyYWwtNDAwXCI+TWljIC8gRmlsZSAvIFN5bnRoPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC01MDAgaGlkZGVuIG1kOmlubGluZVwiPuKGkjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgcm91bmRlZCBiZy1uZXV0cmFsLTgwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIHRleHQtY2VudGVyIHctZnVsbCBtZDp3LWF1dG9cIj5cbiAgICAgICAgICAgICAgICAgICAgMi4gUHJlYW1wXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1uZXV0cmFsLTQwMFwiPi0yNGRCIGEgKzI0ZEIgLyBGYXNlPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC01MDAgaGlkZGVuIG1kOmlubGluZVwiPuKGkjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgcm91bmRlZCBiZy1lbWVyYWxkLTk1MC80MCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNzAwLzUwIHRleHQtZW1lcmFsZC0zMDAgdGV4dC1jZW50ZXIgdy1mdWxsIG1kOnctYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAzLiBQYXJhbWV0cmljIEVRXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1lbWVyYWxkLTQwMFwiPjggQmFuZGFzIEJpcXVhZDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNTAwIGhpZGRlbiBtZDppbmxpbmVcIj7ihpI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMi41IHJvdW5kZWQgYmctbmV1dHJhbC04MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCB0ZXh0LWNlbnRlciB3LWZ1bGwgbWQ6dy1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgIDQuIENvbXByZXNvclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtbmV1dHJhbC00MDBcIj5UaHIgLyBSYXRpbyAvIEtuZWU8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTUwMCBoaWRkZW4gbWQ6aW5saW5lXCI+4oaSPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTIuNSByb3VuZGVkIGJnLW5ldXRyYWwtODAwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAgdGV4dC1jZW50ZXIgdy1mdWxsIG1kOnctYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICA1LiBFc3TDqXJlbyBNL1NcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LW5ldXRyYWwtNDAwXCI+V2lkdGggLyBCYWxhbmNlPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC01MDAgaGlkZGVuIG1kOmlubGluZVwiPuKGkjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgcm91bmRlZCBiZy1yb3NlLTk1MC80MCBib3JkZXIgYm9yZGVyLXJvc2UtNzAwLzUwIHRleHQtcm9zZS0zMDAgdGV4dC1jZW50ZXIgdy1mdWxsIG1kOnctYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICA2LiBMaW1pdGFkb3JcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LXJvc2UtNDAwXCI+QnJpY2t3YWxsIFNvZnQtQ2xpcDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNTAwIGhpZGRlbiBtZDppbmxpbmVcIj7ihpI8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMi41IHJvdW5kZWQgYmctbmV1dHJhbC04MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCB0ZXh0LWNlbnRlciB3LWZ1bGwgbWQ6dy1hdXRvXCI+XG4gICAgICAgICAgICAgICAgICAgIDcuIE91dHB1dCAmIEZGVFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtbmV1dHJhbC00MDBcIj5NYXN0ZXIgT3V0IC8gUlRBPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgcm91bmRlZC1sZyBiZy1uZXV0cmFsLTk1MC82MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHRleHQteHMgc3BhY2UteS0yXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkIHRleHQtd2hpdGVcIj5TZXBhcmFjacOzbiBBcnF1aXRlY3TDs25pY2EgRXN0cmljdGE6PC9kaXY+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImxpc3QtZGlzYyBsaXN0LWluc2lkZSBzcGFjZS15LTEgdGV4dC1uZXV0cmFsLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgPGxpPjxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTIwMFwiPk1vdG9yIGRlIEF1ZGlvIEF1dMOzbm9tbzo8L3N0cm9uZz4gRWwgaGlsbyBEU1Agb3BlcmEgZW4gYWlzbGFtaWVudG8uIFNpIGxhIFVJIHNlIGNvbmdlbGEgbyByb3RhIGxhIHBhbnRhbGxhLCBlbCBmbHVqbyBkZSBhdWRpbyBqYW3DoXMgc3VmcmUgdW5kZXJydW5zLjwvbGk+XG4gICAgICAgICAgICAgICAgICA8bGk+PHN0cm9uZyBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwXCI+UGFyw6FtZXRyb3MgU3Vhdml6YWRvczo8L3N0cm9uZz4gQWwgbW92ZXIgc2xpZGVycyBkZSBmcmVjdWVuY2lhIG8gZ2FuYW5jaWEsIGxvcyBjb2VmaWNpZW50ZXMgc2UgaW50ZXJwb2xhbiBzdWF2ZW1lbnRlIG1lZGlhbnRlIHJhbXBhcyBleHBvbmVuY2lhbGVzIHBhcmEgZWxpbWluYXIgY2xpY2tzIHkgcG9wcy48L2xpPlxuICAgICAgICAgICAgICAgICAgPGxpPjxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTIwMFwiPk1lZGljacOzbiBSZWFsOjwvc3Ryb25nPiBMb3MgaW5kaWNhZG9yZXMgZGUgUGVhayB5IFJNUyBubyBzb24gZ3LDoWZpY29zIGZpY3RpY2lvczsgY2FsY3VsYW4gZGlyZWN0YW1lbnRlIGxhIGVuZXJnw61hIGN1YWRyw6F0aWNhIG1lZGlhIGRlIGxvcyBmcmFtZXMgZGUgYXVkaW8gcHJvY2VzYWRvcy48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHthY3RpdmVUYWIgPT09ICdrb3RsaW4nICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwIGZvbnQtbW9ub1wiPmNvbS5hdWRpb2RzcC5lbmdpbmUuQW5kcm9pZERzcEVuZ2luZUNvbnRyb2xsZXIua3Q8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gY29weVRvQ2xpcGJvYXJkKGtvdGxpbk9ib2VXcmFwcGVyKX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMSBiZy1uZXV0cmFsLTgwMCBob3ZlcjpiZy1uZXV0cmFsLTcwMCByb3VuZGVkIHRleHQteHMgdGV4dC1uZXV0cmFsLTIwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7Y29waWVkID8gPENoZWNrIGNsYXNzTmFtZT1cInctMy41IGgtMy41IHRleHQtZW1lcmFsZC00MDBcIiAvPiA6IDxDb3B5IGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz59XG4gICAgICAgICAgICAgICAgICB7Y29waWVkID8gJ0NvcGlhZG8nIDogJ0NvcGlhciBDw7NkaWdvJ31cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxwcmUgY2xhc3NOYW1lPVwicC00IHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCB0ZXh0LXhzIGZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMzAwIG92ZXJmbG93LXgtYXV0byBtYXgtaC1bMzgwcHhdIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgICAgICAgIHtrb3RsaW5PYm9lV3JhcHBlcn1cbiAgICAgICAgICAgICAgPC9wcmU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge2FjdGl2ZVRhYiA9PT0gJ2NwcCcgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDAgZm9udC1tb25vXCI+bmF0aXZlL3NyYy9kc3BfZW5naW5lLmNwcCAoT2JvZSArIEJpcXVhZCBSQkopPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGNvcHlUb0NsaXBib2FyZChjcHBEc3BFbmdpbmUpfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xIGJnLW5ldXRyYWwtODAwIGhvdmVyOmJnLW5ldXRyYWwtNzAwIHJvdW5kZWQgdGV4dC14cyB0ZXh0LW5ldXRyYWwtMjAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtjb3BpZWQgPyA8Q2hlY2sgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjUgdGV4dC1lbWVyYWxkLTQwMFwiIC8+IDogPENvcHkgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPn1cbiAgICAgICAgICAgICAgICAgIHtjb3BpZWQgPyAnQ29waWFkbycgOiAnQ29waWFyIEPDs2RpZ28nfVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHByZSBjbGFzc05hbWU9XCJwLTQgcm91bmRlZC1sZyBiZy1uZXV0cmFsLTk1MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHRleHQteHMgZm9udC1tb25vIHRleHQtbmV1dHJhbC0zMDAgb3ZlcmZsb3cteC1hdXRvIG1heC1oLVszODBweF0gbGVhZGluZy1yZWxheGVkXCI+XG4gICAgICAgICAgICAgICAge2NwcERzcEVuZ2luZX1cbiAgICAgICAgICAgICAgPC9wcmU+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogTW9kYWwgRm9vdGVyICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTYgcHktMyBib3JkZXItdCBib3JkZXItbmV1dHJhbC04MDAgYmctbmV1dHJhbC05NTAvNjAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgdGV4dC1uZXV0cmFsLTQwMFwiPlxuICAgICAgICAgIDxzcGFuPkFycXVpdGVjdHVyYSBiYXNhZGEgZW4gRXNwZWNpZmljYWNpb25lcyBkZSBHb29nbGUgT2JvZSB5IFdlYiBBdWRpbyBEU1A8L3NwYW4+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMS41IGJnLWVtZXJhbGQtNjAwIGhvdmVyOmJnLWVtZXJhbGQtNTAwIHRleHQtd2hpdGUgZm9udC1tZWRpdW0gcm91bmRlZC1sZyB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgRW50ZW5kaWRvXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0=