const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { AlertCircle, Cpu } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/MeterBridge.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
function ampToDB(amp) {
	if (amp <= 1e-5) return -60;
	const db = 20 * Math.log10(amp);
	return Math.max(-60, Math.min(6, db));
}
function dbToPercent(db) {
	// -60 dB to 0 dB mapped to 0% to 100%
	const clamped = Math.max(-60, Math.min(0, db));
	return (clamped + 60) / 60 * 100;
}
export const MeterBridge = ({ telemetry }) => {
	const peakL_DB = ampToDB(telemetry.outputPeakL);
	const peakR_DB = ampToDB(telemetry.outputPeakR);
	const rmsL_DB = ampToDB(telemetry.outputRMSL);
	const rmsR_DB = ampToDB(telemetry.outputRMSR);
	const pctPeakL = dbToPercent(peakL_DB);
	const pctPeakR = dbToPercent(peakR_DB);
	const pctRMSL = dbToPercent(rmsL_DB);
	const pctRMSR = dbToPercent(rmsR_DB);
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg",
		children: [/* @__PURE__ */ _jsxDEV("div", {
			className: "flex-1 flex flex-col gap-2",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ _jsxDEV("span", {
						className: "text-xs font-semibold text-white",
						children: "Vúmetro Estéreo de Salida (True Peak & RMS)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 38,
						columnNumber: 13
					}, this), telemetry.isClipping && /* @__PURE__ */ _jsxDEV("span", {
						className: "flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold animate-pulse",
						children: [/* @__PURE__ */ _jsxDEV(AlertCircle, { className: "w-3 h-3 text-rose-400" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 17
						}, this), "CLIPPING DETECTADO"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 40,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 37,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-2 text-[10px] font-mono text-neutral-400",
					children: [
						/* @__PURE__ */ _jsxDEV("span", { children: [
							"L: ",
							peakL_DB.toFixed(1),
							" dBFS"
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 48,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("span", { children: "|" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("span", { children: [
							"R: ",
							peakR_DB.toFixed(1),
							" dBFS"
						] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 50,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 47,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 36,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "flex flex-col gap-1.5 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ _jsxDEV("span", {
								className: "w-3 text-[10px] font-mono font-bold text-neutral-400",
								children: "L"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 58,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex-1 h-3.5 bg-neutral-900 rounded overflow-hidden relative border border-neutral-800",
								children: [
									/* @__PURE__ */ _jsxDEV("div", {
										className: "absolute top-0 bottom-0 left-0 bg-emerald-600 transition-all duration-75",
										style: { width: `${pctRMSL}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 61,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 opacity-90 transition-all duration-75",
										style: { width: `${pctPeakL}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 66,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "absolute inset-0 flex justify-between pointer-events-none px-1",
										children: [
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-800/80" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 72,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-800/80" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 73,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-800/80" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 74,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-700" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 75,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 71,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 59,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { className: `w-2.5 h-2.5 rounded-full border transition-colors ${peakL_DB >= -.1 ? "bg-rose-500 border-rose-300 shadow-sm shadow-rose-500" : "bg-neutral-800 border-neutral-700"}` }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 79,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 57,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ _jsxDEV("span", {
								className: "w-3 text-[10px] font-mono font-bold text-neutral-400",
								children: "R"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 88,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("div", {
								className: "flex-1 h-3.5 bg-neutral-900 rounded overflow-hidden relative border border-neutral-800",
								children: [
									/* @__PURE__ */ _jsxDEV("div", {
										className: "absolute top-0 bottom-0 left-0 bg-emerald-600 transition-all duration-75",
										style: { width: `${pctRMSR}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 91,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 opacity-90 transition-all duration-75",
										style: { width: `${pctPeakR}%` }
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 96,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("div", {
										className: "absolute inset-0 flex justify-between pointer-events-none px-1",
										children: [
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-800/80" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 102,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-800/80" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 103,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-800/80" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 104,
												columnNumber: 17
											}, this),
											/* @__PURE__ */ _jsxDEV("span", { className: "w-px h-full bg-neutral-700" }, void 0, false, {
												fileName: _jsxFileName,
												lineNumber: 105,
												columnNumber: 17
											}, this)
										]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 101,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 89,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("div", { className: `w-2.5 h-2.5 rounded-full border transition-colors ${peakR_DB >= -.1 ? "bg-rose-500 border-rose-300 shadow-sm shadow-rose-500" : "bg-neutral-800 border-neutral-700"}` }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 109,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 87,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "flex justify-between text-[9px] font-mono text-neutral-500 px-5",
						children: [
							/* @__PURE__ */ _jsxDEV("span", { children: "-60 dB" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 118,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("span", { children: "-36 dB" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 119,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("span", { children: "-18 dB" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 120,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("span", { children: "-6 dB" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 121,
								columnNumber: 13
							}, this),
							/* @__PURE__ */ _jsxDEV("span", {
								className: "text-rose-400 font-bold",
								children: "0 dBFS"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 122,
								columnNumber: 13
							}, this)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 117,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 55,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 35,
			columnNumber: 7
		}, this), /* @__PURE__ */ _jsxDEV("div", {
			className: "bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex flex-col justify-between gap-2 min-w-[260px]",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center justify-between text-xs pb-1.5 border-b border-neutral-900",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-1.5 text-neutral-300 font-semibold",
					children: [/* @__PURE__ */ _jsxDEV(Cpu, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 131,
						columnNumber: 13
					}, this), "Telemetría PCM DSP"]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 130,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("span", {
					className: `px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${telemetry.state === "running" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-neutral-800 text-neutral-400"}`,
					children: telemetry.state.toUpperCase()
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 134,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 129,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", {
				className: "grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono",
				children: [
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-500",
						children: "Sample Rate:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 146,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-200 text-right",
						children: [telemetry.sampleRate.toLocaleString(), " Hz"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 147,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-500",
						children: "Formato PCM:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 149,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-emerald-400 text-right font-bold",
						children: "32-Bit Float"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 150,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-500",
						children: "Canales:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 152,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-200 text-right",
						children: [telemetry.channels, " (Estéreo I/O)"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 153,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-500",
						children: "Latencia Base:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 155,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-200 text-right",
						children: [(telemetry.baseLatency * 1e3).toFixed(1), " ms"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 156,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-500",
						children: "Búfer Frame:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 158,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("div", {
						className: "text-neutral-200 text-right",
						children: [telemetry.bufferSize, " samples"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 159,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 145,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 128,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 33,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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Z0JBQWYsQ0FBOEMsVUFBVSxXQUFXLGVBQWUsR0FBRSxLQUFROzs7Ozs7S0FFNUYsd0JBQUMsT0FBRDtNQUFLLFdBQVU7Z0JBQW1CO0tBQWlCOzs7OztLQUNuRCx3QkFBQyxPQUFEO01BQUssV0FBVTtnQkFBd0M7S0FBaUI7Ozs7O0tBRXhFLHdCQUFDLE9BQUQ7TUFBSyxXQUFVO2dCQUFtQjtLQUFhOzs7OztLQUMvQyx3QkFBQyxPQUFEO01BQUssV0FBVTtnQkFBZixDQUE4QyxVQUFVLFVBQVMsZ0JBQW1COzs7Ozs7S0FFcEYsd0JBQUMsT0FBRDtNQUFLLFdBQVU7Z0JBQW1CO0tBQW1COzs7OztLQUNyRCx3QkFBQyxPQUFEO01BQUssV0FBVTtnQkFBZixFQUErQyxVQUFVLGNBQWMsSUFBSSxDQUFFLFFBQVEsQ0FBQyxHQUFFLEtBQVE7Ozs7OztLQUVoRyx3QkFBQyxPQUFEO01BQUssV0FBVTtnQkFBbUI7S0FBaUI7Ozs7O0tBQ25ELHdCQUFDLE9BQUQ7TUFBSyxXQUFVO2dCQUFmLENBQThDLFVBQVUsWUFBVyxVQUFhOzs7Ozs7SUFDN0U7Ozs7O1dBQ0Y7Ozs7O1VBQ0Y7Ozs7OztBQUVUIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIk1ldGVyQnJpZGdlLnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXVkaW9UZWxlbWV0cnkgfSBmcm9tICcuLi90eXBlcy9kc3AnO1xuaW1wb3J0IHsgQWxlcnRDaXJjbGUsIENwdSwgTGF5ZXJzIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgdGVsZW1ldHJ5OiBBdWRpb1RlbGVtZXRyeTtcbn1cblxuZnVuY3Rpb24gYW1wVG9EQihhbXA6IG51bWJlcik6IG51bWJlciB7XG4gIGlmIChhbXAgPD0gMC4wMDAwMSkgcmV0dXJuIC02MDtcbiAgY29uc3QgZGIgPSAyMCAqIE1hdGgubG9nMTAoYW1wKTtcbiAgcmV0dXJuIE1hdGgubWF4KC02MCwgTWF0aC5taW4oNiwgZGIpKTtcbn1cblxuZnVuY3Rpb24gZGJUb1BlcmNlbnQoZGI6IG51bWJlcik6IG51bWJlciB7XG4gIC8vIC02MCBkQiB0byAwIGRCIG1hcHBlZCB0byAwJSB0byAxMDAlXG4gIGNvbnN0IGNsYW1wZWQgPSBNYXRoLm1heCgtNjAsIE1hdGgubWluKDAsIGRiKSk7XG4gIHJldHVybiAoKGNsYW1wZWQgKyA2MCkgLyA2MCkgKiAxMDA7XG59XG5cbmV4cG9ydCBjb25zdCBNZXRlckJyaWRnZTogUmVhY3QuRkM8UHJvcHM+ID0gKHsgdGVsZW1ldHJ5IH0pID0+IHtcbiAgY29uc3QgcGVha0xfREIgPSBhbXBUb0RCKHRlbGVtZXRyeS5vdXRwdXRQZWFrTCk7XG4gIGNvbnN0IHBlYWtSX0RCID0gYW1wVG9EQih0ZWxlbWV0cnkub3V0cHV0UGVha1IpO1xuICBjb25zdCBybXNMX0RCID0gYW1wVG9EQih0ZWxlbWV0cnkub3V0cHV0Uk1TTCk7XG4gIGNvbnN0IHJtc1JfREIgPSBhbXBUb0RCKHRlbGVtZXRyeS5vdXRwdXRSTVNSKTtcblxuICBjb25zdCBwY3RQZWFrTCA9IGRiVG9QZXJjZW50KHBlYWtMX0RCKTtcbiAgY29uc3QgcGN0UGVha1IgPSBkYlRvUGVyY2VudChwZWFrUl9EQik7XG4gIGNvbnN0IHBjdFJNU0wgPSBkYlRvUGVyY2VudChybXNMX0RCKTtcbiAgY29uc3QgcGN0Uk1TUiA9IGRiVG9QZXJjZW50KHJtc1JfREIpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTkwMC85MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHJvdW5kZWQteGwgcC00IGZsZXggZmxleC1jb2wgbWQ6ZmxleC1yb3cgaXRlbXMtc3RyZXRjaCBtZDppdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC00IHNoYWRvdy1sZ1wiPlxuICAgICAgey8qIFN0ZXJlbyBMZXZlbCBNZXRlcnMgKEwgJiBSKSAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIGZsZXggZmxleC1jb2wgZ2FwLTJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZVwiPlbDum1ldHJvIEVzdMOpcmVvIGRlIFNhbGlkYSAoVHJ1ZSBQZWFrICYgUk1TKTwvc3Bhbj5cbiAgICAgICAgICAgIHt0ZWxlbWV0cnkuaXNDbGlwcGluZyAmJiAoXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHB4LTEuNSBweS0wLjUgcm91bmRlZCBiZy1yb3NlLTUwMC8yMCB0ZXh0LXJvc2UtMzAwIGJvcmRlciBib3JkZXItcm9zZS01MDAvNDAgdGV4dC1bMTBweF0gZm9udC1ib2xkIGFuaW1hdGUtcHVsc2VcIj5cbiAgICAgICAgICAgICAgICA8QWxlcnRDaXJjbGUgY2xhc3NOYW1lPVwidy0zIGgtMyB0ZXh0LXJvc2UtNDAwXCIgLz5cbiAgICAgICAgICAgICAgICBDTElQUElORyBERVRFQ1RBRE9cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1bMTBweF0gZm9udC1tb25vIHRleHQtbmV1dHJhbC00MDBcIj5cbiAgICAgICAgICAgIDxzcGFuPkw6IHtwZWFrTF9EQi50b0ZpeGVkKDEpfSBkQkZTPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+fDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPlI6IHtwZWFrUl9EQi50b0ZpeGVkKDEpfSBkQkZTPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogTWV0ZXJzIERpc3BsYXkgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBnYXAtMS41IGJnLW5ldXRyYWwtOTUwIHAtMi41IHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMFwiPlxuICAgICAgICAgIHsvKiBMZWZ0IENoYW5uZWwgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0zIHRleHQtWzEwcHhdIGZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1uZXV0cmFsLTQwMFwiPkw8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBoLTMuNSBiZy1uZXV0cmFsLTkwMCByb3VuZGVkIG92ZXJmbG93LWhpZGRlbiByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwXCI+XG4gICAgICAgICAgICAgIHsvKiBSTVMgZmlsbCAoRGFya2VyIEdyZWVuKSAqL31cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIGJvdHRvbS0wIGxlZnQtMCBiZy1lbWVyYWxkLTYwMCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi03NVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke3BjdFJNU0x9JWAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgey8qIFBlYWsgZmlsbCAoQnJpZ2h0IEVtZXJhbGQgLyBBbWJlciAvIFJlZCBncmFkaWVudCkgKi99XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMCBib3R0b20tMCBsZWZ0LTAgYmctZ3JhZGllbnQtdG8tciBmcm9tLWVtZXJhbGQtNTAwIHZpYS1hbWJlci00MDAgdG8tcm9zZS01MDAgb3BhY2l0eS05MCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi03NVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke3BjdFBlYWtMfSVgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIHsvKiBSZWZlcmVuY2Ugc2NhbGUgbm90Y2hlcyAqL31cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGZsZXgganVzdGlmeS1iZXR3ZWVuIHBvaW50ZXItZXZlbnRzLW5vbmUgcHgtMVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctcHggaC1mdWxsIGJnLW5ldXRyYWwtODAwLzgwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctcHggaC1mdWxsIGJnLW5ldXRyYWwtODAwLzgwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctcHggaC1mdWxsIGJnLW5ldXRyYWwtODAwLzgwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctcHggaC1mdWxsIGJnLW5ldXRyYWwtNzAwXCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgey8qIENsaXAgaW5kaWNhdG9yIExFRCAqL31cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy0yLjUgaC0yLjUgcm91bmRlZC1mdWxsIGJvcmRlciB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgIHBlYWtMX0RCID49IC0wLjEgPyAnYmctcm9zZS01MDAgYm9yZGVyLXJvc2UtMzAwIHNoYWRvdy1zbSBzaGFkb3ctcm9zZS01MDAnIDogJ2JnLW5ldXRyYWwtODAwIGJvcmRlci1uZXV0cmFsLTcwMCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFJpZ2h0IENoYW5uZWwgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy0zIHRleHQtWzEwcHhdIGZvbnQtbW9ubyBmb250LWJvbGQgdGV4dC1uZXV0cmFsLTQwMFwiPlI8L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBoLTMuNSBiZy1uZXV0cmFsLTkwMCByb3VuZGVkIG92ZXJmbG93LWhpZGRlbiByZWxhdGl2ZSBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwXCI+XG4gICAgICAgICAgICAgIHsvKiBSTVMgZmlsbCAqL31cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIGJvdHRvbS0wIGxlZnQtMCBiZy1lbWVyYWxkLTYwMCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi03NVwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IGAke3BjdFJNU1J9JWAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgey8qIFBlYWsgZmlsbCAqL31cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIGJvdHRvbS0wIGxlZnQtMCBiZy1ncmFkaWVudC10by1yIGZyb20tZW1lcmFsZC01MDAgdmlhLWFtYmVyLTQwMCB0by1yb3NlLTUwMCBvcGFjaXR5LTkwIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTc1XCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogYCR7cGN0UGVha1J9JWAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgey8qIFJlZmVyZW5jZSBzY2FsZSBub3RjaGVzICovfVxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgZmxleCBqdXN0aWZ5LWJldHdlZW4gcG9pbnRlci1ldmVudHMtbm9uZSBweC0xXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy1weCBoLWZ1bGwgYmctbmV1dHJhbC04MDAvODBcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy1weCBoLWZ1bGwgYmctbmV1dHJhbC04MDAvODBcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy1weCBoLWZ1bGwgYmctbmV1dHJhbC04MDAvODBcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidy1weCBoLWZ1bGwgYmctbmV1dHJhbC03MDBcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7LyogQ2xpcCBpbmRpY2F0b3IgTEVEICovfVxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LTIuNSBoLTIuNSByb3VuZGVkLWZ1bGwgYm9yZGVyIHRyYW5zaXRpb24tY29sb3JzICR7XG4gICAgICAgICAgICAgICAgcGVha1JfREIgPj0gLTAuMSA/ICdiZy1yb3NlLTUwMCBib3JkZXItcm9zZS0zMDAgc2hhZG93LXNtIHNoYWRvdy1yb3NlLTUwMCcgOiAnYmctbmV1dHJhbC04MDAgYm9yZGVyLW5ldXRyYWwtNzAwJ1xuICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogU2NhbGUgbGFiZWxzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC1bOXB4XSBmb250LW1vbm8gdGV4dC1uZXV0cmFsLTUwMCBweC01XCI+XG4gICAgICAgICAgICA8c3Bhbj4tNjAgZEI8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj4tMzYgZEI8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj4tMTggZEI8L3NwYW4+XG4gICAgICAgICAgICA8c3Bhbj4tNiBkQjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtcm9zZS00MDAgZm9udC1ib2xkXCI+MCBkQkZTPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogUmVhbC1UaW1lIEF1ZGlvIFRlbGVtZXRyeSAmIFBDTSBGb3JtYXQgU3BlY3MgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW5ldXRyYWwtOTUwIHAtMyByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTIgbWluLXctWzI2MHB4XVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiB0ZXh0LXhzIHBiLTEuNSBib3JkZXItYiBib3JkZXItbmV1dHJhbC05MDBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdGV4dC1uZXV0cmFsLTMwMCBmb250LXNlbWlib2xkXCI+XG4gICAgICAgICAgICA8Q3B1IGNsYXNzTmFtZT1cInctMy41IGgtMy41IHRleHQtZW1lcmFsZC00MDBcIiAvPlxuICAgICAgICAgICAgVGVsZW1ldHLDrWEgUENNIERTUFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9e2BweC0xLjUgcHktMC41IHJvdW5kZWQgdGV4dC1bMTBweF0gZm9udC1tb25vIGZvbnQtYm9sZCAke1xuICAgICAgICAgICAgICB0ZWxlbWV0cnkuc3RhdGUgPT09ICdydW5uaW5nJ1xuICAgICAgICAgICAgICAgID8gJ2JnLWVtZXJhbGQtNTAwLzIwIHRleHQtZW1lcmFsZC00MDAgYm9yZGVyIGJvcmRlci1lbWVyYWxkLTUwMC8zMCdcbiAgICAgICAgICAgICAgICA6ICdiZy1uZXV0cmFsLTgwMCB0ZXh0LW5ldXRyYWwtNDAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3RlbGVtZXRyeS5zdGF0ZS50b1VwcGVyQ2FzZSgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC14LTMgZ2FwLXktMSB0ZXh0LVsxMXB4XSBmb250LW1vbm9cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC01MDBcIj5TYW1wbGUgUmF0ZTo8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC0yMDAgdGV4dC1yaWdodFwiPnt0ZWxlbWV0cnkuc2FtcGxlUmF0ZS50b0xvY2FsZVN0cmluZygpfSBIejwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNTAwXCI+Rm9ybWF0byBQQ006PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtNDAwIHRleHQtcmlnaHQgZm9udC1ib2xkXCI+MzItQml0IEZsb2F0PC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC01MDBcIj5DYW5hbGVzOjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTIwMCB0ZXh0LXJpZ2h0XCI+e3RlbGVtZXRyeS5jaGFubmVsc30gKEVzdMOpcmVvIEkvTyk8L2Rpdj5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTUwMFwiPkxhdGVuY2lhIEJhc2U6PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwIHRleHQtcmlnaHRcIj57KHRlbGVtZXRyeS5iYXNlTGF0ZW5jeSAqIDEwMDApLnRvRml4ZWQoMSl9IG1zPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbmV1dHJhbC01MDBcIj5Cw7pmZXIgRnJhbWU6PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMjAwIHRleHQtcmlnaHRcIj57dGVsZW1ldHJ5LmJ1ZmZlclNpemV9IHNhbXBsZXM8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0=