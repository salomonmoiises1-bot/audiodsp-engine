package com.eqsb.backend

import android.util.Log
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.jni.EQsbNativeDsp
import java.util.UUID

/**
 * Application-side marker for the platform EQsb AudioEffect route.
 *
 * A normal APK cannot construct android.media.audiofx.AudioEffect or call its
 * hidden/package-private parameter API. The actual EQsb effect instance is
 * created by the platform Effects HAL/AIDL implementation under platform/aidl.
 * This class therefore only reports whether a privileged platform bridge is
 * available; it never opens a second Oboe output route and never captures audio.
 */
class AudioEffectAudioBackend : IAudioBackend {
    override val type: AudioBackendType = AudioBackendType.AUDIO_EFFECT
    override val name: String = "Android AIDL AudioEffect / AudioFlinger Global Mix"

    private var running = false
    override val isRunning: Boolean get() = running

    companion object {
        private const val TAG = "EQsbAudioEffect"
        val EQSB_EFFECT_UUID: UUID = UUID.fromString("7421cb80-5a33-4f9e-a89a-0242ac120002")
    }

    override fun start(dsp: EQsbNativeDsp): Boolean {
        running = false
        Log.i(
            TAG,
            "EQsb platform AudioEffect is supplied by the Effects HAL/AIDL layer; " +
                "the normal APK does not instantiate android.media.audiofx.AudioEffect."
        )
        return false
    }

    override fun stop() {
        running = false
    }

    override fun applyConfig(config: DspConfig) {
        // Configuration is transported by the privileged platform bridge/HAL.
        // A normal APK has no public AudioEffect parameter API for this custom effect.
    }
}
