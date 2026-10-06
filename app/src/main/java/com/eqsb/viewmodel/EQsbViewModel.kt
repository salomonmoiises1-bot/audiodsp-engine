package com.eqsb.viewmodel

import android.app.Application
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.IBinder
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.eqsb.backend.AudioRoutingAudit
import com.eqsb.core.AudioBackendType
import com.eqsb.core.DspConfig
import com.eqsb.core.Preset
import com.eqsb.core.Presets
import com.eqsb.data.DspConfigRepository
import com.eqsb.service.EQsbAudioService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class EQsbViewModel(application: Application) : AndroidViewModel(application) {

    private val repository = DspConfigRepository(application)

    private val _config = MutableStateFlow(repository.loadConfig())
    val config: StateFlow<DspConfig> = _config.asStateFlow()

    private val _currentPreset = MutableStateFlow(Presets.getById(repository.getCurrentPresetId()))
    val currentPreset: StateFlow<Preset> = _currentPreset.asStateFlow()

    private val _isServiceConnected = MutableStateFlow(false)
    val isServiceConnected: StateFlow<Boolean> = _isServiceConnected.asStateFlow()

    private val _isAudioEngineRunning = MutableStateFlow(false)
    val isAudioEngineRunning: StateFlow<Boolean> = _isAudioEngineRunning.asStateFlow()

    private var audioService: EQsbAudioService? = null

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            val binder = service as? EQsbAudioService.LocalBinder
            audioService = binder?.getService()
            _isServiceConnected.value = true

            audioService?.let { s ->
                viewModelScope.launch {
                    s.isServiceActive.collect { active ->
                        _isAudioEngineRunning.value = active
                    }
                }
                viewModelScope.launch {
                    s.configFlow.collect { newCfg ->
                        _config.value = newCfg
                    }
                }
                s.updateConfig(_config.value)
            }
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            audioService = null
            _isServiceConnected.value = false
            _isAudioEngineRunning.value = false
        }
    }

    init {
        bindAudioService()
    }

    private fun bindAudioService() {
        val intent = Intent(getApplication(), EQsbAudioService::class.java)
        getApplication<Application>().bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    fun startAudioEngine() {
        val intent = Intent(getApplication(), EQsbAudioService::class.java).apply {
            action = EQsbAudioService.ACTION_START
        }
        getApplication<Application>().startForegroundService(intent)
    }

    fun stopAudioEngine() {
        val intent = Intent(getApplication(), EQsbAudioService::class.java).apply {
            action = EQsbAudioService.ACTION_STOP
        }
        getApplication<Application>().startService(intent)
    }

    fun toggleBypass() {
        val updated = _config.value.copy(bypass = !_config.value.bypass)
        applyConfigUpdate(updated)
    }

    fun setPreGain(gainDb: Float) {
        applyConfigUpdate(_config.value.copy(preGainDb = gainDb))
    }

    fun setBassBoost(enabled: Boolean, strength: Float) {
        applyConfigUpdate(_config.value.copy(bassBoostEnabled = enabled, bassBoostStrength = strength))
    }

    fun setTone(enabled: Boolean, bassDb: Float, midDb: Float, trebleDb: Float) {
        applyConfigUpdate(
            _config.value.copy(
                toneEnabled = enabled,
                toneBassDb = bassDb,
                toneMidDb = midDb,
                toneTrebleDb = trebleDb
            )
        )
    }

    fun setEQ32Enabled(enabled: Boolean) {
        applyConfigUpdate(_config.value.copy(eq32Enabled = enabled))
    }

    fun setBandGain(bandIndex: Int, gainDb: Float) {
        val updated = _config.value.copyWithBand(bandIndex, gainDb)
        applyConfigUpdate(updated)
    }

    fun resetEQFlat() {
        val flatBands = FloatArray(32) { 0.0f }
        val updated = _config.value.copyWithAllBands(flatBands)
        applyConfigUpdate(updated)
    }

    fun setMdrcConfig(
        enabled: Boolean,
        lowThresh: Float, lowRatio: Float,
        midThresh: Float, midRatio: Float,
        highThresh: Float, highRatio: Float
    ) {
        applyConfigUpdate(
            _config.value.copy(
                mdrcEnabled = enabled,
                mdrcLowThresholdDb = lowThresh, mdrcLowRatio = lowRatio,
                mdrcMidThresholdDb = midThresh, mdrcMidRatio = midRatio,
                mdrcHighThresholdDb = highThresh, mdrcHighRatio = highRatio
            )
        )
    }

    fun setAutoGain(enabled: Boolean, targetDb: Float) {
        applyConfigUpdate(_config.value.copy(autoGainEnabled = enabled, autoGainTargetDb = targetDb))
    }

    fun setLimiter(enabled: Boolean, ceilingDb: Float) {
        applyConfigUpdate(_config.value.copy(limiterEnabled = enabled, limiterCeilingDb = ceilingDb))
    }

    fun setSpatial(enabled: Boolean, width: Float) {
        applyConfigUpdate(_config.value.copy(spatialEnabled = enabled, spatialWidth = width))
    }

    fun setMasterGain(gainDb: Float) {
        applyConfigUpdate(_config.value.copy(masterGainDb = gainDb))
    }

    fun setBalance(balance: Float) {
        applyConfigUpdate(_config.value.copy(balance = balance))
    }

    fun setBackendType(backendType: AudioBackendType) {
        applyConfigUpdate(_config.value.copy(backendType = backendType))
    }

    fun loadPreset(preset: Preset) {
        _currentPreset.value = preset
        repository.saveCurrentPresetId(preset.id)
        applyConfigUpdate(preset.config)
    }

    private fun applyConfigUpdate(newConfig: DspConfig) {
        _config.value = newConfig
        repository.saveConfig(newConfig)
        audioService?.updateConfig(newConfig)
    }

    fun getAuditSections() = AudioRoutingAudit.SECTIONS

    override fun onCleared() {
        super.onCleared()
        try {
            getApplication<Application>().unbindService(serviceConnection)
        } catch (e: Exception) {
            // Unbind safely
        }
    }
}
