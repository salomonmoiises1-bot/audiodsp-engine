package com.eqsb.jni

import com.eqsb.core.DspConfig
import java.nio.ByteBuffer

class EQsbNativeDsp private constructor() {

    private var nativeHandle: Long = 0L

    companion object {
        private var isLibraryLoaded = false

        init {
            try {
                System.loadLibrary("eqsb_dsp")
                isLibraryLoaded = true
            } catch (e: UnsatisfiedLinkError) {
            }
        }

        fun create(): EQsbNativeDsp {
            val dsp = EQsbNativeDsp()
            if (isLibraryLoaded) {
                dsp.nativeHandle = createEngine()
            }
            return dsp
        }

        // Native JNI functions matching EQsbNativeDspJni.cpp
        @JvmStatic private external fun createEngine(): Long
        @JvmStatic private external fun destroyEngine(handle: Long)
        @JvmStatic private external fun initialize(handle: Long, sampleRate: Int, channels: Int, framesPerBlock: Int)
        @JvmStatic private external fun reset(handle: Long)
        @JvmStatic private external fun startOboe(handle: Long): Boolean
        @JvmStatic private external fun stopOboe(handle: Long)
        @JvmStatic private external fun process(handle: Long, pcm: FloatArray, frames: Int)
        @JvmStatic private external fun processDirect(handle: Long, buffer: ByteBuffer, frames: Int)
        @JvmStatic private external fun setPreGain(handle: Long, gainDb: Float)
        @JvmStatic private external fun setBassBoost(handle: Long, enabled: Boolean, strength: Float)
        @JvmStatic private external fun setTone(handle: Long, enabled: Boolean, bassDb: Float, midDb: Float, trebleDb: Float)
        @JvmStatic private external fun setEQ32Enabled(handle: Long, enabled: Boolean)
        @JvmStatic private external fun setBandGain(handle: Long, bandIndex: Int, gainDb: Float)
        @JvmStatic private external fun getBandGain(handle: Long, bandIndex: Int): Float
        @JvmStatic private external fun setAllBandGains(handle: Long, gains: FloatArray)
        @JvmStatic private external fun getAllBandGains(handle: Long): FloatArray?
        @JvmStatic private external fun getCenterFrequency(bandIndex: Int): Float
        @JvmStatic private external fun setMdrcEnabled(handle: Long, enabled: Boolean)
        @JvmStatic private external fun setMdrcBand(handle: Long, bandIndex: Int, threshDb: Float, ratio: Float, attackMs: Float, releaseMs: Float, makeupDb: Float)
        @JvmStatic private external fun setAutoGain(handle: Long, enabled: Boolean, targetDb: Float, maxGainDb: Float, minGainDb: Float)
        @JvmStatic private external fun setLimiter(handle: Long, enabled: Boolean, ceilingDb: Float, releaseMs: Float)
        @JvmStatic private external fun setSpatial(handle: Long, enabled: Boolean, width: Float)
        @JvmStatic private external fun setMasterGain(handle: Long, gainDb: Float)
        @JvmStatic private external fun setBalance(handle: Long, balance: Float)
        @JvmStatic private external fun setBypass(handle: Long, bypass: Boolean)
        @JvmStatic external fun getTechnicalAuditReport(): String?
    }

    fun isNativeReady(): Boolean = nativeHandle != 0L

    fun initialize(sampleRate: Int = 48000, channels: Int = 2, framesPerBlock: Int = 256) {
        if (nativeHandle != 0L) {
            initialize(nativeHandle, sampleRate, channels, framesPerBlock)
        }
    }

    fun startOboeStream(): Boolean = nativeHandle != 0L && startOboe(nativeHandle)

    fun stopOboeStream() {
        if (nativeHandle != 0L) stopOboe(nativeHandle)
    }

    fun resetEngine() {
        if (nativeHandle != 0L) {
            reset(nativeHandle)
        }
    }

    fun processAudio(pcm: FloatArray, frames: Int) {
        if (nativeHandle != 0L) {
            process(nativeHandle, pcm, frames)
        }
    }

    fun processDirectAudio(byteBuffer: ByteBuffer, frames: Int) {
        if (nativeHandle != 0L) {
            processDirect(nativeHandle, byteBuffer, frames)
        }
    }

    fun applyConfig(config: DspConfig) {
        if (nativeHandle == 0L) return

        setBypass(nativeHandle, config.bypass)
        setPreGain(nativeHandle, config.preGainDb)
        setBassBoost(nativeHandle, config.bassBoostEnabled, config.bassBoostStrength)
        setTone(nativeHandle, config.toneEnabled, config.toneBassDb, config.toneMidDb, config.toneTrebleDb)

        setEQ32Enabled(nativeHandle, config.eq32Enabled)
        setAllBandGains(nativeHandle, config.eq32Bands)

        setMdrcEnabled(nativeHandle, config.mdrcEnabled)
        setMdrcBand(nativeHandle, 0, config.mdrcLowThresholdDb, config.mdrcLowRatio, 20f, 120f, 0f)
        setMdrcBand(nativeHandle, 1, config.mdrcMidThresholdDb, config.mdrcMidRatio, 15f, 80f, 0f)
        setMdrcBand(nativeHandle, 2, config.mdrcHighThresholdDb, config.mdrcHighRatio, 10f, 60f, 0f)

        setAutoGain(nativeHandle, config.autoGainEnabled, config.autoGainTargetDb, config.autoGainMaxGainDb, config.autoGainMinGainDb)
        setLimiter(nativeHandle, config.limiterEnabled, config.limiterCeilingDb, config.limiterReleaseMs)
        setSpatial(nativeHandle, config.spatialEnabled, config.spatialWidth)
        setMasterGain(nativeHandle, config.masterGainDb)
        setBalance(nativeHandle, config.balance)
    }

    fun setBandGain(bandIndex: Int, gainDb: Float) {
        if (nativeHandle != 0L) {
            setBandGain(nativeHandle, bandIndex, gainDb)
        }
    }

    fun getBandGain(bandIndex: Int): Float {
        return if (nativeHandle != 0L) getBandGain(nativeHandle, bandIndex) else 0f
    }

    fun destroy() {
        if (nativeHandle != 0L) {
            destroyEngine(nativeHandle)
            nativeHandle = 0L
        }
    }
}
