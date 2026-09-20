import { ISO_32_FREQUENCIES, createDefault32Bands } from "/src/audio/presets.ts";
// Hyperbolic tangent soft saturation curve
function createSoftClipCurve(samples = 4096, ceiling = .98, drive = 1) {
	const curve = new Float32Array(samples);
	for (let i = 0; i < samples; ++i) {
		const x = i * 2 / samples - 1;
		// Soft tanh saturation
		curve[i] = ceiling * Math.tanh(x * drive / ceiling);
	}
	return curve;
}
export class DSPEngine {
	constructor() {
		this.ctx = null;
		this.inputGainNode = null;
		this.inputPhaseNode = null;
		this.preAnalyserNode = null;
		this.bassBoostSubHPF = null;
		this.bassBoostFilter = null;
		this.bassBoostHarmonicsNode = null;
		this.bassBoostHarmonicsGain = null;
		this.bassBoostDryGain = null;
		this.bassBoostWetGain = null;
		this.bassBoostOutputGain = null;
		this.virtSplitter = null;
		this.virtMidGainL = null;
		this.virtMidGainR = null;
		this.virtSideGainL = null;
		this.virtSideGainR = null;
		this.virtSideWidthGain = null;
		this.virtCrossfeedDelayL = null;
		this.virtCrossfeedDelayR = null;
		this.virtCrossfeedLPF_L = null;
		this.virtCrossfeedLPF_R = null;
		this.virtCrossfeedGainL = null;
		this.virtCrossfeedGainR = null;
		this.virtMerger = null;
		this.virtDryGain = null;
		this.virtWetGain = null;
		this.virtOutputGain = null;
		this.eq32FilterNodes = [];
		this.eq32InputNode = null;
		this.eq32OutputNode = null;
		this.toneBassNode = null;
		this.toneMidNode = null;
		this.toneTrebleNode = null;
		this.toneDryGain = null;
		this.toneWetGain = null;
		this.toneOutputGain = null;
		this.mdrcInputGain = null;
		this.mdrcLowLPF = null;
		this.mdrcLowComp = null;
		this.mdrcLowGain = null;
		this.mdrcMidHPF = null;
		this.mdrcMidLPF = null;
		this.mdrcMidComp = null;
		this.mdrcMidGain = null;
		this.mdrcHighHPF = null;
		this.mdrcHighComp = null;
		this.mdrcHighGain = null;
		this.mdrcSummingGain = null;
		this.mdrcDryGain = null;
		this.mdrcWetGain = null;
		this.mdrcOutputGain = null;
		this.autoGainNode = null;
		this.autoGainDetectorAnalyser = null;
		this.autoGainCurrentOffset = 0;
		this.autoGainSmoothingWindow = .95;
		this.masterGainNode = null;
		this.limiterPreGainNode = null;
		this.limiterFastCompNode = null;
		this.limiterWaveShaperNode = null;
		this.limiterDryGain = null;
		this.limiterWetGain = null;
		this.limiterOutputGain = null;
		this.masterDryGain = null;
		this.masterWetGain = null;
		this.postAnalyserNode = null;
		this.currentSourceType = "none";
		this.micStream = null;
		this.micSourceNode = null;
		this.audioElement = null;
		this.mediaElementSourceNode = null;
		this.synthOscillator = null;
		this.synthGain = null;
		this.noiseBufferNode = null;
		this.isSweepRunning = false;
		this.sweepTimer = null;
		this.preGainConfig = {
			enabled: true,
			gainDB: 0,
			phaseInvert: false
		};
		this.bassBoostConfig = {
			enabled: false,
			frequency: 80,
			boostDB: 4.5,
			harmonics: 25,
			subCutoff: 25
		};
		this.virtConfig = {
			enabled: false,
			intensity: 35,
			mode: "headphones",
			crossfeed: .35
		};
		this.eq32Bands = createDefault32Bands();
		this.toneConfig = {
			enabled: true,
			bassDB: 0,
			midDB: 0,
			trebleDB: 0
		};
		this.mdrcConfig = {
			enabled: false,
			lowThreshold: -18,
			lowRatio: 3,
			lowGainDB: 1.5,
			midThreshold: -20,
			midRatio: 2.5,
			midGainDB: .5,
			highThreshold: -22,
			highRatio: 2.8,
			highGainDB: 1,
			attackMs: 15,
			releaseMs: 120
		};
		this.autoGainConfig = {
			enabled: false,
			targetDB: -14,
			speed: "medium",
			maxBoostDB: 6,
			maxCutDB: -8
		};
		this.masterGainConfig = { gainDB: 0 };
		this.limiterConfig = {
			enabled: true,
			ceilingDB: -.2,
			driveDB: 0,
			releaseMs: 60,
			curve: "hyperbolic_tanh"
		};
		this.masterBypass = false;
		this.isClipping = false;
		this.clipResetTimer = null;
		// AudioContext is initialized upon user interaction to satisfy browser policies
	}
	async initAudio() {
		if (!this.ctx) {
			const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
			this.ctx = new AudioCtxClass({ latencyHint: "interactive" });
			this.buildDSPGraph();
			this.startAutoGainLoop();
		}
		if (this.ctx.state === "suspended") {
			await this.ctx.resume();
		}
		return this.ctx;
	}
	getContext() {
		return this.ctx;
	}
	isInitialized() {
		return this.ctx !== null;
	}
	buildDSPGraph() {
		if (!this.ctx) return;
		const now = this.ctx.currentTime;
		// === 1. Input Stage & Pre-Analyser ===
		this.inputGainNode = this.ctx.createGain();
		this.inputPhaseNode = this.ctx.createGain();
		this.inputGainNode.connect(this.inputPhaseNode);
		this.preAnalyserNode = this.ctx.createAnalyser();
		this.preAnalyserNode.fftSize = 2048;
		this.preAnalyserNode.smoothingTimeConstant = .8;
		this.inputPhaseNode.connect(this.preAnalyserNode);
		// Master Dry Branch for Master Bypass
		this.masterDryGain = this.ctx.createGain();
		this.masterWetGain = this.ctx.createGain();
		this.inputPhaseNode.connect(this.masterDryGain);
		// === 2. Bass Boost Stage ===
		// Subsonic cut
		this.bassBoostSubHPF = this.ctx.createBiquadFilter();
		this.bassBoostSubHPF.type = "highpass";
		this.bassBoostSubHPF.frequency.setValueAtTime(25, now);
		this.bassBoostSubHPF.Q.setValueAtTime(.71, now);
		this.inputPhaseNode.connect(this.bassBoostSubHPF);
		// Boost Resonant Filter
		this.bassBoostFilter = this.ctx.createBiquadFilter();
		this.bassBoostFilter.type = "peaking";
		this.bassBoostFilter.frequency.setValueAtTime(80, now);
		this.bassBoostFilter.Q.setValueAtTime(1.4, now);
		this.bassBoostFilter.gain.setValueAtTime(0, now);
		this.bassBoostSubHPF.connect(this.bassBoostFilter);
		// Harmonics generation (soft shaper)
		this.bassBoostHarmonicsNode = this.ctx.createWaveShaper();
		this.bassBoostHarmonicsNode.curve = createSoftClipCurve(1024, .9, 1.8);
		this.bassBoostHarmonicsNode.oversample = "2x";
		this.bassBoostHarmonicsGain = this.ctx.createGain();
		this.bassBoostHarmonicsGain.gain.setValueAtTime(0, now);
		this.bassBoostFilter.connect(this.bassBoostHarmonicsNode);
		this.bassBoostHarmonicsNode.connect(this.bassBoostHarmonicsGain);
		// Bass Boost Dry/Wet mixer
		this.bassBoostDryGain = this.ctx.createGain();
		this.bassBoostWetGain = this.ctx.createGain();
		this.bassBoostOutputGain = this.ctx.createGain();
		this.inputPhaseNode.connect(this.bassBoostDryGain);
		this.bassBoostFilter.connect(this.bassBoostWetGain);
		this.bassBoostHarmonicsGain.connect(this.bassBoostWetGain);
		this.bassBoostDryGain.connect(this.bassBoostOutputGain);
		this.bassBoostWetGain.connect(this.bassBoostOutputGain);
		// === 3. Virtualizer Stage (Stereo Widening & Interaural Delay) ===
		this.virtSplitter = this.ctx.createChannelSplitter(2);
		this.virtMerger = this.ctx.createChannelMerger(2);
		this.virtMidGainL = this.ctx.createGain();
		this.virtMidGainR = this.ctx.createGain();
		this.virtSideGainL = this.ctx.createGain();
		this.virtSideGainR = this.ctx.createGain();
		this.virtSideWidthGain = this.ctx.createGain();
		this.virtCrossfeedDelayL = this.ctx.createDelay(.01);
		this.virtCrossfeedDelayR = this.ctx.createDelay(.01);
		this.virtCrossfeedDelayL.delayTime.setValueAtTime(35e-5, now);
		this.virtCrossfeedDelayR.delayTime.setValueAtTime(35e-5, now);
		this.virtCrossfeedLPF_L = this.ctx.createBiquadFilter();
		this.virtCrossfeedLPF_R = this.ctx.createBiquadFilter();
		this.virtCrossfeedLPF_L.type = "lowpass";
		this.virtCrossfeedLPF_R.type = "lowpass";
		this.virtCrossfeedLPF_L.frequency.setValueAtTime(3200, now);
		this.virtCrossfeedLPF_R.frequency.setValueAtTime(3200, now);
		this.virtCrossfeedGainL = this.ctx.createGain();
		this.virtCrossfeedGainR = this.ctx.createGain();
		this.virtCrossfeedGainL.gain.setValueAtTime(.3, now);
		this.virtCrossfeedGainR.gain.setValueAtTime(.3, now);
		this.virtDryGain = this.ctx.createGain();
		this.virtWetGain = this.ctx.createGain();
		this.virtOutputGain = this.ctx.createGain();
		this.bassBoostOutputGain.connect(this.virtDryGain);
		this.bassBoostOutputGain.connect(this.virtSplitter);
		// M/S and Crossfeed connections
		this.virtSplitter.connect(this.virtMidGainL, 0);
		this.virtSplitter.connect(this.virtMidGainR, 1);
		this.virtMidGainL.gain.setValueAtTime(.5, now);
		this.virtMidGainR.gain.setValueAtTime(.5, now);
		this.virtSplitter.connect(this.virtSideGainL, 0);
		this.virtSplitter.connect(this.virtSideGainR, 1);
		this.virtSideGainL.gain.setValueAtTime(.5, now);
		this.virtSideGainR.gain.setValueAtTime(-.5, now);
		this.virtSideGainL.connect(this.virtSideWidthGain);
		this.virtSideGainR.connect(this.virtSideWidthGain);
		this.virtSideWidthGain.gain.setValueAtTime(1, now);
		// Recombine to L/R
		this.virtMidGainL.connect(this.virtMerger, 0, 0);
		this.virtMidGainR.connect(this.virtMerger, 0, 1);
		this.virtSideWidthGain.connect(this.virtMerger, 0, 0);
		this.virtSideWidthGain.connect(this.virtMerger, 0, 1);
		// Crossfeed
		this.virtSplitter.connect(this.virtCrossfeedDelayL, 1);
		this.virtSplitter.connect(this.virtCrossfeedDelayR, 0);
		this.virtCrossfeedDelayL.connect(this.virtCrossfeedLPF_L);
		this.virtCrossfeedDelayR.connect(this.virtCrossfeedLPF_R);
		this.virtCrossfeedLPF_L.connect(this.virtCrossfeedGainL);
		this.virtCrossfeedLPF_R.connect(this.virtCrossfeedGainR);
		this.virtCrossfeedGainL.connect(this.virtMerger, 0, 0);
		this.virtCrossfeedGainR.connect(this.virtMerger, 0, 1);
		this.virtMerger.connect(this.virtWetGain);
		this.virtDryGain.connect(this.virtOutputGain);
		this.virtWetGain.connect(this.virtOutputGain);
		// === 4. 32-Band ISO Equalizer Stage ===
		this.eq32InputNode = this.ctx.createGain();
		this.eq32OutputNode = this.ctx.createGain();
		this.virtOutputGain.connect(this.eq32InputNode);
		// Build the 32 cascading biquad filter nodes
		this.eq32FilterNodes = [];
		let previousNode = this.eq32InputNode;
		for (let i = 0; i < 32; i++) {
			const filter = this.ctx.createBiquadFilter();
			filter.type = "peaking";
			filter.frequency.setValueAtTime(ISO_32_FREQUENCIES[i].freq, now);
			filter.Q.setValueAtTime(4.318, now);
			filter.gain.setValueAtTime(0, now);
			previousNode.connect(filter);
			previousNode = filter;
			this.eq32FilterNodes.push(filter);
		}
		previousNode.connect(this.eq32OutputNode);
		// === 5. Tone Controls (Bass / Mid / Treble) ===
		this.toneBassNode = this.ctx.createBiquadFilter();
		this.toneBassNode.type = "lowshelf";
		this.toneBassNode.frequency.setValueAtTime(120, now);
		this.toneBassNode.gain.setValueAtTime(0, now);
		this.toneMidNode = this.ctx.createBiquadFilter();
		this.toneMidNode.type = "peaking";
		this.toneMidNode.frequency.setValueAtTime(1e3, now);
		this.toneMidNode.Q.setValueAtTime(.9, now);
		this.toneMidNode.gain.setValueAtTime(0, now);
		this.toneTrebleNode = this.ctx.createBiquadFilter();
		this.toneTrebleNode.type = "highshelf";
		this.toneTrebleNode.frequency.setValueAtTime(7500, now);
		this.toneTrebleNode.gain.setValueAtTime(0, now);
		this.toneDryGain = this.ctx.createGain();
		this.toneWetGain = this.ctx.createGain();
		this.toneOutputGain = this.ctx.createGain();
		this.eq32OutputNode.connect(this.toneDryGain);
		this.eq32OutputNode.connect(this.toneBassNode);
		this.toneBassNode.connect(this.toneMidNode);
		this.toneMidNode.connect(this.toneTrebleNode);
		this.toneTrebleNode.connect(this.toneWetGain);
		this.toneDryGain.connect(this.toneOutputGain);
		this.toneWetGain.connect(this.toneOutputGain);
		// === 6. MDRC (Multi-Band Dynamic Range Control) ===
		this.mdrcInputGain = this.ctx.createGain();
		this.toneOutputGain.connect(this.mdrcInputGain);
		this.mdrcDryGain = this.ctx.createGain();
		this.mdrcWetGain = this.ctx.createGain();
		this.mdrcSummingGain = this.ctx.createGain();
		this.mdrcOutputGain = this.ctx.createGain();
		this.mdrcInputGain.connect(this.mdrcDryGain);
		// Low Band (< 250 Hz)
		this.mdrcLowLPF = this.ctx.createBiquadFilter();
		this.mdrcLowLPF.type = "lowpass";
		this.mdrcLowLPF.frequency.setValueAtTime(250, now);
		this.mdrcLowComp = this.ctx.createDynamicsCompressor();
		this.mdrcLowGain = this.ctx.createGain();
		this.mdrcInputGain.connect(this.mdrcLowLPF);
		this.mdrcLowLPF.connect(this.mdrcLowComp);
		this.mdrcLowComp.connect(this.mdrcLowGain);
		this.mdrcLowGain.connect(this.mdrcSummingGain);
		// Mid Band (250 Hz - 4000 Hz)
		this.mdrcMidHPF = this.ctx.createBiquadFilter();
		this.mdrcMidHPF.type = "highpass";
		this.mdrcMidHPF.frequency.setValueAtTime(250, now);
		this.mdrcMidLPF = this.ctx.createBiquadFilter();
		this.mdrcMidLPF.type = "lowpass";
		this.mdrcMidLPF.frequency.setValueAtTime(4e3, now);
		this.mdrcMidComp = this.ctx.createDynamicsCompressor();
		this.mdrcMidGain = this.ctx.createGain();
		this.mdrcInputGain.connect(this.mdrcMidHPF);
		this.mdrcMidHPF.connect(this.mdrcMidLPF);
		this.mdrcMidLPF.connect(this.mdrcMidComp);
		this.mdrcMidComp.connect(this.mdrcMidGain);
		this.mdrcMidGain.connect(this.mdrcSummingGain);
		// High Band (> 4000 Hz)
		this.mdrcHighHPF = this.ctx.createBiquadFilter();
		this.mdrcHighHPF.type = "highpass";
		this.mdrcHighHPF.frequency.setValueAtTime(4e3, now);
		this.mdrcHighComp = this.ctx.createDynamicsCompressor();
		this.mdrcHighGain = this.ctx.createGain();
		this.mdrcInputGain.connect(this.mdrcHighHPF);
		this.mdrcHighHPF.connect(this.mdrcHighComp);
		this.mdrcHighComp.connect(this.mdrcHighGain);
		this.mdrcHighGain.connect(this.mdrcSummingGain);
		this.mdrcSummingGain.connect(this.mdrcWetGain);
		this.mdrcDryGain.connect(this.mdrcOutputGain);
		this.mdrcWetGain.connect(this.mdrcOutputGain);
		// Default bypass for MDRC
		this.mdrcDryGain.gain.setValueAtTime(1, now);
		this.mdrcWetGain.gain.setValueAtTime(0, now);
		// === 7. AutoGain Stage ===
		this.autoGainNode = this.ctx.createGain();
		this.autoGainDetectorAnalyser = this.ctx.createAnalyser();
		this.autoGainDetectorAnalyser.fftSize = 1024;
		this.mdrcOutputGain.connect(this.autoGainNode);
		this.autoGainNode.connect(this.autoGainDetectorAnalyser);
		// === 8. Master Gain Stage ===
		this.masterGainNode = this.ctx.createGain();
		this.autoGainNode.connect(this.masterGainNode);
		// === 9. Soft Limiter Stage ===
		this.limiterPreGainNode = this.ctx.createGain();
		this.limiterFastCompNode = this.ctx.createDynamicsCompressor();
		this.limiterFastCompNode.threshold.setValueAtTime(-.5, now);
		this.limiterFastCompNode.knee.setValueAtTime(0, now);
		this.limiterFastCompNode.ratio.setValueAtTime(20, now);
		this.limiterFastCompNode.attack.setValueAtTime(.002, now);
		this.limiterFastCompNode.release.setValueAtTime(.05, now);
		this.limiterWaveShaperNode = this.ctx.createWaveShaper();
		this.limiterWaveShaperNode.curve = createSoftClipCurve(4096, .98, 1);
		this.limiterWaveShaperNode.oversample = "4x";
		this.limiterDryGain = this.ctx.createGain();
		this.limiterWetGain = this.ctx.createGain();
		this.limiterOutputGain = this.ctx.createGain();
		this.masterGainNode.connect(this.limiterDryGain);
		this.masterGainNode.connect(this.limiterPreGainNode);
		this.limiterPreGainNode.connect(this.limiterFastCompNode);
		this.limiterFastCompNode.connect(this.limiterWaveShaperNode);
		this.limiterWaveShaperNode.connect(this.limiterWetGain);
		this.limiterDryGain.connect(this.limiterOutputGain);
		this.limiterWetGain.connect(this.limiterOutputGain);
		// Default limiter active
		this.limiterDryGain.gain.setValueAtTime(0, now);
		this.limiterWetGain.gain.setValueAtTime(1, now);
		// === 10. Master Bypass Routing & Output ===
		this.limiterOutputGain.connect(this.masterWetGain);
		this.postAnalyserNode = this.ctx.createAnalyser();
		this.postAnalyserNode.fftSize = 2048;
		this.postAnalyserNode.smoothingTimeConstant = .75;
		this.masterDryGain.connect(this.postAnalyserNode);
		this.masterWetGain.connect(this.postAnalyserNode);
		this.masterDryGain.gain.setValueAtTime(0, now);
		this.masterWetGain.gain.setValueAtTime(1, now);
		// Final route to hardware DAC destination
		this.postAnalyserNode.connect(this.ctx.destination);
	}
	// === Parameter Update Methods ===
	updatePreGain(cfg) {
		this.preGainConfig = cfg;
		if (!this.ctx || !this.inputGainNode || !this.inputPhaseNode) return;
		const now = this.ctx.currentTime;
		const lin = cfg.enabled ? Math.pow(10, cfg.gainDB / 20) : 1;
		this.inputGainNode.gain.setTargetAtTime(lin, now, .015);
		this.inputPhaseNode.gain.setTargetAtTime(cfg.phaseInvert ? -1 : 1, now, .015);
	}
	updateBassBoost(cfg) {
		this.bassBoostConfig = cfg;
		if (!this.ctx || !this.bassBoostFilter || !this.bassBoostSubHPF || !this.bassBoostDryGain || !this.bassBoostWetGain) return;
		const now = this.ctx.currentTime;
		this.bassBoostSubHPF.frequency.setTargetAtTime(cfg.subCutoff, now, .02);
		this.bassBoostFilter.frequency.setTargetAtTime(cfg.frequency, now, .02);
		this.bassBoostFilter.gain.setTargetAtTime(cfg.boostDB, now, .02);
		if (this.bassBoostHarmonicsGain) {
			const harmGain = cfg.harmonics / 100 * .35;
			this.bassBoostHarmonicsGain.gain.setTargetAtTime(harmGain, now, .02);
		}
		if (cfg.enabled) {
			this.bassBoostDryGain.gain.setTargetAtTime(0, now, .015);
			this.bassBoostWetGain.gain.setTargetAtTime(1, now, .015);
		} else {
			this.bassBoostDryGain.gain.setTargetAtTime(1, now, .015);
			this.bassBoostWetGain.gain.setTargetAtTime(0, now, .015);
		}
	}
	updateVirtualizer(cfg) {
		this.virtConfig = cfg;
		if (!this.ctx || !this.virtDryGain || !this.virtWetGain || !this.virtSideWidthGain) return;
		const now = this.ctx.currentTime;
		if (!cfg.enabled) {
			this.virtDryGain.gain.setTargetAtTime(1, now, .02);
			this.virtWetGain.gain.setTargetAtTime(0, now, .02);
			return;
		}
		this.virtDryGain.gain.setTargetAtTime(0, now, .02);
		this.virtWetGain.gain.setTargetAtTime(1, now, .02);
		const normIntensity = cfg.intensity / 100;
		// Width: 1.0 (normal) to 1.8 (extra wide)
		const width = 1 + normIntensity * .8;
		this.virtSideWidthGain.gain.setTargetAtTime(width, now, .02);
		// Crossfeed delay and curve depending on mode
		let delaySec = 3e-4;
		let lpfFreq = 3600;
		let crossGain = .25 * normIntensity;
		if (cfg.mode === "headphones") {
			delaySec = 45e-5;
			lpfFreq = 3e3;
			crossGain = .35 * normIntensity;
		} else if (cfg.mode === "wide") {
			delaySec = 6e-4;
			lpfFreq = 4200;
			crossGain = .45 * normIntensity;
		}
		if (this.virtCrossfeedDelayL && this.virtCrossfeedDelayR) {
			this.virtCrossfeedDelayL.delayTime.setTargetAtTime(delaySec, now, .02);
			this.virtCrossfeedDelayR.delayTime.setTargetAtTime(delaySec, now, .02);
		}
		if (this.virtCrossfeedLPF_L && this.virtCrossfeedLPF_R) {
			this.virtCrossfeedLPF_L.frequency.setTargetAtTime(lpfFreq, now, .02);
			this.virtCrossfeedLPF_R.frequency.setTargetAtTime(lpfFreq, now, .02);
		}
		if (this.virtCrossfeedGainL && this.virtCrossfeedGainR) {
			this.virtCrossfeedGainL.gain.setTargetAtTime(crossGain, now, .02);
			this.virtCrossfeedGainR.gain.setTargetAtTime(crossGain, now, .02);
		}
	}
	update32Band(band) {
		if (band.index < 0 || band.index >= this.eq32Bands.length) return;
		this.eq32Bands[band.index] = { ...band };
		if (!this.ctx || !this.eq32FilterNodes[band.index]) return;
		const filter = this.eq32FilterNodes[band.index];
		const now = this.ctx.currentTime;
		const effectiveGain = band.enabled ? band.gain : 0;
		filter.frequency.setTargetAtTime(band.frequency, now, .02);
		filter.Q.setTargetAtTime(band.q, now, .02);
		filter.gain.setTargetAtTime(effectiveGain, now, .02);
	}
	updateAll32Bands(bands) {
		this.eq32Bands = [...bands];
		if (!this.ctx || this.eq32FilterNodes.length < 32) return;
		const now = this.ctx.currentTime;
		bands.forEach((band, i) => {
			const filter = this.eq32FilterNodes[i];
			if (filter) {
				const effectiveGain = band.enabled ? band.gain : 0;
				filter.frequency.setTargetAtTime(band.frequency, now, .015);
				filter.Q.setTargetAtTime(band.q, now, .015);
				filter.gain.setTargetAtTime(effectiveGain, now, .015);
			}
		});
	}
	updateTone(cfg) {
		this.toneConfig = cfg;
		if (!this.ctx || !this.toneBassNode || !this.toneMidNode || !this.toneTrebleNode || !this.toneDryGain || !this.toneWetGain) return;
		const now = this.ctx.currentTime;
		if (!cfg.enabled) {
			this.toneDryGain.gain.setTargetAtTime(1, now, .02);
			this.toneWetGain.gain.setTargetAtTime(0, now, .02);
			return;
		}
		this.toneDryGain.gain.setTargetAtTime(0, now, .02);
		this.toneWetGain.gain.setTargetAtTime(1, now, .02);
		this.toneBassNode.gain.setTargetAtTime(cfg.bassDB, now, .02);
		this.toneMidNode.gain.setTargetAtTime(cfg.midDB, now, .02);
		this.toneTrebleNode.gain.setTargetAtTime(cfg.trebleDB, now, .02);
	}
	updateMDRC(cfg) {
		this.mdrcConfig = cfg;
		if (!this.ctx || !this.mdrcDryGain || !this.mdrcWetGain) return;
		const now = this.ctx.currentTime;
		if (!cfg.enabled) {
			this.mdrcDryGain.gain.setTargetAtTime(1, now, .02);
			this.mdrcWetGain.gain.setTargetAtTime(0, now, .02);
			return;
		}
		this.mdrcDryGain.gain.setTargetAtTime(0, now, .02);
		this.mdrcWetGain.gain.setTargetAtTime(1, now, .02);
		const attSec = Math.max(.001, cfg.attackMs / 1e3);
		const relSec = Math.max(.01, cfg.releaseMs / 1e3);
		// Low
		if (this.mdrcLowComp && this.mdrcLowGain) {
			this.mdrcLowComp.threshold.setTargetAtTime(cfg.lowThreshold, now, .02);
			this.mdrcLowComp.ratio.setTargetAtTime(cfg.lowRatio, now, .02);
			this.mdrcLowComp.attack.setTargetAtTime(attSec, now, .02);
			this.mdrcLowComp.release.setTargetAtTime(relSec, now, .02);
			this.mdrcLowGain.gain.setTargetAtTime(Math.pow(10, cfg.lowGainDB / 20), now, .02);
		}
		// Mid
		if (this.mdrcMidComp && this.mdrcMidGain) {
			this.mdrcMidComp.threshold.setTargetAtTime(cfg.midThreshold, now, .02);
			this.mdrcMidComp.ratio.setTargetAtTime(cfg.midRatio, now, .02);
			this.mdrcMidComp.attack.setTargetAtTime(attSec, now, .02);
			this.mdrcMidComp.release.setTargetAtTime(relSec, now, .02);
			this.mdrcMidGain.gain.setTargetAtTime(Math.pow(10, cfg.midGainDB / 20), now, .02);
		}
		// High
		if (this.mdrcHighComp && this.mdrcHighGain) {
			this.mdrcHighComp.threshold.setTargetAtTime(cfg.highThreshold, now, .02);
			this.mdrcHighComp.ratio.setTargetAtTime(cfg.highRatio, now, .02);
			this.mdrcHighComp.attack.setTargetAtTime(attSec, now, .02);
			this.mdrcHighComp.release.setTargetAtTime(relSec, now, .02);
			this.mdrcHighGain.gain.setTargetAtTime(Math.pow(10, cfg.highGainDB / 20), now, .02);
		}
	}
	updateAutoGain(cfg) {
		this.autoGainConfig = cfg;
		if (cfg.speed === "fast") this.autoGainSmoothingWindow = .85;
		else if (cfg.speed === "slow") this.autoGainSmoothingWindow = .98;
		else this.autoGainSmoothingWindow = .94;
	}
	updateMasterGain(cfg) {
		this.masterGainConfig = cfg;
		if (!this.ctx || !this.masterGainNode) return;
		const now = this.ctx.currentTime;
		const lin = Math.pow(10, cfg.gainDB / 20);
		this.masterGainNode.gain.setTargetAtTime(lin, now, .02);
	}
	updateLimiter(cfg) {
		this.limiterConfig = cfg;
		if (!this.ctx || !this.limiterDryGain || !this.limiterWetGain || !this.limiterPreGainNode || !this.limiterFastCompNode) return;
		const now = this.ctx.currentTime;
		if (!cfg.enabled) {
			this.limiterDryGain.gain.setTargetAtTime(1, now, .02);
			this.limiterWetGain.gain.setTargetAtTime(0, now, .02);
			return;
		}
		this.limiterDryGain.gain.setTargetAtTime(0, now, .02);
		this.limiterWetGain.gain.setTargetAtTime(1, now, .02);
		const preGainLin = Math.pow(10, cfg.driveDB / 20);
		this.limiterPreGainNode.gain.setTargetAtTime(preGainLin, now, .02);
		this.limiterFastCompNode.threshold.setTargetAtTime(cfg.ceilingDB, now, .02);
		this.limiterFastCompNode.release.setTargetAtTime(Math.max(.01, cfg.releaseMs / 1e3), now, .02);
		// Dynamic wave shape for ceiling
		if (this.limiterWaveShaperNode) {
			const ceilingLin = Math.pow(10, cfg.ceilingDB / 20);
			const driveLin = 1 + cfg.driveDB / 12 * .5;
			this.limiterWaveShaperNode.curve = createSoftClipCurve(4096, ceilingLin, driveLin);
		}
	}
	setMasterBypass(bypass) {
		this.masterBypass = bypass;
		if (!this.ctx || !this.masterDryGain || !this.masterWetGain) return;
		const now = this.ctx.currentTime;
		if (bypass) {
			this.masterDryGain.gain.setTargetAtTime(1, now, .02);
			this.masterWetGain.gain.setTargetAtTime(0, now, .02);
		} else {
			this.masterDryGain.gain.setTargetAtTime(0, now, .02);
			this.masterWetGain.gain.setTargetAtTime(1, now, .02);
		}
	}
	// === Closed-Loop AutoGain Worker ===
	startAutoGainLoop() {
		const buffer = new Float32Array(512);
		window.setInterval(() => {
			if (!this.ctx || !this.autoGainConfig.enabled || !this.autoGainDetectorAnalyser || !this.autoGainNode) {
				return;
			}
			this.autoGainDetectorAnalyser.getFloatTimeDomainData(buffer);
			let sumSq = 0;
			for (let i = 0; i < buffer.length; i++) {
				sumSq += buffer[i] * buffer[i];
			}
			const rms = Math.sqrt(sumSq / buffer.length);
			if (rms < .005) {
				// Signal is silent or near-zero, keep current offset
				return;
			}
			const currentRMS_DB = 20 * Math.log10(rms);
			const errorDB = this.autoGainConfig.targetDB - currentRMS_DB;
			// Clamp offset within user limits
			const clampedTargetOffset = Math.max(this.autoGainConfig.maxCutDB, Math.min(this.autoGainConfig.maxBoostDB, errorDB));
			// Smooth integration
			this.autoGainCurrentOffset = this.autoGainCurrentOffset * this.autoGainSmoothingWindow + clampedTargetOffset * (1 - this.autoGainSmoothingWindow);
			const targetGainLin = Math.pow(10, this.autoGainCurrentOffset / 20);
			this.autoGainNode.gain.setTargetAtTime(targetGainLin, this.ctx.currentTime, .1);
		}, 50);
	}
	// === Audio Sources Setup (File, Mic, Synth Test Generator) ===
	async setAudioSource(type, options) {
		await this.initAudio();
		if (!this.ctx || !this.inputGainNode) return;
		this.stopCurrentSource();
		this.currentSourceType = type;
		if (type === "file" && options?.file) {
			if (!this.audioElement) {
				this.audioElement = new Audio();
				this.audioElement.crossOrigin = "anonymous";
				this.audioElement.loop = true;
			}
			const url = URL.createObjectURL(options.file);
			this.audioElement.src = url;
			if (!this.mediaElementSourceNode) {
				this.mediaElementSourceNode = this.ctx.createMediaElementSource(this.audioElement);
				this.mediaElementSourceNode.connect(this.inputGainNode);
			}
			await this.audioElement.play();
		} else if (type === "mic") {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false
				} });
				this.micStream = stream;
				this.micSourceNode = this.ctx.createMediaStreamSource(stream);
				this.micSourceNode.connect(this.inputGainNode);
			} catch (err) {
				this.currentSourceType = "none";
				throw err;
			}
		} else if (type === "synth") {
			const sType = options?.synthType || "sweep";
			const freq = options?.synthFreq || 440;
			this.startSynthSource(sType, freq);
		}
	}
	startSynthSource(synthType, freq) {
		if (!this.ctx || !this.inputGainNode) return;
		this.synthGain = this.ctx.createGain();
		this.synthGain.gain.setValueAtTime(.25, this.ctx.currentTime);
		this.synthGain.connect(this.inputGainNode);
		if (synthType === "sine") {
			this.synthOscillator = this.ctx.createOscillator();
			this.synthOscillator.type = "sine";
			this.synthOscillator.frequency.setValueAtTime(freq, this.ctx.currentTime);
			this.synthOscillator.connect(this.synthGain);
			this.synthOscillator.start();
		} else if (synthType === "sweep") {
			this.synthOscillator = this.ctx.createOscillator();
			this.synthOscillator.type = "sine";
			this.synthOscillator.connect(this.synthGain);
			const runLogSweep = () => {
				if (!this.synthOscillator || !this.ctx) return;
				const now = this.ctx.currentTime;
				this.synthOscillator.frequency.cancelScheduledValues(now);
				this.synthOscillator.frequency.setValueAtTime(20, now);
				this.synthOscillator.frequency.exponentialRampToValueAtTime(2e4, now + 5);
			};
			runLogSweep();
			this.synthOscillator.start();
			this.isSweepRunning = true;
			this.sweepTimer = window.setInterval(runLogSweep, 5200);
		} else if (synthType === "white_noise") {
			const bufferSize = this.ctx.sampleRate * 2;
			const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
			const output = noiseBuffer.getChannelData(0);
			for (let i = 0; i < bufferSize; i++) {
				output[i] = Math.random() * 2 - 1;
			}
			this.noiseBufferNode = this.ctx.createBufferSource();
			this.noiseBufferNode.buffer = noiseBuffer;
			this.noiseBufferNode.loop = true;
			this.noiseBufferNode.connect(this.synthGain);
			this.noiseBufferNode.start();
		} else if (synthType === "pink_noise") {
			// Kellet 1/f filter approximation
			const bufferSize = this.ctx.sampleRate * 2;
			const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
			const output = noiseBuffer.getChannelData(0);
			let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
			for (let i = 0; i < bufferSize; i++) {
				const white = Math.random() * 2 - 1;
				b0 = .99886 * b0 + white * .0555179;
				b1 = .99332 * b1 + white * .0750759;
				b2 = .969 * b2 + white * .153852;
				b3 = .8665 * b3 + white * .3104856;
				b4 = .55 * b4 + white * .5329522;
				b5 = -.7616 * b5 - white * .016898;
				output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * .5362) * .11;
				b6 = white * .115926;
			}
			this.noiseBufferNode = this.ctx.createBufferSource();
			this.noiseBufferNode.buffer = noiseBuffer;
			this.noiseBufferNode.loop = true;
			this.noiseBufferNode.connect(this.synthGain);
			this.noiseBufferNode.start();
		}
	}
	setSynthFrequency(f) {
		if (this.synthOscillator && this.ctx) {
			this.synthOscillator.frequency.setTargetAtTime(f, this.ctx.currentTime, .02);
		}
	}
	stopCurrentSource() {
		if (this.audioElement) {
			this.audioElement.pause();
		}
		if (this.micStream) {
			this.micStream.getTracks().forEach((t) => t.stop());
			this.micStream = null;
		}
		if (this.micSourceNode) {
			this.micSourceNode.disconnect();
			this.micSourceNode = null;
		}
		if (this.sweepTimer) {
			clearInterval(this.sweepTimer);
			this.sweepTimer = null;
			this.isSweepRunning = false;
		}
		if (this.synthOscillator) {
			try {
				this.synthOscillator.stop();
			} catch {}
			this.synthOscillator.disconnect();
			this.synthOscillator = null;
		}
		if (this.noiseBufferNode) {
			try {
				this.noiseBufferNode.stop();
			} catch {}
			this.noiseBufferNode.disconnect();
			this.noiseBufferNode = null;
		}
		if (this.synthGain) {
			this.synthGain.disconnect();
			this.synthGain = null;
		}
		this.currentSourceType = "none";
	}
	getAudioElement() {
		return this.audioElement;
	}
	// === Telemetry & FFT Analysis Readouts ===
	getTelemetry() {
		if (!this.ctx || !this.postAnalyserNode) {
			return {
				sampleRate: 48e3,
				channels: 2,
				state: "closed",
				baseLatency: .005,
				bufferSize: 512,
				inputPeakL: 0,
				inputPeakR: 0,
				outputPeakL: 0,
				outputPeakR: 0,
				outputRMSL: 0,
				outputRMSR: 0,
				mdrcGainReductionLow: 0,
				mdrcGainReductionMid: 0,
				mdrcGainReductionHigh: 0,
				autoGainCurrentOffsetDB: 0,
				limiterReductionDB: 0,
				isClipping: this.isClipping
			};
		}
		const timeDomain = new Float32Array(512);
		this.postAnalyserNode.getFloatTimeDomainData(timeDomain);
		let peak = 0;
		let sumSq = 0;
		for (let i = 0; i < timeDomain.length; i++) {
			const val = Math.abs(timeDomain[i]);
			if (val > peak) peak = val;
			sumSq += val * val;
		}
		const rms = Math.sqrt(sumSq / timeDomain.length);
		if (peak >= .999) {
			this.isClipping = true;
			if (this.clipResetTimer) window.clearTimeout(this.clipResetTimer);
			this.clipResetTimer = window.setTimeout(() => {
				this.isClipping = false;
			}, 1500);
		}
		const lowGR = this.mdrcLowComp ? Math.abs(this.mdrcLowComp.reduction) : 0;
		const midGR = this.mdrcMidComp ? Math.abs(this.mdrcMidComp.reduction) : 0;
		const highGR = this.mdrcHighComp ? Math.abs(this.mdrcHighComp.reduction) : 0;
		const limGR = this.limiterFastCompNode ? Math.abs(this.limiterFastCompNode.reduction) : 0;
		return {
			sampleRate: this.ctx.sampleRate,
			channels: 2,
			state: this.ctx.state,
			baseLatency: this.ctx.baseLatency || .005,
			bufferSize: 512,
			inputPeakL: peak * .9,
			inputPeakR: peak * .9,
			outputPeakL: peak,
			outputPeakR: peak,
			outputRMSL: rms,
			outputRMSR: rms,
			mdrcGainReductionLow: lowGR,
			mdrcGainReductionMid: midGR,
			mdrcGainReductionHigh: highGR,
			autoGainCurrentOffsetDB: this.autoGainCurrentOffset,
			limiterReductionDB: limGR,
			isClipping: this.isClipping
		};
	}
	getPreFrequencyData(array) {
		if (this.preAnalyserNode) {
			this.preAnalyserNode.getByteFrequencyData(array);
		}
	}
	getPostFrequencyData(array) {
		if (this.postAnalyserNode) {
			this.postAnalyserNode.getByteFrequencyData(array);
		}
	}
	getPostTimeDomainData(array) {
		if (this.postAnalyserNode) {
			this.postAnalyserNode.getByteTimeDomainData(array);
		}
	}
	get32Bands() {
		return this.eq32Bands;
	}
}
export const dspEngine = new DSPEngine();

//# sourceMappingURL=data:application/json;base64,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QUF5QixLQUFLO0dBQzlCLG9CQUFvQjtHQUNwQixZQUFZLEtBQUs7RUFDbkI7Q0FDRjtDQUVBLEFBQU8sb0JBQW9CLE9BQXlCO0VBQ2xELElBQUksS0FBSyxpQkFBaUI7R0FDeEIsS0FBSyxnQkFBZ0IscUJBQXFCLEtBQTJDO0VBQ3ZGO0NBQ0Y7Q0FFQSxBQUFPLHFCQUFxQixPQUF5QjtFQUNuRCxJQUFJLEtBQUssa0JBQWtCO0dBQ3pCLEtBQUssaUJBQWlCLHFCQUFxQixLQUEyQztFQUN4RjtDQUNGO0NBRUEsQUFBTyxzQkFBc0IsT0FBeUI7RUFDcEQsSUFBSSxLQUFLLGtCQUFrQjtHQUN6QixLQUFLLGlCQUFpQixzQkFBc0IsS0FBMkM7RUFDekY7Q0FDRjtDQUVBLEFBQU8sYUFBeUI7RUFDOUIsT0FBTyxLQUFLO0NBQ2Q7QUFDRjtBQUVBLE9BQU8sTUFBTSxZQUFZLElBQUksVUFBVSIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJkc3BFbmdpbmUudHMiXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiLy8gUHJvZmVzc2lvbmFsIFNvZnR3YXJlIEF1ZGlvIERTUCBFbmdpbmVcbi8vIENvbXBsZXRlIDEwLXN0YWdlIHByb2Nlc3NpbmcgY2hhaW46XG4vLyBQcmUtR2FpbiAtPiBCYXNzIEJvb3N0IC0+IFZpcnR1YWxpemVyIC0+IDMyLUJhbmQgSVNPIEVRIC0+IFRvbmUgKEJhc3MvTWlkL1RyZWJsZSkgLT4gTURSQyAtPiBBdXRvR2FpbiAtPiBNYXN0ZXIgR2FpbiAtPiBTb2Z0IExpbWl0ZXIgLT4gT3V0cHV0XG5cbmltcG9ydCB7XG4gIFByZUdhaW5Db25maWcsXG4gIEJhc3NCb29zdENvbmZpZyxcbiAgVmlydHVhbGl6ZXJDb25maWcsXG4gIEVRMzJCYW5kLFxuICBUb25lQ29udHJvbHNDb25maWcsXG4gIE1EUkNDb25maWcsXG4gIEF1dG9HYWluQ29uZmlnLFxuICBNYXN0ZXJHYWluQ29uZmlnLFxuICBTb2Z0TGltaXRlckNvbmZpZyxcbiAgQXVkaW9Tb3VyY2VUeXBlLFxuICBTeW50aFNpZ25hbFR5cGUsXG4gIEF1ZGlvVGVsZW1ldHJ5LFxufSBmcm9tICcuLi90eXBlcy9kc3AnO1xuaW1wb3J0IHsgSVNPXzMyX0ZSRVFVRU5DSUVTLCBjcmVhdGVEZWZhdWx0MzJCYW5kcyB9IGZyb20gJy4vcHJlc2V0cyc7XG5cbi8vIEh5cGVyYm9saWMgdGFuZ2VudCBzb2Z0IHNhdHVyYXRpb24gY3VydmVcbmZ1bmN0aW9uIGNyZWF0ZVNvZnRDbGlwQ3VydmUoc2FtcGxlcyA9IDQwOTYsIGNlaWxpbmcgPSAwLjk4LCBkcml2ZSA9IDEuMCk6IEZsb2F0MzJBcnJheSB7XG4gIGNvbnN0IGN1cnZlID0gbmV3IEZsb2F0MzJBcnJheShzYW1wbGVzKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzYW1wbGVzOyArK2kpIHtcbiAgICBjb25zdCB4ID0gKGkgKiAyKSAvIHNhbXBsZXMgLSAxOyAvLyAtMS4wIHRvICsxLjBcbiAgICAvLyBTb2Z0IHRhbmggc2F0dXJhdGlvblxuICAgIGN1cnZlW2ldID0gY2VpbGluZyAqIE1hdGgudGFuaCgoeCAqIGRyaXZlKSAvIGNlaWxpbmcpO1xuICB9XG4gIHJldHVybiBjdXJ2ZTtcbn1cblxuZXhwb3J0IGNsYXNzIERTUEVuZ2luZSB7XG4gIHByaXZhdGUgY3R4OiBBdWRpb0NvbnRleHQgfCBudWxsID0gbnVsbDtcblxuICAvLyAxLiBJbnB1dCAmIFByZS1BbmFseXNlclxuICBwcml2YXRlIGlucHV0R2Fpbk5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaW5wdXRQaGFzZU5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgcHJlQW5hbHlzZXJOb2RlOiBBbmFseXNlck5vZGUgfCBudWxsID0gbnVsbDtcblxuICAvLyAyLiBCYXNzIEJvb3N0IFNlY3Rpb25cbiAgcHJpdmF0ZSBiYXNzQm9vc3RTdWJIUEY6IEJpcXVhZEZpbHRlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBiYXNzQm9vc3RGaWx0ZXI6IEJpcXVhZEZpbHRlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBiYXNzQm9vc3RIYXJtb25pY3NOb2RlOiBXYXZlU2hhcGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGJhc3NCb29zdEhhcm1vbmljc0dhaW46IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgYmFzc0Jvb3N0RHJ5R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBiYXNzQm9vc3RXZXRHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGJhc3NCb29zdE91dHB1dEdhaW46IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gMy4gVmlydHVhbGl6ZXIgU2VjdGlvbiAoTWlkL1NpZGUgKyBJbnRlcmF1cmFsIERlbGF5KVxuICBwcml2YXRlIHZpcnRTcGxpdHRlcjogQ2hhbm5lbFNwbGl0dGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRNaWRHYWluTDogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB2aXJ0TWlkR2FpblI6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdmlydFNpZGVHYWluTDogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB2aXJ0U2lkZUdhaW5SOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRTaWRlV2lkdGhHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRDcm9zc2ZlZWREZWxheUw6IERlbGF5Tm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRDcm9zc2ZlZWREZWxheVI6IERlbGF5Tm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRDcm9zc2ZlZWRMUEZfTDogQmlxdWFkRmlsdGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRDcm9zc2ZlZWRMUEZfUjogQmlxdWFkRmlsdGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHZpcnRDcm9zc2ZlZWRHYWluTDogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB2aXJ0Q3Jvc3NmZWVkR2FpblI6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdmlydE1lcmdlcjogQ2hhbm5lbE1lcmdlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB2aXJ0RHJ5R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB2aXJ0V2V0R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB2aXJ0T3V0cHV0R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcblxuICAvLyA0LiAzMi1CYW5kIElTTyBFcXVhbGl6ZXJcbiAgcHJpdmF0ZSBlcTMyRmlsdGVyTm9kZXM6IEJpcXVhZEZpbHRlck5vZGVbXSA9IFtdO1xuICBwcml2YXRlIGVxMzJJbnB1dE5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZXEzMk91dHB1dE5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gNS4gVG9uZSBDb250cm9scyAoQmFzcywgTWlkLCBUcmVibGUpXG4gIHByaXZhdGUgdG9uZUJhc3NOb2RlOiBCaXF1YWRGaWx0ZXJOb2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdG9uZU1pZE5vZGU6IEJpcXVhZEZpbHRlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSB0b25lVHJlYmxlTm9kZTogQmlxdWFkRmlsdGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvbmVEcnlHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvbmVXZXRHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvbmVPdXRwdXRHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIDYuIE1EUkMgKE11bHRpLUJhbmQgRHluYW1pYyBSYW5nZSBDb250cm9sKVxuICBwcml2YXRlIG1kcmNJbnB1dEdhaW46IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIC8vIExvdyBCYW5kICg8IDI1MCBIeilcbiAgcHJpdmF0ZSBtZHJjTG93TFBGOiBCaXF1YWRGaWx0ZXJOb2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbWRyY0xvd0NvbXA6IER5bmFtaWNzQ29tcHJlc3Nvck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBtZHJjTG93R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgLy8gTWlkIEJhbmQgKDI1MCBIeiAtIDQwMDAgSHopXG4gIHByaXZhdGUgbWRyY01pZEhQRjogQmlxdWFkRmlsdGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNNaWRMUEY6IEJpcXVhZEZpbHRlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBtZHJjTWlkQ29tcDogRHluYW1pY3NDb21wcmVzc29yTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNNaWRHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICAvLyBIaWdoIEJhbmQgKD4gNDAwMCBIeilcbiAgcHJpdmF0ZSBtZHJjSGlnaEhQRjogQmlxdWFkRmlsdGVyTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNIaWdoQ29tcDogRHluYW1pY3NDb21wcmVzc29yTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNIaWdoR2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgLy8gTURSQyBTdW1taW5nICYgQnlwYXNzXG4gIHByaXZhdGUgbWRyY1N1bW1pbmdHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNEcnlHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNXZXRHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1kcmNPdXRwdXRHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuXG4gIC8vIDcuIEF1dG9HYWluIFNlY3Rpb25cbiAgcHJpdmF0ZSBhdXRvR2Fpbk5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgYXV0b0dhaW5EZXRlY3RvckFuYWx5c2VyOiBBbmFseXNlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBhdXRvR2FpbkN1cnJlbnRPZmZzZXQgPSAwOyAvLyBpbiBkQlxuICBwcml2YXRlIGF1dG9HYWluU21vb3RoaW5nV2luZG93ID0gMC45NTtcblxuICAvLyA4LiBNYXN0ZXIgR2FpbiBTZWN0aW9uXG4gIHByaXZhdGUgbWFzdGVyR2Fpbk5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG5cbiAgLy8gOS4gU29mdCBMaW1pdGVyIFNlY3Rpb25cbiAgcHJpdmF0ZSBsaW1pdGVyUHJlR2Fpbk5vZGU6IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGltaXRlckZhc3RDb21wTm9kZTogRHluYW1pY3NDb21wcmVzc29yTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxpbWl0ZXJXYXZlU2hhcGVyTm9kZTogV2F2ZVNoYXBlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsaW1pdGVyRHJ5R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsaW1pdGVyV2V0R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsaW1pdGVyT3V0cHV0R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcblxuICAvLyAxMC4gTWFzdGVyIEJ5cGFzcyAmIEZpbmFsIE91dHB1dFxuICBwcml2YXRlIG1hc3RlckRyeUdhaW46IEdhaW5Ob2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbWFzdGVyV2V0R2FpbjogR2Fpbk5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBwb3N0QW5hbHlzZXJOb2RlOiBBbmFseXNlck5vZGUgfCBudWxsID0gbnVsbDtcblxuICAvLyBBdWRpbyBTb3VyY2VzXG4gIHByaXZhdGUgY3VycmVudFNvdXJjZVR5cGU6IEF1ZGlvU291cmNlVHlwZSA9ICdub25lJztcbiAgcHJpdmF0ZSBtaWNTdHJlYW06IE1lZGlhU3RyZWFtIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbWljU291cmNlTm9kZTogTWVkaWFTdHJlYW1BdWRpb1NvdXJjZU5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBhdWRpb0VsZW1lbnQ6IEhUTUxBdWRpb0VsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBtZWRpYUVsZW1lbnRTb3VyY2VOb2RlOiBNZWRpYUVsZW1lbnRBdWRpb1NvdXJjZU5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzeW50aE9zY2lsbGF0b3I6IE9zY2lsbGF0b3JOb2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3ludGhHYWluOiBHYWluTm9kZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG5vaXNlQnVmZmVyTm9kZTogQXVkaW9CdWZmZXJTb3VyY2VOb2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaXNTd2VlcFJ1bm5pbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzd2VlcFRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvLyBTdGF0ZSBjYWNoZXNcbiAgcHJpdmF0ZSBwcmVHYWluQ29uZmlnOiBQcmVHYWluQ29uZmlnID0geyBlbmFibGVkOiB0cnVlLCBnYWluREI6IDAsIHBoYXNlSW52ZXJ0OiBmYWxzZSB9O1xuICBwcml2YXRlIGJhc3NCb29zdENvbmZpZzogQmFzc0Jvb3N0Q29uZmlnID0geyBlbmFibGVkOiBmYWxzZSwgZnJlcXVlbmN5OiA4MCwgYm9vc3REQjogNC41LCBoYXJtb25pY3M6IDI1LCBzdWJDdXRvZmY6IDI1IH07XG4gIHByaXZhdGUgdmlydENvbmZpZzogVmlydHVhbGl6ZXJDb25maWcgPSB7IGVuYWJsZWQ6IGZhbHNlLCBpbnRlbnNpdHk6IDM1LCBtb2RlOiAnaGVhZHBob25lcycsIGNyb3NzZmVlZDogMC4zNSB9O1xuICBwcml2YXRlIGVxMzJCYW5kczogRVEzMkJhbmRbXSA9IGNyZWF0ZURlZmF1bHQzMkJhbmRzKCk7XG4gIHByaXZhdGUgdG9uZUNvbmZpZzogVG9uZUNvbnRyb2xzQ29uZmlnID0geyBlbmFibGVkOiB0cnVlLCBiYXNzREI6IDAsIG1pZERCOiAwLCB0cmVibGVEQjogMCB9O1xuICBwcml2YXRlIG1kcmNDb25maWc6IE1EUkNDb25maWcgPSB7XG4gICAgZW5hYmxlZDogZmFsc2UsXG4gICAgbG93VGhyZXNob2xkOiAtMTgsXG4gICAgbG93UmF0aW86IDMuMCxcbiAgICBsb3dHYWluREI6IDEuNSxcbiAgICBtaWRUaHJlc2hvbGQ6IC0yMCxcbiAgICBtaWRSYXRpbzogMi41LFxuICAgIG1pZEdhaW5EQjogMC41LFxuICAgIGhpZ2hUaHJlc2hvbGQ6IC0yMixcbiAgICBoaWdoUmF0aW86IDIuOCxcbiAgICBoaWdoR2FpbkRCOiAxLjAsXG4gICAgYXR0YWNrTXM6IDE1LFxuICAgIHJlbGVhc2VNczogMTIwLFxuICB9O1xuICBwcml2YXRlIGF1dG9HYWluQ29uZmlnOiBBdXRvR2FpbkNvbmZpZyA9IHsgZW5hYmxlZDogZmFsc2UsIHRhcmdldERCOiAtMTQsIHNwZWVkOiAnbWVkaXVtJywgbWF4Qm9vc3REQjogNiwgbWF4Q3V0REI6IC04IH07XG4gIHByaXZhdGUgbWFzdGVyR2FpbkNvbmZpZzogTWFzdGVyR2FpbkNvbmZpZyA9IHsgZ2FpbkRCOiAwIH07XG4gIHByaXZhdGUgbGltaXRlckNvbmZpZzogU29mdExpbWl0ZXJDb25maWcgPSB7IGVuYWJsZWQ6IHRydWUsIGNlaWxpbmdEQjogLTAuMiwgZHJpdmVEQjogMCwgcmVsZWFzZU1zOiA2MCwgY3VydmU6ICdoeXBlcmJvbGljX3RhbmgnIH07XG4gIHByaXZhdGUgbWFzdGVyQnlwYXNzID0gZmFsc2U7XG5cbiAgLy8gQ2xpcHBpbmcgJiBUZWxlbWV0cnlcbiAgcHJpdmF0ZSBpc0NsaXBwaW5nID0gZmFsc2U7XG4gIHByaXZhdGUgY2xpcFJlc2V0VGltZXI6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIEF1ZGlvQ29udGV4dCBpcyBpbml0aWFsaXplZCB1cG9uIHVzZXIgaW50ZXJhY3Rpb24gdG8gc2F0aXNmeSBicm93c2VyIHBvbGljaWVzXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgaW5pdEF1ZGlvKCk6IFByb21pc2U8QXVkaW9Db250ZXh0PiB7XG4gICAgaWYgKCF0aGlzLmN0eCkge1xuICAgICAgY29uc3QgQXVkaW9DdHhDbGFzcyA9IHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgKHdpbmRvdyBhcyB1bmtub3duIGFzIHsgd2Via2l0QXVkaW9Db250ZXh0OiB0eXBlb2YgQXVkaW9Db250ZXh0IH0pLndlYmtpdEF1ZGlvQ29udGV4dDtcbiAgICAgIHRoaXMuY3R4ID0gbmV3IEF1ZGlvQ3R4Q2xhc3MoeyBsYXRlbmN5SGludDogJ2ludGVyYWN0aXZlJyB9KTtcbiAgICAgIHRoaXMuYnVpbGREU1BHcmFwaCgpO1xuICAgICAgdGhpcy5zdGFydEF1dG9HYWluTG9vcCgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jdHguc3RhdGUgPT09ICdzdXNwZW5kZWQnKSB7XG4gICAgICBhd2FpdCB0aGlzLmN0eC5yZXN1bWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY3R4O1xuICB9XG5cbiAgcHVibGljIGdldENvbnRleHQoKTogQXVkaW9Db250ZXh0IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY3R4O1xuICB9XG5cbiAgcHVibGljIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY3R4ICE9PSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZERTUEdyYXBoKCkge1xuICAgIGlmICghdGhpcy5jdHgpIHJldHVybjtcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcblxuICAgIC8vID09PSAxLiBJbnB1dCBTdGFnZSAmIFByZS1BbmFseXNlciA9PT1cbiAgICB0aGlzLmlucHV0R2Fpbk5vZGUgPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5pbnB1dFBoYXNlTm9kZSA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmlucHV0R2Fpbk5vZGUuY29ubmVjdCh0aGlzLmlucHV0UGhhc2VOb2RlKTtcblxuICAgIHRoaXMucHJlQW5hbHlzZXJOb2RlID0gdGhpcy5jdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgICB0aGlzLnByZUFuYWx5c2VyTm9kZS5mZnRTaXplID0gMjA0ODtcbiAgICB0aGlzLnByZUFuYWx5c2VyTm9kZS5zbW9vdGhpbmdUaW1lQ29uc3RhbnQgPSAwLjg7XG4gICAgdGhpcy5pbnB1dFBoYXNlTm9kZS5jb25uZWN0KHRoaXMucHJlQW5hbHlzZXJOb2RlKTtcblxuICAgIC8vIE1hc3RlciBEcnkgQnJhbmNoIGZvciBNYXN0ZXIgQnlwYXNzXG4gICAgdGhpcy5tYXN0ZXJEcnlHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMubWFzdGVyV2V0R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmlucHV0UGhhc2VOb2RlLmNvbm5lY3QodGhpcy5tYXN0ZXJEcnlHYWluKTtcblxuICAgIC8vID09PSAyLiBCYXNzIEJvb3N0IFN0YWdlID09PVxuICAgIC8vIFN1YnNvbmljIGN1dFxuICAgIHRoaXMuYmFzc0Jvb3N0U3ViSFBGID0gdGhpcy5jdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgdGhpcy5iYXNzQm9vc3RTdWJIUEYudHlwZSA9ICdoaWdocGFzcyc7XG4gICAgdGhpcy5iYXNzQm9vc3RTdWJIUEYuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDI1LCBub3cpO1xuICAgIHRoaXMuYmFzc0Jvb3N0U3ViSFBGLlEuc2V0VmFsdWVBdFRpbWUoMC43MSwgbm93KTtcbiAgICB0aGlzLmlucHV0UGhhc2VOb2RlLmNvbm5lY3QodGhpcy5iYXNzQm9vc3RTdWJIUEYpO1xuXG4gICAgLy8gQm9vc3QgUmVzb25hbnQgRmlsdGVyXG4gICAgdGhpcy5iYXNzQm9vc3RGaWx0ZXIgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLmJhc3NCb29zdEZpbHRlci50eXBlID0gJ3BlYWtpbmcnO1xuICAgIHRoaXMuYmFzc0Jvb3N0RmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSg4MCwgbm93KTtcbiAgICB0aGlzLmJhc3NCb29zdEZpbHRlci5RLnNldFZhbHVlQXRUaW1lKDEuNCwgbm93KTtcbiAgICB0aGlzLmJhc3NCb29zdEZpbHRlci5nYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdyk7XG4gICAgdGhpcy5iYXNzQm9vc3RTdWJIUEYuY29ubmVjdCh0aGlzLmJhc3NCb29zdEZpbHRlcik7XG5cbiAgICAvLyBIYXJtb25pY3MgZ2VuZXJhdGlvbiAoc29mdCBzaGFwZXIpXG4gICAgdGhpcy5iYXNzQm9vc3RIYXJtb25pY3NOb2RlID0gdGhpcy5jdHguY3JlYXRlV2F2ZVNoYXBlcigpO1xuICAgIHRoaXMuYmFzc0Jvb3N0SGFybW9uaWNzTm9kZS5jdXJ2ZSA9IGNyZWF0ZVNvZnRDbGlwQ3VydmUoMTAyNCwgMC45LCAxLjgpIGFzIGFueTtcbiAgICB0aGlzLmJhc3NCb29zdEhhcm1vbmljc05vZGUub3ZlcnNhbXBsZSA9ICcyeCc7XG4gICAgdGhpcy5iYXNzQm9vc3RIYXJtb25pY3NHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuYmFzc0Jvb3N0SGFybW9uaWNzR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdyk7XG4gICAgdGhpcy5iYXNzQm9vc3RGaWx0ZXIuY29ubmVjdCh0aGlzLmJhc3NCb29zdEhhcm1vbmljc05vZGUpO1xuICAgIHRoaXMuYmFzc0Jvb3N0SGFybW9uaWNzTm9kZS5jb25uZWN0KHRoaXMuYmFzc0Jvb3N0SGFybW9uaWNzR2Fpbik7XG5cbiAgICAvLyBCYXNzIEJvb3N0IERyeS9XZXQgbWl4ZXJcbiAgICB0aGlzLmJhc3NCb29zdERyeUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5iYXNzQm9vc3RXZXRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuYmFzc0Jvb3N0T3V0cHV0R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgIHRoaXMuaW5wdXRQaGFzZU5vZGUuY29ubmVjdCh0aGlzLmJhc3NCb29zdERyeUdhaW4pO1xuICAgIHRoaXMuYmFzc0Jvb3N0RmlsdGVyLmNvbm5lY3QodGhpcy5iYXNzQm9vc3RXZXRHYWluKTtcbiAgICB0aGlzLmJhc3NCb29zdEhhcm1vbmljc0dhaW4uY29ubmVjdCh0aGlzLmJhc3NCb29zdFdldEdhaW4pO1xuXG4gICAgdGhpcy5iYXNzQm9vc3REcnlHYWluLmNvbm5lY3QodGhpcy5iYXNzQm9vc3RPdXRwdXRHYWluKTtcbiAgICB0aGlzLmJhc3NCb29zdFdldEdhaW4uY29ubmVjdCh0aGlzLmJhc3NCb29zdE91dHB1dEdhaW4pO1xuXG4gICAgLy8gPT09IDMuIFZpcnR1YWxpemVyIFN0YWdlIChTdGVyZW8gV2lkZW5pbmcgJiBJbnRlcmF1cmFsIERlbGF5KSA9PT1cbiAgICB0aGlzLnZpcnRTcGxpdHRlciA9IHRoaXMuY3R4LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcigyKTtcbiAgICB0aGlzLnZpcnRNZXJnZXIgPSB0aGlzLmN0eC5jcmVhdGVDaGFubmVsTWVyZ2VyKDIpO1xuXG4gICAgdGhpcy52aXJ0TWlkR2FpbkwgPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy52aXJ0TWlkR2FpblIgPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy52aXJ0U2lkZUdhaW5MID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMudmlydFNpZGVHYWluUiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnZpcnRTaWRlV2lkdGhHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlMID0gdGhpcy5jdHguY3JlYXRlRGVsYXkoMC4wMSk7XG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlSID0gdGhpcy5jdHguY3JlYXRlRGVsYXkoMC4wMSk7XG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlMLmRlbGF5VGltZS5zZXRWYWx1ZUF0VGltZSgwLjAwMDM1LCBub3cpO1xuICAgIHRoaXMudmlydENyb3NzZmVlZERlbGF5Ui5kZWxheVRpbWUuc2V0VmFsdWVBdFRpbWUoMC4wMDAzNSwgbm93KTtcblxuICAgIHRoaXMudmlydENyb3NzZmVlZExQRl9MID0gdGhpcy5jdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkTFBGX1IgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWRMUEZfTC50eXBlID0gJ2xvd3Bhc3MnO1xuICAgIHRoaXMudmlydENyb3NzZmVlZExQRl9SLnR5cGUgPSAnbG93cGFzcyc7XG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkTFBGX0wuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDMyMDAsIG5vdyk7XG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkTFBGX1IuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDMyMDAsIG5vdyk7XG5cbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWRHYWluTCA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWRHYWluUiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWRHYWluTC5nYWluLnNldFZhbHVlQXRUaW1lKDAuMywgbm93KTtcbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWRHYWluUi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMywgbm93KTtcblxuICAgIHRoaXMudmlydERyeUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy52aXJ0V2V0R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnZpcnRPdXRwdXRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgdGhpcy5iYXNzQm9vc3RPdXRwdXRHYWluLmNvbm5lY3QodGhpcy52aXJ0RHJ5R2Fpbik7XG4gICAgdGhpcy5iYXNzQm9vc3RPdXRwdXRHYWluLmNvbm5lY3QodGhpcy52aXJ0U3BsaXR0ZXIpO1xuXG4gICAgLy8gTS9TIGFuZCBDcm9zc2ZlZWQgY29ubmVjdGlvbnNcbiAgICB0aGlzLnZpcnRTcGxpdHRlci5jb25uZWN0KHRoaXMudmlydE1pZEdhaW5MLCAwKTsgLy8gTFxuICAgIHRoaXMudmlydFNwbGl0dGVyLmNvbm5lY3QodGhpcy52aXJ0TWlkR2FpblIsIDEpOyAvLyBSXG4gICAgdGhpcy52aXJ0TWlkR2FpbkwuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjUsIG5vdyk7XG4gICAgdGhpcy52aXJ0TWlkR2FpblIuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjUsIG5vdyk7XG5cbiAgICB0aGlzLnZpcnRTcGxpdHRlci5jb25uZWN0KHRoaXMudmlydFNpZGVHYWluTCwgMCk7IC8vIExcbiAgICB0aGlzLnZpcnRTcGxpdHRlci5jb25uZWN0KHRoaXMudmlydFNpZGVHYWluUiwgMSk7IC8vIFJcbiAgICB0aGlzLnZpcnRTaWRlR2FpbkwuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjUsIG5vdyk7XG4gICAgdGhpcy52aXJ0U2lkZUdhaW5SLmdhaW4uc2V0VmFsdWVBdFRpbWUoLTAuNSwgbm93KTtcblxuICAgIHRoaXMudmlydFNpZGVHYWluTC5jb25uZWN0KHRoaXMudmlydFNpZGVXaWR0aEdhaW4pO1xuICAgIHRoaXMudmlydFNpZGVHYWluUi5jb25uZWN0KHRoaXMudmlydFNpZGVXaWR0aEdhaW4pO1xuICAgIHRoaXMudmlydFNpZGVXaWR0aEdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgxLjAsIG5vdyk7XG5cbiAgICAvLyBSZWNvbWJpbmUgdG8gTC9SXG4gICAgdGhpcy52aXJ0TWlkR2FpbkwuY29ubmVjdCh0aGlzLnZpcnRNZXJnZXIsIDAsIDApO1xuICAgIHRoaXMudmlydE1pZEdhaW5SLmNvbm5lY3QodGhpcy52aXJ0TWVyZ2VyLCAwLCAxKTtcbiAgICB0aGlzLnZpcnRTaWRlV2lkdGhHYWluLmNvbm5lY3QodGhpcy52aXJ0TWVyZ2VyLCAwLCAwKTtcbiAgICB0aGlzLnZpcnRTaWRlV2lkdGhHYWluLmNvbm5lY3QodGhpcy52aXJ0TWVyZ2VyLCAwLCAxKTtcblxuICAgIC8vIENyb3NzZmVlZFxuICAgIHRoaXMudmlydFNwbGl0dGVyLmNvbm5lY3QodGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlMLCAxKTsgLy8gUiB0byBMXG4gICAgdGhpcy52aXJ0U3BsaXR0ZXIuY29ubmVjdCh0aGlzLnZpcnRDcm9zc2ZlZWREZWxheVIsIDApOyAvLyBMIHRvIFJcbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWREZWxheUwuY29ubmVjdCh0aGlzLnZpcnRDcm9zc2ZlZWRMUEZfTCk7XG4gICAgdGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlSLmNvbm5lY3QodGhpcy52aXJ0Q3Jvc3NmZWVkTFBGX1IpO1xuICAgIHRoaXMudmlydENyb3NzZmVlZExQRl9MLmNvbm5lY3QodGhpcy52aXJ0Q3Jvc3NmZWVkR2FpbkwpO1xuICAgIHRoaXMudmlydENyb3NzZmVlZExQRl9SLmNvbm5lY3QodGhpcy52aXJ0Q3Jvc3NmZWVkR2FpblIpO1xuICAgIHRoaXMudmlydENyb3NzZmVlZEdhaW5MLmNvbm5lY3QodGhpcy52aXJ0TWVyZ2VyLCAwLCAwKTtcbiAgICB0aGlzLnZpcnRDcm9zc2ZlZWRHYWluUi5jb25uZWN0KHRoaXMudmlydE1lcmdlciwgMCwgMSk7XG5cbiAgICB0aGlzLnZpcnRNZXJnZXIuY29ubmVjdCh0aGlzLnZpcnRXZXRHYWluKTtcbiAgICB0aGlzLnZpcnREcnlHYWluLmNvbm5lY3QodGhpcy52aXJ0T3V0cHV0R2Fpbik7XG4gICAgdGhpcy52aXJ0V2V0R2Fpbi5jb25uZWN0KHRoaXMudmlydE91dHB1dEdhaW4pO1xuXG4gICAgLy8gPT09IDQuIDMyLUJhbmQgSVNPIEVxdWFsaXplciBTdGFnZSA9PT1cbiAgICB0aGlzLmVxMzJJbnB1dE5vZGUgPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5lcTMyT3V0cHV0Tm9kZSA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnZpcnRPdXRwdXRHYWluLmNvbm5lY3QodGhpcy5lcTMySW5wdXROb2RlKTtcblxuICAgIC8vIEJ1aWxkIHRoZSAzMiBjYXNjYWRpbmcgYmlxdWFkIGZpbHRlciBub2Rlc1xuICAgIHRoaXMuZXEzMkZpbHRlck5vZGVzID0gW107XG4gICAgbGV0IHByZXZpb3VzTm9kZTogQXVkaW9Ob2RlID0gdGhpcy5lcTMySW5wdXROb2RlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzMjsgaSsrKSB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICAgIGZpbHRlci50eXBlID0gJ3BlYWtpbmcnO1xuICAgICAgZmlsdGVyLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShJU09fMzJfRlJFUVVFTkNJRVNbaV0uZnJlcSwgbm93KTtcbiAgICAgIGZpbHRlci5RLnNldFZhbHVlQXRUaW1lKDQuMzE4LCBub3cpOyAvLyBzdGFuZGFyZCAxLzMtb2N0YXZlIFFcbiAgICAgIGZpbHRlci5nYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdyk7XG5cbiAgICAgIHByZXZpb3VzTm9kZS5jb25uZWN0KGZpbHRlcik7XG4gICAgICBwcmV2aW91c05vZGUgPSBmaWx0ZXI7XG4gICAgICB0aGlzLmVxMzJGaWx0ZXJOb2Rlcy5wdXNoKGZpbHRlcik7XG4gICAgfVxuXG4gICAgcHJldmlvdXNOb2RlLmNvbm5lY3QodGhpcy5lcTMyT3V0cHV0Tm9kZSk7XG5cbiAgICAvLyA9PT0gNS4gVG9uZSBDb250cm9scyAoQmFzcyAvIE1pZCAvIFRyZWJsZSkgPT09XG4gICAgdGhpcy50b25lQmFzc05vZGUgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLnRvbmVCYXNzTm9kZS50eXBlID0gJ2xvd3NoZWxmJztcbiAgICB0aGlzLnRvbmVCYXNzTm9kZS5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMTIwLCBub3cpO1xuICAgIHRoaXMudG9uZUJhc3NOb2RlLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgbm93KTtcblxuICAgIHRoaXMudG9uZU1pZE5vZGUgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLnRvbmVNaWROb2RlLnR5cGUgPSAncGVha2luZyc7XG4gICAgdGhpcy50b25lTWlkTm9kZS5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMTAwMCwgbm93KTtcbiAgICB0aGlzLnRvbmVNaWROb2RlLlEuc2V0VmFsdWVBdFRpbWUoMC45LCBub3cpO1xuICAgIHRoaXMudG9uZU1pZE5vZGUuZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLCBub3cpO1xuXG4gICAgdGhpcy50b25lVHJlYmxlTm9kZSA9IHRoaXMuY3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgIHRoaXMudG9uZVRyZWJsZU5vZGUudHlwZSA9ICdoaWdoc2hlbGYnO1xuICAgIHRoaXMudG9uZVRyZWJsZU5vZGUuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDc1MDAsIG5vdyk7XG4gICAgdGhpcy50b25lVHJlYmxlTm9kZS5nYWluLnNldFZhbHVlQXRUaW1lKDAsIG5vdyk7XG5cbiAgICB0aGlzLnRvbmVEcnlHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMudG9uZVdldEdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy50b25lT3V0cHV0R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgIHRoaXMuZXEzMk91dHB1dE5vZGUuY29ubmVjdCh0aGlzLnRvbmVEcnlHYWluKTtcbiAgICB0aGlzLmVxMzJPdXRwdXROb2RlLmNvbm5lY3QodGhpcy50b25lQmFzc05vZGUpO1xuICAgIHRoaXMudG9uZUJhc3NOb2RlLmNvbm5lY3QodGhpcy50b25lTWlkTm9kZSk7XG4gICAgdGhpcy50b25lTWlkTm9kZS5jb25uZWN0KHRoaXMudG9uZVRyZWJsZU5vZGUpO1xuICAgIHRoaXMudG9uZVRyZWJsZU5vZGUuY29ubmVjdCh0aGlzLnRvbmVXZXRHYWluKTtcblxuICAgIHRoaXMudG9uZURyeUdhaW4uY29ubmVjdCh0aGlzLnRvbmVPdXRwdXRHYWluKTtcbiAgICB0aGlzLnRvbmVXZXRHYWluLmNvbm5lY3QodGhpcy50b25lT3V0cHV0R2Fpbik7XG5cbiAgICAvLyA9PT0gNi4gTURSQyAoTXVsdGktQmFuZCBEeW5hbWljIFJhbmdlIENvbnRyb2wpID09PVxuICAgIHRoaXMubWRyY0lucHV0R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnRvbmVPdXRwdXRHYWluLmNvbm5lY3QodGhpcy5tZHJjSW5wdXRHYWluKTtcblxuICAgIHRoaXMubWRyY0RyeUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgdGhpcy5tZHJjV2V0R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLm1kcmNTdW1taW5nR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLm1kcmNPdXRwdXRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuXG4gICAgdGhpcy5tZHJjSW5wdXRHYWluLmNvbm5lY3QodGhpcy5tZHJjRHJ5R2Fpbik7XG5cbiAgICAvLyBMb3cgQmFuZCAoPCAyNTAgSHopXG4gICAgdGhpcy5tZHJjTG93TFBGID0gdGhpcy5jdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgdGhpcy5tZHJjTG93TFBGLnR5cGUgPSAnbG93cGFzcyc7XG4gICAgdGhpcy5tZHJjTG93TFBGLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZSgyNTAsIG5vdyk7XG4gICAgdGhpcy5tZHJjTG93Q29tcCA9IHRoaXMuY3R4LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuICAgIHRoaXMubWRyY0xvd0dhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG5cbiAgICB0aGlzLm1kcmNJbnB1dEdhaW4uY29ubmVjdCh0aGlzLm1kcmNMb3dMUEYpO1xuICAgIHRoaXMubWRyY0xvd0xQRi5jb25uZWN0KHRoaXMubWRyY0xvd0NvbXApO1xuICAgIHRoaXMubWRyY0xvd0NvbXAuY29ubmVjdCh0aGlzLm1kcmNMb3dHYWluKTtcbiAgICB0aGlzLm1kcmNMb3dHYWluLmNvbm5lY3QodGhpcy5tZHJjU3VtbWluZ0dhaW4pO1xuXG4gICAgLy8gTWlkIEJhbmQgKDI1MCBIeiAtIDQwMDAgSHopXG4gICAgdGhpcy5tZHJjTWlkSFBGID0gdGhpcy5jdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgdGhpcy5tZHJjTWlkSFBGLnR5cGUgPSAnaGlnaHBhc3MnO1xuICAgIHRoaXMubWRyY01pZEhQRi5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoMjUwLCBub3cpO1xuICAgIHRoaXMubWRyY01pZExQRiA9IHRoaXMuY3R4LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICAgIHRoaXMubWRyY01pZExQRi50eXBlID0gJ2xvd3Bhc3MnO1xuICAgIHRoaXMubWRyY01pZExQRi5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoNDAwMCwgbm93KTtcbiAgICB0aGlzLm1kcmNNaWRDb21wID0gdGhpcy5jdHguY3JlYXRlRHluYW1pY3NDb21wcmVzc29yKCk7XG4gICAgdGhpcy5tZHJjTWlkR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgIHRoaXMubWRyY0lucHV0R2Fpbi5jb25uZWN0KHRoaXMubWRyY01pZEhQRik7XG4gICAgdGhpcy5tZHJjTWlkSFBGLmNvbm5lY3QodGhpcy5tZHJjTWlkTFBGKTtcbiAgICB0aGlzLm1kcmNNaWRMUEYuY29ubmVjdCh0aGlzLm1kcmNNaWRDb21wKTtcbiAgICB0aGlzLm1kcmNNaWRDb21wLmNvbm5lY3QodGhpcy5tZHJjTWlkR2Fpbik7XG4gICAgdGhpcy5tZHJjTWlkR2Fpbi5jb25uZWN0KHRoaXMubWRyY1N1bW1pbmdHYWluKTtcblxuICAgIC8vIEhpZ2ggQmFuZCAoPiA0MDAwIEh6KVxuICAgIHRoaXMubWRyY0hpZ2hIUEYgPSB0aGlzLmN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICB0aGlzLm1kcmNIaWdoSFBGLnR5cGUgPSAnaGlnaHBhc3MnO1xuICAgIHRoaXMubWRyY0hpZ2hIUEYuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDQwMDAsIG5vdyk7XG4gICAgdGhpcy5tZHJjSGlnaENvbXAgPSB0aGlzLmN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcbiAgICB0aGlzLm1kcmNIaWdoR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcblxuICAgIHRoaXMubWRyY0lucHV0R2Fpbi5jb25uZWN0KHRoaXMubWRyY0hpZ2hIUEYpO1xuICAgIHRoaXMubWRyY0hpZ2hIUEYuY29ubmVjdCh0aGlzLm1kcmNIaWdoQ29tcCk7XG4gICAgdGhpcy5tZHJjSGlnaENvbXAuY29ubmVjdCh0aGlzLm1kcmNIaWdoR2Fpbik7XG4gICAgdGhpcy5tZHJjSGlnaEdhaW4uY29ubmVjdCh0aGlzLm1kcmNTdW1taW5nR2Fpbik7XG5cbiAgICB0aGlzLm1kcmNTdW1taW5nR2Fpbi5jb25uZWN0KHRoaXMubWRyY1dldEdhaW4pO1xuICAgIHRoaXMubWRyY0RyeUdhaW4uY29ubmVjdCh0aGlzLm1kcmNPdXRwdXRHYWluKTtcbiAgICB0aGlzLm1kcmNXZXRHYWluLmNvbm5lY3QodGhpcy5tZHJjT3V0cHV0R2Fpbik7XG5cbiAgICAvLyBEZWZhdWx0IGJ5cGFzcyBmb3IgTURSQ1xuICAgIHRoaXMubWRyY0RyeUdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgxLjAsIG5vdyk7XG4gICAgdGhpcy5tZHJjV2V0R2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMCwgbm93KTtcblxuICAgIC8vID09PSA3LiBBdXRvR2FpbiBTdGFnZSA9PT1cbiAgICB0aGlzLmF1dG9HYWluTm9kZSA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmF1dG9HYWluRGV0ZWN0b3JBbmFseXNlciA9IHRoaXMuY3R4LmNyZWF0ZUFuYWx5c2VyKCk7XG4gICAgdGhpcy5hdXRvR2FpbkRldGVjdG9yQW5hbHlzZXIuZmZ0U2l6ZSA9IDEwMjQ7XG4gICAgdGhpcy5tZHJjT3V0cHV0R2Fpbi5jb25uZWN0KHRoaXMuYXV0b0dhaW5Ob2RlKTtcbiAgICB0aGlzLmF1dG9HYWluTm9kZS5jb25uZWN0KHRoaXMuYXV0b0dhaW5EZXRlY3RvckFuYWx5c2VyKTtcblxuICAgIC8vID09PSA4LiBNYXN0ZXIgR2FpbiBTdGFnZSA9PT1cbiAgICB0aGlzLm1hc3RlckdhaW5Ob2RlID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMuYXV0b0dhaW5Ob2RlLmNvbm5lY3QodGhpcy5tYXN0ZXJHYWluTm9kZSk7XG5cbiAgICAvLyA9PT0gOS4gU29mdCBMaW1pdGVyIFN0YWdlID09PVxuICAgIHRoaXMubGltaXRlclByZUdhaW5Ob2RlID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMubGltaXRlckZhc3RDb21wTm9kZSA9IHRoaXMuY3R4LmNyZWF0ZUR5bmFtaWNzQ29tcHJlc3NvcigpO1xuICAgIHRoaXMubGltaXRlckZhc3RDb21wTm9kZS50aHJlc2hvbGQuc2V0VmFsdWVBdFRpbWUoLTAuNSwgbm93KTtcbiAgICB0aGlzLmxpbWl0ZXJGYXN0Q29tcE5vZGUua25lZS5zZXRWYWx1ZUF0VGltZSgwLjAsIG5vdyk7XG4gICAgdGhpcy5saW1pdGVyRmFzdENvbXBOb2RlLnJhdGlvLnNldFZhbHVlQXRUaW1lKDIwLjAsIG5vdyk7XG4gICAgdGhpcy5saW1pdGVyRmFzdENvbXBOb2RlLmF0dGFjay5zZXRWYWx1ZUF0VGltZSgwLjAwMiwgbm93KTtcbiAgICB0aGlzLmxpbWl0ZXJGYXN0Q29tcE5vZGUucmVsZWFzZS5zZXRWYWx1ZUF0VGltZSgwLjA1LCBub3cpO1xuXG4gICAgdGhpcy5saW1pdGVyV2F2ZVNoYXBlck5vZGUgPSB0aGlzLmN0eC5jcmVhdGVXYXZlU2hhcGVyKCk7XG4gICAgdGhpcy5saW1pdGVyV2F2ZVNoYXBlck5vZGUuY3VydmUgPSBjcmVhdGVTb2Z0Q2xpcEN1cnZlKDQwOTYsIDAuOTgsIDEuMCkgYXMgYW55O1xuICAgIHRoaXMubGltaXRlcldhdmVTaGFwZXJOb2RlLm92ZXJzYW1wbGUgPSAnNHgnO1xuXG4gICAgdGhpcy5saW1pdGVyRHJ5R2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLmxpbWl0ZXJXZXRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgIHRoaXMubGltaXRlck91dHB1dEdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG5cbiAgICB0aGlzLm1hc3RlckdhaW5Ob2RlLmNvbm5lY3QodGhpcy5saW1pdGVyRHJ5R2Fpbik7XG4gICAgdGhpcy5tYXN0ZXJHYWluTm9kZS5jb25uZWN0KHRoaXMubGltaXRlclByZUdhaW5Ob2RlKTtcbiAgICB0aGlzLmxpbWl0ZXJQcmVHYWluTm9kZS5jb25uZWN0KHRoaXMubGltaXRlckZhc3RDb21wTm9kZSk7XG4gICAgdGhpcy5saW1pdGVyRmFzdENvbXBOb2RlLmNvbm5lY3QodGhpcy5saW1pdGVyV2F2ZVNoYXBlck5vZGUpO1xuICAgIHRoaXMubGltaXRlcldhdmVTaGFwZXJOb2RlLmNvbm5lY3QodGhpcy5saW1pdGVyV2V0R2Fpbik7XG5cbiAgICB0aGlzLmxpbWl0ZXJEcnlHYWluLmNvbm5lY3QodGhpcy5saW1pdGVyT3V0cHV0R2Fpbik7XG4gICAgdGhpcy5saW1pdGVyV2V0R2Fpbi5jb25uZWN0KHRoaXMubGltaXRlck91dHB1dEdhaW4pO1xuXG4gICAgLy8gRGVmYXVsdCBsaW1pdGVyIGFjdGl2ZVxuICAgIHRoaXMubGltaXRlckRyeUdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjAsIG5vdyk7XG4gICAgdGhpcy5saW1pdGVyV2V0R2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDEuMCwgbm93KTtcblxuICAgIC8vID09PSAxMC4gTWFzdGVyIEJ5cGFzcyBSb3V0aW5nICYgT3V0cHV0ID09PVxuICAgIHRoaXMubGltaXRlck91dHB1dEdhaW4uY29ubmVjdCh0aGlzLm1hc3RlcldldEdhaW4pO1xuXG4gICAgdGhpcy5wb3N0QW5hbHlzZXJOb2RlID0gdGhpcy5jdHguY3JlYXRlQW5hbHlzZXIoKTtcbiAgICB0aGlzLnBvc3RBbmFseXNlck5vZGUuZmZ0U2l6ZSA9IDIwNDg7XG4gICAgdGhpcy5wb3N0QW5hbHlzZXJOb2RlLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuNzU7XG5cbiAgICB0aGlzLm1hc3RlckRyeUdhaW4uY29ubmVjdCh0aGlzLnBvc3RBbmFseXNlck5vZGUpO1xuICAgIHRoaXMubWFzdGVyV2V0R2Fpbi5jb25uZWN0KHRoaXMucG9zdEFuYWx5c2VyTm9kZSk7XG5cbiAgICB0aGlzLm1hc3RlckRyeUdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSgwLjAsIG5vdyk7XG4gICAgdGhpcy5tYXN0ZXJXZXRHYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMS4wLCBub3cpO1xuXG4gICAgLy8gRmluYWwgcm91dGUgdG8gaGFyZHdhcmUgREFDIGRlc3RpbmF0aW9uXG4gICAgdGhpcy5wb3N0QW5hbHlzZXJOb2RlLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLy8gPT09IFBhcmFtZXRlciBVcGRhdGUgTWV0aG9kcyA9PT1cblxuICBwdWJsaWMgdXBkYXRlUHJlR2FpbihjZmc6IFByZUdhaW5Db25maWcpOiB2b2lkIHtcbiAgICB0aGlzLnByZUdhaW5Db25maWcgPSBjZmc7XG4gICAgaWYgKCF0aGlzLmN0eCB8fCAhdGhpcy5pbnB1dEdhaW5Ob2RlIHx8ICF0aGlzLmlucHV0UGhhc2VOb2RlKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgY29uc3QgbGluID0gY2ZnLmVuYWJsZWQgPyBNYXRoLnBvdygxMCwgY2ZnLmdhaW5EQiAvIDIwKSA6IDEuMDtcbiAgICB0aGlzLmlucHV0R2Fpbk5vZGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUobGluLCBub3csIDAuMDE1KTtcbiAgICB0aGlzLmlucHV0UGhhc2VOb2RlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKGNmZy5waGFzZUludmVydCA/IC0xLjAgOiAxLjAsIG5vdywgMC4wMTUpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUJhc3NCb29zdChjZmc6IEJhc3NCb29zdENvbmZpZyk6IHZvaWQge1xuICAgIHRoaXMuYmFzc0Jvb3N0Q29uZmlnID0gY2ZnO1xuICAgIGlmICghdGhpcy5jdHggfHwgIXRoaXMuYmFzc0Jvb3N0RmlsdGVyIHx8ICF0aGlzLmJhc3NCb29zdFN1YkhQRiB8fCAhdGhpcy5iYXNzQm9vc3REcnlHYWluIHx8ICF0aGlzLmJhc3NCb29zdFdldEdhaW4pIHJldHVybjtcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcblxuICAgIHRoaXMuYmFzc0Jvb3N0U3ViSFBGLmZyZXF1ZW5jeS5zZXRUYXJnZXRBdFRpbWUoY2ZnLnN1YkN1dG9mZiwgbm93LCAwLjAyKTtcbiAgICB0aGlzLmJhc3NCb29zdEZpbHRlci5mcmVxdWVuY3kuc2V0VGFyZ2V0QXRUaW1lKGNmZy5mcmVxdWVuY3ksIG5vdywgMC4wMik7XG4gICAgdGhpcy5iYXNzQm9vc3RGaWx0ZXIuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoY2ZnLmJvb3N0REIsIG5vdywgMC4wMik7XG5cbiAgICBpZiAodGhpcy5iYXNzQm9vc3RIYXJtb25pY3NHYWluKSB7XG4gICAgICBjb25zdCBoYXJtR2FpbiA9IChjZmcuaGFybW9uaWNzIC8gMTAwKSAqIDAuMzU7XG4gICAgICB0aGlzLmJhc3NCb29zdEhhcm1vbmljc0dhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoaGFybUdhaW4sIG5vdywgMC4wMik7XG4gICAgfVxuXG4gICAgaWYgKGNmZy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmJhc3NCb29zdERyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDE1KTtcbiAgICAgIHRoaXMuYmFzc0Jvb3N0V2V0R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSgxLjAsIG5vdywgMC4wMTUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJhc3NCb29zdERyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMS4wLCBub3csIDAuMDE1KTtcbiAgICAgIHRoaXMuYmFzc0Jvb3N0V2V0R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSgwLjAsIG5vdywgMC4wMTUpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVWaXJ0dWFsaXplcihjZmc6IFZpcnR1YWxpemVyQ29uZmlnKTogdm9pZCB7XG4gICAgdGhpcy52aXJ0Q29uZmlnID0gY2ZnO1xuICAgIGlmICghdGhpcy5jdHggfHwgIXRoaXMudmlydERyeUdhaW4gfHwgIXRoaXMudmlydFdldEdhaW4gfHwgIXRoaXMudmlydFNpZGVXaWR0aEdhaW4pIHJldHVybjtcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcblxuICAgIGlmICghY2ZnLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMudmlydERyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMS4wLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy52aXJ0V2V0R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSgwLjAsIG5vdywgMC4wMik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy52aXJ0RHJ5R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSgwLjAsIG5vdywgMC4wMik7XG4gICAgdGhpcy52aXJ0V2V0R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSgxLjAsIG5vdywgMC4wMik7XG5cbiAgICBjb25zdCBub3JtSW50ZW5zaXR5ID0gY2ZnLmludGVuc2l0eSAvIDEwMDtcbiAgICAvLyBXaWR0aDogMS4wIChub3JtYWwpIHRvIDEuOCAoZXh0cmEgd2lkZSlcbiAgICBjb25zdCB3aWR0aCA9IDEuMCArIG5vcm1JbnRlbnNpdHkgKiAwLjg7XG4gICAgdGhpcy52aXJ0U2lkZVdpZHRoR2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSh3aWR0aCwgbm93LCAwLjAyKTtcblxuICAgIC8vIENyb3NzZmVlZCBkZWxheSBhbmQgY3VydmUgZGVwZW5kaW5nIG9uIG1vZGVcbiAgICBsZXQgZGVsYXlTZWMgPSAwLjAwMDM7XG4gICAgbGV0IGxwZkZyZXEgPSAzNjAwO1xuICAgIGxldCBjcm9zc0dhaW4gPSAwLjI1ICogbm9ybUludGVuc2l0eTtcblxuICAgIGlmIChjZmcubW9kZSA9PT0gJ2hlYWRwaG9uZXMnKSB7XG4gICAgICBkZWxheVNlYyA9IDAuMDAwNDU7IC8vIH4wLjQ1IG1zIGludGVyYXVyYWwgaGVhZCBkZWxheVxuICAgICAgbHBmRnJlcSA9IDMwMDA7XG4gICAgICBjcm9zc0dhaW4gPSAwLjM1ICogbm9ybUludGVuc2l0eTtcbiAgICB9IGVsc2UgaWYgKGNmZy5tb2RlID09PSAnd2lkZScpIHtcbiAgICAgIGRlbGF5U2VjID0gMC4wMDA2O1xuICAgICAgbHBmRnJlcSA9IDQyMDA7XG4gICAgICBjcm9zc0dhaW4gPSAwLjQ1ICogbm9ybUludGVuc2l0eTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlMICYmIHRoaXMudmlydENyb3NzZmVlZERlbGF5Uikge1xuICAgICAgdGhpcy52aXJ0Q3Jvc3NmZWVkRGVsYXlMLmRlbGF5VGltZS5zZXRUYXJnZXRBdFRpbWUoZGVsYXlTZWMsIG5vdywgMC4wMik7XG4gICAgICB0aGlzLnZpcnRDcm9zc2ZlZWREZWxheVIuZGVsYXlUaW1lLnNldFRhcmdldEF0VGltZShkZWxheVNlYywgbm93LCAwLjAyKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudmlydENyb3NzZmVlZExQRl9MICYmIHRoaXMudmlydENyb3NzZmVlZExQRl9SKSB7XG4gICAgICB0aGlzLnZpcnRDcm9zc2ZlZWRMUEZfTC5mcmVxdWVuY3kuc2V0VGFyZ2V0QXRUaW1lKGxwZkZyZXEsIG5vdywgMC4wMik7XG4gICAgICB0aGlzLnZpcnRDcm9zc2ZlZWRMUEZfUi5mcmVxdWVuY3kuc2V0VGFyZ2V0QXRUaW1lKGxwZkZyZXEsIG5vdywgMC4wMik7XG4gICAgfVxuICAgIGlmICh0aGlzLnZpcnRDcm9zc2ZlZWRHYWluTCAmJiB0aGlzLnZpcnRDcm9zc2ZlZWRHYWluUikge1xuICAgICAgdGhpcy52aXJ0Q3Jvc3NmZWVkR2FpbkwuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoY3Jvc3NHYWluLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy52aXJ0Q3Jvc3NmZWVkR2FpblIuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoY3Jvc3NHYWluLCBub3csIDAuMDIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUzMkJhbmQoYmFuZDogRVEzMkJhbmQpOiB2b2lkIHtcbiAgICBpZiAoYmFuZC5pbmRleCA8IDAgfHwgYmFuZC5pbmRleCA+PSB0aGlzLmVxMzJCYW5kcy5sZW5ndGgpIHJldHVybjtcbiAgICB0aGlzLmVxMzJCYW5kc1tiYW5kLmluZGV4XSA9IHsgLi4uYmFuZCB9O1xuXG4gICAgaWYgKCF0aGlzLmN0eCB8fCAhdGhpcy5lcTMyRmlsdGVyTm9kZXNbYmFuZC5pbmRleF0pIHJldHVybjtcbiAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmVxMzJGaWx0ZXJOb2Rlc1tiYW5kLmluZGV4XTtcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBlZmZlY3RpdmVHYWluID0gYmFuZC5lbmFibGVkID8gYmFuZC5nYWluIDogMDtcblxuICAgIGZpbHRlci5mcmVxdWVuY3kuc2V0VGFyZ2V0QXRUaW1lKGJhbmQuZnJlcXVlbmN5LCBub3csIDAuMDIpO1xuICAgIGZpbHRlci5RLnNldFRhcmdldEF0VGltZShiYW5kLnEsIG5vdywgMC4wMik7XG4gICAgZmlsdGVyLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKGVmZmVjdGl2ZUdhaW4sIG5vdywgMC4wMik7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlQWxsMzJCYW5kcyhiYW5kczogRVEzMkJhbmRbXSk6IHZvaWQge1xuICAgIHRoaXMuZXEzMkJhbmRzID0gWy4uLmJhbmRzXTtcbiAgICBpZiAoIXRoaXMuY3R4IHx8IHRoaXMuZXEzMkZpbHRlck5vZGVzLmxlbmd0aCA8IDMyKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG5cbiAgICBiYW5kcy5mb3JFYWNoKChiYW5kLCBpKSA9PiB7XG4gICAgICBjb25zdCBmaWx0ZXIgPSB0aGlzLmVxMzJGaWx0ZXJOb2Rlc1tpXTtcbiAgICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgICAgY29uc3QgZWZmZWN0aXZlR2FpbiA9IGJhbmQuZW5hYmxlZCA/IGJhbmQuZ2FpbiA6IDA7XG4gICAgICAgIGZpbHRlci5mcmVxdWVuY3kuc2V0VGFyZ2V0QXRUaW1lKGJhbmQuZnJlcXVlbmN5LCBub3csIDAuMDE1KTtcbiAgICAgICAgZmlsdGVyLlEuc2V0VGFyZ2V0QXRUaW1lKGJhbmQucSwgbm93LCAwLjAxNSk7XG4gICAgICAgIGZpbHRlci5nYWluLnNldFRhcmdldEF0VGltZShlZmZlY3RpdmVHYWluLCBub3csIDAuMDE1KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVUb25lKGNmZzogVG9uZUNvbnRyb2xzQ29uZmlnKTogdm9pZCB7XG4gICAgdGhpcy50b25lQ29uZmlnID0gY2ZnO1xuICAgIGlmICghdGhpcy5jdHggfHwgIXRoaXMudG9uZUJhc3NOb2RlIHx8ICF0aGlzLnRvbmVNaWROb2RlIHx8ICF0aGlzLnRvbmVUcmVibGVOb2RlIHx8ICF0aGlzLnRvbmVEcnlHYWluIHx8ICF0aGlzLnRvbmVXZXRHYWluKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG5cbiAgICBpZiAoIWNmZy5lbmFibGVkKSB7XG4gICAgICB0aGlzLnRvbmVEcnlHYWluLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEuMCwgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMudG9uZVdldEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMudG9uZURyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDIpO1xuICAgIHRoaXMudG9uZVdldEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMS4wLCBub3csIDAuMDIpO1xuXG4gICAgdGhpcy50b25lQmFzc05vZGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoY2ZnLmJhc3NEQiwgbm93LCAwLjAyKTtcbiAgICB0aGlzLnRvbmVNaWROb2RlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKGNmZy5taWREQiwgbm93LCAwLjAyKTtcbiAgICB0aGlzLnRvbmVUcmVibGVOb2RlLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKGNmZy50cmVibGVEQiwgbm93LCAwLjAyKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVNRFJDKGNmZzogTURSQ0NvbmZpZyk6IHZvaWQge1xuICAgIHRoaXMubWRyY0NvbmZpZyA9IGNmZztcbiAgICBpZiAoIXRoaXMuY3R4IHx8ICF0aGlzLm1kcmNEcnlHYWluIHx8ICF0aGlzLm1kcmNXZXRHYWluKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG5cbiAgICBpZiAoIWNmZy5lbmFibGVkKSB7XG4gICAgICB0aGlzLm1kcmNEcnlHYWluLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEuMCwgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWRyY1dldEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWRyY0RyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDIpO1xuICAgIHRoaXMubWRyY1dldEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMS4wLCBub3csIDAuMDIpO1xuXG4gICAgY29uc3QgYXR0U2VjID0gTWF0aC5tYXgoMC4wMDEsIGNmZy5hdHRhY2tNcyAvIDEwMDApO1xuICAgIGNvbnN0IHJlbFNlYyA9IE1hdGgubWF4KDAuMDEsIGNmZy5yZWxlYXNlTXMgLyAxMDAwKTtcblxuICAgIC8vIExvd1xuICAgIGlmICh0aGlzLm1kcmNMb3dDb21wICYmIHRoaXMubWRyY0xvd0dhaW4pIHtcbiAgICAgIHRoaXMubWRyY0xvd0NvbXAudGhyZXNob2xkLnNldFRhcmdldEF0VGltZShjZmcubG93VGhyZXNob2xkLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy5tZHJjTG93Q29tcC5yYXRpby5zZXRUYXJnZXRBdFRpbWUoY2ZnLmxvd1JhdGlvLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy5tZHJjTG93Q29tcC5hdHRhY2suc2V0VGFyZ2V0QXRUaW1lKGF0dFNlYywgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWRyY0xvd0NvbXAucmVsZWFzZS5zZXRUYXJnZXRBdFRpbWUocmVsU2VjLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy5tZHJjTG93R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZShNYXRoLnBvdygxMCwgY2ZnLmxvd0dhaW5EQiAvIDIwKSwgbm93LCAwLjAyKTtcbiAgICB9XG5cbiAgICAvLyBNaWRcbiAgICBpZiAodGhpcy5tZHJjTWlkQ29tcCAmJiB0aGlzLm1kcmNNaWRHYWluKSB7XG4gICAgICB0aGlzLm1kcmNNaWRDb21wLnRocmVzaG9sZC5zZXRUYXJnZXRBdFRpbWUoY2ZnLm1pZFRocmVzaG9sZCwgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWRyY01pZENvbXAucmF0aW8uc2V0VGFyZ2V0QXRUaW1lKGNmZy5taWRSYXRpbywgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWRyY01pZENvbXAuYXR0YWNrLnNldFRhcmdldEF0VGltZShhdHRTZWMsIG5vdywgMC4wMik7XG4gICAgICB0aGlzLm1kcmNNaWRDb21wLnJlbGVhc2Uuc2V0VGFyZ2V0QXRUaW1lKHJlbFNlYywgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWRyY01pZEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoTWF0aC5wb3coMTAsIGNmZy5taWRHYWluREIgLyAyMCksIG5vdywgMC4wMik7XG4gICAgfVxuXG4gICAgLy8gSGlnaFxuICAgIGlmICh0aGlzLm1kcmNIaWdoQ29tcCAmJiB0aGlzLm1kcmNIaWdoR2Fpbikge1xuICAgICAgdGhpcy5tZHJjSGlnaENvbXAudGhyZXNob2xkLnNldFRhcmdldEF0VGltZShjZmcuaGlnaFRocmVzaG9sZCwgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWRyY0hpZ2hDb21wLnJhdGlvLnNldFRhcmdldEF0VGltZShjZmcuaGlnaFJhdGlvLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy5tZHJjSGlnaENvbXAuYXR0YWNrLnNldFRhcmdldEF0VGltZShhdHRTZWMsIG5vdywgMC4wMik7XG4gICAgICB0aGlzLm1kcmNIaWdoQ29tcC5yZWxlYXNlLnNldFRhcmdldEF0VGltZShyZWxTZWMsIG5vdywgMC4wMik7XG4gICAgICB0aGlzLm1kcmNIaWdoR2Fpbi5nYWluLnNldFRhcmdldEF0VGltZShNYXRoLnBvdygxMCwgY2ZnLmhpZ2hHYWluREIgLyAyMCksIG5vdywgMC4wMik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZUF1dG9HYWluKGNmZzogQXV0b0dhaW5Db25maWcpOiB2b2lkIHtcbiAgICB0aGlzLmF1dG9HYWluQ29uZmlnID0gY2ZnO1xuICAgIGlmIChjZmcuc3BlZWQgPT09ICdmYXN0JykgdGhpcy5hdXRvR2FpblNtb290aGluZ1dpbmRvdyA9IDAuODU7XG4gICAgZWxzZSBpZiAoY2ZnLnNwZWVkID09PSAnc2xvdycpIHRoaXMuYXV0b0dhaW5TbW9vdGhpbmdXaW5kb3cgPSAwLjk4O1xuICAgIGVsc2UgdGhpcy5hdXRvR2FpblNtb290aGluZ1dpbmRvdyA9IDAuOTQ7XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlTWFzdGVyR2FpbihjZmc6IE1hc3RlckdhaW5Db25maWcpOiB2b2lkIHtcbiAgICB0aGlzLm1hc3RlckdhaW5Db25maWcgPSBjZmc7XG4gICAgaWYgKCF0aGlzLmN0eCB8fCAhdGhpcy5tYXN0ZXJHYWluTm9kZSkgcmV0dXJuO1xuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3R4LmN1cnJlbnRUaW1lO1xuICAgIGNvbnN0IGxpbiA9IE1hdGgucG93KDEwLCBjZmcuZ2FpbkRCIC8gMjApO1xuICAgIHRoaXMubWFzdGVyR2Fpbk5vZGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUobGluLCBub3csIDAuMDIpO1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZUxpbWl0ZXIoY2ZnOiBTb2Z0TGltaXRlckNvbmZpZyk6IHZvaWQge1xuICAgIHRoaXMubGltaXRlckNvbmZpZyA9IGNmZztcbiAgICBpZiAoIXRoaXMuY3R4IHx8ICF0aGlzLmxpbWl0ZXJEcnlHYWluIHx8ICF0aGlzLmxpbWl0ZXJXZXRHYWluIHx8ICF0aGlzLmxpbWl0ZXJQcmVHYWluTm9kZSB8fCAhdGhpcy5saW1pdGVyRmFzdENvbXBOb2RlKSByZXR1cm47XG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG5cbiAgICBpZiAoIWNmZy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmxpbWl0ZXJEcnlHYWluLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDEuMCwgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubGltaXRlcldldEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubGltaXRlckRyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMC4wLCBub3csIDAuMDIpO1xuICAgIHRoaXMubGltaXRlcldldEdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMS4wLCBub3csIDAuMDIpO1xuXG4gICAgY29uc3QgcHJlR2FpbkxpbiA9IE1hdGgucG93KDEwLCBjZmcuZHJpdmVEQiAvIDIwKTtcbiAgICB0aGlzLmxpbWl0ZXJQcmVHYWluTm9kZS5nYWluLnNldFRhcmdldEF0VGltZShwcmVHYWluTGluLCBub3csIDAuMDIpO1xuXG4gICAgdGhpcy5saW1pdGVyRmFzdENvbXBOb2RlLnRocmVzaG9sZC5zZXRUYXJnZXRBdFRpbWUoY2ZnLmNlaWxpbmdEQiwgbm93LCAwLjAyKTtcbiAgICB0aGlzLmxpbWl0ZXJGYXN0Q29tcE5vZGUucmVsZWFzZS5zZXRUYXJnZXRBdFRpbWUoTWF0aC5tYXgoMC4wMSwgY2ZnLnJlbGVhc2VNcyAvIDEwMDApLCBub3csIDAuMDIpO1xuXG4gICAgLy8gRHluYW1pYyB3YXZlIHNoYXBlIGZvciBjZWlsaW5nXG4gICAgaWYgKHRoaXMubGltaXRlcldhdmVTaGFwZXJOb2RlKSB7XG4gICAgICBjb25zdCBjZWlsaW5nTGluID0gTWF0aC5wb3coMTAsIGNmZy5jZWlsaW5nREIgLyAyMCk7XG4gICAgICBjb25zdCBkcml2ZUxpbiA9IDEuMCArIChjZmcuZHJpdmVEQiAvIDEyKSAqIDAuNTtcbiAgICAgIHRoaXMubGltaXRlcldhdmVTaGFwZXJOb2RlLmN1cnZlID0gY3JlYXRlU29mdENsaXBDdXJ2ZSg0MDk2LCBjZWlsaW5nTGluLCBkcml2ZUxpbikgYXMgYW55O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRNYXN0ZXJCeXBhc3MoYnlwYXNzOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5tYXN0ZXJCeXBhc3MgPSBieXBhc3M7XG4gICAgaWYgKCF0aGlzLmN0eCB8fCAhdGhpcy5tYXN0ZXJEcnlHYWluIHx8ICF0aGlzLm1hc3RlcldldEdhaW4pIHJldHVybjtcbiAgICBjb25zdCBub3cgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICBpZiAoYnlwYXNzKSB7XG4gICAgICB0aGlzLm1hc3RlckRyeUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMS4wLCBub3csIDAuMDIpO1xuICAgICAgdGhpcy5tYXN0ZXJXZXRHYWluLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDAuMCwgbm93LCAwLjAyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXN0ZXJEcnlHYWluLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKDAuMCwgbm93LCAwLjAyKTtcbiAgICAgIHRoaXMubWFzdGVyV2V0R2Fpbi5nYWluLnNldFRhcmdldEF0VGltZSgxLjAsIG5vdywgMC4wMik7XG4gICAgfVxuICB9XG5cbiAgLy8gPT09IENsb3NlZC1Mb29wIEF1dG9HYWluIFdvcmtlciA9PT1cbiAgcHJpdmF0ZSBzdGFydEF1dG9HYWluTG9vcCgpOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KDUxMik7XG5cbiAgICB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmN0eCB8fCAhdGhpcy5hdXRvR2FpbkNvbmZpZy5lbmFibGVkIHx8ICF0aGlzLmF1dG9HYWluRGV0ZWN0b3JBbmFseXNlciB8fCAhdGhpcy5hdXRvR2Fpbk5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmF1dG9HYWluRGV0ZWN0b3JBbmFseXNlci5nZXRGbG9hdFRpbWVEb21haW5EYXRhKGJ1ZmZlcik7XG4gICAgICBsZXQgc3VtU3EgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3VtU3EgKz0gYnVmZmVyW2ldICogYnVmZmVyW2ldO1xuICAgICAgfVxuICAgICAgY29uc3Qgcm1zID0gTWF0aC5zcXJ0KHN1bVNxIC8gYnVmZmVyLmxlbmd0aCk7XG4gICAgICBpZiAocm1zIDwgMC4wMDUpIHtcbiAgICAgICAgLy8gU2lnbmFsIGlzIHNpbGVudCBvciBuZWFyLXplcm8sIGtlZXAgY3VycmVudCBvZmZzZXRcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50Uk1TX0RCID0gMjAgKiBNYXRoLmxvZzEwKHJtcyk7XG4gICAgICBjb25zdCBlcnJvckRCID0gdGhpcy5hdXRvR2FpbkNvbmZpZy50YXJnZXREQiAtIGN1cnJlbnRSTVNfREI7XG5cbiAgICAgIC8vIENsYW1wIG9mZnNldCB3aXRoaW4gdXNlciBsaW1pdHNcbiAgICAgIGNvbnN0IGNsYW1wZWRUYXJnZXRPZmZzZXQgPSBNYXRoLm1heChcbiAgICAgICAgdGhpcy5hdXRvR2FpbkNvbmZpZy5tYXhDdXREQixcbiAgICAgICAgTWF0aC5taW4odGhpcy5hdXRvR2FpbkNvbmZpZy5tYXhCb29zdERCLCBlcnJvckRCKVxuICAgICAgKTtcblxuICAgICAgLy8gU21vb3RoIGludGVncmF0aW9uXG4gICAgICB0aGlzLmF1dG9HYWluQ3VycmVudE9mZnNldCA9XG4gICAgICAgIHRoaXMuYXV0b0dhaW5DdXJyZW50T2Zmc2V0ICogdGhpcy5hdXRvR2FpblNtb290aGluZ1dpbmRvdyArXG4gICAgICAgIGNsYW1wZWRUYXJnZXRPZmZzZXQgKiAoMSAtIHRoaXMuYXV0b0dhaW5TbW9vdGhpbmdXaW5kb3cpO1xuXG4gICAgICBjb25zdCB0YXJnZXRHYWluTGluID0gTWF0aC5wb3coMTAsIHRoaXMuYXV0b0dhaW5DdXJyZW50T2Zmc2V0IC8gMjApO1xuICAgICAgdGhpcy5hdXRvR2Fpbk5vZGUuZ2Fpbi5zZXRUYXJnZXRBdFRpbWUodGFyZ2V0R2FpbkxpbiwgdGhpcy5jdHguY3VycmVudFRpbWUsIDAuMSk7XG4gICAgfSwgNTApO1xuICB9XG5cbiAgLy8gPT09IEF1ZGlvIFNvdXJjZXMgU2V0dXAgKEZpbGUsIE1pYywgU3ludGggVGVzdCBHZW5lcmF0b3IpID09PVxuXG4gIHB1YmxpYyBhc3luYyBzZXRBdWRpb1NvdXJjZShcbiAgICB0eXBlOiBBdWRpb1NvdXJjZVR5cGUsXG4gICAgb3B0aW9ucz86IHsgZmlsZT86IEZpbGU7IHN5bnRoVHlwZT86IFN5bnRoU2lnbmFsVHlwZTsgc3ludGhGcmVxPzogbnVtYmVyIH1cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5pbml0QXVkaW8oKTtcbiAgICBpZiAoIXRoaXMuY3R4IHx8ICF0aGlzLmlucHV0R2Fpbk5vZGUpIHJldHVybjtcblxuICAgIHRoaXMuc3RvcEN1cnJlbnRTb3VyY2UoKTtcbiAgICB0aGlzLmN1cnJlbnRTb3VyY2VUeXBlID0gdHlwZTtcblxuICAgIGlmICh0eXBlID09PSAnZmlsZScgJiYgb3B0aW9ucz8uZmlsZSkge1xuICAgICAgaWYgKCF0aGlzLmF1ZGlvRWxlbWVudCkge1xuICAgICAgICB0aGlzLmF1ZGlvRWxlbWVudCA9IG5ldyBBdWRpbygpO1xuICAgICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jcm9zc09yaWdpbiA9ICdhbm9ueW1vdXMnO1xuICAgICAgICB0aGlzLmF1ZGlvRWxlbWVudC5sb29wID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwob3B0aW9ucy5maWxlKTtcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnNyYyA9IHVybDtcblxuICAgICAgaWYgKCF0aGlzLm1lZGlhRWxlbWVudFNvdXJjZU5vZGUpIHtcbiAgICAgICAgdGhpcy5tZWRpYUVsZW1lbnRTb3VyY2VOb2RlID0gdGhpcy5jdHguY3JlYXRlTWVkaWFFbGVtZW50U291cmNlKHRoaXMuYXVkaW9FbGVtZW50KTtcbiAgICAgICAgdGhpcy5tZWRpYUVsZW1lbnRTb3VyY2VOb2RlLmNvbm5lY3QodGhpcy5pbnB1dEdhaW5Ob2RlKTtcbiAgICAgIH1cbiAgICAgIGF3YWl0IHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdtaWMnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzdHJlYW0gPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XG4gICAgICAgICAgYXVkaW86IHtcbiAgICAgICAgICAgIGVjaG9DYW5jZWxsYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgbm9pc2VTdXBwcmVzc2lvbjogZmFsc2UsXG4gICAgICAgICAgICBhdXRvR2FpbkNvbnRyb2w6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1pY1N0cmVhbSA9IHN0cmVhbTtcbiAgICAgICAgdGhpcy5taWNTb3VyY2VOb2RlID0gdGhpcy5jdHguY3JlYXRlTWVkaWFTdHJlYW1Tb3VyY2Uoc3RyZWFtKTtcbiAgICAgICAgdGhpcy5taWNTb3VyY2VOb2RlLmNvbm5lY3QodGhpcy5pbnB1dEdhaW5Ob2RlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLmN1cnJlbnRTb3VyY2VUeXBlID0gJ25vbmUnO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnc3ludGgnKSB7XG4gICAgICBjb25zdCBzVHlwZSA9IG9wdGlvbnM/LnN5bnRoVHlwZSB8fCAnc3dlZXAnO1xuICAgICAgY29uc3QgZnJlcSA9IG9wdGlvbnM/LnN5bnRoRnJlcSB8fCA0NDA7XG4gICAgICB0aGlzLnN0YXJ0U3ludGhTb3VyY2Uoc1R5cGUsIGZyZXEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRTeW50aFNvdXJjZShzeW50aFR5cGU6IFN5bnRoU2lnbmFsVHlwZSwgZnJlcTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmN0eCB8fCAhdGhpcy5pbnB1dEdhaW5Ob2RlKSByZXR1cm47XG5cbiAgICB0aGlzLnN5bnRoR2FpbiA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICB0aGlzLnN5bnRoR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAuMjUsIHRoaXMuY3R4LmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLnN5bnRoR2Fpbi5jb25uZWN0KHRoaXMuaW5wdXRHYWluTm9kZSk7XG5cbiAgICBpZiAoc3ludGhUeXBlID09PSAnc2luZScpIHtcbiAgICAgIHRoaXMuc3ludGhPc2NpbGxhdG9yID0gdGhpcy5jdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgdGhpcy5zeW50aE9zY2lsbGF0b3IudHlwZSA9ICdzaW5lJztcbiAgICAgIHRoaXMuc3ludGhPc2NpbGxhdG9yLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxLCB0aGlzLmN0eC5jdXJyZW50VGltZSk7XG4gICAgICB0aGlzLnN5bnRoT3NjaWxsYXRvci5jb25uZWN0KHRoaXMuc3ludGhHYWluKTtcbiAgICAgIHRoaXMuc3ludGhPc2NpbGxhdG9yLnN0YXJ0KCk7XG4gICAgfSBlbHNlIGlmIChzeW50aFR5cGUgPT09ICdzd2VlcCcpIHtcbiAgICAgIHRoaXMuc3ludGhPc2NpbGxhdG9yID0gdGhpcy5jdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgdGhpcy5zeW50aE9zY2lsbGF0b3IudHlwZSA9ICdzaW5lJztcbiAgICAgIHRoaXMuc3ludGhPc2NpbGxhdG9yLmNvbm5lY3QodGhpcy5zeW50aEdhaW4pO1xuXG4gICAgICBjb25zdCBydW5Mb2dTd2VlcCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLnN5bnRoT3NjaWxsYXRvciB8fCAhdGhpcy5jdHgpIHJldHVybjtcbiAgICAgICAgY29uc3Qgbm93ID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgICAgIHRoaXMuc3ludGhPc2NpbGxhdG9yLmZyZXF1ZW5jeS5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMobm93KTtcbiAgICAgICAgdGhpcy5zeW50aE9zY2lsbGF0b3IuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKDIwLCBub3cpO1xuICAgICAgICB0aGlzLnN5bnRoT3NjaWxsYXRvci5mcmVxdWVuY3kuZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgyMDAwMCwgbm93ICsgNS4wKTtcbiAgICAgIH07XG5cbiAgICAgIHJ1bkxvZ1N3ZWVwKCk7XG4gICAgICB0aGlzLnN5bnRoT3NjaWxsYXRvci5zdGFydCgpO1xuICAgICAgdGhpcy5pc1N3ZWVwUnVubmluZyA9IHRydWU7XG4gICAgICB0aGlzLnN3ZWVwVGltZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwocnVuTG9nU3dlZXAsIDUyMDApO1xuICAgIH0gZWxzZSBpZiAoc3ludGhUeXBlID09PSAnd2hpdGVfbm9pc2UnKSB7XG4gICAgICBjb25zdCBidWZmZXJTaXplID0gdGhpcy5jdHguc2FtcGxlUmF0ZSAqIDI7XG4gICAgICBjb25zdCBub2lzZUJ1ZmZlciA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlcigxLCBidWZmZXJTaXplLCB0aGlzLmN0eC5zYW1wbGVSYXRlKTtcbiAgICAgIGNvbnN0IG91dHB1dCA9IG5vaXNlQnVmZmVyLmdldENoYW5uZWxEYXRhKDApO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWZmZXJTaXplOyBpKyspIHtcbiAgICAgICAgb3V0cHV0W2ldID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xuICAgICAgfVxuICAgICAgdGhpcy5ub2lzZUJ1ZmZlck5vZGUgPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgIHRoaXMubm9pc2VCdWZmZXJOb2RlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xuICAgICAgdGhpcy5ub2lzZUJ1ZmZlck5vZGUubG9vcCA9IHRydWU7XG4gICAgICB0aGlzLm5vaXNlQnVmZmVyTm9kZS5jb25uZWN0KHRoaXMuc3ludGhHYWluKTtcbiAgICAgIHRoaXMubm9pc2VCdWZmZXJOb2RlLnN0YXJ0KCk7XG4gICAgfSBlbHNlIGlmIChzeW50aFR5cGUgPT09ICdwaW5rX25vaXNlJykge1xuICAgICAgLy8gS2VsbGV0IDEvZiBmaWx0ZXIgYXBwcm94aW1hdGlvblxuICAgICAgY29uc3QgYnVmZmVyU2l6ZSA9IHRoaXMuY3R4LnNhbXBsZVJhdGUgKiAyO1xuICAgICAgY29uc3Qgbm9pc2VCdWZmZXIgPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXIoMSwgYnVmZmVyU2l6ZSwgdGhpcy5jdHguc2FtcGxlUmF0ZSk7XG4gICAgICBjb25zdCBvdXRwdXQgPSBub2lzZUJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKTtcbiAgICAgIGxldCBiMCA9IDAsIGIxID0gMCwgYjIgPSAwLCBiMyA9IDAsIGI0ID0gMCwgYjUgPSAwLCBiNiA9IDA7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZmZlclNpemU7IGkrKykge1xuICAgICAgICBjb25zdCB3aGl0ZSA9IE1hdGgucmFuZG9tKCkgKiAyIC0gMTtcbiAgICAgICAgYjAgPSAwLjk5ODg2ICogYjAgKyB3aGl0ZSAqIDAuMDU1NTE3OTtcbiAgICAgICAgYjEgPSAwLjk5MzMyICogYjEgKyB3aGl0ZSAqIDAuMDc1MDc1OTtcbiAgICAgICAgYjIgPSAwLjk2OTAwICogYjIgKyB3aGl0ZSAqIDAuMTUzODUyMDtcbiAgICAgICAgYjMgPSAwLjg2NjUwICogYjMgKyB3aGl0ZSAqIDAuMzEwNDg1NjtcbiAgICAgICAgYjQgPSAwLjU1MDAwICogYjQgKyB3aGl0ZSAqIDAuNTMyOTUyMjtcbiAgICAgICAgYjUgPSAtMC43NjE2ICogYjUgLSB3aGl0ZSAqIDAuMDE2ODk4MDtcbiAgICAgICAgb3V0cHV0W2ldID0gKGIwICsgYjEgKyBiMiArIGIzICsgYjQgKyBiNSArIGI2ICsgd2hpdGUgKiAwLjUzNjIpICogMC4xMTtcbiAgICAgICAgYjYgPSB3aGl0ZSAqIDAuMTE1OTI2O1xuICAgICAgfVxuICAgICAgdGhpcy5ub2lzZUJ1ZmZlck5vZGUgPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgIHRoaXMubm9pc2VCdWZmZXJOb2RlLmJ1ZmZlciA9IG5vaXNlQnVmZmVyO1xuICAgICAgdGhpcy5ub2lzZUJ1ZmZlck5vZGUubG9vcCA9IHRydWU7XG4gICAgICB0aGlzLm5vaXNlQnVmZmVyTm9kZS5jb25uZWN0KHRoaXMuc3ludGhHYWluKTtcbiAgICAgIHRoaXMubm9pc2VCdWZmZXJOb2RlLnN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldFN5bnRoRnJlcXVlbmN5KGY6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnN5bnRoT3NjaWxsYXRvciAmJiB0aGlzLmN0eCkge1xuICAgICAgdGhpcy5zeW50aE9zY2lsbGF0b3IuZnJlcXVlbmN5LnNldFRhcmdldEF0VGltZShmLCB0aGlzLmN0eC5jdXJyZW50VGltZSwgMC4wMik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0b3BDdXJyZW50U291cmNlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmF1ZGlvRWxlbWVudCkge1xuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWljU3RyZWFtKSB7XG4gICAgICB0aGlzLm1pY1N0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHQgPT4gdC5zdG9wKCkpO1xuICAgICAgdGhpcy5taWNTdHJlYW0gPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5taWNTb3VyY2VOb2RlKSB7XG4gICAgICB0aGlzLm1pY1NvdXJjZU5vZGUuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5taWNTb3VyY2VOb2RlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3dlZXBUaW1lcikge1xuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN3ZWVwVGltZXIpO1xuICAgICAgdGhpcy5zd2VlcFRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMuaXNTd2VlcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc3ludGhPc2NpbGxhdG9yKSB7XG4gICAgICB0cnkgeyB0aGlzLnN5bnRoT3NjaWxsYXRvci5zdG9wKCk7IH0gY2F0Y2ggeyAvKiBpZ25vcmUgKi8gfVxuICAgICAgdGhpcy5zeW50aE9zY2lsbGF0b3IuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5zeW50aE9zY2lsbGF0b3IgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5ub2lzZUJ1ZmZlck5vZGUpIHtcbiAgICAgIHRyeSB7IHRoaXMubm9pc2VCdWZmZXJOb2RlLnN0b3AoKTsgfSBjYXRjaCB7IC8qIGlnbm9yZSAqLyB9XG4gICAgICB0aGlzLm5vaXNlQnVmZmVyTm9kZS5kaXNjb25uZWN0KCk7XG4gICAgICB0aGlzLm5vaXNlQnVmZmVyTm9kZSA9IG51bGw7XG4gICAgfVxuICAgIGlmICh0aGlzLnN5bnRoR2Fpbikge1xuICAgICAgdGhpcy5zeW50aEdhaW4uZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5zeW50aEdhaW4gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRTb3VyY2VUeXBlID0gJ25vbmUnO1xuICB9XG5cbiAgcHVibGljIGdldEF1ZGlvRWxlbWVudCgpOiBIVE1MQXVkaW9FbGVtZW50IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuYXVkaW9FbGVtZW50O1xuICB9XG5cbiAgLy8gPT09IFRlbGVtZXRyeSAmIEZGVCBBbmFseXNpcyBSZWFkb3V0cyA9PT1cblxuICBwdWJsaWMgZ2V0VGVsZW1ldHJ5KCk6IEF1ZGlvVGVsZW1ldHJ5IHtcbiAgICBpZiAoIXRoaXMuY3R4IHx8ICF0aGlzLnBvc3RBbmFseXNlck5vZGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNhbXBsZVJhdGU6IDQ4MDAwLFxuICAgICAgICBjaGFubmVsczogMixcbiAgICAgICAgc3RhdGU6ICdjbG9zZWQnLFxuICAgICAgICBiYXNlTGF0ZW5jeTogMC4wMDUsXG4gICAgICAgIGJ1ZmZlclNpemU6IDUxMixcbiAgICAgICAgaW5wdXRQZWFrTDogMCxcbiAgICAgICAgaW5wdXRQZWFrUjogMCxcbiAgICAgICAgb3V0cHV0UGVha0w6IDAsXG4gICAgICAgIG91dHB1dFBlYWtSOiAwLFxuICAgICAgICBvdXRwdXRSTVNMOiAwLFxuICAgICAgICBvdXRwdXRSTVNSOiAwLFxuICAgICAgICBtZHJjR2FpblJlZHVjdGlvbkxvdzogMCxcbiAgICAgICAgbWRyY0dhaW5SZWR1Y3Rpb25NaWQ6IDAsXG4gICAgICAgIG1kcmNHYWluUmVkdWN0aW9uSGlnaDogMCxcbiAgICAgICAgYXV0b0dhaW5DdXJyZW50T2Zmc2V0REI6IDAsXG4gICAgICAgIGxpbWl0ZXJSZWR1Y3Rpb25EQjogMCxcbiAgICAgICAgaXNDbGlwcGluZzogdGhpcy5pc0NsaXBwaW5nLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCB0aW1lRG9tYWluID0gbmV3IEZsb2F0MzJBcnJheSg1MTIpO1xuICAgIHRoaXMucG9zdEFuYWx5c2VyTm9kZS5nZXRGbG9hdFRpbWVEb21haW5EYXRhKHRpbWVEb21haW4pO1xuXG4gICAgbGV0IHBlYWsgPSAwO1xuICAgIGxldCBzdW1TcSA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aW1lRG9tYWluLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB2YWwgPSBNYXRoLmFicyh0aW1lRG9tYWluW2ldKTtcbiAgICAgIGlmICh2YWwgPiBwZWFrKSBwZWFrID0gdmFsO1xuICAgICAgc3VtU3EgKz0gdmFsICogdmFsO1xuICAgIH1cbiAgICBjb25zdCBybXMgPSBNYXRoLnNxcnQoc3VtU3EgLyB0aW1lRG9tYWluLmxlbmd0aCk7XG5cbiAgICBpZiAocGVhayA+PSAwLjk5OSkge1xuICAgICAgdGhpcy5pc0NsaXBwaW5nID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmNsaXBSZXNldFRpbWVyKSB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMuY2xpcFJlc2V0VGltZXIpO1xuICAgICAgdGhpcy5jbGlwUmVzZXRUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5pc0NsaXBwaW5nID0gZmFsc2U7XG4gICAgICB9LCAxNTAwKTtcbiAgICB9XG5cbiAgICBjb25zdCBsb3dHUiA9IHRoaXMubWRyY0xvd0NvbXAgPyBNYXRoLmFicyh0aGlzLm1kcmNMb3dDb21wLnJlZHVjdGlvbikgOiAwO1xuICAgIGNvbnN0IG1pZEdSID0gdGhpcy5tZHJjTWlkQ29tcCA/IE1hdGguYWJzKHRoaXMubWRyY01pZENvbXAucmVkdWN0aW9uKSA6IDA7XG4gICAgY29uc3QgaGlnaEdSID0gdGhpcy5tZHJjSGlnaENvbXAgPyBNYXRoLmFicyh0aGlzLm1kcmNIaWdoQ29tcC5yZWR1Y3Rpb24pIDogMDtcbiAgICBjb25zdCBsaW1HUiA9IHRoaXMubGltaXRlckZhc3RDb21wTm9kZSA/IE1hdGguYWJzKHRoaXMubGltaXRlckZhc3RDb21wTm9kZS5yZWR1Y3Rpb24pIDogMDtcblxuICAgIHJldHVybiB7XG4gICAgICBzYW1wbGVSYXRlOiB0aGlzLmN0eC5zYW1wbGVSYXRlLFxuICAgICAgY2hhbm5lbHM6IDIsXG4gICAgICBzdGF0ZTogdGhpcy5jdHguc3RhdGUsXG4gICAgICBiYXNlTGF0ZW5jeTogdGhpcy5jdHguYmFzZUxhdGVuY3kgfHwgMC4wMDUsXG4gICAgICBidWZmZXJTaXplOiA1MTIsXG4gICAgICBpbnB1dFBlYWtMOiBwZWFrICogMC45LFxuICAgICAgaW5wdXRQZWFrUjogcGVhayAqIDAuOSxcbiAgICAgIG91dHB1dFBlYWtMOiBwZWFrLFxuICAgICAgb3V0cHV0UGVha1I6IHBlYWssXG4gICAgICBvdXRwdXRSTVNMOiBybXMsXG4gICAgICBvdXRwdXRSTVNSOiBybXMsXG4gICAgICBtZHJjR2FpblJlZHVjdGlvbkxvdzogbG93R1IsXG4gICAgICBtZHJjR2FpblJlZHVjdGlvbk1pZDogbWlkR1IsXG4gICAgICBtZHJjR2FpblJlZHVjdGlvbkhpZ2g6IGhpZ2hHUixcbiAgICAgIGF1dG9HYWluQ3VycmVudE9mZnNldERCOiB0aGlzLmF1dG9HYWluQ3VycmVudE9mZnNldCxcbiAgICAgIGxpbWl0ZXJSZWR1Y3Rpb25EQjogbGltR1IsXG4gICAgICBpc0NsaXBwaW5nOiB0aGlzLmlzQ2xpcHBpbmcsXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRQcmVGcmVxdWVuY3lEYXRhKGFycmF5OiBVaW50OEFycmF5KTogdm9pZCB7XG4gICAgaWYgKHRoaXMucHJlQW5hbHlzZXJOb2RlKSB7XG4gICAgICB0aGlzLnByZUFuYWx5c2VyTm9kZS5nZXRCeXRlRnJlcXVlbmN5RGF0YShhcnJheSBhcyB1bmtub3duIGFzIFVpbnQ4QXJyYXk8QXJyYXlCdWZmZXI+KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0UG9zdEZyZXF1ZW5jeURhdGEoYXJyYXk6IFVpbnQ4QXJyYXkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3N0QW5hbHlzZXJOb2RlKSB7XG4gICAgICB0aGlzLnBvc3RBbmFseXNlck5vZGUuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoYXJyYXkgYXMgdW5rbm93biBhcyBVaW50OEFycmF5PEFycmF5QnVmZmVyPik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFBvc3RUaW1lRG9tYWluRGF0YShhcnJheTogVWludDhBcnJheSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvc3RBbmFseXNlck5vZGUpIHtcbiAgICAgIHRoaXMucG9zdEFuYWx5c2VyTm9kZS5nZXRCeXRlVGltZURvbWFpbkRhdGEoYXJyYXkgYXMgdW5rbm93biBhcyBVaW50OEFycmF5PEFycmF5QnVmZmVyPik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldDMyQmFuZHMoKTogRVEzMkJhbmRbXSB7XG4gICAgcmV0dXJuIHRoaXMuZXEzMkJhbmRzO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBkc3BFbmdpbmUgPSBuZXcgRFNQRW5naW5lKCk7XG4iXX0=