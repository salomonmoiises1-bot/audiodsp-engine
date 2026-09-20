const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { Sliders, RotateCcw, ArrowUpDown, ChevronLeft, ChevronRight } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/Equalizer32Section.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const Equalizer32Section = ({ bands, onBandChange, onResetFlat, onInvertCurve, selectedBandIndex, onSelectBandIndex }) => {
	const [activeOctaveGroup, setActiveOctaveGroup] = useState("all");
	// Groupings for convenience if user wants to zoom into regions
	// Bass: Bands 0 to 10 (20 Hz - 200 Hz)
	// Mid: Bands 11 to 21 (250 Hz - 2.5 kHz)
	// High: Bands 22 to 31 (3.15 kHz - 20 kHz)
	const filteredBands = bands.filter((_, idx) => {
		if (activeOctaveGroup === "bass") return idx <= 10;
		if (activeOctaveGroup === "mid") return idx >= 11 && idx <= 21;
		if (activeOctaveGroup === "high") return idx >= 22;
		return true;
	});
	const getBandCategoryColor = (freq) => {
		if (freq < 60) return "text-purple-400 border-purple-500/40 bg-purple-950/20";
		if (freq < 250) return "text-indigo-400 border-indigo-500/40 bg-indigo-950/20";
		if (freq < 1e3) return "text-sky-400 border-sky-500/40 bg-sky-950/20";
		if (freq < 4e3) return "text-emerald-400 border-emerald-500/40 bg-emerald-950/20";
		if (freq < 1e4) return "text-amber-400 border-amber-500/40 bg-amber-950/20";
		return "text-rose-400 border-rose-500/40 bg-rose-950/20";
	};
	const getSliderAccent = (gain) => {
		if (gain > 0) return "accent-emerald-400";
		if (gain < 0) return "accent-sky-400";
		return "accent-neutral-500";
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg",
		children: [
			/* @__PURE__ */ _jsxDEV("div", {
				className: "flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-neutral-800",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
						children: /* @__PURE__ */ _jsxDEV(Sliders, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 56,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 55,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("h3", {
							className: "text-sm font-bold text-white tracking-tight",
							children: "Ecualizador Gráfico Real de 32 Bandas (ISO 1/3 Octava)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							className: "px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-emerald-400 border border-neutral-700",
							children: "32 FILTROS BIQUAD RBJ"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 63,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 59,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("p", {
						className: "text-[11px] text-neutral-400 mt-0.5",
						children: "Frecuencias fijas normalizadas ISO 266 (20 Hz - 20 kHz) • Q = 4.318 • Rango: -15.0 dB a +15.0 dB"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 13
					}, this)] }, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 58,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 54,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex rounded-lg bg-neutral-950 border border-neutral-800 p-0.5 text-xs font-medium",
							children: [
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => setActiveOctaveGroup("all"),
									className: `px-2.5 py-1 rounded transition-colors ${activeOctaveGroup === "all" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-white"}`,
									children: "Todas (32)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 77,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => setActiveOctaveGroup("bass"),
									className: `px-2 py-1 rounded transition-colors ${activeOctaveGroup === "bass" ? "bg-indigo-900/60 text-indigo-200 font-semibold" : "text-neutral-400 hover:text-white"}`,
									children: "Graves (20-200Hz)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 85,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => setActiveOctaveGroup("mid"),
									className: `px-2 py-1 rounded transition-colors ${activeOctaveGroup === "mid" ? "bg-emerald-900/60 text-emerald-200 font-semibold" : "text-neutral-400 hover:text-white"}`,
									children: "Medios (250-2.5kHz)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 93,
									columnNumber: 13
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: () => setActiveOctaveGroup("high"),
									className: `px-2 py-1 rounded transition-colors ${activeOctaveGroup === "high" ? "bg-amber-900/60 text-amber-200 font-semibold" : "text-neutral-400 hover:text-white"}`,
									children: "Agudos (3.15k-20kHz)"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 101,
									columnNumber: 13
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: onInvertCurve,
							className: "px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center gap-1",
							title: "Invertir ganancias de todas las bandas (+/-)",
							children: [/* @__PURE__ */ _jsxDEV(ArrowUpDown, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 117,
								columnNumber: 13
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "hidden sm:inline",
								children: "Invertir"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 118,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: onResetFlat,
							className: "px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center gap-1",
							title: "Restablecer todas las 32 bandas a 0 dB",
							children: [/* @__PURE__ */ _jsxDEV(RotateCcw, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 127,
								columnNumber: 13
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Reset Flat" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 128,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 74,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 53,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "w-full overflow-x-auto pb-2 pt-1 scrollbar-thin",
				children: /* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-end gap-1.5 sm:gap-2 min-w-[960px] px-1 justify-between",
					children: filteredBands.map((band) => {
						const isSelected = selectedBandIndex === band.index;
						const categoryBadge = getBandCategoryColor(band.frequency);
						return /* @__PURE__ */ _jsxDEV("div", {
							onClick: () => onSelectBandIndex(band.index),
							className: `flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-all border ${isSelected ? "bg-neutral-800/90 border-emerald-500 shadow-md shadow-emerald-500/10" : "bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/40"} w-[26px] sm:w-[28px] md:w-[32px]`,
							children: [
								/* @__PURE__ */ _jsxDEV("span", {
									className: `text-[10px] font-mono font-bold leading-none ${band.gain > 0 ? "text-emerald-400" : band.gain < 0 ? "text-sky-400" : "text-neutral-500"}`,
									children: band.gain > 0 ? `+${band.gain.toFixed(1)}` : band.gain === 0 ? "0" : band.gain.toFixed(1)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 151,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "h-44 sm:h-52 flex items-center justify-center relative py-1",
									children: [/* @__PURE__ */ _jsxDEV("div", { className: "absolute top-1/2 left-0 right-0 h-px bg-neutral-700 pointer-events-none z-0" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 166,
										columnNumber: 19
									}, this), /* @__PURE__ */ _jsxDEV("input", {
										type: "range",
										min: "-15",
										max: "15",
										step: "0.5",
										value: band.gain,
										onChange: (e) => onBandChange({
											...band,
											gain: parseFloat(e.target.value)
										}),
										className: `w-36 sm:w-44 h-1.5 -rotate-90 origin-center cursor-pointer ${getSliderAccent(band.gain)} z-10`
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 167,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 164,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("button", {
									onClick: (e) => {
										e.stopPropagation();
										onBandChange({
											...band,
											gain: 0
										});
									},
									className: `text-[9px] px-1 py-0.5 rounded font-mono transition-colors ${band.gain !== 0 ? "bg-neutral-800 hover:bg-neutral-700 text-neutral-300" : "text-neutral-600 hover:text-neutral-400"}`,
									title: `Restablecer banda ${band.label}Hz a 0 dB`,
									children: "0"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 186,
									columnNumber: 17
								}, this),
								/* @__PURE__ */ _jsxDEV("div", {
									className: "flex flex-col items-center gap-0.5 mt-0.5",
									children: [/* @__PURE__ */ _jsxDEV("span", {
										className: `text-[10px] font-bold font-mono text-center tracking-tighter ${categoryBadge}`,
										children: band.label
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 203,
										columnNumber: 19
									}, this), /* @__PURE__ */ _jsxDEV("span", {
										className: "text-[8px] font-mono text-neutral-500",
										children: ["#", band.index + 1]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 206,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 202,
									columnNumber: 17
								}, this)
							]
						}, band.id, true, {
							fileName: _jsxFileName,
							lineNumber: 141,
							columnNumber: 15
						}, this);
					})
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 135,
					columnNumber: 9
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 134,
				columnNumber: 7
			}, this),
			selectedBandIndex !== null && bands[selectedBandIndex] && /* @__PURE__ */ _jsxDEV("div", {
				className: "bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ _jsxDEV("span", {
							className: "font-semibold text-white",
							children: [
								"Banda #",
								selectedBandIndex + 1,
								" (",
								bands[selectedBandIndex].frequency,
								" Hz):"
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 220,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "Ganancia:"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 224,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("input", {
									type: "number",
									min: "-15",
									max: "15",
									step: "0.1",
									value: bands[selectedBandIndex].gain,
									onChange: (e) => onBandChange({
										...bands[selectedBandIndex],
										gain: parseFloat(e.target.value) || 0
									}),
									className: "w-16 px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 font-mono text-emerald-400 text-center font-bold"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 225,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-400",
									children: "dB"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 239,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 223,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ _jsxDEV("span", {
								className: "text-neutral-400",
								children: "Factor Q:"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 243,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("span", {
								className: "font-mono text-neutral-200",
								children: [bands[selectedBandIndex].q.toFixed(3), " (1/3 Octava)"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 244,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 242,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 219,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => onSelectBandIndex(Math.max(0, selectedBandIndex - 1)),
							disabled: selectedBandIndex === 0,
							className: "p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30",
							title: "Banda anterior",
							children: /* @__PURE__ */ _jsxDEV(ChevronLeft, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 257,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 251,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("span", {
							className: "font-mono text-neutral-400 text-[11px]",
							children: [selectedBandIndex + 1, " de 32"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 259,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => onSelectBandIndex(Math.min(31, selectedBandIndex + 1)),
							disabled: selectedBandIndex === 31,
							className: "p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30",
							title: "Banda siguiente",
							children: /* @__PURE__ */ _jsxDEV(ChevronRight, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 268,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 262,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 250,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 218,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 51,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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TUFDaEM7Ozs7O01BQ1Isd0JBQUMsUUFBRDtPQUFNLFdBQVU7aUJBQWhCLENBQ0csb0JBQW9CLEdBQUUsUUFDbkI7Ozs7OztNQUNOLHdCQUFDLFVBQUQ7T0FDRSxlQUFlLGtCQUFrQixLQUFLLElBQUksSUFBSSxvQkFBb0IsQ0FBQyxDQUFDO09BQ3BFLFVBQVUsc0JBQXNCO09BQ2hDLFdBQVU7T0FDVixPQUFNO2lCQUVOLHdCQUFDLGNBQUQsRUFBYyxXQUFVLGNBQWU7Ozs7O01BQ2pDOzs7OztLQUNMOzs7OztZQUNGOzs7Ozs7RUFFSjs7Ozs7O0FBRVQiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiRXF1YWxpemVyMzJTZWN0aW9uLnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBFUTMyQmFuZCB9IGZyb20gJy4uL3R5cGVzL2RzcCc7XG5pbXBvcnQgeyBTbGlkZXJzLCBSb3RhdGVDY3csIEFycm93VXBEb3duLCBDaGV2cm9uTGVmdCwgQ2hldnJvblJpZ2h0IH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgYmFuZHM6IEVRMzJCYW5kW107XG4gIG9uQmFuZENoYW5nZTogKGJhbmQ6IEVRMzJCYW5kKSA9PiB2b2lkO1xuICBvblJlc2V0RmxhdDogKCkgPT4gdm9pZDtcbiAgb25JbnZlcnRDdXJ2ZTogKCkgPT4gdm9pZDtcbiAgc2VsZWN0ZWRCYW5kSW5kZXg6IG51bWJlciB8IG51bGw7XG4gIG9uU2VsZWN0QmFuZEluZGV4OiAoaW5kZXg6IG51bWJlcikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEVxdWFsaXplcjMyU2VjdGlvbjogUmVhY3QuRkM8UHJvcHM+ID0gKHtcbiAgYmFuZHMsXG4gIG9uQmFuZENoYW5nZSxcbiAgb25SZXNldEZsYXQsXG4gIG9uSW52ZXJ0Q3VydmUsXG4gIHNlbGVjdGVkQmFuZEluZGV4LFxuICBvblNlbGVjdEJhbmRJbmRleCxcbn0pID0+IHtcbiAgY29uc3QgW2FjdGl2ZU9jdGF2ZUdyb3VwLCBzZXRBY3RpdmVPY3RhdmVHcm91cF0gPSB1c2VTdGF0ZTwnYWxsJyB8ICdiYXNzJyB8ICdtaWQnIHwgJ2hpZ2gnPignYWxsJyk7XG5cbiAgLy8gR3JvdXBpbmdzIGZvciBjb252ZW5pZW5jZSBpZiB1c2VyIHdhbnRzIHRvIHpvb20gaW50byByZWdpb25zXG4gIC8vIEJhc3M6IEJhbmRzIDAgdG8gMTAgKDIwIEh6IC0gMjAwIEh6KVxuICAvLyBNaWQ6IEJhbmRzIDExIHRvIDIxICgyNTAgSHogLSAyLjUga0h6KVxuICAvLyBIaWdoOiBCYW5kcyAyMiB0byAzMSAoMy4xNSBrSHogLSAyMCBrSHopXG4gIGNvbnN0IGZpbHRlcmVkQmFuZHMgPSBiYW5kcy5maWx0ZXIoKF8sIGlkeCkgPT4ge1xuICAgIGlmIChhY3RpdmVPY3RhdmVHcm91cCA9PT0gJ2Jhc3MnKSByZXR1cm4gaWR4IDw9IDEwO1xuICAgIGlmIChhY3RpdmVPY3RhdmVHcm91cCA9PT0gJ21pZCcpIHJldHVybiBpZHggPj0gMTEgJiYgaWR4IDw9IDIxO1xuICAgIGlmIChhY3RpdmVPY3RhdmVHcm91cCA9PT0gJ2hpZ2gnKSByZXR1cm4gaWR4ID49IDIyO1xuICAgIHJldHVybiB0cnVlO1xuICB9KTtcblxuICBjb25zdCBnZXRCYW5kQ2F0ZWdvcnlDb2xvciA9IChmcmVxOiBudW1iZXIpID0+IHtcbiAgICBpZiAoZnJlcSA8IDYwKSByZXR1cm4gJ3RleHQtcHVycGxlLTQwMCBib3JkZXItcHVycGxlLTUwMC80MCBiZy1wdXJwbGUtOTUwLzIwJzsgLy8gU3ViLUJhc3NcbiAgICBpZiAoZnJlcSA8IDI1MCkgcmV0dXJuICd0ZXh0LWluZGlnby00MDAgYm9yZGVyLWluZGlnby01MDAvNDAgYmctaW5kaWdvLTk1MC8yMCc7IC8vIEJhc3NcbiAgICBpZiAoZnJlcSA8IDEwMDApIHJldHVybiAndGV4dC1za3ktNDAwIGJvcmRlci1za3ktNTAwLzQwIGJnLXNreS05NTAvMjAnOyAvLyBMb3ctTWlkXG4gICAgaWYgKGZyZXEgPCA0MDAwKSByZXR1cm4gJ3RleHQtZW1lcmFsZC00MDAgYm9yZGVyLWVtZXJhbGQtNTAwLzQwIGJnLWVtZXJhbGQtOTUwLzIwJzsgLy8gTWlkXG4gICAgaWYgKGZyZXEgPCAxMDAwMCkgcmV0dXJuICd0ZXh0LWFtYmVyLTQwMCBib3JkZXItYW1iZXItNTAwLzQwIGJnLWFtYmVyLTk1MC8yMCc7IC8vIEhpZ2gtTWlkIC8gUHJlc2VuY2VcbiAgICByZXR1cm4gJ3RleHQtcm9zZS00MDAgYm9yZGVyLXJvc2UtNTAwLzQwIGJnLXJvc2UtOTUwLzIwJzsgLy8gQnJpbGxpYW5jZSAmIEFpclxuICB9O1xuXG4gIGNvbnN0IGdldFNsaWRlckFjY2VudCA9IChnYWluOiBudW1iZXIpID0+IHtcbiAgICBpZiAoZ2FpbiA+IDApIHJldHVybiAnYWNjZW50LWVtZXJhbGQtNDAwJztcbiAgICBpZiAoZ2FpbiA8IDApIHJldHVybiAnYWNjZW50LXNreS00MDAnO1xuICAgIHJldHVybiAnYWNjZW50LW5ldXRyYWwtNTAwJztcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctbmV1dHJhbC05MDAvOTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCByb3VuZGVkLXhsIHAtNCBmbGV4IGZsZXgtY29sIGdhcC0zIHNoYWRvdy1sZ1wiPlxuICAgICAgey8qIEhlYWRlciBiYXIgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC13cmFwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTMgcGItMi41IGJvcmRlci1iIGJvcmRlci1uZXV0cmFsLTgwMFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTEuNSByb3VuZGVkLWxnIGJnLWVtZXJhbGQtNTAwLzEwIGJvcmRlciBib3JkZXItZW1lcmFsZC01MDAvMzAgdGV4dC1lbWVyYWxkLTQwMFwiPlxuICAgICAgICAgICAgPFNsaWRlcnMgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1ib2xkIHRleHQtd2hpdGUgdHJhY2tpbmctdGlnaHRcIj5cbiAgICAgICAgICAgICAgICBFY3VhbGl6YWRvciBHcsOhZmljbyBSZWFsIGRlIDMyIEJhbmRhcyAoSVNPIDEvMyBPY3RhdmEpXG4gICAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB4LTIgcHktMC41IHJvdW5kZWQgdGV4dC1bMTBweF0gZm9udC1tb25vIGZvbnQtYm9sZCBiZy1uZXV0cmFsLTgwMCB0ZXh0LWVtZXJhbGQtNDAwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDBcIj5cbiAgICAgICAgICAgICAgICAzMiBGSUxUUk9TIEJJUVVBRCBSQkpcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVsxMXB4XSB0ZXh0LW5ldXRyYWwtNDAwIG10LTAuNVwiPlxuICAgICAgICAgICAgICBGcmVjdWVuY2lhcyBmaWphcyBub3JtYWxpemFkYXMgSVNPIDI2NiAoMjAgSHogLSAyMCBrSHopIOKAoiBRID0gNC4zMTgg4oCiIFJhbmdvOiAtMTUuMCBkQiBhICsxNS4wIGRCXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBBY3Rpb24gYnV0dG9ucyAmIFpvb20gZmlsdGVycyAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICB7LyogWm9vbSB0YWJzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCByb3VuZGVkLWxnIGJnLW5ldXRyYWwtOTUwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgcC0wLjUgdGV4dC14cyBmb250LW1lZGl1bVwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVPY3RhdmVHcm91cCgnYWxsJyl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTIuNSBweS0xIHJvdW5kZWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICBhY3RpdmVPY3RhdmVHcm91cCA9PT0gJ2FsbCcgPyAnYmctbmV1dHJhbC04MDAgdGV4dC13aGl0ZSBmb250LXNlbWlib2xkJyA6ICd0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtd2hpdGUnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBUb2RhcyAoMzIpXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlT2N0YXZlR3JvdXAoJ2Jhc3MnKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMiBweS0xIHJvdW5kZWQgdHJhbnNpdGlvbi1jb2xvcnMgJHtcbiAgICAgICAgICAgICAgICBhY3RpdmVPY3RhdmVHcm91cCA9PT0gJ2Jhc3MnID8gJ2JnLWluZGlnby05MDAvNjAgdGV4dC1pbmRpZ28tMjAwIGZvbnQtc2VtaWJvbGQnIDogJ3RleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEdyYXZlcyAoMjAtMjAwSHopXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlT2N0YXZlR3JvdXAoJ21pZCcpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0yIHB5LTEgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgIGFjdGl2ZU9jdGF2ZUdyb3VwID09PSAnbWlkJyA/ICdiZy1lbWVyYWxkLTkwMC82MCB0ZXh0LWVtZXJhbGQtMjAwIGZvbnQtc2VtaWJvbGQnIDogJ3RleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIE1lZGlvcyAoMjUwLTIuNWtIeilcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVPY3RhdmVHcm91cCgnaGlnaCcpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0yIHB5LTEgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgIGFjdGl2ZU9jdGF2ZUdyb3VwID09PSAnaGlnaCcgPyAnYmctYW1iZXItOTAwLzYwIHRleHQtYW1iZXItMjAwIGZvbnQtc2VtaWJvbGQnIDogJ3RleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEFndWRvcyAoMy4xNWstMjBrSHopXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBJbnZlcnQgY3VydmUgKi99XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25JbnZlcnRDdXJ2ZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0xLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtbWVkaXVtIGJnLW5ldXRyYWwtOTUwIGhvdmVyOmJnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC0zMDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiXG4gICAgICAgICAgICB0aXRsZT1cIkludmVydGlyIGdhbmFuY2lhcyBkZSB0b2RhcyBsYXMgYmFuZGFzICgrLy0pXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8QXJyb3dVcERvd24gY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuIHNtOmlubGluZVwiPkludmVydGlyPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgey8qIFJlc2V0IGFsbCB0byBGbGF0ICgwIGRCKSAqL31cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXtvblJlc2V0RmxhdH1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0xLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtbWVkaXVtIGJnLW5ldXRyYWwtOTUwIGhvdmVyOmJnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC0zMDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCB0cmFuc2l0aW9uLWNvbG9ycyBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiXG4gICAgICAgICAgICB0aXRsZT1cIlJlc3RhYmxlY2VyIHRvZGFzIGxhcyAzMiBiYW5kYXMgYSAwIGRCXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8Um90YXRlQ2N3IGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz5cbiAgICAgICAgICAgIDxzcGFuPlJlc2V0IEZsYXQ8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiAzMi1TbGlkZXIgSG9yaXpvbnRhbCBGYWRlciBSYWNrICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgb3ZlcmZsb3cteC1hdXRvIHBiLTIgcHQtMSBzY3JvbGxiYXItdGhpblwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtZW5kIGdhcC0xLjUgc206Z2FwLTIgbWluLXctWzk2MHB4XSBweC0xIGp1c3RpZnktYmV0d2VlblwiPlxuICAgICAgICAgIHtmaWx0ZXJlZEJhbmRzLm1hcCgoYmFuZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHNlbGVjdGVkQmFuZEluZGV4ID09PSBiYW5kLmluZGV4O1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlCYWRnZSA9IGdldEJhbmRDYXRlZ29yeUNvbG9yKGJhbmQuZnJlcXVlbmN5KTtcblxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGtleT17YmFuZC5pZH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdEJhbmRJbmRleChiYW5kLmluZGV4KX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtMS41IHAtMS41IHJvdW5kZWQtbGcgdHJhbnNpdGlvbi1hbGwgYm9yZGVyICR7XG4gICAgICAgICAgICAgICAgICBpc1NlbGVjdGVkXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLW5ldXRyYWwtODAwLzkwIGJvcmRlci1lbWVyYWxkLTUwMCBzaGFkb3ctbWQgc2hhZG93LWVtZXJhbGQtNTAwLzEwJ1xuICAgICAgICAgICAgICAgICAgICA6ICdiZy1uZXV0cmFsLTk1MC82MCBib3JkZXItbmV1dHJhbC04MDAvODAgaG92ZXI6YmctbmV1dHJhbC04MDAvNDAnXG4gICAgICAgICAgICAgICAgfSB3LVsyNnB4XSBzbTp3LVsyOHB4XSBtZDp3LVszMnB4XWB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7LyogR2FpbiBSZWFkb3V0ICovfVxuICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LVsxMHB4XSBmb250LW1vbm8gZm9udC1ib2xkIGxlYWRpbmctbm9uZSAke1xuICAgICAgICAgICAgICAgICAgICBiYW5kLmdhaW4gPiAwXG4gICAgICAgICAgICAgICAgICAgICAgPyAndGV4dC1lbWVyYWxkLTQwMCdcbiAgICAgICAgICAgICAgICAgICAgICA6IGJhbmQuZ2FpbiA8IDBcbiAgICAgICAgICAgICAgICAgICAgICA/ICd0ZXh0LXNreS00MDAnXG4gICAgICAgICAgICAgICAgICAgICAgOiAndGV4dC1uZXV0cmFsLTUwMCdcbiAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtiYW5kLmdhaW4gPiAwID8gYCske2JhbmQuZ2Fpbi50b0ZpeGVkKDEpfWAgOiBiYW5kLmdhaW4gPT09IDAgPyAnMCcgOiBiYW5kLmdhaW4udG9GaXhlZCgxKX1cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG5cbiAgICAgICAgICAgICAgICB7LyogVmVydGljYWwgRmFkZXIgU2xpZGVyICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaC00NCBzbTpoLTUyIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHJlbGF0aXZlIHB5LTFcIj5cbiAgICAgICAgICAgICAgICAgIHsvKiBaZXJvIGRCIHJlZmVyZW5jZSBsaW5lICovfVxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMS8yIGxlZnQtMCByaWdodC0wIGgtcHggYmctbmV1dHJhbC03MDAgcG9pbnRlci1ldmVudHMtbm9uZSB6LTBcIiAvPlxuICAgICAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgIG1pbj1cIi0xNVwiXG4gICAgICAgICAgICAgICAgICAgIG1heD1cIjE1XCJcbiAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjAuNVwiXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtiYW5kLmdhaW59XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICBvbkJhbmRDaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uYmFuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhaW46IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy0zNiBzbTp3LTQ0IGgtMS41IC1yb3RhdGUtOTAgb3JpZ2luLWNlbnRlciBjdXJzb3ItcG9pbnRlciAke2dldFNsaWRlckFjY2VudChcbiAgICAgICAgICAgICAgICAgICAgICBiYW5kLmdhaW5cbiAgICAgICAgICAgICAgICAgICAgKX0gei0xMGB9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgey8qIFJlc2V0IHRvIDAgZEIgaW5kaXZpZHVhbCBidXR0b24gKi99XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICAgICAgb25CYW5kQ2hhbmdlKHsgLi4uYmFuZCwgZ2FpbjogMCB9KTtcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LVs5cHhdIHB4LTEgcHktMC41IHJvdW5kZWQgZm9udC1tb25vIHRyYW5zaXRpb24tY29sb3JzICR7XG4gICAgICAgICAgICAgICAgICAgIGJhbmQuZ2FpbiAhPT0gMFxuICAgICAgICAgICAgICAgICAgICAgID8gJ2JnLW5ldXRyYWwtODAwIGhvdmVyOmJnLW5ldXRyYWwtNzAwIHRleHQtbmV1dHJhbC0zMDAnXG4gICAgICAgICAgICAgICAgICAgICAgOiAndGV4dC1uZXV0cmFsLTYwMCBob3Zlcjp0ZXh0LW5ldXRyYWwtNDAwJ1xuICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICB0aXRsZT17YFJlc3RhYmxlY2VyIGJhbmRhICR7YmFuZC5sYWJlbH1IeiBhIDAgZEJgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIHsvKiBCYW5kIEluZGV4ICYgRnJlcXVlbmN5IExhYmVsICovfVxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgZ2FwLTAuNSBtdC0wLjVcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YHRleHQtWzEwcHhdIGZvbnQtYm9sZCBmb250LW1vbm8gdGV4dC1jZW50ZXIgdHJhY2tpbmctdGlnaHRlciAke2NhdGVnb3J5QmFkZ2V9YH0+XG4gICAgICAgICAgICAgICAgICAgIHtiYW5kLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOHB4XSBmb250LW1vbm8gdGV4dC1uZXV0cmFsLTUwMFwiPlxuICAgICAgICAgICAgICAgICAgICAje2JhbmQuaW5kZXggKyAxfVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTZWxlY3RlZCBCYW5kIEluc3BlY3RvciBkZXRhaWxzICovfVxuICAgICAge3NlbGVjdGVkQmFuZEluZGV4ICE9PSBudWxsICYmIGJhbmRzW3NlbGVjdGVkQmFuZEluZGV4XSAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctbmV1dHJhbC05NTAgcC0yLjUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIGZsZXggZmxleC13cmFwIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gZ2FwLTMgdGV4dC14c1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgICBCYW5kYSAje3NlbGVjdGVkQmFuZEluZGV4ICsgMX0gKHtiYW5kc1tzZWxlY3RlZEJhbmRJbmRleF0uZnJlcXVlbmN5fSBIeik6XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5HYW5hbmNpYTo8L3NwYW4+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxuICAgICAgICAgICAgICAgIG1pbj1cIi0xNVwiXG4gICAgICAgICAgICAgICAgbWF4PVwiMTVcIlxuICAgICAgICAgICAgICAgIHN0ZXA9XCIwLjFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtiYW5kc1tzZWxlY3RlZEJhbmRJbmRleF0uZ2Fpbn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+XG4gICAgICAgICAgICAgICAgICBvbkJhbmRDaGFuZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAuLi5iYW5kc1tzZWxlY3RlZEJhbmRJbmRleF0sXG4gICAgICAgICAgICAgICAgICAgIGdhaW46IHBhcnNlRmxvYXQoZS50YXJnZXQudmFsdWUpIHx8IDAsXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTE2IHB4LTEuNSBweS0wLjUgcm91bmRlZCBiZy1uZXV0cmFsLTkwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIGZvbnQtbW9ubyB0ZXh0LWVtZXJhbGQtNDAwIHRleHQtY2VudGVyIGZvbnQtYm9sZFwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5kQjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC00MDBcIj5GYWN0b3IgUTo8L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtbW9ubyB0ZXh0LW5ldXRyYWwtMjAwXCI+XG4gICAgICAgICAgICAgICAge2JhbmRzW3NlbGVjdGVkQmFuZEluZGV4XS5xLnRvRml4ZWQoMyl9ICgxLzMgT2N0YXZhKVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3RCYW5kSW5kZXgoTWF0aC5tYXgoMCwgc2VsZWN0ZWRCYW5kSW5kZXggLSAxKSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzZWxlY3RlZEJhbmRJbmRleCA9PT0gMH1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicC0xIHJvdW5kZWQgYmctbmV1dHJhbC05MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCB0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtd2hpdGUgZGlzYWJsZWQ6b3BhY2l0eS0zMFwiXG4gICAgICAgICAgICAgIHRpdGxlPVwiQmFuZGEgYW50ZXJpb3JcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8Q2hldnJvbkxlZnQgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1uZXV0cmFsLTQwMCB0ZXh0LVsxMXB4XVwiPlxuICAgICAgICAgICAgICB7c2VsZWN0ZWRCYW5kSW5kZXggKyAxfSBkZSAzMlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdEJhbmRJbmRleChNYXRoLm1pbigzMSwgc2VsZWN0ZWRCYW5kSW5kZXggKyAxKSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzZWxlY3RlZEJhbmRJbmRleCA9PT0gMzF9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMSByb3VuZGVkIGJnLW5ldXRyYWwtOTAwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIGRpc2FibGVkOm9wYWNpdHktMzBcIlxuICAgICAgICAgICAgICB0aXRsZT1cIkJhbmRhIHNpZ3VpZW50ZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxDaGV2cm9uUmlnaHQgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0=