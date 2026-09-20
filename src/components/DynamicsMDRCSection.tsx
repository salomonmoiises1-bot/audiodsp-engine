const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { Sparkles, ShieldAlert, SlidersVertical, Power } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/DynamicsMDRCSection.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const DynamicsMDRCSection = ({ mdrc, onMDRCChange, autoGain, onAutoGainChange, masterGain, onMasterGainChange, limiter, onLimiterChange, telemetry }) => {
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
		children: [/* @__PURE__ */ _jsxDEV("div", {
			className: "lg:col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg",
			children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center justify-between pb-2 border-b border-neutral-800 mb-3",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400",
						children: /* @__PURE__ */ _jsxDEV(SlidersVertical, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 42,
							columnNumber: 17
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 41,
						columnNumber: 15
					}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
						className: "text-xs font-bold text-white uppercase tracking-wider",
						children: "5. MDRC (Control Dinámico Multibanda)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 45,
						columnNumber: 17
					}, this), /* @__PURE__ */ _jsxDEV("p", {
						className: "text-[10px] text-neutral-400",
						children: "Crossover de 3 bandas con compresión y compensación de ganancia independiente"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 17
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 40,
					columnNumber: 13
				}, this), /* @__PURE__ */ _jsxDEV("button", {
					onClick: () => onMDRCChange({
						...mdrc,
						enabled: !mdrc.enabled
					}),
					className: `p-1 rounded-md transition-colors ${mdrc.enabled ? "bg-purple-500/20 text-purple-400 border border-purple-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
					title: mdrc.enabled ? "Módulo Activo" : "Módulo en Bypass",
					children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3.5 h-3.5" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 15
					}, this)
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 53,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 39,
				columnNumber: 11
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "bg-neutral-950/70 border border-neutral-800/80 rounded-lg p-3 flex flex-col gap-2.5",
						children: [
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs font-bold text-indigo-400",
									children: "Banda Baja (<250Hz)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 71,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-[10px] font-mono text-neutral-400",
									children: [
										"GR: -",
										telemetry.mdrcGainReductionLow.toFixed(1),
										" dB"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 72,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 70,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden",
								children: /* @__PURE__ */ _jsxDEV("div", {
									className: "h-full bg-indigo-500 transition-all duration-75",
									style: { width: `${Math.min(100, telemetry.mdrcGainReductionLow / 15 * 100)}%` }
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 79,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Umbral:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 87,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.lowThreshold, " dBFS"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 88,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "-40",
								max: "0",
								step: "1",
								value: mdrc.lowThreshold,
								onChange: (e) => onMDRCChange({
									...mdrc,
									lowThreshold: parseInt(e.target.value)
								}),
								className: "w-full accent-indigo-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 90,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ratio:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 105,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.lowRatio.toFixed(1), ":1"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 106,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 104,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "1.0",
								max: "10.0",
								step: "0.5",
								value: mdrc.lowRatio,
								onChange: (e) => onMDRCChange({
									...mdrc,
									lowRatio: parseFloat(e.target.value)
								}),
								className: "w-full accent-indigo-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 108,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 103,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ganancia:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 123,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.lowGainDB > 0 ? `+${mdrc.lowGainDB.toFixed(1)}` : mdrc.lowGainDB.toFixed(1), " dB"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 124,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 122,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "-12",
								max: "12",
								step: "0.5",
								value: mdrc.lowGainDB,
								onChange: (e) => onMDRCChange({
									...mdrc,
									lowGainDB: parseFloat(e.target.value)
								}),
								className: "w-full accent-indigo-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 69,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "bg-neutral-950/70 border border-neutral-800/80 rounded-lg p-3 flex flex-col gap-2.5",
						children: [
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs font-bold text-emerald-400",
									children: "Banda Media (250-4k)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 145,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-[10px] font-mono text-neutral-400",
									children: [
										"GR: -",
										telemetry.mdrcGainReductionMid.toFixed(1),
										" dB"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 146,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 144,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden",
								children: /* @__PURE__ */ _jsxDEV("div", {
									className: "h-full bg-emerald-500 transition-all duration-75",
									style: { width: `${Math.min(100, telemetry.mdrcGainReductionMid / 15 * 100)}%` }
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 153,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 152,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Umbral:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 161,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.midThreshold, " dBFS"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 162,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 160,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "-40",
								max: "0",
								step: "1",
								value: mdrc.midThreshold,
								onChange: (e) => onMDRCChange({
									...mdrc,
									midThreshold: parseInt(e.target.value)
								}),
								className: "w-full accent-emerald-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 164,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 159,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ratio:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 179,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.midRatio.toFixed(1), ":1"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 180,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 178,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "1.0",
								max: "10.0",
								step: "0.5",
								value: mdrc.midRatio,
								onChange: (e) => onMDRCChange({
									...mdrc,
									midRatio: parseFloat(e.target.value)
								}),
								className: "w-full accent-emerald-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 182,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 177,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ganancia:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 197,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.midGainDB > 0 ? `+${mdrc.midGainDB.toFixed(1)}` : mdrc.midGainDB.toFixed(1), " dB"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 198,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 196,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "-12",
								max: "12",
								step: "0.5",
								value: mdrc.midGainDB,
								onChange: (e) => onMDRCChange({
									...mdrc,
									midGainDB: parseFloat(e.target.value)
								}),
								className: "w-full accent-emerald-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 202,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 195,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 143,
						columnNumber: 13
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "bg-neutral-950/70 border border-neutral-800/80 rounded-lg p-3 flex flex-col gap-2.5",
						children: [
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs font-bold text-amber-400",
									children: "Banda Alta (>4kHz)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 219,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-[10px] font-mono text-neutral-400",
									children: [
										"GR: -",
										telemetry.mdrcGainReductionHigh.toFixed(1),
										" dB"
									]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 220,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 218,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden",
								children: /* @__PURE__ */ _jsxDEV("div", {
									className: "h-full bg-amber-500 transition-all duration-75",
									style: { width: `${Math.min(100, telemetry.mdrcGainReductionHigh / 15 * 100)}%` }
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 227,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 226,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Umbral:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 235,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.highThreshold, " dBFS"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 236,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 234,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "-40",
								max: "0",
								step: "1",
								value: mdrc.highThreshold,
								onChange: (e) => onMDRCChange({
									...mdrc,
									highThreshold: parseInt(e.target.value)
								}),
								className: "w-full accent-amber-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 238,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 233,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ratio:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 253,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.highRatio.toFixed(1), ":1"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 254,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 252,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "1.0",
								max: "10.0",
								step: "0.5",
								value: mdrc.highRatio,
								onChange: (e) => onMDRCChange({
									...mdrc,
									highRatio: parseFloat(e.target.value)
								}),
								className: "w-full accent-amber-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 256,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 15
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex justify-between text-[11px] mb-0.5",
								children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ganancia:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 271,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "font-mono text-neutral-200",
									children: [mdrc.highGainDB > 0 ? `+${mdrc.highGainDB.toFixed(1)}` : mdrc.highGainDB.toFixed(1), " dB"]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 272,
									columnNumber: 19
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 270,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("input", {
								type: "range",
								min: "-12",
								max: "12",
								step: "0.5",
								value: mdrc.highGainDB,
								onChange: (e) => onMDRCChange({
									...mdrc,
									highGainDB: parseFloat(e.target.value)
								}),
								className: "w-full accent-amber-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 276,
								columnNumber: 17
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 269,
								columnNumber: 15
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 217,
						columnNumber: 13
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 67,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 38,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "grid grid-cols-2 gap-4 mt-3 pt-2.5 border-t border-neutral-800 text-xs",
				children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex justify-between mb-1",
					children: [/* @__PURE__ */ _jsxDEV("span", {
						className: "text-neutral-400",
						children: "Ataque Global:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 296,
						columnNumber: 15
					}, this), /* @__PURE__ */ _jsxDEV("span", {
						className: "font-mono text-neutral-300",
						children: [mdrc.attackMs, " ms"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 297,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 295,
					columnNumber: 13
				}, this), /* @__PURE__ */ _jsxDEV("input", {
					type: "range",
					min: "5",
					max: "80",
					step: "1",
					value: mdrc.attackMs,
					onChange: (e) => onMDRCChange({
						...mdrc,
						attackMs: parseInt(e.target.value)
					}),
					className: "w-full accent-purple-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 299,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 294,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex justify-between mb-1",
					children: [/* @__PURE__ */ _jsxDEV("span", {
						className: "text-neutral-400",
						children: "Liberación Global:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 311,
						columnNumber: 15
					}, this), /* @__PURE__ */ _jsxDEV("span", {
						className: "font-mono text-neutral-300",
						children: [mdrc.releaseMs, " ms"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 312,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 310,
					columnNumber: 13
				}, this), /* @__PURE__ */ _jsxDEV("input", {
					type: "range",
					min: "20",
					max: "400",
					step: "10",
					value: mdrc.releaseMs,
					onChange: (e) => onMDRCChange({
						...mdrc,
						releaseMs: parseInt(e.target.value)
					}),
					className: "w-full accent-purple-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 314,
					columnNumber: 13
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 309,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 293,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 37,
			columnNumber: 7
		}, this), /* @__PURE__ */ _jsxDEV("div", {
			className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "p-3 rounded-lg bg-neutral-950 border border-neutral-800",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "p-1 rounded bg-teal-500/10 text-teal-400",
									children: /* @__PURE__ */ _jsxDEV(Sparkles, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 335,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 334,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs font-bold text-white uppercase tracking-wider",
									children: "6. AutoGain (Normalizador RMS)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 337,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 333,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => onAutoGainChange({
									...autoGain,
									enabled: !autoGain.enabled
								}),
								className: `p-1 rounded transition-colors ${autoGain.enabled ? "bg-teal-500/20 text-teal-400 border border-teal-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
								children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3 h-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 349,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 341,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 332,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-2 text-xs",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: "text-neutral-400",
										children: "Objetivo Sonoridad:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 355,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "font-mono font-bold text-teal-400",
										children: [autoGain.targetDB, " dBFS"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 356,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 354,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("input", {
									type: "range",
									min: "-24",
									max: "-6",
									step: "1",
									value: autoGain.targetDB,
									onChange: (e) => onAutoGainChange({
										...autoGain,
										targetDB: parseInt(e.target.value)
									}),
									className: "w-full accent-teal-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 358,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex items-center justify-between pt-1",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: "text-neutral-400",
										children: "Velocidad:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 371,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("div", {
										className: "flex rounded bg-neutral-900 border border-neutral-800 p-0.5 text-[10px]",
										children: [
											"slow",
											"medium",
											"fast"
										].map((s) => /* @__PURE__ */ _jsxDEV("button", {
											onClick: () => onAutoGainChange({
												...autoGain,
												speed: s
											}),
											className: `px-2 py-0.5 rounded capitalize ${autoGain.speed === s ? "bg-neutral-800 text-teal-300 font-bold" : "text-neutral-400"}`,
											children: s === "slow" ? "Lento" : s === "medium" ? "Medio" : "Rápido"
										}, s, false, {
											fileName: _jsxFileName,
											lineNumber: 374,
											columnNumber: 21
										}, this))
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 372,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 370,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "p-1.5 rounded bg-neutral-900 border border-neutral-800 flex justify-between items-center text-[11px]",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: "text-neutral-400",
										children: "Compensación Activa:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 388,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "font-mono font-bold text-teal-300",
										children: [
											telemetry.autoGainCurrentOffsetDB >= 0 ? "+" : "",
											telemetry.autoGainCurrentOffsetDB.toFixed(1),
											" dB"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 389,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 387,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 353,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 331,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "p-3 rounded-lg bg-neutral-950 border border-neutral-800",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "font-bold text-white uppercase tracking-wider",
								children: "7. Master Gain"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 400,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-white",
								children: [masterGain.gainDB > 0 ? `+${masterGain.gainDB.toFixed(1)}` : masterGain.gainDB.toFixed(1), " dB"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 403,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 399,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "-24",
							max: "12",
							step: "0.5",
							value: masterGain.gainDB,
							onChange: (e) => onMasterGainChange({ gainDB: parseFloat(e.target.value) }),
							className: "w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 407,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 398,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "p-3 rounded-lg bg-neutral-950 border border-neutral-800",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "p-1 rounded bg-rose-500/10 text-rose-400",
									children: /* @__PURE__ */ _jsxDEV(ShieldAlert, { className: "w-3.5 h-3.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 425,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 424,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-xs font-bold text-white uppercase tracking-wider",
									children: "8. Soft Limiter (Curva Tanh)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 427,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 423,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => onLimiterChange({
									...limiter,
									enabled: !limiter.enabled
								}),
								className: `p-1 rounded transition-colors ${limiter.enabled ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
								children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3 h-3" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 439,
									columnNumber: 17
								}, this)
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 431,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 422,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "space-y-2 text-xs",
							children: [
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: "text-neutral-400",
										children: "Techo Máximo (Ceiling):"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 445,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "font-mono font-bold text-rose-400",
										children: [limiter.ceilingDB.toFixed(1), " dBFS"]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 446,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 444,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("input", {
									type: "range",
									min: "-6.0",
									max: "0.0",
									step: "0.1",
									value: limiter.ceilingDB,
									onChange: (e) => onLimiterChange({
										...limiter,
										ceilingDB: parseFloat(e.target.value)
									}),
									className: "w-full accent-rose-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 448,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: "text-neutral-400",
										children: "Drive de Entrada:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 461,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "font-mono text-neutral-200",
										children: [
											"+",
											limiter.driveDB.toFixed(1),
											" dB"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 462,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 460,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("input", {
									type: "range",
									min: "0",
									max: "12",
									step: "0.5",
									value: limiter.driveDB,
									onChange: (e) => onLimiterChange({
										...limiter,
										driveDB: parseFloat(e.target.value)
									}),
									className: "w-full accent-rose-400 h-1 bg-neutral-800 rounded-lg cursor-pointer"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 464,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex items-center justify-between pt-1",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: "text-neutral-400 text-[11px]",
										children: "Reducción Instantánea:"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 477,
										columnNumber: 17
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "font-mono font-bold text-rose-400",
										children: [
											"-",
											telemetry.limiterReductionDB.toFixed(1),
											" dB"
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 478,
										columnNumber: 17
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 476,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 443,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 421,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 329,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "text-[10px] text-neutral-500 mt-3 pt-2 border-t border-neutral-800/60",
				children: "Curva no lineal asintótica suave que elimina recorte digital duro."
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 486,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 328,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 35,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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LENBQUM7U0FFdkUsV0FBVTtRQUNYOzs7OztRQUVELHdCQUFDLE9BQUQ7U0FBSyxXQUFVO21CQUFmLENBQ0Usd0JBQUMsUUFBRDtVQUFNLFdBQVU7b0JBQW1CO1NBQXVCOzs7O21CQUMxRCx3QkFBQyxRQUFEO1VBQU0sV0FBVTtvQkFBaEI7V0FBNkM7V0FBRSxRQUFRLFFBQVEsUUFBUSxDQUFDO1dBQUU7VUFBUzs7Ozs7aUJBQ2hGOzs7Ozs7UUFDTCx3QkFBQyxTQUFEO1NBQ0UsTUFBSztTQUNMLEtBQUk7U0FDSixLQUFJO1NBQ0osTUFBSztTQUNMLE9BQU8sUUFBUTtTQUNmLFdBQVcsTUFDVCxnQkFBZ0I7VUFBRSxHQUFHO1VBQVMsU0FBUyxXQUFXLEVBQUUsT0FBTyxLQUFLO1NBQUUsQ0FBQztTQUVyRSxXQUFVO1FBQ1g7Ozs7O1FBRUQsd0JBQUMsT0FBRDtTQUFLLFdBQVU7bUJBQWYsQ0FDRSx3QkFBQyxRQUFEO1VBQU0sV0FBVTtvQkFBK0I7U0FBNEI7Ozs7bUJBQzNFLHdCQUFDLFFBQUQ7VUFBTSxXQUFVO29CQUFoQjtXQUFvRDtXQUNoRCxVQUFVLG1CQUFtQixRQUFRLENBQUM7V0FBRTtVQUN0Qzs7Ozs7aUJBQ0g7Ozs7OztPQUNGOzs7OztjQUNGOzs7Ozs7SUFDRjs7Ozs7YUFFTCx3QkFBQyxPQUFEO0lBQUssV0FBVTtjQUF3RTtHQUVsRjs7OztXQUNGOzs7OztVQUNGOzs7Ozs7QUFFVCIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJEeW5hbWljc01EUkNTZWN0aW9uLnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtcbiAgTURSQ0NvbmZpZyxcbiAgQXV0b0dhaW5Db25maWcsXG4gIE1hc3RlckdhaW5Db25maWcsXG4gIFNvZnRMaW1pdGVyQ29uZmlnLFxuICBBdWRpb1RlbGVtZXRyeSxcbn0gZnJvbSAnLi4vdHlwZXMvZHNwJztcbmltcG9ydCB7IEdhdWdlLCBTcGFya2xlcywgU2hpZWxkQWxlcnQsIFNsaWRlcnNWZXJ0aWNhbCwgUG93ZXIgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBtZHJjOiBNRFJDQ29uZmlnO1xuICBvbk1EUkNDaGFuZ2U6IChjZmc6IE1EUkNDb25maWcpID0+IHZvaWQ7XG4gIGF1dG9HYWluOiBBdXRvR2FpbkNvbmZpZztcbiAgb25BdXRvR2FpbkNoYW5nZTogKGNmZzogQXV0b0dhaW5Db25maWcpID0+IHZvaWQ7XG4gIG1hc3RlckdhaW46IE1hc3RlckdhaW5Db25maWc7XG4gIG9uTWFzdGVyR2FpbkNoYW5nZTogKGNmZzogTWFzdGVyR2FpbkNvbmZpZykgPT4gdm9pZDtcbiAgbGltaXRlcjogU29mdExpbWl0ZXJDb25maWc7XG4gIG9uTGltaXRlckNoYW5nZTogKGNmZzogU29mdExpbWl0ZXJDb25maWcpID0+IHZvaWQ7XG4gIHRlbGVtZXRyeTogQXVkaW9UZWxlbWV0cnk7XG59XG5cbmV4cG9ydCBjb25zdCBEeW5hbWljc01EUkNTZWN0aW9uOiBSZWFjdC5GQzxQcm9wcz4gPSAoe1xuICBtZHJjLFxuICBvbk1EUkNDaGFuZ2UsXG4gIGF1dG9HYWluLFxuICBvbkF1dG9HYWluQ2hhbmdlLFxuICBtYXN0ZXJHYWluLFxuICBvbk1hc3RlckdhaW5DaGFuZ2UsXG4gIGxpbWl0ZXIsXG4gIG9uTGltaXRlckNoYW5nZSxcbiAgdGVsZW1ldHJ5LFxufSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBsZzpncmlkLWNvbHMtMyBnYXAtNFwiPlxuICAgICAgey8qIDEuIE1EUkM6IE11bHRpLUJhbmQgRHluYW1pYyBSYW5nZSBDb250cm9sICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZzpjb2wtc3Bhbi0yIGJnLW5ldXRyYWwtOTAwLzkwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgcm91bmRlZC14bCBwLTQgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW4gc2hhZG93LWxnXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcGItMiBib3JkZXItYiBib3JkZXItbmV1dHJhbC04MDAgbWItM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMS41IHJvdW5kZWQtbGcgYmctcHVycGxlLTUwMC8xMCBib3JkZXIgYm9yZGVyLXB1cnBsZS01MDAvMzAgdGV4dC1wdXJwbGUtNDAwXCI+XG4gICAgICAgICAgICAgICAgPFNsaWRlcnNWZXJ0aWNhbCBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtd2hpdGUgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+XG4gICAgICAgICAgICAgICAgICA1LiBNRFJDIChDb250cm9sIERpbsOhbWljbyBNdWx0aWJhbmRhKVxuICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1uZXV0cmFsLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgQ3Jvc3NvdmVyIGRlIDMgYmFuZGFzIGNvbiBjb21wcmVzacOzbiB5IGNvbXBlbnNhY2nDs24gZGUgZ2FuYW5jaWEgaW5kZXBlbmRpZW50ZVxuICAgICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25NRFJDQ2hhbmdlKHsgLi4ubWRyYywgZW5hYmxlZDogIW1kcmMuZW5hYmxlZCB9KX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcC0xIHJvdW5kZWQtbWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICBtZHJjLmVuYWJsZWRcbiAgICAgICAgICAgICAgICAgID8gJ2JnLXB1cnBsZS01MDAvMjAgdGV4dC1wdXJwbGUtNDAwIGJvcmRlciBib3JkZXItcHVycGxlLTUwMC80MCdcbiAgICAgICAgICAgICAgICAgIDogJ2JnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC01MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgIHRpdGxlPXttZHJjLmVuYWJsZWQgPyAnTcOzZHVsbyBBY3Rpdm8nIDogJ03Ds2R1bG8gZW4gQnlwYXNzJ31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFBvd2VyIGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIDMgQmFuZHMgQ29sdW1ucyAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTMgZ2FwLTNcIj5cbiAgICAgICAgICAgIHsvKiBMb3cgQmFuZCAoPCAyNTAgSHopICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTk1MC83MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwLzgwIHJvdW5kZWQtbGcgcC0zIGZsZXggZmxleC1jb2wgZ2FwLTIuNVwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtaW5kaWdvLTQwMFwiPkJhbmRhIEJhamEgKCZsdDsyNTBIeik8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtbmV1dHJhbC00MDBcIj5cbiAgICAgICAgICAgICAgICAgIEdSOiAte3RlbGVtZXRyeS5tZHJjR2FpblJlZHVjdGlvbkxvdy50b0ZpeGVkKDEpfSBkQlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIE1ldGVyICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLTEuNSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC1mdWxsIGJnLWluZGlnby01MDAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNzVcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke01hdGgubWluKDEwMCwgKHRlbGVtZXRyeS5tZHJjR2FpblJlZHVjdGlvbkxvdyAvIDE1KSAqIDEwMCl9JWAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC1bMTFweF0gbWItMC41XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+VW1icmFsOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+e21kcmMubG93VGhyZXNob2xkfSBkQkZTPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgIG1pbj1cIi00MFwiXG4gICAgICAgICAgICAgICAgICBtYXg9XCIwXCJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIxXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXttZHJjLmxvd1RocmVzaG9sZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgb25NRFJDQ2hhbmdlKHsgLi4ubWRyYywgbG93VGhyZXNob2xkOiBwYXJzZUludChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtaW5kaWdvLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzExcHhdIG1iLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPlJhdGlvOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+e21kcmMubG93UmF0aW8udG9GaXhlZCgxKX06MTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICBtaW49XCIxLjBcIlxuICAgICAgICAgICAgICAgICAgbWF4PVwiMTAuMFwiXG4gICAgICAgICAgICAgICAgICBzdGVwPVwiMC41XCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXttZHJjLmxvd1JhdGlvfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgICBvbk1EUkNDaGFuZ2UoeyAuLi5tZHJjLCBsb3dSYXRpbzogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtaW5kaWdvLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzExcHhdIG1iLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPkdhbmFuY2lhOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgIHttZHJjLmxvd0dhaW5EQiA+IDAgPyBgKyR7bWRyYy5sb3dHYWluREIudG9GaXhlZCgxKX1gIDogbWRyYy5sb3dHYWluREIudG9GaXhlZCgxKX0gZEJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICBtaW49XCItMTJcIlxuICAgICAgICAgICAgICAgICAgbWF4PVwiMTJcIlxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17bWRyYy5sb3dHYWluREJ9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgIG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIGxvd0dhaW5EQjogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtaW5kaWdvLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIE1pZCBCYW5kICgyNTAgSHogLSA0MDAwIEh6KSAqL31cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctbmV1dHJhbC05NTAvNzAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMC84MCByb3VuZGVkLWxnIHAtMyBmbGV4IGZsZXgtY29sIGdhcC0yLjVcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LWVtZXJhbGQtNDAwXCI+QmFuZGEgTWVkaWEgKDI1MC00ayk8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtbmV1dHJhbC00MDBcIj5cbiAgICAgICAgICAgICAgICAgIEdSOiAte3RlbGVtZXRyeS5tZHJjR2FpblJlZHVjdGlvbk1pZC50b0ZpeGVkKDEpfSBkQlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIE1ldGVyICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLTEuNSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuXCI+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC1mdWxsIGJnLWVtZXJhbGQtNTAwIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTc1XCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtNYXRoLm1pbigxMDAsICh0ZWxlbWV0cnkubWRyY0dhaW5SZWR1Y3Rpb25NaWQgLyAxNSkgKiAxMDApfSVgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzExcHhdIG1iLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPlVtYnJhbDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1uZXV0cmFsLTIwMFwiPnttZHJjLm1pZFRocmVzaG9sZH0gZEJGUzwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICBtaW49XCItNDBcIlxuICAgICAgICAgICAgICAgICAgbWF4PVwiMFwiXG4gICAgICAgICAgICAgICAgICBzdGVwPVwiMVwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17bWRyYy5taWRUaHJlc2hvbGR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgIG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIG1pZFRocmVzaG9sZDogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWVtZXJhbGQtNDAwIGgtMSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC1bMTFweF0gbWItMC41XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+UmF0aW86PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtbmV1dHJhbC0yMDBcIj57bWRyYy5taWRSYXRpby50b0ZpeGVkKDEpfToxPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgIG1pbj1cIjEuMFwiXG4gICAgICAgICAgICAgICAgICBtYXg9XCIxMC4wXCJcbiAgICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjVcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e21kcmMubWlkUmF0aW99XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgIG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIG1pZFJhdGlvOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGFjY2VudC1lbWVyYWxkLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzExcHhdIG1iLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPkdhbmFuY2lhOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+XG4gICAgICAgICAgICAgICAgICAgIHttZHJjLm1pZEdhaW5EQiA+IDAgPyBgKyR7bWRyYy5taWRHYWluREIudG9GaXhlZCgxKX1gIDogbWRyYy5taWRHYWluREIudG9GaXhlZCgxKX0gZEJcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICBtaW49XCItMTJcIlxuICAgICAgICAgICAgICAgICAgbWF4PVwiMTJcIlxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17bWRyYy5taWRHYWluREJ9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgIG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIG1pZEdhaW5EQjogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtZW1lcmFsZC00MDAgaC0xIGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBIaWdoIEJhbmQgKD4gNDAwMCBIeikgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW5ldXRyYWwtOTUwLzcwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAvODAgcm91bmRlZC1sZyBwLTMgZmxleCBmbGV4LWNvbCBnYXAtMi41XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC1hbWJlci00MDBcIj5CYW5kYSBBbHRhICgmZ3Q7NGtIeik8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtbmV1dHJhbC00MDBcIj5cbiAgICAgICAgICAgICAgICAgIEdSOiAte3RlbGVtZXRyeS5tZHJjR2FpblJlZHVjdGlvbkhpZ2gudG9GaXhlZCgxKX0gZEJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIHsvKiBNZXRlciAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgaC0xLjUgYmctbmV1dHJhbC04MDAgcm91bmRlZC1mdWxsIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtZnVsbCBiZy1hbWJlci01MDAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNzVcIlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke01hdGgubWluKDEwMCwgKHRlbGVtZXRyeS5tZHJjR2FpblJlZHVjdGlvbkhpZ2ggLyAxNSkgKiAxMDApfSVgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzExcHhdIG1iLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPlVtYnJhbDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1uZXV0cmFsLTIwMFwiPnttZHJjLmhpZ2hUaHJlc2hvbGR9IGRCRlM8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgbWluPVwiLTQwXCJcbiAgICAgICAgICAgICAgICAgIG1heD1cIjBcIlxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjFcIlxuICAgICAgICAgICAgICAgICAgdmFsdWU9e21kcmMuaGlnaFRocmVzaG9sZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgb25NRFJDQ2hhbmdlKHsgLi4ubWRyYywgaGlnaFRocmVzaG9sZDogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWFtYmVyLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzExcHhdIG1iLTAuNVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPlJhdGlvOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+e21kcmMuaGlnaFJhdGlvLnRvRml4ZWQoMSl9OjE8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgICAgbWluPVwiMS4wXCJcbiAgICAgICAgICAgICAgICAgIG1heD1cIjEwLjBcIlxuICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17bWRyYy5oaWdoUmF0aW99XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgIG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIGhpZ2hSYXRpbzogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtYW1iZXItNDAwIGgtMSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC1bMTFweF0gbWItMC41XCI+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+R2FuYW5jaWE6PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtbmV1dHJhbC0yMDBcIj5cbiAgICAgICAgICAgICAgICAgICAge21kcmMuaGlnaEdhaW5EQiA+IDAgPyBgKyR7bWRyYy5oaWdoR2FpbkRCLnRvRml4ZWQoMSl9YCA6IG1kcmMuaGlnaEdhaW5EQi50b0ZpeGVkKDEpfSBkQlxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICAgIG1pbj1cIi0xMlwiXG4gICAgICAgICAgICAgICAgICBtYXg9XCIxMlwiXG4gICAgICAgICAgICAgICAgICBzdGVwPVwiMC41XCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXttZHJjLmhpZ2hHYWluREJ9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICAgIG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIGhpZ2hHYWluREI6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpIH0pXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWFtYmVyLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIEdsb2JhbCBCYWxsaXN0aWNzICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTQgbXQtMyBwdC0yLjUgYm9yZGVyLXQgYm9yZGVyLW5ldXRyYWwtODAwIHRleHQteHNcIj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBtYi0xXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5BdGFxdWUgR2xvYmFsOjwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtbmV1dHJhbC0zMDBcIj57bWRyYy5hdHRhY2tNc30gbXM8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICBtaW49XCI1XCJcbiAgICAgICAgICAgICAgbWF4PVwiODBcIlxuICAgICAgICAgICAgICBzdGVwPVwiMVwiXG4gICAgICAgICAgICAgIHZhbHVlPXttZHJjLmF0dGFja01zfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIGF0dGFja01zOiBwYXJzZUludChlLnRhcmdldC52YWx1ZSkgfSl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtcHVycGxlLTQwMCBoLTEgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIG1iLTFcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPkxpYmVyYWNpw7NuIEdsb2JhbDo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMzAwXCI+e21kcmMucmVsZWFzZU1zfSBtczwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgIG1pbj1cIjIwXCJcbiAgICAgICAgICAgICAgbWF4PVwiNDAwXCJcbiAgICAgICAgICAgICAgc3RlcD1cIjEwXCJcbiAgICAgICAgICAgICAgdmFsdWU9e21kcmMucmVsZWFzZU1zfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uTURSQ0NoYW5nZSh7IC4uLm1kcmMsIHJlbGVhc2VNczogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpIH0pfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LXB1cnBsZS00MDAgaC0xIGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIDIuIEF1dG9HYWluICYgTWFzdGVyIE91dHB1dCBTdGFnZSB3aXRoIFNvZnQgTGltaXRlciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctbmV1dHJhbC05MDAvOTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCByb3VuZGVkLXhsIHAtNCBmbGV4IGZsZXgtY29sIGp1c3RpZnktYmV0d2VlbiBzaGFkb3ctbGdcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgICAgICB7LyogQXV0b0dhaW4gQm94ICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zIHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTEgcm91bmRlZCBiZy10ZWFsLTUwMC8xMCB0ZXh0LXRlYWwtNDAwXCI+XG4gICAgICAgICAgICAgICAgICA8U3BhcmtsZXMgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtd2hpdGUgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+XG4gICAgICAgICAgICAgICAgICA2LiBBdXRvR2FpbiAoTm9ybWFsaXphZG9yIFJNUylcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25BdXRvR2FpbkNoYW5nZSh7IC4uLmF1dG9HYWluLCBlbmFibGVkOiAhYXV0b0dhaW4uZW5hYmxlZCB9KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BwLTEgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgICAgYXV0b0dhaW4uZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICA/ICdiZy10ZWFsLTUwMC8yMCB0ZXh0LXRlYWwtNDAwIGJvcmRlciBib3JkZXItdGVhbC01MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgIDogJ2JnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC01MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCdcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxQb3dlciBjbGFzc05hbWU9XCJ3LTMgaC0zXCIgLz5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTIgdGV4dC14c1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPk9iamV0aXZvIFNvbm9yaWRhZDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LXRlYWwtNDAwXCI+e2F1dG9HYWluLnRhcmdldERCfSBkQkZTPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCItMjRcIlxuICAgICAgICAgICAgICAgIG1heD1cIi02XCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2F1dG9HYWluLnRhcmdldERCfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgIG9uQXV0b0dhaW5DaGFuZ2UoeyAuLi5hdXRvR2FpbiwgdGFyZ2V0REI6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LXRlYWwtNDAwIGgtMSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwdC0xXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPlZlbG9jaWRhZDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHJvdW5kZWQgYmctbmV1dHJhbC05MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCBwLTAuNSB0ZXh0LVsxMHB4XVwiPlxuICAgICAgICAgICAgICAgICAgeyhbJ3Nsb3cnLCAnbWVkaXVtJywgJ2Zhc3QnXSBhcyBjb25zdCkubWFwKChzKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgICBrZXk9e3N9XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25BdXRvR2FpbkNoYW5nZSh7IC4uLmF1dG9HYWluLCBzcGVlZDogcyB9KX1cbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0yIHB5LTAuNSByb3VuZGVkIGNhcGl0YWxpemUgJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9HYWluLnNwZWVkID09PSBzID8gJ2JnLW5ldXRyYWwtODAwIHRleHQtdGVhbC0zMDAgZm9udC1ib2xkJyA6ICd0ZXh0LW5ldXRyYWwtNDAwJ1xuICAgICAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3MgPT09ICdzbG93JyA/ICdMZW50bycgOiBzID09PSAnbWVkaXVtJyA/ICdNZWRpbycgOiAnUsOhcGlkbyd9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0xLjUgcm91bmRlZCBiZy1uZXV0cmFsLTkwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciB0ZXh0LVsxMXB4XVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5Db21wZW5zYWNpw7NuIEFjdGl2YTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LXRlYWwtMzAwXCI+XG4gICAgICAgICAgICAgICAgICB7dGVsZW1ldHJ5LmF1dG9HYWluQ3VycmVudE9mZnNldERCID49IDAgPyAnKycgOiAnJ31cbiAgICAgICAgICAgICAgICAgIHt0ZWxlbWV0cnkuYXV0b0dhaW5DdXJyZW50T2Zmc2V0REIudG9GaXhlZCgxKX0gZEJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogTWFzdGVyIEdhaW4gU2xpZGVyICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zIHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIG1iLTFcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1ib2xkIHRleHQtd2hpdGUgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+XG4gICAgICAgICAgICAgICAgNy4gTWFzdGVyIEdhaW5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gZm9udC1ib2xkIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICB7bWFzdGVyR2Fpbi5nYWluREIgPiAwID8gYCske21hc3RlckdhaW4uZ2FpbkRCLnRvRml4ZWQoMSl9YCA6IG1hc3RlckdhaW4uZ2FpbkRCLnRvRml4ZWQoMSl9IGRCXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgIG1pbj1cIi0yNFwiXG4gICAgICAgICAgICAgIG1heD1cIjEyXCJcbiAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgIHZhbHVlPXttYXN0ZXJHYWluLmdhaW5EQn1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgIG9uTWFzdGVyR2FpbkNoYW5nZSh7IGdhaW5EQjogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LXdoaXRlIGgtMS41IGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBTb2Z0IExpbWl0ZXIgQm94ICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zIHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTEgcm91bmRlZCBiZy1yb3NlLTUwMC8xMCB0ZXh0LXJvc2UtNDAwXCI+XG4gICAgICAgICAgICAgICAgICA8U2hpZWxkQWxlcnQgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtd2hpdGUgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+XG4gICAgICAgICAgICAgICAgICA4LiBTb2Z0IExpbWl0ZXIgKEN1cnZhIFRhbmgpXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uTGltaXRlckNoYW5nZSh7IC4uLmxpbWl0ZXIsIGVuYWJsZWQ6ICFsaW1pdGVyLmVuYWJsZWQgfSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcC0xIHJvdW5kZWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICAgIGxpbWl0ZXIuZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICA/ICdiZy1yb3NlLTUwMC8yMCB0ZXh0LXJvc2UtNDAwIGJvcmRlciBib3JkZXItcm9zZS01MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgIDogJ2JnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC01MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCdcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxQb3dlciBjbGFzc05hbWU9XCJ3LTMgaC0zXCIgLz5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTIgdGV4dC14c1wiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPlRlY2hvIE3DoXhpbW8gKENlaWxpbmcpOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gZm9udC1ib2xkIHRleHQtcm9zZS00MDBcIj57bGltaXRlci5jZWlsaW5nREIudG9GaXhlZCgxKX0gZEJGUzwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgbWluPVwiLTYuMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiMC4wXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC4xXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17bGltaXRlci5jZWlsaW5nREJ9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgb25MaW1pdGVyQ2hhbmdlKHsgLi4ubGltaXRlciwgY2VpbGluZ0RCOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LXJvc2UtNDAwIGgtMSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTQwMFwiPkRyaXZlIGRlIEVudHJhZGE6PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+K3tsaW1pdGVyLmRyaXZlREIudG9GaXhlZCgxKX0gZEI8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjEyXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC41XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17bGltaXRlci5kcml2ZURCfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgIG9uTGltaXRlckNoYW5nZSh7IC4uLmxpbWl0ZXIsIGRyaXZlREI6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtcm9zZS00MDAgaC0xIGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHB0LTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwIHRleHQtWzExcHhdXCI+UmVkdWNjacOzbiBJbnN0YW50w6FuZWE6PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1yb3NlLTQwMFwiPlxuICAgICAgICAgICAgICAgICAgLXt0ZWxlbWV0cnkubGltaXRlclJlZHVjdGlvbkRCLnRvRml4ZWQoMSl9IGRCXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtbmV1dHJhbC01MDAgbXQtMyBwdC0yIGJvcmRlci10IGJvcmRlci1uZXV0cmFsLTgwMC82MFwiPlxuICAgICAgICAgIEN1cnZhIG5vIGxpbmVhbCBhc2ludMOzdGljYSBzdWF2ZSBxdWUgZWxpbWluYSByZWNvcnRlIGRpZ2l0YWwgZHVyby5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0=