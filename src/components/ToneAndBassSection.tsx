const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { Volume2, Zap, Headphones, Waves, RotateCcw, Power } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/ToneAndBassSection.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const ToneAndBassSection = ({ preGain, onPreGainChange, tone, onToneChange, bassBoost, onBassBoostChange, virtualizer, onVirtualizerChange }) => {
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4",
		children: [
			/* @__PURE__ */ _jsxDEV("div", {
				className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg",
				children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center justify-between pb-2 border-b border-neutral-800 mb-3",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400",
							children: /* @__PURE__ */ _jsxDEV(Volume2, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 39,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 38,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
							className: "text-xs font-bold text-white uppercase tracking-wider",
							children: "1. Pre-Gain & Fase"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 42,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-[10px] text-neutral-400",
							children: "Calibración de entrada"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 37,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: () => onPreGainChange({
							...preGain,
							enabled: !preGain.enabled
						}),
						className: `p-1 rounded-md transition-colors ${preGain.enabled ? "bg-sky-500/20 text-sky-400 border border-sky-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
						title: preGain.enabled ? "Módulo Activo" : "Módulo en Bypass",
						children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 57,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 48,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 36,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ _jsxDEV("div", { children: [
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Ganancia de Entrada:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 64,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-sky-400",
								children: [preGain.gainDB > 0 ? `+${preGain.gainDB.toFixed(1)}` : preGain.gainDB.toFixed(1), " dB"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 65,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "-24",
							max: "12",
							step: "0.5",
							value: preGain.gainDB,
							onChange: (e) => onPreGainChange({
								...preGain,
								gainDB: parseFloat(e.target.value)
							}),
							className: "w-full accent-sky-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 69,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-[9px] font-mono text-neutral-500 mt-1",
							children: [
								/* @__PURE__ */ _jsxDEV("span", { children: "-24 dB" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 81,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("span", { children: "0 dB" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 82,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("span", { children: "+12 dB" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 83,
									columnNumber: 17
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 80,
							columnNumber: 15
						}, this)
					] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center justify-between pt-1 border-t border-neutral-800/80",
						children: [/* @__PURE__ */ _jsxDEV("span", {
							className: "text-xs text-neutral-400",
							children: "Inversión de Fase (180°):"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							onClick: () => onPreGainChange({
								...preGain,
								phaseInvert: !preGain.phaseInvert
							}),
							className: `px-2.5 py-1 rounded text-xs font-mono font-semibold transition-colors ${preGain.phaseInvert ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:text-white"}`,
							children: preGain.phaseInvert ? "180° (Invertida)" : "0° (Normal)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 61,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 35,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "text-[10px] text-neutral-500 mt-3 pt-2 border-t border-neutral-800/60",
					children: "Ajuste lineal previo a los bloques no lineales."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 105,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 34,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg",
				children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center justify-between pb-2 border-b border-neutral-800 mb-3",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400",
							children: /* @__PURE__ */ _jsxDEV(Zap, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 116,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
							className: "text-xs font-bold text-white uppercase tracking-wider",
							children: "2. Bass Boost & Armónicos"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 119,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-[10px] text-neutral-400",
							children: "Refuerzo psicoacústico"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 118,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 114,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: () => onBassBoostChange({
							...bassBoost,
							enabled: !bassBoost.enabled
						}),
						className: `p-1 rounded-md transition-colors ${bassBoost.enabled ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
						title: bassBoost.enabled ? "Módulo Activo" : "Módulo en Bypass",
						children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 134,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 125,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 113,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Realce de Bajos:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 141,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-indigo-400",
								children: [
									"+",
									bassBoost.boostDB.toFixed(1),
									" dB"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 142,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 140,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "0",
							max: "15",
							step: "0.5",
							value: bassBoost.boostDB,
							onChange: (e) => onBassBoostChange({
								...bassBoost,
								boostDB: parseFloat(e.target.value)
							}),
							className: "w-full accent-indigo-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 146,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 139,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Frecuencia Central:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono text-indigo-300",
								children: [bassBoost.frequency, " Hz"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 162,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 160,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "40",
							max: "140",
							step: "5",
							value: bassBoost.frequency,
							onChange: (e) => onBassBoostChange({
								...bassBoost,
								frequency: parseInt(e.target.value)
							}),
							className: "w-full accent-indigo-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 164,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 159,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Excitador de Armónicos:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 179,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono text-indigo-300",
								children: [bassBoost.harmonics, "%"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 180,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 178,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "0",
							max: "100",
							step: "5",
							value: bassBoost.harmonics,
							onChange: (e) => onBassBoostChange({
								...bassBoost,
								harmonics: parseInt(e.target.value)
							}),
							className: "w-full accent-indigo-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 182,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 177,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Filtro Subsónico HPF:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 197,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono text-indigo-300",
								children: [bassBoost.subCutoff, " Hz"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 198,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 196,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "20",
							max: "35",
							step: "1",
							value: bassBoost.subCutoff,
							onChange: (e) => onBassBoostChange({
								...bassBoost,
								subCutoff: parseInt(e.target.value)
							}),
							className: "w-full accent-indigo-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 200,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 195,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 138,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 112,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "text-[10px] text-neutral-500 mt-3 pt-2 border-t border-neutral-800/60",
					children: "Protección de excursión y percepción en altavoces compactos."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 215,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 111,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg",
				children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center justify-between pb-2 border-b border-neutral-800 mb-3",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
							children: /* @__PURE__ */ _jsxDEV(Headphones, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 226,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 225,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
							className: "text-xs font-bold text-white uppercase tracking-wider",
							children: "3. Virtualizer Estéreo"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 229,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-[10px] text-neutral-400",
							children: "Escenario y crossfeed"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 232,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 228,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 224,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: () => onVirtualizerChange({
							...virtualizer,
							enabled: !virtualizer.enabled
						}),
						className: `p-1 rounded-md transition-colors ${virtualizer.enabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
						title: virtualizer.enabled ? "Módulo Activo" : "Módulo en Bypass",
						children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 244,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 235,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 223,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "space-y-3.5",
					children: [
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Amplitud Espacial:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 251,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-emerald-400",
								children: [virtualizer.intensity, "%"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 252,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 250,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "0",
							max: "100",
							step: "5",
							value: virtualizer.intensity,
							onChange: (e) => onVirtualizerChange({
								...virtualizer,
								intensity: parseInt(e.target.value)
							}),
							className: "w-full accent-emerald-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 256,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 249,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("span", {
							className: "text-xs text-neutral-400 block mb-1.5",
							children: "Perfil Acústico:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 270,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "grid grid-cols-3 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs",
							children: [
								"headphones",
								"speakers",
								"wide"
							].map((mode) => /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => onVirtualizerChange({
									...virtualizer,
									mode
								}),
								className: `py-1 rounded text-center font-medium capitalize transition-colors ${virtualizer.mode === mode ? "bg-neutral-800 text-emerald-300 font-bold" : "text-neutral-400 hover:text-white"}`,
								children: mode === "headphones" ? "Audífonos" : mode === "speakers" ? "Parlantes" : "Amplio"
							}, mode, false, {
								fileName: _jsxFileName,
								lineNumber: 273,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 271,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 269,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "p-2 rounded bg-neutral-950/60 border border-neutral-800/80 text-[11px] text-neutral-400",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-300 font-semibold",
								children: "Filtro Interaural:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 289,
								columnNumber: 15
							}, this), " Demora ITD de ~0.4ms con atenuación espectral HRTF a 3.2 kHz."]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 288,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 248,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 222,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "text-[10px] text-neutral-500 mt-3 pt-2 border-t border-neutral-800/60",
					children: "Matriz Mid/Side real con retardo interaural de fase natural."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 294,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 221,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between shadow-lg",
				children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center justify-between pb-2 border-b border-neutral-800 mb-3",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400",
							children: /* @__PURE__ */ _jsxDEV(Waves, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 305,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 304,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h4", {
							className: "text-xs font-bold text-white uppercase tracking-wider",
							children: "4. Controles de Tono"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 308,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-[10px] text-neutral-400",
							children: "Bass • Mid • Treble"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 311,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 307,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 303,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => onToneChange({
								...tone,
								bassDB: 0,
								midDB: 0,
								trebleDB: 0
							}),
							className: "p-1 rounded text-neutral-400 hover:text-white",
							title: "Restablecer Tono a 0 dB",
							children: /* @__PURE__ */ _jsxDEV(RotateCcw, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 320,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 315,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							onClick: () => onToneChange({
								...tone,
								enabled: !tone.enabled
							}),
							className: `p-1 rounded-md transition-colors ${tone.enabled ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-neutral-800 text-neutral-500 border border-neutral-700"}`,
							title: tone.enabled ? "Módulo Activo" : "Módulo en Bypass",
							children: /* @__PURE__ */ _jsxDEV(Power, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 331,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 322,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 314,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 302,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Graves (120 Hz Shelf):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 340,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-amber-400",
								children: [tone.bassDB > 0 ? `+${tone.bassDB.toFixed(1)}` : tone.bassDB.toFixed(1), " dB"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 341,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 339,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "-12",
							max: "12",
							step: "0.5",
							value: tone.bassDB,
							onChange: (e) => onToneChange({
								...tone,
								bassDB: parseFloat(e.target.value)
							}),
							className: "w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 345,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 338,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Medios (1 kHz Bell):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 361,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-amber-400",
								children: [tone.midDB > 0 ? `+${tone.midDB.toFixed(1)}` : tone.midDB.toFixed(1), " dB"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 362,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 360,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "-12",
							max: "12",
							step: "0.5",
							value: tone.midDB,
							onChange: (e) => onToneChange({
								...tone,
								midDB: parseFloat(e.target.value)
							}),
							className: "w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 366,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 359,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex justify-between text-xs mb-1",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Agudos (7.5 kHz Shelf):"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 382,
								columnNumber: 17
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono font-bold text-amber-400",
								children: [tone.trebleDB > 0 ? `+${tone.trebleDB.toFixed(1)}` : tone.trebleDB.toFixed(1), " dB"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 383,
								columnNumber: 17
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 381,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "-12",
							max: "12",
							step: "0.5",
							value: tone.trebleDB,
							onChange: (e) => onToneChange({
								...tone,
								trebleDB: parseFloat(e.target.value)
							}),
							className: "w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 387,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 380,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 336,
					columnNumber: 11
				}, this)] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 301,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "text-[10px] text-neutral-500 mt-3 pt-2 border-t border-neutral-800/60",
					children: "Tres etapas de filtrado analógico biquad en cascada."
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 402,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 300,
				columnNumber: 7
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 32,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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QWYsQ0FDRSx3QkFBQyxRQUFEO1FBQU0sV0FBVTtrQkFBbUI7T0FBNkI7Ozs7aUJBQ2hFLHdCQUFDLFFBQUQ7UUFBTSxXQUFVO2tCQUFoQixDQUNHLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxTQUFTLFFBQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxRQUFRLENBQUMsR0FBRSxLQUMzRTs7Ozs7ZUFDSDs7Ozs7Z0JBQ0wsd0JBQUMsU0FBRDtPQUNFLE1BQUs7T0FDTCxLQUFJO09BQ0osS0FBSTtPQUNKLE1BQUs7T0FDTCxPQUFPLEtBQUs7T0FDWixXQUFXLE1BQ1QsYUFBYTtRQUFFLEdBQUc7UUFBTSxVQUFVLFdBQVcsRUFBRSxPQUFPLEtBQUs7T0FBRSxDQUFDO09BRWhFLFdBQVU7TUFDWDs7OztjQUNFOzs7OztLQUNGOzs7OztZQUNGOzs7O2NBRUwsd0JBQUMsT0FBRDtLQUFLLFdBQVU7ZUFBd0U7SUFFbEY7Ozs7WUFDRjs7Ozs7O0VBQ0Y7Ozs7OztBQUVUIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIlRvbmVBbmRCYXNzU2VjdGlvbi50c3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIFByZUdhaW5Db25maWcsXG4gIEJhc3NCb29zdENvbmZpZyxcbiAgVmlydHVhbGl6ZXJDb25maWcsXG4gIFRvbmVDb250cm9sc0NvbmZpZyxcbn0gZnJvbSAnLi4vdHlwZXMvZHNwJztcbmltcG9ydCB7IFZvbHVtZTIsIFphcCwgSGVhZHBob25lcywgV2F2ZXMsIFJvdGF0ZUNjdywgUG93ZXIgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBwcmVHYWluOiBQcmVHYWluQ29uZmlnO1xuICBvblByZUdhaW5DaGFuZ2U6IChjZmc6IFByZUdhaW5Db25maWcpID0+IHZvaWQ7XG4gIHRvbmU6IFRvbmVDb250cm9sc0NvbmZpZztcbiAgb25Ub25lQ2hhbmdlOiAoY2ZnOiBUb25lQ29udHJvbHNDb25maWcpID0+IHZvaWQ7XG4gIGJhc3NCb29zdDogQmFzc0Jvb3N0Q29uZmlnO1xuICBvbkJhc3NCb29zdENoYW5nZTogKGNmZzogQmFzc0Jvb3N0Q29uZmlnKSA9PiB2b2lkO1xuICB2aXJ0dWFsaXplcjogVmlydHVhbGl6ZXJDb25maWc7XG4gIG9uVmlydHVhbGl6ZXJDaGFuZ2U6IChjZmc6IFZpcnR1YWxpemVyQ29uZmlnKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgVG9uZUFuZEJhc3NTZWN0aW9uOiBSZWFjdC5GQzxQcm9wcz4gPSAoe1xuICBwcmVHYWluLFxuICBvblByZUdhaW5DaGFuZ2UsXG4gIHRvbmUsXG4gIG9uVG9uZUNoYW5nZSxcbiAgYmFzc0Jvb3N0LFxuICBvbkJhc3NCb29zdENoYW5nZSxcbiAgdmlydHVhbGl6ZXIsXG4gIG9uVmlydHVhbGl6ZXJDaGFuZ2UsXG59KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0xIG1kOmdyaWQtY29scy0yIHhsOmdyaWQtY29scy00IGdhcC00XCI+XG4gICAgICB7LyogMS4gUHJlLUdhaW4gU3RhZ2UgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW5ldXRyYWwtOTAwLzkwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgcm91bmRlZC14bCBwLTQgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW4gc2hhZG93LWxnXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcGItMiBib3JkZXItYiBib3JkZXItbmV1dHJhbC04MDAgbWItM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMS41IHJvdW5kZWQtbGcgYmctc2t5LTUwMC8xMCBib3JkZXIgYm9yZGVyLXNreS01MDAvMzAgdGV4dC1za3ktNDAwXCI+XG4gICAgICAgICAgICAgICAgPFZvbHVtZTIgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIHVwcGVyY2FzZSB0cmFja2luZy13aWRlclwiPlxuICAgICAgICAgICAgICAgICAgMS4gUHJlLUdhaW4gJiBGYXNlXG4gICAgICAgICAgICAgICAgPC9oND5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LW5ldXRyYWwtNDAwXCI+Q2FsaWJyYWNpw7NuIGRlIGVudHJhZGE8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uUHJlR2FpbkNoYW5nZSh7IC4uLnByZUdhaW4sIGVuYWJsZWQ6ICFwcmVHYWluLmVuYWJsZWQgfSl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHAtMSByb3VuZGVkLW1kIHRyYW5zaXRpb24tY29sb3JzICR7XG4gICAgICAgICAgICAgICAgcHJlR2Fpbi5lbmFibGVkXG4gICAgICAgICAgICAgICAgICA/ICdiZy1za3ktNTAwLzIwIHRleHQtc2t5LTQwMCBib3JkZXIgYm9yZGVyLXNreS01MDAvNDAnXG4gICAgICAgICAgICAgICAgICA6ICdiZy1uZXV0cmFsLTgwMCB0ZXh0LW5ldXRyYWwtNTAwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICB0aXRsZT17cHJlR2Fpbi5lbmFibGVkID8gJ03Ds2R1bG8gQWN0aXZvJyA6ICdNw7NkdWxvIGVuIEJ5cGFzcyd9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxQb3dlciBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgbWItMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5HYW5hbmNpYSBkZSBFbnRyYWRhOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gZm9udC1ib2xkIHRleHQtc2t5LTQwMFwiPlxuICAgICAgICAgICAgICAgICAge3ByZUdhaW4uZ2FpbkRCID4gMCA/IGArJHtwcmVHYWluLmdhaW5EQi50b0ZpeGVkKDEpfWAgOiBwcmVHYWluLmdhaW5EQi50b0ZpeGVkKDEpfSBkQlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgbWluPVwiLTI0XCJcbiAgICAgICAgICAgICAgICBtYXg9XCIxMlwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3ByZUdhaW4uZ2FpbkRCfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgIG9uUHJlR2FpbkNoYW5nZSh7IC4uLnByZUdhaW4sIGdhaW5EQjogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGFjY2VudC1za3ktNDAwIGgtMS41IGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQtWzlweF0gZm9udC1tb25vIHRleHQtbmV1dHJhbC01MDAgbXQtMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuPi0yNCBkQjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj4wIGRCPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuPisxMiBkQjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcHQtMSBib3JkZXItdCBib3JkZXItbmV1dHJhbC04MDAvODBcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwXCI+SW52ZXJzacOzbiBkZSBGYXNlICgxODDCsCk6PC9zcGFuPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT5cbiAgICAgICAgICAgICAgICAgIG9uUHJlR2FpbkNoYW5nZSh7IC4uLnByZUdhaW4sIHBoYXNlSW52ZXJ0OiAhcHJlR2Fpbi5waGFzZUludmVydCB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0yLjUgcHktMSByb3VuZGVkIHRleHQteHMgZm9udC1tb25vIGZvbnQtc2VtaWJvbGQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICAgIHByZUdhaW4ucGhhc2VJbnZlcnRcbiAgICAgICAgICAgICAgICAgICAgPyAnYmctYW1iZXItNTAwLzIwIHRleHQtYW1iZXItMzAwIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzQwJ1xuICAgICAgICAgICAgICAgICAgICA6ICdiZy1uZXV0cmFsLTgwMCB0ZXh0LW5ldXRyYWwtNDAwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtwcmVHYWluLnBoYXNlSW52ZXJ0ID8gJzE4MMKwIChJbnZlcnRpZGEpJyA6ICcwwrAgKE5vcm1hbCknfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtbmV1dHJhbC01MDAgbXQtMyBwdC0yIGJvcmRlci10IGJvcmRlci1uZXV0cmFsLTgwMC82MFwiPlxuICAgICAgICAgIEFqdXN0ZSBsaW5lYWwgcHJldmlvIGEgbG9zIGJsb3F1ZXMgbm8gbGluZWFsZXMuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiAyLiBCYXNzIEJvb3N0IE1vZHVsZSAoSW5kZXBlbmRlbnQpICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTkwMC85MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHJvdW5kZWQteGwgcC00IGZsZXggZmxleC1jb2wganVzdGlmeS1iZXR3ZWVuIHNoYWRvdy1sZ1wiPlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIHBiLTIgYm9yZGVyLWIgYm9yZGVyLW5ldXRyYWwtODAwIG1iLTNcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTEuNSByb3VuZGVkLWxnIGJnLWluZGlnby01MDAvMTAgYm9yZGVyIGJvcmRlci1pbmRpZ28tNTAwLzMwIHRleHQtaW5kaWdvLTQwMFwiPlxuICAgICAgICAgICAgICAgIDxaYXAgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIHVwcGVyY2FzZSB0cmFja2luZy13aWRlclwiPlxuICAgICAgICAgICAgICAgICAgMi4gQmFzcyBCb29zdCAmIEFybcOzbmljb3NcbiAgICAgICAgICAgICAgICA8L2g0PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtbmV1dHJhbC00MDBcIj5SZWZ1ZXJ6byBwc2ljb2Fjw7pzdGljbzwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25CYXNzQm9vc3RDaGFuZ2UoeyAuLi5iYXNzQm9vc3QsIGVuYWJsZWQ6ICFiYXNzQm9vc3QuZW5hYmxlZCB9KX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcC0xIHJvdW5kZWQtbWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICBiYXNzQm9vc3QuZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgPyAnYmctaW5kaWdvLTUwMC8yMCB0ZXh0LWluZGlnby00MDAgYm9yZGVyIGJvcmRlci1pbmRpZ28tNTAwLzQwJ1xuICAgICAgICAgICAgICAgICAgOiAnYmctbmV1dHJhbC04MDAgdGV4dC1uZXV0cmFsLTUwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwJ1xuICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgdGl0bGU9e2Jhc3NCb29zdC5lbmFibGVkID8gJ03Ds2R1bG8gQWN0aXZvJyA6ICdNw7NkdWxvIGVuIEJ5cGFzcyd9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxQb3dlciBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgbWItMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5SZWFsY2UgZGUgQmFqb3M6PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1pbmRpZ28tNDAwXCI+XG4gICAgICAgICAgICAgICAgICAre2Jhc3NCb29zdC5ib29zdERCLnRvRml4ZWQoMSl9IGRCXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCIwXCJcbiAgICAgICAgICAgICAgICBtYXg9XCIxNVwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2Jhc3NCb29zdC5ib29zdERCfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgIG9uQmFzc0Jvb3N0Q2hhbmdlKHsgLi4uYmFzc0Jvb3N0LCBib29zdERCOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWluZGlnby00MDAgaC0xLjUgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIG1iLTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+RnJlY3VlbmNpYSBDZW50cmFsOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1pbmRpZ28tMzAwXCI+e2Jhc3NCb29zdC5mcmVxdWVuY3l9IEh6PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCI0MFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiMTQwXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiNVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e2Jhc3NCb29zdC5mcmVxdWVuY3l9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgb25CYXNzQm9vc3RDaGFuZ2UoeyAuLi5iYXNzQm9vc3QsIGZyZXF1ZW5jeTogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtaW5kaWdvLTQwMCBoLTEuNSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgbWItMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5FeGNpdGFkb3IgZGUgQXJtw7NuaWNvczo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtaW5kaWdvLTMwMFwiPntiYXNzQm9vc3QuaGFybW9uaWNzfSU8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjEwMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjVcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtiYXNzQm9vc3QuaGFybW9uaWNzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgIG9uQmFzc0Jvb3N0Q2hhbmdlKHsgLi4uYmFzc0Jvb3N0LCBoYXJtb25pY3M6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWluZGlnby00MDAgaC0xLjUgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIG1iLTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+RmlsdHJvIFN1YnPDs25pY28gSFBGOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1pbmRpZ28tMzAwXCI+e2Jhc3NCb29zdC5zdWJDdXRvZmZ9IEh6PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCIyMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiMzVcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIxXCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17YmFzc0Jvb3N0LnN1YkN1dG9mZn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICBvbkJhc3NCb29zdENoYW5nZSh7IC4uLmJhc3NCb29zdCwgc3ViQ3V0b2ZmOiBwYXJzZUludChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGFjY2VudC1pbmRpZ28tNDAwIGgtMS41IGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1uZXV0cmFsLTUwMCBtdC0zIHB0LTIgYm9yZGVyLXQgYm9yZGVyLW5ldXRyYWwtODAwLzYwXCI+XG4gICAgICAgICAgUHJvdGVjY2nDs24gZGUgZXhjdXJzacOzbiB5IHBlcmNlcGNpw7NuIGVuIGFsdGF2b2NlcyBjb21wYWN0b3MuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiAzLiBWaXJ0dWFsaXplciAmIFN0ZXJlbyBXaWRlbmluZyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctbmV1dHJhbC05MDAvOTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCByb3VuZGVkLXhsIHAtNCBmbGV4IGZsZXgtY29sIGp1c3RpZnktYmV0d2VlbiBzaGFkb3ctbGdcIj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBwYi0yIGJvcmRlci1iIGJvcmRlci1uZXV0cmFsLTgwMCBtYi0zXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0xLjUgcm91bmRlZC1sZyBiZy1lbWVyYWxkLTUwMC8xMCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNTAwLzMwIHRleHQtZW1lcmFsZC00MDBcIj5cbiAgICAgICAgICAgICAgICA8SGVhZHBob25lcyBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtd2hpdGUgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVyXCI+XG4gICAgICAgICAgICAgICAgICAzLiBWaXJ0dWFsaXplciBFc3TDqXJlb1xuICAgICAgICAgICAgICAgIDwvaDQ+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1uZXV0cmFsLTQwMFwiPkVzY2VuYXJpbyB5IGNyb3NzZmVlZDwvcD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25WaXJ0dWFsaXplckNoYW5nZSh7IC4uLnZpcnR1YWxpemVyLCBlbmFibGVkOiAhdmlydHVhbGl6ZXIuZW5hYmxlZCB9KX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcC0xIHJvdW5kZWQtbWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICB2aXJ0dWFsaXplci5lbmFibGVkXG4gICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTUwMC8yMCB0ZXh0LWVtZXJhbGQtNDAwIGJvcmRlciBib3JkZXItZW1lcmFsZC01MDAvNDAnXG4gICAgICAgICAgICAgICAgICA6ICdiZy1uZXV0cmFsLTgwMCB0ZXh0LW5ldXRyYWwtNTAwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICB0aXRsZT17dmlydHVhbGl6ZXIuZW5hYmxlZCA/ICdNw7NkdWxvIEFjdGl2bycgOiAnTcOzZHVsbyBlbiBCeXBhc3MnfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UG93ZXIgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktMy41XCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgbWItMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5BbXBsaXR1ZCBFc3BhY2lhbDo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LWVtZXJhbGQtNDAwXCI+XG4gICAgICAgICAgICAgICAgICB7dmlydHVhbGl6ZXIuaW50ZW5zaXR5fSVcbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgICAgICB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICAgIG1heD1cIjEwMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjVcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXt2aXJ0dWFsaXplci5pbnRlbnNpdHl9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgb25WaXJ0dWFsaXplckNoYW5nZSh7IC4uLnZpcnR1YWxpemVyLCBpbnRlbnNpdHk6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWVtZXJhbGQtNDAwIGgtMS41IGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTQwMCBibG9jayBtYi0xLjVcIj5QZXJmaWwgQWPDunN0aWNvOjwvc3Bhbj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0zIGdhcC0xIGJnLW5ldXRyYWwtOTUwIHAtMSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgdGV4dC14c1wiPlxuICAgICAgICAgICAgICAgIHsoWydoZWFkcGhvbmVzJywgJ3NwZWFrZXJzJywgJ3dpZGUnXSBhcyBjb25zdCkubWFwKChtb2RlKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIGtleT17bW9kZX1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25WaXJ0dWFsaXplckNoYW5nZSh7IC4uLnZpcnR1YWxpemVyLCBtb2RlIH0pfVxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweS0xIHJvdW5kZWQgdGV4dC1jZW50ZXIgZm9udC1tZWRpdW0gY2FwaXRhbGl6ZSB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgICAgICAgIHZpcnR1YWxpemVyLm1vZGUgPT09IG1vZGVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLW5ldXRyYWwtODAwIHRleHQtZW1lcmFsZC0zMDAgZm9udC1ib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAndGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LXdoaXRlJ1xuICAgICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge21vZGUgPT09ICdoZWFkcGhvbmVzJyA/ICdBdWTDrWZvbm9zJyA6IG1vZGUgPT09ICdzcGVha2VycycgPyAnUGFybGFudGVzJyA6ICdBbXBsaW8nfVxuICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yIHJvdW5kZWQgYmctbmV1dHJhbC05NTAvNjAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMC84MCB0ZXh0LVsxMXB4XSB0ZXh0LW5ldXRyYWwtNDAwXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC0zMDAgZm9udC1zZW1pYm9sZFwiPkZpbHRybyBJbnRlcmF1cmFsOjwvc3Bhbj4gRGVtb3JhIElURCBkZSB+MC40bXMgY29uIGF0ZW51YWNpw7NuIGVzcGVjdHJhbCBIUlRGIGEgMy4yIGtIei5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIHRleHQtbmV1dHJhbC01MDAgbXQtMyBwdC0yIGJvcmRlci10IGJvcmRlci1uZXV0cmFsLTgwMC82MFwiPlxuICAgICAgICAgIE1hdHJpeiBNaWQvU2lkZSByZWFsIGNvbiByZXRhcmRvIGludGVyYXVyYWwgZGUgZmFzZSBuYXR1cmFsLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogNC4gVG9uZSBDb250cm9scyAoQmFzcyAvIE1pZCAvIFRyZWJsZSkgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW5ldXRyYWwtOTAwLzkwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgcm91bmRlZC14bCBwLTQgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW4gc2hhZG93LWxnXCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gcGItMiBib3JkZXItYiBib3JkZXItbmV1dHJhbC04MDAgbWItM1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMS41IHJvdW5kZWQtbGcgYmctYW1iZXItNTAwLzEwIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzMwIHRleHQtYW1iZXItNDAwXCI+XG4gICAgICAgICAgICAgICAgPFdhdmVzIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8aDQgY2xhc3NOYW1lPVwidGV4dC14cyBmb250LWJvbGQgdGV4dC13aGl0ZSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDQuIENvbnRyb2xlcyBkZSBUb25vXG4gICAgICAgICAgICAgICAgPC9oND5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LW5ldXRyYWwtNDAwXCI+QmFzcyDigKIgTWlkIOKAoiBUcmVibGU8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCI+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblRvbmVDaGFuZ2UoeyAuLi50b25lLCBiYXNzREI6IDAsIG1pZERCOiAwLCB0cmVibGVEQjogMCB9KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEgcm91bmRlZCB0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtd2hpdGVcIlxuICAgICAgICAgICAgICAgIHRpdGxlPVwiUmVzdGFibGVjZXIgVG9ubyBhIDAgZEJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPFJvdGF0ZUNjdyBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25Ub25lQ2hhbmdlKHsgLi4udG9uZSwgZW5hYmxlZDogIXRvbmUuZW5hYmxlZCB9KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BwLTEgcm91bmRlZC1tZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgICAgdG9uZS5lbmFibGVkXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLWFtYmVyLTUwMC8yMCB0ZXh0LWFtYmVyLTQwMCBib3JkZXIgYm9yZGVyLWFtYmVyLTUwMC80MCdcbiAgICAgICAgICAgICAgICAgICAgOiAnYmctbmV1dHJhbC04MDAgdGV4dC1uZXV0cmFsLTUwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwJ1xuICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgIHRpdGxlPXt0b25lLmVuYWJsZWQgPyAnTcOzZHVsbyBBY3Rpdm8nIDogJ03Ds2R1bG8gZW4gQnlwYXNzJ31cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxQb3dlciBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxuICAgICAgICAgICAgey8qIEJhc3MgKDEyMCBIeiBMb3cgU2hlbGYpICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIG1iLTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+R3JhdmVzICgxMjAgSHogU2hlbGYpOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gZm9udC1ib2xkIHRleHQtYW1iZXItNDAwXCI+XG4gICAgICAgICAgICAgICAgICB7dG9uZS5iYXNzREIgPiAwID8gYCske3RvbmUuYmFzc0RCLnRvRml4ZWQoMSl9YCA6IHRvbmUuYmFzc0RCLnRvRml4ZWQoMSl9IGRCXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCItMTJcIlxuICAgICAgICAgICAgICAgIG1heD1cIjEyXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC41XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17dG9uZS5iYXNzREJ9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgb25Ub25lQ2hhbmdlKHsgLi4udG9uZSwgYmFzc0RCOiBwYXJzZUZsb2F0KGUudGFyZ2V0LnZhbHVlKSB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgYWNjZW50LWFtYmVyLTQwMCBoLTEuNSBiZy1uZXV0cmFsLTgwMCByb3VuZGVkLWxnIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogTWlkICgxMDAwIEh6IFBlYWtpbmcpICovfVxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIG1iLTFcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+TWVkaW9zICgxIGtIeiBCZWxsKTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LWFtYmVyLTQwMFwiPlxuICAgICAgICAgICAgICAgICAge3RvbmUubWlkREIgPiAwID8gYCske3RvbmUubWlkREIudG9GaXhlZCgxKX1gIDogdG9uZS5taWREQi50b0ZpeGVkKDEpfSBkQlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgbWluPVwiLTEyXCJcbiAgICAgICAgICAgICAgICBtYXg9XCIxMlwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgdmFsdWU9e3RvbmUubWlkREJ9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PlxuICAgICAgICAgICAgICAgICAgb25Ub25lQ2hhbmdlKHsgLi4udG9uZSwgbWlkREI6IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhY2NlbnQtYW1iZXItNDAwIGgtMS41IGJnLW5ldXRyYWwtODAwIHJvdW5kZWQtbGcgY3Vyc29yLXBvaW50ZXJcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIHsvKiBUcmVibGUgKDcuNSBrSHogSGlnaCBTaGVsZikgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIHRleHQteHMgbWItMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5BZ3Vkb3MgKDcuNSBrSHogU2hlbGYpOjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gZm9udC1ib2xkIHRleHQtYW1iZXItNDAwXCI+XG4gICAgICAgICAgICAgICAgICB7dG9uZS50cmVibGVEQiA+IDAgPyBgKyR7dG9uZS50cmVibGVEQi50b0ZpeGVkKDEpfWAgOiB0b25lLnRyZWJsZURCLnRvRml4ZWQoMSl9IGRCXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCItMTJcIlxuICAgICAgICAgICAgICAgIG1heD1cIjEyXCJcbiAgICAgICAgICAgICAgICBzdGVwPVwiMC41XCJcbiAgICAgICAgICAgICAgICB2YWx1ZT17dG9uZS50cmVibGVEQn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICBvblRvbmVDaGFuZ2UoeyAuLi50b25lLCB0cmVibGVEQjogcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSkgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGFjY2VudC1hbWJlci00MDAgaC0xLjUgYmctbmV1dHJhbC04MDAgcm91bmRlZC1sZyBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LW5ldXRyYWwtNTAwIG10LTMgcHQtMiBib3JkZXItdCBib3JkZXItbmV1dHJhbC04MDAvNjBcIj5cbiAgICAgICAgICBUcmVzIGV0YXBhcyBkZSBmaWx0cmFkbyBhbmFsw7NnaWNvIGJpcXVhZCBlbiBjYXNjYWRhLlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdfQ==