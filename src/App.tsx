const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useCallback = __vite__cjsImport0_react["useCallback"]; const useRef = __vite__cjsImport0_react["useRef"];const _jsxDEV = __vite__cjsImport15_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { dspEngine } from "/src/audio/dspEngine.ts";
import { FACTORY_PRESETS, loadUserPresets, saveUserPresets, DEFAULT_PREGAIN, DEFAULT_BASS_BOOST, DEFAULT_VIRTUALIZER, createDefault32Bands, DEFAULT_TONE, DEFAULT_MDRC, DEFAULT_AUTOGAIN, DEFAULT_MASTER_GAIN, DEFAULT_LIMITER } from "/src/audio/presets.ts";
import { Header } from "/src/components/Header.tsx";
import { SpectrumDisplay } from "/src/components/SpectrumDisplay.tsx";
import { Equalizer32Section } from "/src/components/Equalizer32Section.tsx";
import { ToneAndBassSection } from "/src/components/ToneAndBassSection.tsx";
import { DynamicsMDRCSection } from "/src/components/DynamicsMDRCSection.tsx";
import { MeterBridge } from "/src/components/MeterBridge.tsx";
import { AudioSourceBar } from "/src/components/AudioSourceBar.tsx";
import { PresetBar } from "/src/components/PresetBar.tsx";
import { AndroidArchitectureModal } from "/src/components/AndroidArchitectureModal.tsx";
import { DSPValidationModal } from "/src/components/DSPValidationModal.tsx";
import { DirectZipDownloadModal } from "/src/components/DirectZipDownloadModal.tsx";
import { NativeBridgeDispatcher } from "/src/utils/nativeBridge.ts";
var _jsxFileName = "/app/applet/src/App.tsx";
import __vite__cjsImport15_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export default function App() {
	const [isEngineActive, setIsEngineActive] = useState(false);
	const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
	const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
	const [isZipModalOpen, setIsZipModalOpen] = useState(false);
	// === Core DSP Module States ===
	const [preGain, setPreGain] = useState(DEFAULT_PREGAIN);
	const [bassBoost, setBassBoost] = useState(DEFAULT_BASS_BOOST);
	const [virtualizer, setVirtualizer] = useState(DEFAULT_VIRTUALIZER);
	const [eq32Bands, setEq32Bands] = useState(createDefault32Bands());
	const [selectedBandIndex, setSelectedBandIndex] = useState(6);
	const [tone, setTone] = useState(DEFAULT_TONE);
	const [mdrc, setMDRC] = useState(DEFAULT_MDRC);
	const [autoGain, setAutoGain] = useState(DEFAULT_AUTOGAIN);
	const [masterGain, setMasterGain] = useState(DEFAULT_MASTER_GAIN);
	const [limiter, setLimiter] = useState(DEFAULT_LIMITER);
	const [masterBypass, setMasterBypass] = useState(false);
	// Audio source state
	const [currentSource, setCurrentSource] = useState("none");
	// Presets
	const [userPresets, setUserPresets] = useState([]);
	const [currentPresetId, setCurrentPresetId] = useState(FACTORY_PRESETS[0].id);
	// Real-time telemetry
	const [telemetry, setTelemetry] = useState({
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
		isClipping: false
	});
	const initializedRef = useRef(false);
	// Load custom presets on mount
	useEffect(() => {
		const loaded = loadUserPresets();
		setUserPresets(loaded);
	}, []);
	// Sync state to DSP Engine
	const syncAllToEngine = useCallback((pPreGain, pBassBoost, pVirt, pBands, pTone, pMDRC, pAutoGain, pMasterGain, pLimiter, pBypass) => {
		if (!dspEngine.isInitialized()) return;
		dspEngine.updatePreGain(pPreGain);
		dspEngine.updateBassBoost(pBassBoost);
		dspEngine.updateVirtualizer(pVirt);
		dspEngine.updateAll32Bands(pBands);
		dspEngine.updateTone(pTone);
		dspEngine.updateMDRC(pMDRC);
		dspEngine.updateAutoGain(pAutoGain);
		dspEngine.updateMasterGain(pMasterGain);
		dspEngine.updateLimiter(pLimiter);
		dspEngine.setMasterBypass(pBypass);
		// Sincronizar en el motor DSP nativo de Android si se ejecuta en WebView
		NativeBridgeDispatcher.setMasterBypass(pBypass);
		NativeBridgeDispatcher.setPreGain(pPreGain.gainDB, pPreGain.phaseInvert);
		NativeBridgeDispatcher.setBassBoost(pBassBoost.enabled, pBassBoost.boostDB, pBassBoost.frequency, pBassBoost.harmonics);
		NativeBridgeDispatcher.setVirtualizer(pVirt.enabled, pVirt.intensity / 50, pVirt.crossfeed);
		pBands.forEach((b) => NativeBridgeDispatcher.setEqBand(b.index, b.gain));
		NativeBridgeDispatcher.setTone(pTone.enabled, pTone.bassDB, pTone.midDB, pTone.trebleDB);
		NativeBridgeDispatcher.setMdrc("low", pMDRC.lowThreshold, pMDRC.lowRatio, pMDRC.attackMs, pMDRC.releaseMs, pMDRC.lowGainDB);
		NativeBridgeDispatcher.setMdrc("mid", pMDRC.midThreshold, pMDRC.midRatio, pMDRC.attackMs, pMDRC.releaseMs, pMDRC.midGainDB);
		NativeBridgeDispatcher.setMdrc("high", pMDRC.highThreshold, pMDRC.highRatio, pMDRC.attackMs, pMDRC.releaseMs, pMDRC.highGainDB);
		NativeBridgeDispatcher.setMasterGain(pMasterGain.gainDB, 0);
		NativeBridgeDispatcher.setLimiter(pLimiter.enabled, Math.pow(10, pLimiter.ceilingDB / 20));
	}, []);
	// Apply Preset
	const applyPreset = useCallback((preset) => {
		setPreGain({ ...preset.preGain });
		setBassBoost({ ...preset.bassBoost });
		setVirtualizer({ ...preset.virtualizer });
		setEq32Bands([...preset.eq32Bands]);
		setTone({ ...preset.tone });
		setMDRC({ ...preset.mdrc });
		setAutoGain({ ...preset.autoGain });
		setMasterGain({ ...preset.masterGain });
		setLimiter({ ...preset.limiter });
		setMasterBypass(preset.masterBypass ?? false);
		setCurrentPresetId(preset.id);
		syncAllToEngine(preset.preGain, preset.bassBoost, preset.virtualizer, preset.eq32Bands, preset.tone, preset.mdrc, preset.autoGain, preset.masterGain, preset.limiter, preset.masterBypass ?? false);
	}, [syncAllToEngine]);
	// Master Power / Audio Context toggle
	const handleToggleEngine = async () => {
		if (!dspEngine.isInitialized()) {
			await dspEngine.initAudio();
			syncAllToEngine(preGain, bassBoost, virtualizer, eq32Bands, tone, mdrc, autoGain, masterGain, limiter, masterBypass);
			setIsEngineActive(true);
			initializedRef.current = true;
		} else {
			const ctx = dspEngine.getContext();
			if (ctx) {
				if (ctx.state === "running") {
					await ctx.suspend();
					setIsEngineActive(false);
				} else {
					await ctx.resume();
					setIsEngineActive(true);
				}
			}
		}
	};
	const handleToggleMasterBypass = () => {
		const next = !masterBypass;
		setMasterBypass(next);
		dspEngine.setMasterBypass(next);
		NativeBridgeDispatcher.setMasterBypass(next);
	};
	// DSP Parameter change handlers (directly invoking real software DSP processing)
	const handlePreGainChange = useCallback((cfg) => {
		setPreGain(cfg);
		dspEngine.updatePreGain(cfg);
		NativeBridgeDispatcher.setPreGain(cfg.gainDB, cfg.phaseInvert);
	}, []);
	const handleBassBoostChange = useCallback((cfg) => {
		setBassBoost(cfg);
		dspEngine.updateBassBoost(cfg);
		NativeBridgeDispatcher.setBassBoost(cfg.enabled, cfg.boostDB, cfg.frequency, cfg.harmonics);
	}, []);
	const handleVirtualizerChange = useCallback((cfg) => {
		setVirtualizer(cfg);
		dspEngine.updateVirtualizer(cfg);
		NativeBridgeDispatcher.setVirtualizer(cfg.enabled, cfg.intensity / 50, cfg.crossfeed);
	}, []);
	const handleBandChange = useCallback((band) => {
		setEq32Bands((prev) => {
			const next = [...prev];
			next[band.index] = band;
			dspEngine.update32Band(band);
			NativeBridgeDispatcher.setEqBand(band.index, band.enabled ? band.gain : 0);
			return next;
		});
	}, []);
	const handleResetFlat = useCallback(() => {
		setEq32Bands((prev) => {
			const reset = prev.map((b) => ({
				...b,
				gain: 0
			}));
			dspEngine.updateAll32Bands(reset);
			reset.forEach((b) => NativeBridgeDispatcher.setEqBand(b.index, 0));
			return reset;
		});
	}, []);
	const handleInvertCurve = useCallback(() => {
		setEq32Bands((prev) => {
			const inverted = prev.map((b) => ({
				...b,
				gain: -b.gain
			}));
			dspEngine.updateAll32Bands(inverted);
			inverted.forEach((b) => NativeBridgeDispatcher.setEqBand(b.index, b.gain));
			return inverted;
		});
	}, []);
	const handleToneChange = useCallback((cfg) => {
		setTone(cfg);
		dspEngine.updateTone(cfg);
		NativeBridgeDispatcher.setTone(cfg.enabled, cfg.bassDB, cfg.midDB, cfg.trebleDB);
	}, []);
	const handleMDRCChange = useCallback((cfg) => {
		setMDRC(cfg);
		dspEngine.updateMDRC(cfg);
		NativeBridgeDispatcher.setMdrc("low", cfg.lowThreshold, cfg.lowRatio, cfg.attackMs, cfg.releaseMs, cfg.lowGainDB);
		NativeBridgeDispatcher.setMdrc("mid", cfg.midThreshold, cfg.midRatio, cfg.attackMs, cfg.releaseMs, cfg.midGainDB);
		NativeBridgeDispatcher.setMdrc("high", cfg.highThreshold, cfg.highRatio, cfg.attackMs, cfg.releaseMs, cfg.highGainDB);
	}, []);
	const handleAutoGainChange = useCallback((cfg) => {
		setAutoGain(cfg);
		dspEngine.updateAutoGain(cfg);
	}, []);
	const handleMasterGainChange = useCallback((cfg) => {
		setMasterGain(cfg);
		dspEngine.updateMasterGain(cfg);
		NativeBridgeDispatcher.setMasterGain(cfg.gainDB, 0);
	}, []);
	const handleLimiterChange = useCallback((cfg) => {
		setLimiter(cfg);
		dspEngine.updateLimiter(cfg);
		NativeBridgeDispatcher.setLimiter(cfg.enabled, Math.pow(10, cfg.ceilingDB / 20));
	}, []);
	const handleSourceChange = (src) => {
		setCurrentSource(src);
		setIsEngineActive(src !== "none");
	};
	// User Preset Management
	const handleSavePreset = (name, category) => {
		const newPreset = {
			id: `user-preset-${Date.now()}`,
			name,
			category: category || "Personalizado",
			description: "Preset configurado por el usuario",
			isFactory: false,
			preGain: { ...preGain },
			bassBoost: { ...bassBoost },
			virtualizer: { ...virtualizer },
			eq32Bands: [...eq32Bands],
			tone: { ...tone },
			mdrc: { ...mdrc },
			autoGain: { ...autoGain },
			masterGain: { ...masterGain },
			limiter: { ...limiter },
			masterBypass
		};
		const updated = [...userPresets, newPreset];
		setUserPresets(updated);
		saveUserPresets(updated);
		setCurrentPresetId(newPreset.id);
	};
	const handleDeletePreset = (id) => {
		const updated = userPresets.filter((p) => p.id !== id);
		setUserPresets(updated);
		saveUserPresets(updated);
		if (currentPresetId === id) {
			applyPreset(FACTORY_PRESETS[0]);
		}
	};
	const handleExportPresets = () => {
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userPresets, null, 2));
		const downloadAnchor = document.createElement("a");
		downloadAnchor.setAttribute("href", dataStr);
		downloadAnchor.setAttribute("download", `audio_dsp_32band_presets_${new Date().toISOString().slice(0, 10)}.json`);
		document.body.appendChild(downloadAnchor);
		downloadAnchor.click();
		downloadAnchor.remove();
	};
	const handleImportPresets = (imported) => {
		const merged = [...userPresets, ...imported.map((p) => ({
			...p,
			isFactory: false
		}))];
		setUserPresets(merged);
		saveUserPresets(merged);
		if (imported.length > 0) {
			applyPreset(imported[0]);
		}
	};
	// Telemetry Polling Loop (50ms interval)
	useEffect(() => {
		const interval = window.setInterval(() => {
			if (dspEngine.isInitialized()) {
				const t = dspEngine.getTelemetry();
				setTelemetry(t);
				setIsEngineActive(t.state === "running");
			}
		}, 50);
		return () => clearInterval(interval);
	}, []);
	const allPresets = [...FACTORY_PRESETS, ...userPresets];
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200",
		children: [
			/* @__PURE__ */ _jsxDEV(Header, {
				isEngineActive,
				onToggleEngine: handleToggleEngine,
				onOpenAndroidAudit: () => setIsAndroidModalOpen(true),
				onOpenTestSuite: () => setIsTestSuiteOpen(true),
				onOpenZipDownload: () => setIsZipModalOpen(true),
				masterBypass,
				onToggleMasterBypass: handleToggleMasterBypass,
				sampleRate: telemetry.sampleRate
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 374,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("main", {
				className: "flex-1 w-full max-w-7xl mx-auto p-3 sm:p-5 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ _jsxDEV(PresetBar, {
						currentPresetId,
						allPresets,
						onSelectPreset: applyPreset,
						onSavePreset: handleSavePreset,
						onDeletePreset: handleDeletePreset,
						onExportPresets: handleExportPresets,
						onImportPresets: handleImportPresets,
						onResetFlat: () => applyPreset(FACTORY_PRESETS[0])
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 388,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV(AudioSourceBar, {
						currentSource,
						onSourceChange: handleSourceChange
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 400,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV(SpectrumDisplay, {
						eq32Bands,
						onBandChange: handleBandChange,
						tone,
						bassBoost,
						selectedBandIndex,
						onSelectBandIndex: setSelectedBandIndex
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 406,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV(Equalizer32Section, {
						bands: eq32Bands,
						onBandChange: handleBandChange,
						onResetFlat: handleResetFlat,
						onInvertCurve: handleInvertCurve,
						selectedBandIndex,
						onSelectBandIndex: setSelectedBandIndex
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 416,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV(ToneAndBassSection, {
						preGain,
						onPreGainChange: handlePreGainChange,
						tone,
						onToneChange: handleToneChange,
						bassBoost,
						onBassBoostChange: handleBassBoostChange,
						virtualizer,
						onVirtualizerChange: handleVirtualizerChange
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 426,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV(DynamicsMDRCSection, {
						mdrc,
						onMDRCChange: handleMDRCChange,
						autoGain,
						onAutoGainChange: handleAutoGainChange,
						masterGain,
						onMasterGainChange: handleMasterGainChange,
						limiter,
						onLimiterChange: handleLimiterChange,
						telemetry
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 438,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV(MeterBridge, { telemetry }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 451,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 386,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("footer", {
				className: "border-t border-neutral-900 px-4 py-3 text-center text-xs text-neutral-500 bg-neutral-950",
				children: "Motor DSP de Audio por Software • Arquitectura de Punto Flotante de 32-bit • 32 Bandas ISO 266 • Diseñado para Android & Web Audio"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 455,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV(AndroidArchitectureModal, {
				isOpen: isAndroidModalOpen,
				onClose: () => setIsAndroidModalOpen(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 460,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV(DSPValidationModal, {
				isOpen: isTestSuiteOpen,
				onClose: () => setIsTestSuiteOpen(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 466,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV(DirectZipDownloadModal, {
				isOpen: isZipModalOpen,
				onClose: () => setIsZipModalOpen(false)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 472,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 372,
		columnNumber: 5
	}, this);
}

//# sourceMappingURL=data:application/json;base64,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QUFjO01BQ2QsYUFBYTtNQUNiLGVBQWU7TUFDSTtNQUNuQixtQkFBbUI7S0FDcEI7Ozs7O0tBR0Qsd0JBQUMsb0JBQUQ7TUFDVztNQUNULGlCQUFpQjtNQUNYO01BQ04sY0FBYztNQUNIO01BQ1gsbUJBQW1CO01BQ047TUFDYixxQkFBcUI7S0FDdEI7Ozs7O0tBR0Qsd0JBQUMscUJBQUQ7TUFDUTtNQUNOLGNBQWM7TUFDSjtNQUNWLGtCQUFrQjtNQUNOO01BQ1osb0JBQW9CO01BQ1g7TUFDVCxpQkFBaUI7TUFDTjtLQUNaOzs7OztLQUdELHdCQUFDLGFBQUQsRUFBd0IsVUFBWTs7Ozs7SUFDaEM7Ozs7OztHQUdOLHdCQUFDLFVBQUQ7SUFBUSxXQUFVO2NBQTRGO0dBRXRHOzs7OztHQUdSLHdCQUFDLDBCQUFEO0lBQ0UsUUFBUTtJQUNSLGVBQWUsc0JBQXNCLEtBQUs7R0FDM0M7Ozs7O0dBR0Qsd0JBQUMsb0JBQUQ7SUFDRSxRQUFRO0lBQ1IsZUFBZSxtQkFBbUIsS0FBSztHQUN4Qzs7Ozs7R0FHRCx3QkFBQyx3QkFBRDtJQUNFLFFBQVE7SUFDUixlQUFlLGtCQUFrQixLQUFLO0dBQ3ZDOzs7OztFQUNFOzs7Ozs7QUFFVCIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJBcHAudHN4Il0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrLCB1c2VSZWYgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBkc3BFbmdpbmUgfSBmcm9tICcuL2F1ZGlvL2RzcEVuZ2luZSc7XG5pbXBvcnQge1xuICBQcmVHYWluQ29uZmlnLFxuICBCYXNzQm9vc3RDb25maWcsXG4gIFZpcnR1YWxpemVyQ29uZmlnLFxuICBFUTMyQmFuZCxcbiAgVG9uZUNvbnRyb2xzQ29uZmlnLFxuICBNRFJDQ29uZmlnLFxuICBBdXRvR2FpbkNvbmZpZyxcbiAgTWFzdGVyR2FpbkNvbmZpZyxcbiAgU29mdExpbWl0ZXJDb25maWcsXG4gIERTUFByZXNldCxcbiAgQXVkaW9Tb3VyY2VUeXBlLFxuICBBdWRpb1RlbGVtZXRyeSxcbn0gZnJvbSAnLi90eXBlcy9kc3AnO1xuaW1wb3J0IHtcbiAgRkFDVE9SWV9QUkVTRVRTLFxuICBsb2FkVXNlclByZXNldHMsXG4gIHNhdmVVc2VyUHJlc2V0cyxcbiAgREVGQVVMVF9QUkVHQUlOLFxuICBERUZBVUxUX0JBU1NfQk9PU1QsXG4gIERFRkFVTFRfVklSVFVBTElaRVIsXG4gIGNyZWF0ZURlZmF1bHQzMkJhbmRzLFxuICBERUZBVUxUX1RPTkUsXG4gIERFRkFVTFRfTURSQyxcbiAgREVGQVVMVF9BVVRPR0FJTixcbiAgREVGQVVMVF9NQVNURVJfR0FJTixcbiAgREVGQVVMVF9MSU1JVEVSLFxufSBmcm9tICcuL2F1ZGlvL3ByZXNldHMnO1xuXG5pbXBvcnQgeyBIZWFkZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvSGVhZGVyJztcbmltcG9ydCB7IFNwZWN0cnVtRGlzcGxheSB9IGZyb20gJy4vY29tcG9uZW50cy9TcGVjdHJ1bURpc3BsYXknO1xuaW1wb3J0IHsgRXF1YWxpemVyMzJTZWN0aW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL0VxdWFsaXplcjMyU2VjdGlvbic7XG5pbXBvcnQgeyBUb25lQW5kQmFzc1NlY3Rpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvVG9uZUFuZEJhc3NTZWN0aW9uJztcbmltcG9ydCB7IER5bmFtaWNzTURSQ1NlY3Rpb24gfSBmcm9tICcuL2NvbXBvbmVudHMvRHluYW1pY3NNRFJDU2VjdGlvbic7XG5pbXBvcnQgeyBNZXRlckJyaWRnZSB9IGZyb20gJy4vY29tcG9uZW50cy9NZXRlckJyaWRnZSc7XG5pbXBvcnQgeyBBdWRpb1NvdXJjZUJhciB9IGZyb20gJy4vY29tcG9uZW50cy9BdWRpb1NvdXJjZUJhcic7XG5pbXBvcnQgeyBQcmVzZXRCYXIgfSBmcm9tICcuL2NvbXBvbmVudHMvUHJlc2V0QmFyJztcbmltcG9ydCB7IEFuZHJvaWRBcmNoaXRlY3R1cmVNb2RhbCB9IGZyb20gJy4vY29tcG9uZW50cy9BbmRyb2lkQXJjaGl0ZWN0dXJlTW9kYWwnO1xuaW1wb3J0IHsgRFNQVmFsaWRhdGlvbk1vZGFsIH0gZnJvbSAnLi9jb21wb25lbnRzL0RTUFZhbGlkYXRpb25Nb2RhbCc7XG5pbXBvcnQgeyBEaXJlY3RaaXBEb3dubG9hZE1vZGFsIH0gZnJvbSAnLi9jb21wb25lbnRzL0RpcmVjdFppcERvd25sb2FkTW9kYWwnO1xuaW1wb3J0IHsgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlciB9IGZyb20gJy4vdXRpbHMvbmF0aXZlQnJpZGdlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKCkge1xuICBjb25zdCBbaXNFbmdpbmVBY3RpdmUsIHNldElzRW5naW5lQWN0aXZlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzQW5kcm9pZE1vZGFsT3Blbiwgc2V0SXNBbmRyb2lkTW9kYWxPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzVGVzdFN1aXRlT3Blbiwgc2V0SXNUZXN0U3VpdGVPcGVuXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2lzWmlwTW9kYWxPcGVuLCBzZXRJc1ppcE1vZGFsT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgLy8gPT09IENvcmUgRFNQIE1vZHVsZSBTdGF0ZXMgPT09XG4gIGNvbnN0IFtwcmVHYWluLCBzZXRQcmVHYWluXSA9IHVzZVN0YXRlPFByZUdhaW5Db25maWc+KERFRkFVTFRfUFJFR0FJTik7XG4gIGNvbnN0IFtiYXNzQm9vc3QsIHNldEJhc3NCb29zdF0gPSB1c2VTdGF0ZTxCYXNzQm9vc3RDb25maWc+KERFRkFVTFRfQkFTU19CT09TVCk7XG4gIGNvbnN0IFt2aXJ0dWFsaXplciwgc2V0VmlydHVhbGl6ZXJdID0gdXNlU3RhdGU8VmlydHVhbGl6ZXJDb25maWc+KERFRkFVTFRfVklSVFVBTElaRVIpO1xuICBjb25zdCBbZXEzMkJhbmRzLCBzZXRFcTMyQmFuZHNdID0gdXNlU3RhdGU8RVEzMkJhbmRbXT4oY3JlYXRlRGVmYXVsdDMyQmFuZHMoKSk7XG4gIGNvbnN0IFtzZWxlY3RlZEJhbmRJbmRleCwgc2V0U2VsZWN0ZWRCYW5kSW5kZXhdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4oNik7IC8vIERlZmF1bHQgODAgSHpcbiAgY29uc3QgW3RvbmUsIHNldFRvbmVdID0gdXNlU3RhdGU8VG9uZUNvbnRyb2xzQ29uZmlnPihERUZBVUxUX1RPTkUpO1xuICBjb25zdCBbbWRyYywgc2V0TURSQ10gPSB1c2VTdGF0ZTxNRFJDQ29uZmlnPihERUZBVUxUX01EUkMpO1xuICBjb25zdCBbYXV0b0dhaW4sIHNldEF1dG9HYWluXSA9IHVzZVN0YXRlPEF1dG9HYWluQ29uZmlnPihERUZBVUxUX0FVVE9HQUlOKTtcbiAgY29uc3QgW21hc3RlckdhaW4sIHNldE1hc3RlckdhaW5dID0gdXNlU3RhdGU8TWFzdGVyR2FpbkNvbmZpZz4oREVGQVVMVF9NQVNURVJfR0FJTik7XG4gIGNvbnN0IFtsaW1pdGVyLCBzZXRMaW1pdGVyXSA9IHVzZVN0YXRlPFNvZnRMaW1pdGVyQ29uZmlnPihERUZBVUxUX0xJTUlURVIpO1xuICBjb25zdCBbbWFzdGVyQnlwYXNzLCBzZXRNYXN0ZXJCeXBhc3NdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIC8vIEF1ZGlvIHNvdXJjZSBzdGF0ZVxuICBjb25zdCBbY3VycmVudFNvdXJjZSwgc2V0Q3VycmVudFNvdXJjZV0gPSB1c2VTdGF0ZTxBdWRpb1NvdXJjZVR5cGU+KCdub25lJyk7XG5cbiAgLy8gUHJlc2V0c1xuICBjb25zdCBbdXNlclByZXNldHMsIHNldFVzZXJQcmVzZXRzXSA9IHVzZVN0YXRlPERTUFByZXNldFtdPihbXSk7XG4gIGNvbnN0IFtjdXJyZW50UHJlc2V0SWQsIHNldEN1cnJlbnRQcmVzZXRJZF0gPSB1c2VTdGF0ZTxzdHJpbmc+KEZBQ1RPUllfUFJFU0VUU1swXS5pZCk7XG5cbiAgLy8gUmVhbC10aW1lIHRlbGVtZXRyeVxuICBjb25zdCBbdGVsZW1ldHJ5LCBzZXRUZWxlbWV0cnldID0gdXNlU3RhdGU8QXVkaW9UZWxlbWV0cnk+KHtcbiAgICBzYW1wbGVSYXRlOiA0ODAwMCxcbiAgICBjaGFubmVsczogMixcbiAgICBzdGF0ZTogJ2Nsb3NlZCcsXG4gICAgYmFzZUxhdGVuY3k6IDAuMDA1LFxuICAgIGJ1ZmZlclNpemU6IDUxMixcbiAgICBpbnB1dFBlYWtMOiAwLFxuICAgIGlucHV0UGVha1I6IDAsXG4gICAgb3V0cHV0UGVha0w6IDAsXG4gICAgb3V0cHV0UGVha1I6IDAsXG4gICAgb3V0cHV0Uk1TTDogMCxcbiAgICBvdXRwdXRSTVNSOiAwLFxuICAgIG1kcmNHYWluUmVkdWN0aW9uTG93OiAwLFxuICAgIG1kcmNHYWluUmVkdWN0aW9uTWlkOiAwLFxuICAgIG1kcmNHYWluUmVkdWN0aW9uSGlnaDogMCxcbiAgICBhdXRvR2FpbkN1cnJlbnRPZmZzZXREQjogMCxcbiAgICBsaW1pdGVyUmVkdWN0aW9uREI6IDAsXG4gICAgaXNDbGlwcGluZzogZmFsc2UsXG4gIH0pO1xuXG4gIGNvbnN0IGluaXRpYWxpemVkUmVmID0gdXNlUmVmKGZhbHNlKTtcblxuICAvLyBMb2FkIGN1c3RvbSBwcmVzZXRzIG9uIG1vdW50XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgbG9hZGVkID0gbG9hZFVzZXJQcmVzZXRzKCk7XG4gICAgc2V0VXNlclByZXNldHMobG9hZGVkKTtcbiAgfSwgW10pO1xuXG4gIC8vIFN5bmMgc3RhdGUgdG8gRFNQIEVuZ2luZVxuICBjb25zdCBzeW5jQWxsVG9FbmdpbmUgPSB1c2VDYWxsYmFjayhcbiAgICAoXG4gICAgICBwUHJlR2FpbjogUHJlR2FpbkNvbmZpZyxcbiAgICAgIHBCYXNzQm9vc3Q6IEJhc3NCb29zdENvbmZpZyxcbiAgICAgIHBWaXJ0OiBWaXJ0dWFsaXplckNvbmZpZyxcbiAgICAgIHBCYW5kczogRVEzMkJhbmRbXSxcbiAgICAgIHBUb25lOiBUb25lQ29udHJvbHNDb25maWcsXG4gICAgICBwTURSQzogTURSQ0NvbmZpZyxcbiAgICAgIHBBdXRvR2FpbjogQXV0b0dhaW5Db25maWcsXG4gICAgICBwTWFzdGVyR2FpbjogTWFzdGVyR2FpbkNvbmZpZyxcbiAgICAgIHBMaW1pdGVyOiBTb2Z0TGltaXRlckNvbmZpZyxcbiAgICAgIHBCeXBhc3M6IGJvb2xlYW5cbiAgICApID0+IHtcbiAgICAgIGlmICghZHNwRW5naW5lLmlzSW5pdGlhbGl6ZWQoKSkgcmV0dXJuO1xuICAgICAgZHNwRW5naW5lLnVwZGF0ZVByZUdhaW4ocFByZUdhaW4pO1xuICAgICAgZHNwRW5naW5lLnVwZGF0ZUJhc3NCb29zdChwQmFzc0Jvb3N0KTtcbiAgICAgIGRzcEVuZ2luZS51cGRhdGVWaXJ0dWFsaXplcihwVmlydCk7XG4gICAgICBkc3BFbmdpbmUudXBkYXRlQWxsMzJCYW5kcyhwQmFuZHMpO1xuICAgICAgZHNwRW5naW5lLnVwZGF0ZVRvbmUocFRvbmUpO1xuICAgICAgZHNwRW5naW5lLnVwZGF0ZU1EUkMocE1EUkMpO1xuICAgICAgZHNwRW5naW5lLnVwZGF0ZUF1dG9HYWluKHBBdXRvR2Fpbik7XG4gICAgICBkc3BFbmdpbmUudXBkYXRlTWFzdGVyR2FpbihwTWFzdGVyR2Fpbik7XG4gICAgICBkc3BFbmdpbmUudXBkYXRlTGltaXRlcihwTGltaXRlcik7XG4gICAgICBkc3BFbmdpbmUuc2V0TWFzdGVyQnlwYXNzKHBCeXBhc3MpO1xuXG4gICAgICAvLyBTaW5jcm9uaXphciBlbiBlbCBtb3RvciBEU1AgbmF0aXZvIGRlIEFuZHJvaWQgc2kgc2UgZWplY3V0YSBlbiBXZWJWaWV3XG4gICAgICBOYXRpdmVCcmlkZ2VEaXNwYXRjaGVyLnNldE1hc3RlckJ5cGFzcyhwQnlwYXNzKTtcbiAgICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0UHJlR2FpbihwUHJlR2Fpbi5nYWluREIsIHBQcmVHYWluLnBoYXNlSW52ZXJ0KTtcbiAgICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0QmFzc0Jvb3N0KHBCYXNzQm9vc3QuZW5hYmxlZCwgcEJhc3NCb29zdC5ib29zdERCLCBwQmFzc0Jvb3N0LmZyZXF1ZW5jeSwgcEJhc3NCb29zdC5oYXJtb25pY3MpO1xuICAgICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRWaXJ0dWFsaXplcihwVmlydC5lbmFibGVkLCBwVmlydC5pbnRlbnNpdHkgLyA1MC4wLCBwVmlydC5jcm9zc2ZlZWQpO1xuICAgICAgcEJhbmRzLmZvckVhY2goKGIpID0+IE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0RXFCYW5kKGIuaW5kZXgsIGIuZ2FpbikpO1xuICAgICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRUb25lKHBUb25lLmVuYWJsZWQsIHBUb25lLmJhc3NEQiwgcFRvbmUubWlkREIsIHBUb25lLnRyZWJsZURCKTtcbiAgICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TWRyYygnbG93JywgcE1EUkMubG93VGhyZXNob2xkLCBwTURSQy5sb3dSYXRpbywgcE1EUkMuYXR0YWNrTXMsIHBNRFJDLnJlbGVhc2VNcywgcE1EUkMubG93R2FpbkRCKTtcbiAgICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TWRyYygnbWlkJywgcE1EUkMubWlkVGhyZXNob2xkLCBwTURSQy5taWRSYXRpbywgcE1EUkMuYXR0YWNrTXMsIHBNRFJDLnJlbGVhc2VNcywgcE1EUkMubWlkR2FpbkRCKTtcbiAgICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TWRyYygnaGlnaCcsIHBNRFJDLmhpZ2hUaHJlc2hvbGQsIHBNRFJDLmhpZ2hSYXRpbywgcE1EUkMuYXR0YWNrTXMsIHBNRFJDLnJlbGVhc2VNcywgcE1EUkMuaGlnaEdhaW5EQik7XG4gICAgICBOYXRpdmVCcmlkZ2VEaXNwYXRjaGVyLnNldE1hc3RlckdhaW4ocE1hc3RlckdhaW4uZ2FpbkRCLCAwLjApO1xuICAgICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRMaW1pdGVyKHBMaW1pdGVyLmVuYWJsZWQsIE1hdGgucG93KDEwLCBwTGltaXRlci5jZWlsaW5nREIgLyAyMCkpO1xuICAgIH0sXG4gICAgW11cbiAgKTtcblxuICAvLyBBcHBseSBQcmVzZXRcbiAgY29uc3QgYXBwbHlQcmVzZXQgPSB1c2VDYWxsYmFjayhcbiAgICAocHJlc2V0OiBEU1BQcmVzZXQpID0+IHtcbiAgICAgIHNldFByZUdhaW4oeyAuLi5wcmVzZXQucHJlR2FpbiB9KTtcbiAgICAgIHNldEJhc3NCb29zdCh7IC4uLnByZXNldC5iYXNzQm9vc3QgfSk7XG4gICAgICBzZXRWaXJ0dWFsaXplcih7IC4uLnByZXNldC52aXJ0dWFsaXplciB9KTtcbiAgICAgIHNldEVxMzJCYW5kcyhbLi4ucHJlc2V0LmVxMzJCYW5kc10pO1xuICAgICAgc2V0VG9uZSh7IC4uLnByZXNldC50b25lIH0pO1xuICAgICAgc2V0TURSQyh7IC4uLnByZXNldC5tZHJjIH0pO1xuICAgICAgc2V0QXV0b0dhaW4oeyAuLi5wcmVzZXQuYXV0b0dhaW4gfSk7XG4gICAgICBzZXRNYXN0ZXJHYWluKHsgLi4ucHJlc2V0Lm1hc3RlckdhaW4gfSk7XG4gICAgICBzZXRMaW1pdGVyKHsgLi4ucHJlc2V0LmxpbWl0ZXIgfSk7XG4gICAgICBzZXRNYXN0ZXJCeXBhc3MocHJlc2V0Lm1hc3RlckJ5cGFzcyA/PyBmYWxzZSk7XG4gICAgICBzZXRDdXJyZW50UHJlc2V0SWQocHJlc2V0LmlkKTtcblxuICAgICAgc3luY0FsbFRvRW5naW5lKFxuICAgICAgICBwcmVzZXQucHJlR2FpbixcbiAgICAgICAgcHJlc2V0LmJhc3NCb29zdCxcbiAgICAgICAgcHJlc2V0LnZpcnR1YWxpemVyLFxuICAgICAgICBwcmVzZXQuZXEzMkJhbmRzLFxuICAgICAgICBwcmVzZXQudG9uZSxcbiAgICAgICAgcHJlc2V0Lm1kcmMsXG4gICAgICAgIHByZXNldC5hdXRvR2FpbixcbiAgICAgICAgcHJlc2V0Lm1hc3RlckdhaW4sXG4gICAgICAgIHByZXNldC5saW1pdGVyLFxuICAgICAgICBwcmVzZXQubWFzdGVyQnlwYXNzID8/IGZhbHNlXG4gICAgICApO1xuICAgIH0sXG4gICAgW3N5bmNBbGxUb0VuZ2luZV1cbiAgKTtcblxuICAvLyBNYXN0ZXIgUG93ZXIgLyBBdWRpbyBDb250ZXh0IHRvZ2dsZVxuICBjb25zdCBoYW5kbGVUb2dnbGVFbmdpbmUgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFkc3BFbmdpbmUuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICBhd2FpdCBkc3BFbmdpbmUuaW5pdEF1ZGlvKCk7XG4gICAgICBzeW5jQWxsVG9FbmdpbmUoXG4gICAgICAgIHByZUdhaW4sXG4gICAgICAgIGJhc3NCb29zdCxcbiAgICAgICAgdmlydHVhbGl6ZXIsXG4gICAgICAgIGVxMzJCYW5kcyxcbiAgICAgICAgdG9uZSxcbiAgICAgICAgbWRyYyxcbiAgICAgICAgYXV0b0dhaW4sXG4gICAgICAgIG1hc3RlckdhaW4sXG4gICAgICAgIGxpbWl0ZXIsXG4gICAgICAgIG1hc3RlckJ5cGFzc1xuICAgICAgKTtcbiAgICAgIHNldElzRW5naW5lQWN0aXZlKHRydWUpO1xuICAgICAgaW5pdGlhbGl6ZWRSZWYuY3VycmVudCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN0eCA9IGRzcEVuZ2luZS5nZXRDb250ZXh0KCk7XG4gICAgICBpZiAoY3R4KSB7XG4gICAgICAgIGlmIChjdHguc3RhdGUgPT09ICdydW5uaW5nJykge1xuICAgICAgICAgIGF3YWl0IGN0eC5zdXNwZW5kKCk7XG4gICAgICAgICAgc2V0SXNFbmdpbmVBY3RpdmUoZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF3YWl0IGN0eC5yZXN1bWUoKTtcbiAgICAgICAgICBzZXRJc0VuZ2luZUFjdGl2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVUb2dnbGVNYXN0ZXJCeXBhc3MgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9ICFtYXN0ZXJCeXBhc3M7XG4gICAgc2V0TWFzdGVyQnlwYXNzKG5leHQpO1xuICAgIGRzcEVuZ2luZS5zZXRNYXN0ZXJCeXBhc3MobmV4dCk7XG4gICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRNYXN0ZXJCeXBhc3MobmV4dCk7XG4gIH07XG5cbiAgLy8gRFNQIFBhcmFtZXRlciBjaGFuZ2UgaGFuZGxlcnMgKGRpcmVjdGx5IGludm9raW5nIHJlYWwgc29mdHdhcmUgRFNQIHByb2Nlc3NpbmcpXG4gIGNvbnN0IGhhbmRsZVByZUdhaW5DaGFuZ2UgPSB1c2VDYWxsYmFjaygoY2ZnOiBQcmVHYWluQ29uZmlnKSA9PiB7XG4gICAgc2V0UHJlR2FpbihjZmcpO1xuICAgIGRzcEVuZ2luZS51cGRhdGVQcmVHYWluKGNmZyk7XG4gICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRQcmVHYWluKGNmZy5nYWluREIsIGNmZy5waGFzZUludmVydCk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVCYXNzQm9vc3RDaGFuZ2UgPSB1c2VDYWxsYmFjaygoY2ZnOiBCYXNzQm9vc3RDb25maWcpID0+IHtcbiAgICBzZXRCYXNzQm9vc3QoY2ZnKTtcbiAgICBkc3BFbmdpbmUudXBkYXRlQmFzc0Jvb3N0KGNmZyk7XG4gICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRCYXNzQm9vc3QoY2ZnLmVuYWJsZWQsIGNmZy5ib29zdERCLCBjZmcuZnJlcXVlbmN5LCBjZmcuaGFybW9uaWNzKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZVZpcnR1YWxpemVyQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGNmZzogVmlydHVhbGl6ZXJDb25maWcpID0+IHtcbiAgICBzZXRWaXJ0dWFsaXplcihjZmcpO1xuICAgIGRzcEVuZ2luZS51cGRhdGVWaXJ0dWFsaXplcihjZmcpO1xuICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0VmlydHVhbGl6ZXIoY2ZnLmVuYWJsZWQsIGNmZy5pbnRlbnNpdHkgLyA1MC4wLCBjZmcuY3Jvc3NmZWVkKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZUJhbmRDaGFuZ2UgPSB1c2VDYWxsYmFjaygoYmFuZDogRVEzMkJhbmQpID0+IHtcbiAgICBzZXRFcTMyQmFuZHMoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IG5leHQgPSBbLi4ucHJldl07XG4gICAgICBuZXh0W2JhbmQuaW5kZXhdID0gYmFuZDtcbiAgICAgIGRzcEVuZ2luZS51cGRhdGUzMkJhbmQoYmFuZCk7XG4gICAgICBOYXRpdmVCcmlkZ2VEaXNwYXRjaGVyLnNldEVxQmFuZChiYW5kLmluZGV4LCBiYW5kLmVuYWJsZWQgPyBiYW5kLmdhaW4gOiAwKTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFuZGxlUmVzZXRGbGF0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHNldEVxMzJCYW5kcygocHJldikgPT4ge1xuICAgICAgY29uc3QgcmVzZXQgPSBwcmV2Lm1hcCgoYikgPT4gKHsgLi4uYiwgZ2FpbjogMCB9KSk7XG4gICAgICBkc3BFbmdpbmUudXBkYXRlQWxsMzJCYW5kcyhyZXNldCk7XG4gICAgICByZXNldC5mb3JFYWNoKChiKSA9PiBOYXRpdmVCcmlkZ2VEaXNwYXRjaGVyLnNldEVxQmFuZChiLmluZGV4LCAwKSk7XG4gICAgICByZXR1cm4gcmVzZXQ7XG4gICAgfSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVJbnZlcnRDdXJ2ZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBzZXRFcTMyQmFuZHMoKHByZXYpID0+IHtcbiAgICAgIGNvbnN0IGludmVydGVkID0gcHJldi5tYXAoKGIpID0+ICh7IC4uLmIsIGdhaW46IC1iLmdhaW4gfSkpO1xuICAgICAgZHNwRW5naW5lLnVwZGF0ZUFsbDMyQmFuZHMoaW52ZXJ0ZWQpO1xuICAgICAgaW52ZXJ0ZWQuZm9yRWFjaCgoYikgPT4gTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRFcUJhbmQoYi5pbmRleCwgYi5nYWluKSk7XG4gICAgICByZXR1cm4gaW52ZXJ0ZWQ7XG4gICAgfSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVUb25lQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGNmZzogVG9uZUNvbnRyb2xzQ29uZmlnKSA9PiB7XG4gICAgc2V0VG9uZShjZmcpO1xuICAgIGRzcEVuZ2luZS51cGRhdGVUb25lKGNmZyk7XG4gICAgTmF0aXZlQnJpZGdlRGlzcGF0Y2hlci5zZXRUb25lKGNmZy5lbmFibGVkLCBjZmcuYmFzc0RCLCBjZmcubWlkREIsIGNmZy50cmVibGVEQik7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVNRFJDQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGNmZzogTURSQ0NvbmZpZykgPT4ge1xuICAgIHNldE1EUkMoY2ZnKTtcbiAgICBkc3BFbmdpbmUudXBkYXRlTURSQyhjZmcpO1xuICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TWRyYygnbG93JywgY2ZnLmxvd1RocmVzaG9sZCwgY2ZnLmxvd1JhdGlvLCBjZmcuYXR0YWNrTXMsIGNmZy5yZWxlYXNlTXMsIGNmZy5sb3dHYWluREIpO1xuICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TWRyYygnbWlkJywgY2ZnLm1pZFRocmVzaG9sZCwgY2ZnLm1pZFJhdGlvLCBjZmcuYXR0YWNrTXMsIGNmZy5yZWxlYXNlTXMsIGNmZy5taWRHYWluREIpO1xuICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TWRyYygnaGlnaCcsIGNmZy5oaWdoVGhyZXNob2xkLCBjZmcuaGlnaFJhdGlvLCBjZmcuYXR0YWNrTXMsIGNmZy5yZWxlYXNlTXMsIGNmZy5oaWdoR2FpbkRCKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZUF1dG9HYWluQ2hhbmdlID0gdXNlQ2FsbGJhY2soKGNmZzogQXV0b0dhaW5Db25maWcpID0+IHtcbiAgICBzZXRBdXRvR2FpbihjZmcpO1xuICAgIGRzcEVuZ2luZS51cGRhdGVBdXRvR2FpbihjZmcpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFuZGxlTWFzdGVyR2FpbkNoYW5nZSA9IHVzZUNhbGxiYWNrKChjZmc6IE1hc3RlckdhaW5Db25maWcpID0+IHtcbiAgICBzZXRNYXN0ZXJHYWluKGNmZyk7XG4gICAgZHNwRW5naW5lLnVwZGF0ZU1hc3RlckdhaW4oY2ZnKTtcbiAgICBOYXRpdmVCcmlkZ2VEaXNwYXRjaGVyLnNldE1hc3RlckdhaW4oY2ZnLmdhaW5EQiwgMC4wKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZUxpbWl0ZXJDaGFuZ2UgPSB1c2VDYWxsYmFjaygoY2ZnOiBTb2Z0TGltaXRlckNvbmZpZykgPT4ge1xuICAgIHNldExpbWl0ZXIoY2ZnKTtcbiAgICBkc3BFbmdpbmUudXBkYXRlTGltaXRlcihjZmcpO1xuICAgIE5hdGl2ZUJyaWRnZURpc3BhdGNoZXIuc2V0TGltaXRlcihjZmcuZW5hYmxlZCwgTWF0aC5wb3coMTAsIGNmZy5jZWlsaW5nREIgLyAyMCkpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFuZGxlU291cmNlQ2hhbmdlID0gKHNyYzogQXVkaW9Tb3VyY2VUeXBlKSA9PiB7XG4gICAgc2V0Q3VycmVudFNvdXJjZShzcmMpO1xuICAgIHNldElzRW5naW5lQWN0aXZlKHNyYyAhPT0gJ25vbmUnKTtcbiAgfTtcblxuICAvLyBVc2VyIFByZXNldCBNYW5hZ2VtZW50XG4gIGNvbnN0IGhhbmRsZVNhdmVQcmVzZXQgPSAobmFtZTogc3RyaW5nLCBjYXRlZ29yeTogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgbmV3UHJlc2V0OiBEU1BQcmVzZXQgPSB7XG4gICAgICBpZDogYHVzZXItcHJlc2V0LSR7RGF0ZS5ub3coKX1gLFxuICAgICAgbmFtZSxcbiAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeSB8fCAnUGVyc29uYWxpemFkbycsXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByZXNldCBjb25maWd1cmFkbyBwb3IgZWwgdXN1YXJpbycsXG4gICAgICBpc0ZhY3Rvcnk6IGZhbHNlLFxuICAgICAgcHJlR2FpbjogeyAuLi5wcmVHYWluIH0sXG4gICAgICBiYXNzQm9vc3Q6IHsgLi4uYmFzc0Jvb3N0IH0sXG4gICAgICB2aXJ0dWFsaXplcjogeyAuLi52aXJ0dWFsaXplciB9LFxuICAgICAgZXEzMkJhbmRzOiBbLi4uZXEzMkJhbmRzXSxcbiAgICAgIHRvbmU6IHsgLi4udG9uZSB9LFxuICAgICAgbWRyYzogeyAuLi5tZHJjIH0sXG4gICAgICBhdXRvR2FpbjogeyAuLi5hdXRvR2FpbiB9LFxuICAgICAgbWFzdGVyR2FpbjogeyAuLi5tYXN0ZXJHYWluIH0sXG4gICAgICBsaW1pdGVyOiB7IC4uLmxpbWl0ZXIgfSxcbiAgICAgIG1hc3RlckJ5cGFzcyxcbiAgICB9O1xuICAgIGNvbnN0IHVwZGF0ZWQgPSBbLi4udXNlclByZXNldHMsIG5ld1ByZXNldF07XG4gICAgc2V0VXNlclByZXNldHModXBkYXRlZCk7XG4gICAgc2F2ZVVzZXJQcmVzZXRzKHVwZGF0ZWQpO1xuICAgIHNldEN1cnJlbnRQcmVzZXRJZChuZXdQcmVzZXQuaWQpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZURlbGV0ZVByZXNldCA9IChpZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgdXBkYXRlZCA9IHVzZXJQcmVzZXRzLmZpbHRlcigocCkgPT4gcC5pZCAhPT0gaWQpO1xuICAgIHNldFVzZXJQcmVzZXRzKHVwZGF0ZWQpO1xuICAgIHNhdmVVc2VyUHJlc2V0cyh1cGRhdGVkKTtcbiAgICBpZiAoY3VycmVudFByZXNldElkID09PSBpZCkge1xuICAgICAgYXBwbHlQcmVzZXQoRkFDVE9SWV9QUkVTRVRTWzBdKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlRXhwb3J0UHJlc2V0cyA9ICgpID0+IHtcbiAgICBjb25zdCBkYXRhU3RyID1cbiAgICAgICdkYXRhOnRleHQvanNvbjtjaGFyc2V0PXV0Zi04LCcgK1xuICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHVzZXJQcmVzZXRzLCBudWxsLCAyKSk7XG4gICAgY29uc3QgZG93bmxvYWRBbmNob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgZG93bmxvYWRBbmNob3Iuc2V0QXR0cmlidXRlKCdocmVmJywgZGF0YVN0cik7XG4gICAgZG93bmxvYWRBbmNob3Iuc2V0QXR0cmlidXRlKFxuICAgICAgJ2Rvd25sb2FkJyxcbiAgICAgIGBhdWRpb19kc3BfMzJiYW5kX3ByZXNldHNfJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApfS5qc29uYFxuICAgICk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkb3dubG9hZEFuY2hvcik7XG4gICAgZG93bmxvYWRBbmNob3IuY2xpY2soKTtcbiAgICBkb3dubG9hZEFuY2hvci5yZW1vdmUoKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVJbXBvcnRQcmVzZXRzID0gKGltcG9ydGVkOiBEU1BQcmVzZXRbXSkgPT4ge1xuICAgIGNvbnN0IG1lcmdlZCA9IFtcbiAgICAgIC4uLnVzZXJQcmVzZXRzLFxuICAgICAgLi4uaW1wb3J0ZWQubWFwKChwKSA9PiAoeyAuLi5wLCBpc0ZhY3Rvcnk6IGZhbHNlIH0pKSxcbiAgICBdO1xuICAgIHNldFVzZXJQcmVzZXRzKG1lcmdlZCk7XG4gICAgc2F2ZVVzZXJQcmVzZXRzKG1lcmdlZCk7XG4gICAgaWYgKGltcG9ydGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIGFwcGx5UHJlc2V0KGltcG9ydGVkWzBdKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGVsZW1ldHJ5IFBvbGxpbmcgTG9vcCAoNTBtcyBpbnRlcnZhbClcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBpbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBpZiAoZHNwRW5naW5lLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgICBjb25zdCB0ID0gZHNwRW5naW5lLmdldFRlbGVtZXRyeSgpO1xuICAgICAgICBzZXRUZWxlbWV0cnkodCk7XG4gICAgICAgIHNldElzRW5naW5lQWN0aXZlKHQuc3RhdGUgPT09ICdydW5uaW5nJyk7XG4gICAgICB9XG4gICAgfSwgNTApO1xuXG4gICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgYWxsUHJlc2V0cyA9IFsuLi5GQUNUT1JZX1BSRVNFVFMsIC4uLnVzZXJQcmVzZXRzXTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLW5ldXRyYWwtOTUwIHRleHQtbmV1dHJhbC0xMDAgZmxleCBmbGV4LWNvbCBmb250LXNhbnMgc2VsZWN0aW9uOmJnLWVtZXJhbGQtNTAwLzMwIHNlbGVjdGlvbjp0ZXh0LWVtZXJhbGQtMjAwXCI+XG4gICAgICB7LyogMS4gTWFzdGVyIEhlYWRlciAqL31cbiAgICAgIDxIZWFkZXJcbiAgICAgICAgaXNFbmdpbmVBY3RpdmU9e2lzRW5naW5lQWN0aXZlfVxuICAgICAgICBvblRvZ2dsZUVuZ2luZT17aGFuZGxlVG9nZ2xlRW5naW5lfVxuICAgICAgICBvbk9wZW5BbmRyb2lkQXVkaXQ9eygpID0+IHNldElzQW5kcm9pZE1vZGFsT3Blbih0cnVlKX1cbiAgICAgICAgb25PcGVuVGVzdFN1aXRlPXsoKSA9PiBzZXRJc1Rlc3RTdWl0ZU9wZW4odHJ1ZSl9XG4gICAgICAgIG9uT3BlblppcERvd25sb2FkPXsoKSA9PiBzZXRJc1ppcE1vZGFsT3Blbih0cnVlKX1cbiAgICAgICAgbWFzdGVyQnlwYXNzPXttYXN0ZXJCeXBhc3N9XG4gICAgICAgIG9uVG9nZ2xlTWFzdGVyQnlwYXNzPXtoYW5kbGVUb2dnbGVNYXN0ZXJCeXBhc3N9XG4gICAgICAgIHNhbXBsZVJhdGU9e3RlbGVtZXRyeS5zYW1wbGVSYXRlfVxuICAgICAgLz5cblxuICAgICAgey8qIDIuIE1haW4gQ29udGVudCBXb3Jrc3BhY2UgKi99XG4gICAgICA8bWFpbiBjbGFzc05hbWU9XCJmbGV4LTEgdy1mdWxsIG1heC13LTd4bCBteC1hdXRvIHAtMyBzbTpwLTUgZmxleCBmbGV4LWNvbCBnYXAtNFwiPlxuICAgICAgICB7LyogUHJlc2V0IFNlbGVjdG9yICYgRmlsZSBJbXBvcnQvRXhwb3J0IEJhciAqL31cbiAgICAgICAgPFByZXNldEJhclxuICAgICAgICAgIGN1cnJlbnRQcmVzZXRJZD17Y3VycmVudFByZXNldElkfVxuICAgICAgICAgIGFsbFByZXNldHM9e2FsbFByZXNldHN9XG4gICAgICAgICAgb25TZWxlY3RQcmVzZXQ9e2FwcGx5UHJlc2V0fVxuICAgICAgICAgIG9uU2F2ZVByZXNldD17aGFuZGxlU2F2ZVByZXNldH1cbiAgICAgICAgICBvbkRlbGV0ZVByZXNldD17aGFuZGxlRGVsZXRlUHJlc2V0fVxuICAgICAgICAgIG9uRXhwb3J0UHJlc2V0cz17aGFuZGxlRXhwb3J0UHJlc2V0c31cbiAgICAgICAgICBvbkltcG9ydFByZXNldHM9e2hhbmRsZUltcG9ydFByZXNldHN9XG4gICAgICAgICAgb25SZXNldEZsYXQ9eygpID0+IGFwcGx5UHJlc2V0KEZBQ1RPUllfUFJFU0VUU1swXSl9XG4gICAgICAgIC8+XG5cbiAgICAgICAgey8qIEF1ZGlvIElucHV0IFNlbGVjdG9yIChMb2NhbCBBdWRpbyBGaWxlcywgTGl2ZSBNaWNyb3Bob25lLCBTaWduYWwgR2VuZXJhdG9yKSAqL31cbiAgICAgICAgPEF1ZGlvU291cmNlQmFyXG4gICAgICAgICAgY3VycmVudFNvdXJjZT17Y3VycmVudFNvdXJjZX1cbiAgICAgICAgICBvblNvdXJjZUNoYW5nZT17aGFuZGxlU291cmNlQ2hhbmdlfVxuICAgICAgICAvPlxuXG4gICAgICAgIHsvKiBEdWFsIFJUQSBGRlQgMjA0OCBTcGVjdHJ1bSBBbmFseXplciAmIENvbXBvc2l0ZSAzMi1CYW5kIEZpbHRlciBSZXNwb25zZSBDdXJ2ZSAqL31cbiAgICAgICAgPFNwZWN0cnVtRGlzcGxheVxuICAgICAgICAgIGVxMzJCYW5kcz17ZXEzMkJhbmRzfVxuICAgICAgICAgIG9uQmFuZENoYW5nZT17aGFuZGxlQmFuZENoYW5nZX1cbiAgICAgICAgICB0b25lPXt0b25lfVxuICAgICAgICAgIGJhc3NCb29zdD17YmFzc0Jvb3N0fVxuICAgICAgICAgIHNlbGVjdGVkQmFuZEluZGV4PXtzZWxlY3RlZEJhbmRJbmRleH1cbiAgICAgICAgICBvblNlbGVjdEJhbmRJbmRleD17c2V0U2VsZWN0ZWRCYW5kSW5kZXh9XG4gICAgICAgIC8+XG5cbiAgICAgICAgey8qIDMyLUJhbmQgSVNPIEVxdWFsaXplciBSYWNrICovfVxuICAgICAgICA8RXF1YWxpemVyMzJTZWN0aW9uXG4gICAgICAgICAgYmFuZHM9e2VxMzJCYW5kc31cbiAgICAgICAgICBvbkJhbmRDaGFuZ2U9e2hhbmRsZUJhbmRDaGFuZ2V9XG4gICAgICAgICAgb25SZXNldEZsYXQ9e2hhbmRsZVJlc2V0RmxhdH1cbiAgICAgICAgICBvbkludmVydEN1cnZlPXtoYW5kbGVJbnZlcnRDdXJ2ZX1cbiAgICAgICAgICBzZWxlY3RlZEJhbmRJbmRleD17c2VsZWN0ZWRCYW5kSW5kZXh9XG4gICAgICAgICAgb25TZWxlY3RCYW5kSW5kZXg9e3NldFNlbGVjdGVkQmFuZEluZGV4fVxuICAgICAgICAvPlxuXG4gICAgICAgIHsvKiBUb25lIENvbnRyb2xzLCBCYXNzIEJvb3N0IHdpdGggRXhjdXJzaW9uL0hhcm1vbmljcywgUHJlLUdhaW4gJiBWaXJ0dWFsaXplciAqL31cbiAgICAgICAgPFRvbmVBbmRCYXNzU2VjdGlvblxuICAgICAgICAgIHByZUdhaW49e3ByZUdhaW59XG4gICAgICAgICAgb25QcmVHYWluQ2hhbmdlPXtoYW5kbGVQcmVHYWluQ2hhbmdlfVxuICAgICAgICAgIHRvbmU9e3RvbmV9XG4gICAgICAgICAgb25Ub25lQ2hhbmdlPXtoYW5kbGVUb25lQ2hhbmdlfVxuICAgICAgICAgIGJhc3NCb29zdD17YmFzc0Jvb3N0fVxuICAgICAgICAgIG9uQmFzc0Jvb3N0Q2hhbmdlPXtoYW5kbGVCYXNzQm9vc3RDaGFuZ2V9XG4gICAgICAgICAgdmlydHVhbGl6ZXI9e3ZpcnR1YWxpemVyfVxuICAgICAgICAgIG9uVmlydHVhbGl6ZXJDaGFuZ2U9e2hhbmRsZVZpcnR1YWxpemVyQ2hhbmdlfVxuICAgICAgICAvPlxuXG4gICAgICAgIHsvKiBEeW5hbWljcyBTZWN0aW9uOiBNRFJDIDMtQmFuZCBDcm9zc292ZXIsIENsb3NlZC1Mb29wIEF1dG9HYWluLCBNYXN0ZXIgR2FpbiAmIFNvZnQgTGltaXRlciAqL31cbiAgICAgICAgPER5bmFtaWNzTURSQ1NlY3Rpb25cbiAgICAgICAgICBtZHJjPXttZHJjfVxuICAgICAgICAgIG9uTURSQ0NoYW5nZT17aGFuZGxlTURSQ0NoYW5nZX1cbiAgICAgICAgICBhdXRvR2Fpbj17YXV0b0dhaW59XG4gICAgICAgICAgb25BdXRvR2FpbkNoYW5nZT17aGFuZGxlQXV0b0dhaW5DaGFuZ2V9XG4gICAgICAgICAgbWFzdGVyR2Fpbj17bWFzdGVyR2Fpbn1cbiAgICAgICAgICBvbk1hc3RlckdhaW5DaGFuZ2U9e2hhbmRsZU1hc3RlckdhaW5DaGFuZ2V9XG4gICAgICAgICAgbGltaXRlcj17bGltaXRlcn1cbiAgICAgICAgICBvbkxpbWl0ZXJDaGFuZ2U9e2hhbmRsZUxpbWl0ZXJDaGFuZ2V9XG4gICAgICAgICAgdGVsZW1ldHJ5PXt0ZWxlbWV0cnl9XG4gICAgICAgIC8+XG5cbiAgICAgICAgey8qIE1ldGVyIEJyaWRnZSAmIFN0cmVhbSBUZWxlbWV0cnkgKi99XG4gICAgICAgIDxNZXRlckJyaWRnZSB0ZWxlbWV0cnk9e3RlbGVtZXRyeX0gLz5cbiAgICAgIDwvbWFpbj5cblxuICAgICAgey8qIEZvb3RlciAqL31cbiAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiYm9yZGVyLXQgYm9yZGVyLW5ldXRyYWwtOTAwIHB4LTQgcHktMyB0ZXh0LWNlbnRlciB0ZXh0LXhzIHRleHQtbmV1dHJhbC01MDAgYmctbmV1dHJhbC05NTBcIj5cbiAgICAgICAgTW90b3IgRFNQIGRlIEF1ZGlvIHBvciBTb2Z0d2FyZSDigKIgQXJxdWl0ZWN0dXJhIGRlIFB1bnRvIEZsb3RhbnRlIGRlIDMyLWJpdCDigKIgMzIgQmFuZGFzIElTTyAyNjYg4oCiIERpc2XDsWFkbyBwYXJhIEFuZHJvaWQgJiBXZWIgQXVkaW9cbiAgICAgIDwvZm9vdGVyPlxuXG4gICAgICB7LyogQW5kcm9pZCBBcmNoaXRlY3R1cmUgYW5kIFN5c3RlbSBDb25zdHJhaW50cyBBdWRpdG9yIE1vZGFsICovfVxuICAgICAgPEFuZHJvaWRBcmNoaXRlY3R1cmVNb2RhbFxuICAgICAgICBpc09wZW49e2lzQW5kcm9pZE1vZGFsT3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNBbmRyb2lkTW9kYWxPcGVuKGZhbHNlKX1cbiAgICAgIC8+XG5cbiAgICAgIHsvKiBBdXRvbWF0ZWQgRFNQIFRlc3QgU3VpdGUgVmFsaWRhdGlvbiBNb2RhbCAqL31cbiAgICAgIDxEU1BWYWxpZGF0aW9uTW9kYWxcbiAgICAgICAgaXNPcGVuPXtpc1Rlc3RTdWl0ZU9wZW59XG4gICAgICAgIG9uQ2xvc2U9eygpID0+IHNldElzVGVzdFN1aXRlT3BlbihmYWxzZSl9XG4gICAgICAvPlxuXG4gICAgICB7LyogRGlyZWN0IE1vYmlsZS9BbmRyb2lkIFpJUCBEb3dubG9hZGVyIE1vZGFsICovfVxuICAgICAgPERpcmVjdFppcERvd25sb2FkTW9kYWxcbiAgICAgICAgaXNPcGVuPXtpc1ppcE1vZGFsT3Blbn1cbiAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0SXNaaXBNb2RhbE9wZW4oZmFsc2UpfVxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdfQ==