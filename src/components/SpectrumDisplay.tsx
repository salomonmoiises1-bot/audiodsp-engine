const React = __vite__cjsImport0_react; const useRef = __vite__cjsImport0_react["useRef"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useState = __vite__cjsImport0_react["useState"]; const useCallback = __vite__cjsImport0_react["useCallback"];const _jsxDEV = __vite__cjsImport4_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { dspEngine } from "/src/audio/dspEngine.ts";
import { Activity, Eye } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
import { DSPTestSuite } from "/src/audio/dspTestSuite.ts";
var _jsxFileName = "/app/applet/src/components/SpectrumDisplay.tsx";
import __vite__cjsImport4_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const SpectrumDisplay = ({ eq32Bands, onBandChange, tone, bassBoost, selectedBandIndex, onSelectBandIndex }) => {
	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const [viewMode, setViewMode] = useState("spectrum");
	const [showPrePost, setShowPrePost] = useState(true);
	const [draggingIndex, setDraggingIndex] = useState(null);
	// Frequency and dB coordinates
	const minFreq = 20;
	const maxFreq = 2e4;
	const minDB = -18;
	const maxDB = 18;
	// Logarithmic conversion
	const freqToX = useCallback((freq, width) => {
		const f = Math.max(minFreq, Math.min(maxFreq, freq));
		const logMin = Math.log10(minFreq);
		const logMax = Math.log10(maxFreq);
		const logF = Math.log10(f);
		return (logF - logMin) / (logMax - logMin) * width;
	}, []);
	const xToFreq = useCallback((x, width) => {
		const clampedX = Math.max(0, Math.min(width, x));
		const logMin = Math.log10(minFreq);
		const logMax = Math.log10(maxFreq);
		const logF = logMin + clampedX / width * (logMax - logMin);
		return Math.pow(10, logF);
	}, []);
	const dbToY = useCallback((db, height) => {
		const clampedDB = Math.max(minDB, Math.min(maxDB, db));
		return height - (clampedDB - minDB) / (maxDB - minDB) * height;
	}, []);
	const yToDB = useCallback((y, height) => {
		const clampedY = Math.max(0, Math.min(height, y));
		const normalized = 1 - clampedY / height;
		const db = minDB + normalized * (maxDB - minDB);
		return Math.round(db * 2) / 2;
	}, []);
	// Compute composite frequency response at frequency f
	const computeTotalFilterGainAtFreq = useCallback((f) => {
		let totalGainDB = 0;
		// 1. 32-Band EQ contribution
		for (let i = 0; i < eq32Bands.length; i++) {
			const b = eq32Bands[i];
			if (b.enabled && b.gain !== 0) {
				totalGainDB += DSPTestSuite.calculateBiquadPeakingGain(f, b.frequency, b.gain, b.q);
			}
		}
		// 2. Tone Controls
		if (tone.enabled) {
			if (tone.bassDB !== 0) {
				totalGainDB += DSPTestSuite.calculateBiquadPeakingGain(f, 120, tone.bassDB, .71);
			}
			if (tone.midDB !== 0) {
				totalGainDB += DSPTestSuite.calculateBiquadPeakingGain(f, 1e3, tone.midDB, .9);
			}
			if (tone.trebleDB !== 0) {
				totalGainDB += DSPTestSuite.calculateBiquadPeakingGain(f, 7500, tone.trebleDB, .71);
			}
		}
		// 3. Bass Boost
		if (bassBoost.enabled && bassBoost.boostDB !== 0) {
			totalGainDB += DSPTestSuite.calculateBiquadPeakingGain(f, bassBoost.frequency, bassBoost.boostDB, 1.4);
		}
		return Math.max(-24, Math.min(24, totalGainDB));
	}, [
		eq32Bands,
		tone,
		bassBoost
	]);
	// Pointer interactions on canvas for dragging EQ nodes
	const handlePointerDown = (e) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		// Hit test on 32 nodes
		for (let i = 0; i < eq32Bands.length; i++) {
			const b = eq32Bands[i];
			const nodeX = freqToX(b.frequency, rect.width);
			const nodeY = dbToY(b.gain, rect.height);
			const dist = Math.hypot(x - nodeX, y - nodeY);
			if (dist < 14) {
				setDraggingIndex(i);
				onSelectBandIndex(i);
				e.target.setPointerCapture(e.pointerId);
				return;
			}
		}
	};
	const handlePointerMove = (e) => {
		if (draggingIndex === null) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const y = e.clientY - rect.top;
		const newGain = Math.max(-15, Math.min(15, yToDB(y, rect.height)));
		const targetBand = eq32Bands[draggingIndex];
		if (targetBand && targetBand.gain !== newGain) {
			onBandChange({
				...targetBand,
				gain: newGain
			});
		}
	};
	const handlePointerUp = (e) => {
		if (draggingIndex !== null) {
			try {
				e.target.releasePointerCapture(e.pointerId);
			} catch {}
			setDraggingIndex(null);
		}
	};
	// High precision Canvas Animation Loop
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let animId;
		const preFreqData = new Uint8Array(1024);
		const postFreqData = new Uint8Array(1024);
		const timeDomainData = new Uint8Array(1024);
		const render = () => {
			// Responsive sizing
			const dpr = window.devicePixelRatio || 1;
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
				canvas.width = width * dpr;
				canvas.height = height * dpr;
			}
			ctx.save();
			ctx.scale(dpr, dpr);
			// Background
			ctx.fillStyle = "#0a0a0a";
			ctx.fillRect(0, 0, width, height);
			// === Grid lines: dB levels ===
			const dbLevels = [
				15,
				10,
				5,
				0,
				-5,
				-10,
				-15
			];
			ctx.lineWidth = 1;
			dbLevels.forEach((db) => {
				const y = dbToY(db, height);
				ctx.strokeStyle = db === 0 ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.06)";
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
				ctx.fillStyle = db === 0 ? "rgba(16, 185, 129, 0.8)" : "rgba(255, 255, 255, 0.3)";
				ctx.font = "9px monospace";
				ctx.fillText(`${db > 0 ? "+" : ""}${db}dB`, 6, y - 3);
			});
			// === Grid lines: Frequencies ===
			const freqMarkers = [
				20,
				50,
				100,
				200,
				500,
				1e3,
				2e3,
				5e3,
				1e4,
				2e4
			];
			freqMarkers.forEach((freq) => {
				const x = freqToX(freq, width);
				ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
				const label = freq >= 1e3 ? `${freq / 1e3}k` : `${freq}`;
				ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
				ctx.font = "9px monospace";
				ctx.fillText(label, x + 3, height - 6);
			});
			// === Real-time audio rendering modes ===
			if (viewMode === "spectrum") {
				// Retrieve RTA spectrum
				dspEngine.getPostFrequencyData(postFreqData);
				if (showPrePost) {
					dspEngine.getPreFrequencyData(preFreqData);
					// Render Pre-DSP Ghost Spectrum (Grey/Amber outline)
					ctx.beginPath();
					ctx.strokeStyle = "rgba(251, 191, 36, 0.35)";
					ctx.lineWidth = 1.5;
					for (let i = 0; i < preFreqData.length; i++) {
						const freq = i * 24e3 / preFreqData.length;
						if (freq < minFreq) continue;
						const x = freqToX(freq, width);
						const val = preFreqData[i] / 255;
						const y = height - val * (height * .85);
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					}
					ctx.stroke();
				}
				// Render Post-DSP Spectrum Gradient Bars / Area
				const grad = ctx.createLinearGradient(0, height, 0, 0);
				grad.addColorStop(0, "rgba(16, 185, 129, 0.05)");
				grad.addColorStop(.5, "rgba(16, 185, 129, 0.25)");
				grad.addColorStop(1, "rgba(52, 211, 153, 0.6)");
				ctx.beginPath();
				ctx.moveTo(0, height);
				for (let i = 0; i < postFreqData.length; i++) {
					const freq = i * 24e3 / postFreqData.length;
					if (freq < minFreq) continue;
					const x = freqToX(freq, width);
					const val = postFreqData[i] / 255;
					const y = height - val * (height * .85);
					ctx.lineTo(x, y);
				}
				ctx.lineTo(width, height);
				ctx.closePath();
				ctx.fillStyle = grad;
				ctx.fill();
				// Stroke line
				ctx.beginPath();
				for (let i = 0; i < postFreqData.length; i++) {
					const freq = i * 24e3 / postFreqData.length;
					if (freq < minFreq) continue;
					const x = freqToX(freq, width);
					const val = postFreqData[i] / 255;
					const y = height - val * (height * .85);
					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.strokeStyle = "#10b981";
				ctx.lineWidth = 2;
				ctx.stroke();
			} else if (viewMode === "oscilloscope") {
				// Time domain wave
				dspEngine.getPostTimeDomainData(timeDomainData);
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = "#10b981";
				const sliceWidth = width / timeDomainData.length;
				let x = 0;
				for (let i = 0; i < timeDomainData.length; i++) {
					const v = timeDomainData[i] / 128;
					const y = v * height / 2;
					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
					x += sliceWidth;
				}
				ctx.stroke();
			}
			// === COMPOSITE 32-BAND EQUALIZER & FILTER RESPONSE CURVE ===
			// Always drawn on top of the RTA spectrum to show filter transfer curve!
			ctx.beginPath();
			const numCurveSteps = 120;
			for (let s = 0; s <= numCurveSteps; s++) {
				const x = s / numCurveSteps * width;
				const freq = xToFreq(x, width);
				const gainDB = computeTotalFilterGainAtFreq(freq);
				const y = dbToY(gainDB, height);
				if (s === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.strokeStyle = "#38bdf8";
			ctx.lineWidth = 2.5;
			ctx.stroke();
			// === 32 INTERACTIVE NODES ===
			eq32Bands.forEach((band, idx) => {
				const nodeX = freqToX(band.frequency, width);
				const nodeY = dbToY(band.gain, height);
				const isSelected = selectedBandIndex === idx;
				// Vertical drop line to zero dB
				const zeroY = dbToY(0, height);
				ctx.beginPath();
				ctx.moveTo(nodeX, zeroY);
				ctx.lineTo(nodeX, nodeY);
				ctx.strokeStyle = isSelected ? "rgba(56, 189, 248, 0.6)" : "rgba(255, 255, 255, 0.12)";
				ctx.lineWidth = 1;
				ctx.stroke();
				// Node circle
				ctx.beginPath();
				ctx.arc(nodeX, nodeY, isSelected ? 6 : 3.5, 0, 2 * Math.PI);
				ctx.fillStyle = isSelected ? "#38bdf8" : band.gain !== 0 ? "#10b981" : "#737373";
				ctx.fill();
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = "#000000";
				ctx.stroke();
			});
			ctx.restore();
			animId = requestAnimationFrame(render);
		};
		animId = requestAnimationFrame(render);
		return () => cancelAnimationFrame(animId);
	}, [
		viewMode,
		showPrePost,
		selectedBandIndex,
		eq32Bands,
		computeTotalFilterGainAtFreq,
		dbToY,
		freqToX,
		xToFreq
	]);
	return /* @__PURE__ */ _jsxDEV("div", {
		ref: containerRef,
		className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg",
		children: [/* @__PURE__ */ _jsxDEV("div", {
			className: "flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-800",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
					children: /* @__PURE__ */ _jsxDEV(Activity, { className: "w-4 h-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 357,
						columnNumber: 13
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 356,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h3", {
					className: "text-sm font-bold text-white tracking-tight",
					children: "Visualizador RTA & Curva Acústica Compuesta"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 360,
					columnNumber: 13
				}, this), /* @__PURE__ */ _jsxDEV("p", {
					className: "text-[11px] text-neutral-400",
					children: "Transformada Rápida de Fourier (FFT 2048) en tiempo real con 32 nodos interactivos"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 363,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 359,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 355,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "hidden sm:flex items-center gap-3 text-[11px] font-medium mr-2",
						children: [
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ _jsxDEV("span", { className: "w-2.5 h-0.5 bg-sky-400 rounded-full inline-block" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 373,
									columnNumber: 15
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-300",
									children: "Curva DSP"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 374,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 372,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ _jsxDEV("span", { className: "w-2.5 h-2.5 bg-emerald-500/50 rounded-sm inline-block" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 377,
									columnNumber: 15
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-300",
									children: "Espectro Post-DSP"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 378,
									columnNumber: 15
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 376,
								columnNumber: 13
							}, this),
							showPrePost && /* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ _jsxDEV("span", { className: "w-2.5 h-0.5 bg-amber-400 rounded-full inline-block" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 382,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-300",
									children: "Pre-DSP"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 383,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 381,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 371,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						onClick: () => setShowPrePost(!showPrePost),
						className: `px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${showPrePost ? "bg-amber-500/10 text-amber-300 border-amber-500/30" : "bg-neutral-950 text-neutral-400 border-neutral-800"}`,
						children: [/* @__PURE__ */ _jsxDEV(Eye, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 397,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Pre/Post" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 398,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 389,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "flex rounded-lg bg-neutral-950 border border-neutral-800 p-0.5 text-xs font-medium",
						children: [/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setViewMode("spectrum"),
							className: `px-2.5 py-1 rounded transition-colors ${viewMode === "spectrum" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400"}`,
							children: "RTA FFT"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 403,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							onClick: () => setViewMode("oscilloscope"),
							className: `px-2.5 py-1 rounded transition-colors ${viewMode === "oscilloscope" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400"}`,
							children: "Osciloscopio"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 411,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 402,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 369,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 354,
			columnNumber: 7
		}, this), /* @__PURE__ */ _jsxDEV("div", {
			className: "relative w-full h-56 sm:h-64 rounded-lg overflow-hidden border border-neutral-800/80 bg-neutral-950 cursor-crosshair",
			children: /* @__PURE__ */ _jsxDEV("canvas", {
				ref: canvasRef,
				onPointerDown: handlePointerDown,
				onPointerMove: handlePointerMove,
				onPointerUp: handlePointerUp,
				className: "w-full h-full touch-none"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 425,
				columnNumber: 9
			}, this)
		}, void 0, false, {
			fileName: _jsxFileName,
			lineNumber: 424,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 349,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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QkFDdEUsd0JBQUMsUUFBRDtTQUFNLFdBQVU7bUJBQW1CO1FBQWE7Ozs7Z0JBQzdDOzs7Ozs7TUFFSjs7Ozs7O0tBR0wsd0JBQUMsVUFBRDtNQUNFLGVBQWUsZUFBZSxDQUFDLFdBQVc7TUFDMUMsV0FBVywrRkFDVCxjQUNJLHVEQUNBO2dCQUxSLENBUUUsd0JBQUMsS0FBRCxFQUFLLFdBQVUsY0FBZTs7OztnQkFDOUIsd0JBQUMsUUFBRCxZQUFNLFdBQWM7Ozs7Y0FDZDs7Ozs7O0tBR1Isd0JBQUMsT0FBRDtNQUFLLFdBQVU7Z0JBQWYsQ0FDRSx3QkFBQyxVQUFEO09BQ0UsZUFBZSxZQUFZLFVBQVU7T0FDckMsV0FBVyx5Q0FDVCxhQUFhLGFBQWEsNENBQTRDO2lCQUV6RTtNQUVPOzs7O2dCQUNSLHdCQUFDLFVBQUQ7T0FDRSxlQUFlLFlBQVksY0FBYztPQUN6QyxXQUFXLHlDQUNULGFBQWEsaUJBQWlCLDRDQUE0QztpQkFFN0U7TUFFTzs7OztjQUNMOzs7Ozs7SUFDRjs7Ozs7V0FDRjs7Ozs7WUFHTCx3QkFBQyxPQUFEO0dBQUssV0FBVTthQUNiLHdCQUFDLFVBQUQ7SUFDRSxLQUFLO0lBQ0wsZUFBZTtJQUNmLGVBQWU7SUFDZixhQUFhO0lBQ2IsV0FBVTtHQUNYOzs7OztFQUNFOzs7O1VBQ0Y7Ozs7OztBQUVUIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlNwZWN0cnVtRGlzcGxheS50c3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBkc3BFbmdpbmUgfSBmcm9tICcuLi9hdWRpby9kc3BFbmdpbmUnO1xuaW1wb3J0IHsgRVEzMkJhbmQsIFRvbmVDb250cm9sc0NvbmZpZywgQmFzc0Jvb3N0Q29uZmlnIH0gZnJvbSAnLi4vdHlwZXMvZHNwJztcbmltcG9ydCB7IEFjdGl2aXR5LCBXYXZlcywgRXllLCBTcGFya2xlcyB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5pbXBvcnQgeyBEU1BUZXN0U3VpdGUgfSBmcm9tICcuLi9hdWRpby9kc3BUZXN0U3VpdGUnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBlcTMyQmFuZHM6IEVRMzJCYW5kW107XG4gIG9uQmFuZENoYW5nZTogKGJhbmQ6IEVRMzJCYW5kKSA9PiB2b2lkO1xuICB0b25lOiBUb25lQ29udHJvbHNDb25maWc7XG4gIGJhc3NCb29zdDogQmFzc0Jvb3N0Q29uZmlnO1xuICBzZWxlY3RlZEJhbmRJbmRleDogbnVtYmVyIHwgbnVsbDtcbiAgb25TZWxlY3RCYW5kSW5kZXg6IChpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgU3BlY3RydW1EaXNwbGF5OiBSZWFjdC5GQzxQcm9wcz4gPSAoe1xuICBlcTMyQmFuZHMsXG4gIG9uQmFuZENoYW5nZSxcbiAgdG9uZSxcbiAgYmFzc0Jvb3N0LFxuICBzZWxlY3RlZEJhbmRJbmRleCxcbiAgb25TZWxlY3RCYW5kSW5kZXgsXG59KSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lclJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGNhbnZhc1JlZiA9IHVzZVJlZjxIVE1MQ2FudmFzRWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IFt2aWV3TW9kZSwgc2V0Vmlld01vZGVdID0gdXNlU3RhdGU8J3NwZWN0cnVtJyB8ICdjdXJ2ZScgfCAnb3NjaWxsb3Njb3BlJz4oJ3NwZWN0cnVtJyk7XG4gIGNvbnN0IFtzaG93UHJlUG9zdCwgc2V0U2hvd1ByZVBvc3RdID0gdXNlU3RhdGU8Ym9vbGVhbj4odHJ1ZSk7XG4gIGNvbnN0IFtkcmFnZ2luZ0luZGV4LCBzZXREcmFnZ2luZ0luZGV4XSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuXG4gIC8vIEZyZXF1ZW5jeSBhbmQgZEIgY29vcmRpbmF0ZXNcbiAgY29uc3QgbWluRnJlcSA9IDIwO1xuICBjb25zdCBtYXhGcmVxID0gMjAwMDA7XG4gIGNvbnN0IG1pbkRCID0gLTE4O1xuICBjb25zdCBtYXhEQiA9IDE4O1xuXG4gIC8vIExvZ2FyaXRobWljIGNvbnZlcnNpb25cbiAgY29uc3QgZnJlcVRvWCA9IHVzZUNhbGxiYWNrKChmcmVxOiBudW1iZXIsIHdpZHRoOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBmID0gTWF0aC5tYXgobWluRnJlcSwgTWF0aC5taW4obWF4RnJlcSwgZnJlcSkpO1xuICAgIGNvbnN0IGxvZ01pbiA9IE1hdGgubG9nMTAobWluRnJlcSk7XG4gICAgY29uc3QgbG9nTWF4ID0gTWF0aC5sb2cxMChtYXhGcmVxKTtcbiAgICBjb25zdCBsb2dGID0gTWF0aC5sb2cxMChmKTtcbiAgICByZXR1cm4gKChsb2dGIC0gbG9nTWluKSAvIChsb2dNYXggLSBsb2dNaW4pKSAqIHdpZHRoO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgeFRvRnJlcSA9IHVzZUNhbGxiYWNrKCh4OiBudW1iZXIsIHdpZHRoOiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjbGFtcGVkWCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHdpZHRoLCB4KSk7XG4gICAgY29uc3QgbG9nTWluID0gTWF0aC5sb2cxMChtaW5GcmVxKTtcbiAgICBjb25zdCBsb2dNYXggPSBNYXRoLmxvZzEwKG1heEZyZXEpO1xuICAgIGNvbnN0IGxvZ0YgPSBsb2dNaW4gKyAoY2xhbXBlZFggLyB3aWR0aCkgKiAobG9nTWF4IC0gbG9nTWluKTtcbiAgICByZXR1cm4gTWF0aC5wb3coMTAsIGxvZ0YpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgZGJUb1kgPSB1c2VDYWxsYmFjaygoZGI6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjbGFtcGVkREIgPSBNYXRoLm1heChtaW5EQiwgTWF0aC5taW4obWF4REIsIGRiKSk7XG4gICAgcmV0dXJuIGhlaWdodCAtICgoY2xhbXBlZERCIC0gbWluREIpIC8gKG1heERCIC0gbWluREIpKSAqIGhlaWdodDtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHlUb0RCID0gdXNlQ2FsbGJhY2soKHk6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpID0+IHtcbiAgICBjb25zdCBjbGFtcGVkWSA9IE1hdGgubWF4KDAsIE1hdGgubWluKGhlaWdodCwgeSkpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSAxIC0gY2xhbXBlZFkgLyBoZWlnaHQ7XG4gICAgY29uc3QgZGIgPSBtaW5EQiArIG5vcm1hbGl6ZWQgKiAobWF4REIgLSBtaW5EQik7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoZGIgKiAyKSAvIDI7IC8vIHNuYXAgdG8gMC41IGRCXG4gIH0sIFtdKTtcblxuICAvLyBDb21wdXRlIGNvbXBvc2l0ZSBmcmVxdWVuY3kgcmVzcG9uc2UgYXQgZnJlcXVlbmN5IGZcbiAgY29uc3QgY29tcHV0ZVRvdGFsRmlsdGVyR2FpbkF0RnJlcSA9IHVzZUNhbGxiYWNrKFxuICAgIChmOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICAgICAgbGV0IHRvdGFsR2FpbkRCID0gMDtcblxuICAgICAgLy8gMS4gMzItQmFuZCBFUSBjb250cmlidXRpb25cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXEzMkJhbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGIgPSBlcTMyQmFuZHNbaV07XG4gICAgICAgIGlmIChiLmVuYWJsZWQgJiYgYi5nYWluICE9PSAwKSB7XG4gICAgICAgICAgdG90YWxHYWluREIgKz0gRFNQVGVzdFN1aXRlLmNhbGN1bGF0ZUJpcXVhZFBlYWtpbmdHYWluKGYsIGIuZnJlcXVlbmN5LCBiLmdhaW4sIGIucSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gMi4gVG9uZSBDb250cm9sc1xuICAgICAgaWYgKHRvbmUuZW5hYmxlZCkge1xuICAgICAgICBpZiAodG9uZS5iYXNzREIgIT09IDApIHtcbiAgICAgICAgICB0b3RhbEdhaW5EQiArPSBEU1BUZXN0U3VpdGUuY2FsY3VsYXRlQmlxdWFkUGVha2luZ0dhaW4oZiwgMTIwLCB0b25lLmJhc3NEQiwgMC43MSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvbmUubWlkREIgIT09IDApIHtcbiAgICAgICAgICB0b3RhbEdhaW5EQiArPSBEU1BUZXN0U3VpdGUuY2FsY3VsYXRlQmlxdWFkUGVha2luZ0dhaW4oZiwgMTAwMCwgdG9uZS5taWREQiwgMC45KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodG9uZS50cmVibGVEQiAhPT0gMCkge1xuICAgICAgICAgIHRvdGFsR2FpbkRCICs9IERTUFRlc3RTdWl0ZS5jYWxjdWxhdGVCaXF1YWRQZWFraW5nR2FpbihmLCA3NTAwLCB0b25lLnRyZWJsZURCLCAwLjcxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAzLiBCYXNzIEJvb3N0XG4gICAgICBpZiAoYmFzc0Jvb3N0LmVuYWJsZWQgJiYgYmFzc0Jvb3N0LmJvb3N0REIgIT09IDApIHtcbiAgICAgICAgdG90YWxHYWluREIgKz0gRFNQVGVzdFN1aXRlLmNhbGN1bGF0ZUJpcXVhZFBlYWtpbmdHYWluKGYsIGJhc3NCb29zdC5mcmVxdWVuY3ksIGJhc3NCb29zdC5ib29zdERCLCAxLjQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gTWF0aC5tYXgoLTI0LCBNYXRoLm1pbigyNCwgdG90YWxHYWluREIpKTtcbiAgICB9LFxuICAgIFtlcTMyQmFuZHMsIHRvbmUsIGJhc3NCb29zdF1cbiAgKTtcblxuICAvLyBQb2ludGVyIGludGVyYWN0aW9ucyBvbiBjYW52YXMgZm9yIGRyYWdnaW5nIEVRIG5vZGVzXG4gIGNvbnN0IGhhbmRsZVBvaW50ZXJEb3duID0gKGU6IFJlYWN0LlBvaW50ZXJFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4pID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBjYW52YXNSZWYuY3VycmVudDtcbiAgICBpZiAoIWNhbnZhcykgcmV0dXJuO1xuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgeCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcbiAgICBjb25zdCB5ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICAvLyBIaXQgdGVzdCBvbiAzMiBub2Rlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXEzMkJhbmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBiID0gZXEzMkJhbmRzW2ldO1xuICAgICAgY29uc3Qgbm9kZVggPSBmcmVxVG9YKGIuZnJlcXVlbmN5LCByZWN0LndpZHRoKTtcbiAgICAgIGNvbnN0IG5vZGVZID0gZGJUb1koYi5nYWluLCByZWN0LmhlaWdodCk7XG4gICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdCh4IC0gbm9kZVgsIHkgLSBub2RlWSk7XG5cbiAgICAgIGlmIChkaXN0IDwgMTQpIHtcbiAgICAgICAgc2V0RHJhZ2dpbmdJbmRleChpKTtcbiAgICAgICAgb25TZWxlY3RCYW5kSW5kZXgoaSk7XG4gICAgICAgIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkuc2V0UG9pbnRlckNhcHR1cmUoZS5wb2ludGVySWQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBvaW50ZXJNb3ZlID0gKGU6IFJlYWN0LlBvaW50ZXJFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4pID0+IHtcbiAgICBpZiAoZHJhZ2dpbmdJbmRleCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgIGNvbnN0IGNhbnZhcyA9IGNhbnZhc1JlZi5jdXJyZW50O1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCB5ID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XG5cbiAgICBjb25zdCBuZXdHYWluID0gTWF0aC5tYXgoLTE1LCBNYXRoLm1pbigxNSwgeVRvREIoeSwgcmVjdC5oZWlnaHQpKSk7XG4gICAgY29uc3QgdGFyZ2V0QmFuZCA9IGVxMzJCYW5kc1tkcmFnZ2luZ0luZGV4XTtcbiAgICBpZiAodGFyZ2V0QmFuZCAmJiB0YXJnZXRCYW5kLmdhaW4gIT09IG5ld0dhaW4pIHtcbiAgICAgIG9uQmFuZENoYW5nZSh7IC4uLnRhcmdldEJhbmQsIGdhaW46IG5ld0dhaW4gfSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVBvaW50ZXJVcCA9IChlOiBSZWFjdC5Qb2ludGVyRXZlbnQ8SFRNTENhbnZhc0VsZW1lbnQ+KSA9PiB7XG4gICAgaWYgKGRyYWdnaW5nSW5kZXggIT09IG51bGwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkucmVsZWFzZVBvaW50ZXJDYXB0dXJlKGUucG9pbnRlcklkKTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICAvKiBpZ25vcmUgKi9cbiAgICAgIH1cbiAgICAgIHNldERyYWdnaW5nSW5kZXgobnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIEhpZ2ggcHJlY2lzaW9uIENhbnZhcyBBbmltYXRpb24gTG9vcFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGNhbnZhc1JlZi5jdXJyZW50O1xuICAgIGlmICghY2FudmFzKSByZXR1cm47XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKCFjdHgpIHJldHVybjtcblxuICAgIGxldCBhbmltSWQ6IG51bWJlcjtcbiAgICBjb25zdCBwcmVGcmVxRGF0YSA9IG5ldyBVaW50OEFycmF5KDEwMjQpO1xuICAgIGNvbnN0IHBvc3RGcmVxRGF0YSA9IG5ldyBVaW50OEFycmF5KDEwMjQpO1xuICAgIGNvbnN0IHRpbWVEb21haW5EYXRhID0gbmV3IFVpbnQ4QXJyYXkoMTAyNCk7XG5cbiAgICBjb25zdCByZW5kZXIgPSAoKSA9PiB7XG4gICAgICAvLyBSZXNwb25zaXZlIHNpemluZ1xuICAgICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAgIGNvbnN0IHdpZHRoID0gY2FudmFzLmNsaWVudFdpZHRoO1xuICAgICAgY29uc3QgaGVpZ2h0ID0gY2FudmFzLmNsaWVudEhlaWdodDtcblxuICAgICAgaWYgKGNhbnZhcy53aWR0aCAhPT0gd2lkdGggKiBkcHIgfHwgY2FudmFzLmhlaWdodCAhPT0gaGVpZ2h0ICogZHByKSB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoICogZHByO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ICogZHByO1xuICAgICAgfVxuXG4gICAgICBjdHguc2F2ZSgpO1xuICAgICAgY3R4LnNjYWxlKGRwciwgZHByKTtcblxuICAgICAgLy8gQmFja2dyb3VuZFxuICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjMGEwYTBhJztcbiAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgLy8gPT09IEdyaWQgbGluZXM6IGRCIGxldmVscyA9PT1cbiAgICAgIGNvbnN0IGRiTGV2ZWxzID0gWzE1LCAxMCwgNSwgMCwgLTUsIC0xMCwgLTE1XTtcbiAgICAgIGN0eC5saW5lV2lkdGggPSAxO1xuXG4gICAgICBkYkxldmVscy5mb3JFYWNoKChkYikgPT4ge1xuICAgICAgICBjb25zdCB5ID0gZGJUb1koZGIsIGhlaWdodCk7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGRiID09PSAwID8gJ3JnYmEoMTYsIDE4NSwgMTI5LCAwLjQpJyA6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDYpJztcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHgubW92ZVRvKDAsIHkpO1xuICAgICAgICBjdHgubGluZVRvKHdpZHRoLCB5KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBkYiA9PT0gMCA/ICdyZ2JhKDE2LCAxODUsIDEyOSwgMC44KScgOiAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpJztcbiAgICAgICAgY3R4LmZvbnQgPSAnOXB4IG1vbm9zcGFjZSc7XG4gICAgICAgIGN0eC5maWxsVGV4dChgJHtkYiA+IDAgPyAnKycgOiAnJ30ke2RifWRCYCwgNiwgeSAtIDMpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vID09PSBHcmlkIGxpbmVzOiBGcmVxdWVuY2llcyA9PT1cbiAgICAgIGNvbnN0IGZyZXFNYXJrZXJzID0gWzIwLCA1MCwgMTAwLCAyMDAsIDUwMCwgMTAwMCwgMjAwMCwgNTAwMCwgMTAwMDAsIDIwMDAwXTtcbiAgICAgIGZyZXFNYXJrZXJzLmZvckVhY2goKGZyZXEpID0+IHtcbiAgICAgICAgY29uc3QgeCA9IGZyZXFUb1goZnJlcSwgd2lkdGgpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA2KSc7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyh4LCAwKTtcbiAgICAgICAgY3R4LmxpbmVUbyh4LCBoZWlnaHQpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG5cbiAgICAgICAgY29uc3QgbGFiZWwgPSBmcmVxID49IDEwMDAgPyBgJHtmcmVxIC8gMTAwMH1rYCA6IGAke2ZyZXF9YDtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMzUpJztcbiAgICAgICAgY3R4LmZvbnQgPSAnOXB4IG1vbm9zcGFjZSc7XG4gICAgICAgIGN0eC5maWxsVGV4dChsYWJlbCwgeCArIDMsIGhlaWdodCAtIDYpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vID09PSBSZWFsLXRpbWUgYXVkaW8gcmVuZGVyaW5nIG1vZGVzID09PVxuICAgICAgaWYgKHZpZXdNb2RlID09PSAnc3BlY3RydW0nKSB7XG4gICAgICAgIC8vIFJldHJpZXZlIFJUQSBzcGVjdHJ1bVxuICAgICAgICBkc3BFbmdpbmUuZ2V0UG9zdEZyZXF1ZW5jeURhdGEocG9zdEZyZXFEYXRhKTtcbiAgICAgICAgaWYgKHNob3dQcmVQb3N0KSB7XG4gICAgICAgICAgZHNwRW5naW5lLmdldFByZUZyZXF1ZW5jeURhdGEocHJlRnJlcURhdGEpO1xuXG4gICAgICAgICAgLy8gUmVuZGVyIFByZS1EU1AgR2hvc3QgU3BlY3RydW0gKEdyZXkvQW1iZXIgb3V0bGluZSlcbiAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoMjUxLCAxOTEsIDM2LCAwLjM1KSc7XG4gICAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDEuNTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZUZyZXFEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBmcmVxID0gKGkgKiAyNDAwMCkgLyBwcmVGcmVxRGF0YS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoZnJlcSA8IG1pbkZyZXEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgeCA9IGZyZXFUb1goZnJlcSwgd2lkdGgpO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gcHJlRnJlcURhdGFbaV0gLyAyNTU7XG4gICAgICAgICAgICBjb25zdCB5ID0gaGVpZ2h0IC0gdmFsICogKGhlaWdodCAqIDAuODUpO1xuICAgICAgICAgICAgaWYgKGkgPT09IDApIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgICAgICAgICBlbHNlIGN0eC5saW5lVG8oeCwgeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbmRlciBQb3N0LURTUCBTcGVjdHJ1bSBHcmFkaWVudCBCYXJzIC8gQXJlYVxuICAgICAgICBjb25zdCBncmFkID0gY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIGhlaWdodCwgMCwgMCk7XG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAsICdyZ2JhKDE2LCAxODUsIDEyOSwgMC4wNSknKTtcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoMC41LCAncmdiYSgxNiwgMTg1LCAxMjksIDAuMjUpJyk7XG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEsICdyZ2JhKDUyLCAyMTEsIDE1MywgMC42KScpO1xuXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygwLCBoZWlnaHQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc3RGcmVxRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGZyZXEgPSAoaSAqIDI0MDAwKSAvIHBvc3RGcmVxRGF0YS5sZW5ndGg7XG4gICAgICAgICAgaWYgKGZyZXEgPCBtaW5GcmVxKSBjb250aW51ZTtcbiAgICAgICAgICBjb25zdCB4ID0gZnJlcVRvWChmcmVxLCB3aWR0aCk7XG4gICAgICAgICAgY29uc3QgdmFsID0gcG9zdEZyZXFEYXRhW2ldIC8gMjU1O1xuICAgICAgICAgIGNvbnN0IHkgPSBoZWlnaHQgLSB2YWwgKiAoaGVpZ2h0ICogMC44NSk7XG4gICAgICAgICAgY3R4LmxpbmVUbyh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBjdHgubGluZVRvKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBncmFkO1xuICAgICAgICBjdHguZmlsbCgpO1xuXG4gICAgICAgIC8vIFN0cm9rZSBsaW5lXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3N0RnJlcURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBmcmVxID0gKGkgKiAyNDAwMCkgLyBwb3N0RnJlcURhdGEubGVuZ3RoO1xuICAgICAgICAgIGlmIChmcmVxIDwgbWluRnJlcSkgY29udGludWU7XG4gICAgICAgICAgY29uc3QgeCA9IGZyZXFUb1goZnJlcSwgd2lkdGgpO1xuICAgICAgICAgIGNvbnN0IHZhbCA9IHBvc3RGcmVxRGF0YVtpXSAvIDI1NTtcbiAgICAgICAgICBjb25zdCB5ID0gaGVpZ2h0IC0gdmFsICogKGhlaWdodCAqIDAuODUpO1xuICAgICAgICAgIGlmIChpID09PSAwKSBjdHgubW92ZVRvKHgsIHkpO1xuICAgICAgICAgIGVsc2UgY3R4LmxpbmVUbyh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzEwYjk4MSc7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9IGVsc2UgaWYgKHZpZXdNb2RlID09PSAnb3NjaWxsb3Njb3BlJykge1xuICAgICAgICAvLyBUaW1lIGRvbWFpbiB3YXZlXG4gICAgICAgIGRzcEVuZ2luZS5nZXRQb3N0VGltZURvbWFpbkRhdGEodGltZURvbWFpbkRhdGEpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzEwYjk4MSc7XG4gICAgICAgIGNvbnN0IHNsaWNlV2lkdGggPSB3aWR0aCAvIHRpbWVEb21haW5EYXRhLmxlbmd0aDtcbiAgICAgICAgbGV0IHggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVEb21haW5EYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgdiA9IHRpbWVEb21haW5EYXRhW2ldIC8gMTI4LjA7XG4gICAgICAgICAgY29uc3QgeSA9ICh2ICogaGVpZ2h0KSAvIDI7XG4gICAgICAgICAgaWYgKGkgPT09IDApIGN0eC5tb3ZlVG8oeCwgeSk7XG4gICAgICAgICAgZWxzZSBjdHgubGluZVRvKHgsIHkpO1xuICAgICAgICAgIHggKz0gc2xpY2VXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vID09PSBDT01QT1NJVEUgMzItQkFORCBFUVVBTElaRVIgJiBGSUxURVIgUkVTUE9OU0UgQ1VSVkUgPT09XG4gICAgICAvLyBBbHdheXMgZHJhd24gb24gdG9wIG9mIHRoZSBSVEEgc3BlY3RydW0gdG8gc2hvdyBmaWx0ZXIgdHJhbnNmZXIgY3VydmUhXG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjb25zdCBudW1DdXJ2ZVN0ZXBzID0gMTIwO1xuICAgICAgZm9yIChsZXQgcyA9IDA7IHMgPD0gbnVtQ3VydmVTdGVwczsgcysrKSB7XG4gICAgICAgIGNvbnN0IHggPSAocyAvIG51bUN1cnZlU3RlcHMpICogd2lkdGg7XG4gICAgICAgIGNvbnN0IGZyZXEgPSB4VG9GcmVxKHgsIHdpZHRoKTtcbiAgICAgICAgY29uc3QgZ2FpbkRCID0gY29tcHV0ZVRvdGFsRmlsdGVyR2FpbkF0RnJlcShmcmVxKTtcbiAgICAgICAgY29uc3QgeSA9IGRiVG9ZKGdhaW5EQiwgaGVpZ2h0KTtcblxuICAgICAgICBpZiAocyA9PT0gMCkgY3R4Lm1vdmVUbyh4LCB5KTtcbiAgICAgICAgZWxzZSBjdHgubGluZVRvKHgsIHkpO1xuICAgICAgfVxuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMzOGJkZjgnOyAvLyBDeWFuIGN1cnZlXG4gICAgICBjdHgubGluZVdpZHRoID0gMi41O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuXG4gICAgICAvLyA9PT0gMzIgSU5URVJBQ1RJVkUgTk9ERVMgPT09XG4gICAgICBlcTMyQmFuZHMuZm9yRWFjaCgoYmFuZCwgaWR4KSA9PiB7XG4gICAgICAgIGNvbnN0IG5vZGVYID0gZnJlcVRvWChiYW5kLmZyZXF1ZW5jeSwgd2lkdGgpO1xuICAgICAgICBjb25zdCBub2RlWSA9IGRiVG9ZKGJhbmQuZ2FpbiwgaGVpZ2h0KTtcbiAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkQmFuZEluZGV4ID09PSBpZHg7XG5cbiAgICAgICAgLy8gVmVydGljYWwgZHJvcCBsaW5lIHRvIHplcm8gZEJcbiAgICAgICAgY29uc3QgemVyb1kgPSBkYlRvWSgwLCBoZWlnaHQpO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8obm9kZVgsIHplcm9ZKTtcbiAgICAgICAgY3R4LmxpbmVUbyhub2RlWCwgbm9kZVkpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBpc1NlbGVjdGVkID8gJ3JnYmEoNTYsIDE4OSwgMjQ4LCAwLjYpJyA6ICdyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMTIpJztcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcblxuICAgICAgICAvLyBOb2RlIGNpcmNsZVxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5hcmMobm9kZVgsIG5vZGVZLCBpc1NlbGVjdGVkID8gNiA6IDMuNSwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gaXNTZWxlY3RlZCA/ICcjMzhiZGY4JyA6IGJhbmQuZ2FpbiAhPT0gMCA/ICcjMTBiOTgxJyA6ICcjNzM3MzczJztcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDEuNTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJyMwMDAwMDAnO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICB9KTtcblxuICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgIGFuaW1JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgIH07XG5cbiAgICBhbmltSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICByZXR1cm4gKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUoYW5pbUlkKTtcbiAgfSwgW1xuICAgIHZpZXdNb2RlLFxuICAgIHNob3dQcmVQb3N0LFxuICAgIHNlbGVjdGVkQmFuZEluZGV4LFxuICAgIGVxMzJCYW5kcyxcbiAgICBjb21wdXRlVG90YWxGaWx0ZXJHYWluQXRGcmVxLFxuICAgIGRiVG9ZLFxuICAgIGZyZXFUb1gsXG4gICAgeFRvRnJlcSxcbiAgXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e2NvbnRhaW5lclJlZn1cbiAgICAgIGNsYXNzTmFtZT1cImJnLW5ldXRyYWwtOTAwLzkwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgcm91bmRlZC14bCBwLTQgZmxleCBmbGV4LWNvbCBnYXAtMyBzaGFkb3ctbGdcIlxuICAgID5cbiAgICAgIHsvKiBUb3AgY29udHJvbCBiYXIgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTMgcGItMiBib3JkZXItYiBib3JkZXItbmV1dHJhbC04MDBcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0xLjUgcm91bmRlZC1sZyBiZy1lbWVyYWxkLTUwMC8xMCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNTAwLzMwIHRleHQtZW1lcmFsZC00MDBcIj5cbiAgICAgICAgICAgIDxBY3Rpdml0eSBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ib2xkIHRleHQtd2hpdGUgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgVmlzdWFsaXphZG9yIFJUQSAmIEN1cnZhIEFjw7pzdGljYSBDb21wdWVzdGFcbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LW5ldXRyYWwtNDAwXCI+XG4gICAgICAgICAgICAgIFRyYW5zZm9ybWFkYSBSw6FwaWRhIGRlIEZvdXJpZXIgKEZGVCAyMDQ4KSBlbiB0aWVtcG8gcmVhbCBjb24gMzIgbm9kb3MgaW50ZXJhY3Rpdm9zXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICB7LyogTGVnZW5kICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGlkZGVuIHNtOmZsZXggaXRlbXMtY2VudGVyIGdhcC0zIHRleHQtWzExcHhdIGZvbnQtbWVkaXVtIG1yLTJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ3LTIuNSBoLTAuNSBiZy1za3ktNDAwIHJvdW5kZWQtZnVsbCBpbmxpbmUtYmxvY2tcIiAvPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMzAwXCI+Q3VydmEgRFNQPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0yLjUgaC0yLjUgYmctZW1lcmFsZC01MDAvNTAgcm91bmRlZC1zbSBpbmxpbmUtYmxvY2tcIiAvPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMzAwXCI+RXNwZWN0cm8gUG9zdC1EU1A8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIHtzaG93UHJlUG9zdCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctMi41IGgtMC41IGJnLWFtYmVyLTQwMCByb3VuZGVkLWZ1bGwgaW5saW5lLWJsb2NrXCIgLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMzAwXCI+UHJlLURTUDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFRvZ2dsZSBQcmUvUG9zdCAqL31cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93UHJlUG9zdCghc2hvd1ByZVBvc3QpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMi41IHB5LTEgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtbWVkaXVtIGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSAke1xuICAgICAgICAgICAgICBzaG93UHJlUG9zdFxuICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTUwMC8xMCB0ZXh0LWFtYmVyLTMwMCBib3JkZXItYW1iZXItNTAwLzMwJ1xuICAgICAgICAgICAgICAgIDogJ2JnLW5ldXRyYWwtOTUwIHRleHQtbmV1dHJhbC00MDAgYm9yZGVyLW5ldXRyYWwtODAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPEV5ZSBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICA8c3Bhbj5QcmUvUG9zdDwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgIHsvKiBNb2RlIFN3aXRjaGVyICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCByb3VuZGVkLWxnIGJnLW5ldXRyYWwtOTUwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgcC0wLjUgdGV4dC14cyBmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRWaWV3TW9kZSgnc3BlY3RydW0nKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMi41IHB5LTEgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgIHZpZXdNb2RlID09PSAnc3BlY3RydW0nID8gJ2JnLW5ldXRyYWwtODAwIHRleHQtd2hpdGUgZm9udC1zZW1pYm9sZCcgOiAndGV4dC1uZXV0cmFsLTQwMCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFJUQSBGRlRcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRWaWV3TW9kZSgnb3NjaWxsb3Njb3BlJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTIuNSBweS0xIHJvdW5kZWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICB2aWV3TW9kZSA9PT0gJ29zY2lsbG9zY29wZScgPyAnYmctbmV1dHJhbC04MDAgdGV4dC13aGl0ZSBmb250LXNlbWlib2xkJyA6ICd0ZXh0LW5ldXRyYWwtNDAwJ1xuICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgT3NjaWxvc2NvcGlvXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIENhbnZhcyB2aWV3ICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB3LWZ1bGwgaC01NiBzbTpoLTY0IHJvdW5kZWQtbGcgb3ZlcmZsb3ctaGlkZGVuIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAvODAgYmctbmV1dHJhbC05NTAgY3Vyc29yLWNyb3NzaGFpclwiPlxuICAgICAgICA8Y2FudmFzXG4gICAgICAgICAgcmVmPXtjYW52YXNSZWZ9XG4gICAgICAgICAgb25Qb2ludGVyRG93bj17aGFuZGxlUG9pbnRlckRvd259XG4gICAgICAgICAgb25Qb2ludGVyTW92ZT17aGFuZGxlUG9pbnRlck1vdmV9XG4gICAgICAgICAgb25Qb2ludGVyVXA9e2hhbmRsZVBvaW50ZXJVcH1cbiAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIHRvdWNoLW5vbmVcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuIl19