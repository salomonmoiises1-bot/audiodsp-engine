const React = __vite__cjsImport0_react;const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { Power, Info, Sliders, ShieldCheck, ToggleLeft, ToggleRight, Download } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/Header.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const Header = ({ isEngineActive, onToggleEngine, onOpenAndroidAudit, onOpenTestSuite, onOpenZipDownload, masterBypass, onToggleMasterBypass, sampleRate }) => {
	return /* @__PURE__ */ _jsxDEV("header", {
		className: "bg-neutral-950/80 backdrop-blur border-b border-neutral-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30",
		children: [/* @__PURE__ */ _jsxDEV("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20",
				children: /* @__PURE__ */ _jsxDEV(Sliders, { className: "w-5 h-5" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 30,
					columnNumber: 11
				}, this)
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 29,
				columnNumber: 9
			}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ _jsxDEV("h1", {
					className: "text-base font-bold text-white tracking-tight leading-none",
					children: "AudioDSP Engine Pro"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 34,
					columnNumber: 13
				}, this), /* @__PURE__ */ _jsxDEV("span", {
					className: "px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-emerald-400 border border-neutral-700 font-mono",
					children: "32-BIT FLOAT • 32 BANDS"
				}, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 37,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 33,
				columnNumber: 11
			}, this), /* @__PURE__ */ _jsxDEV("p", {
				className: "text-[11px] text-neutral-400 mt-0.5",
				children: "Procesador de Audio Digital por Software para Android & Formatos PCM"
			}, void 0, false, {
				fileName: _jsxFileName,
				lineNumber: 41,
				columnNumber: 11
			}, this)] }, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 32,
				columnNumber: 9
			}, this)]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 28,
			columnNumber: 7
		}, this), /* @__PURE__ */ _jsxDEV("div", {
			className: "flex flex-wrap items-center gap-2.5",
			children: [
				/* @__PURE__ */ _jsxDEV("div", {
					className: "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400",
					children: [/* @__PURE__ */ _jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 51,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: sampleRate > 0 ? `${sampleRate.toLocaleString()} Hz` : "48,000 Hz" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 52,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 50,
					columnNumber: 9
				}, this),
				isEngineActive && /* @__PURE__ */ _jsxDEV("button", {
					onClick: onToggleMasterBypass,
					className: `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${masterBypass ? "bg-amber-500/20 text-amber-300 border-amber-500/50" : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white"}`,
					title: "Bypass Maestro (desactiva todo el procesamiento manteniendo el audio activo)",
					children: [masterBypass ? /* @__PURE__ */ _jsxDEV(ToggleRight, { className: "w-4 h-4 text-amber-400" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 29
					}, this) : /* @__PURE__ */ _jsxDEV(ToggleLeft, { className: "w-4 h-4 text-neutral-500" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 66,
						columnNumber: 82
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: masterBypass ? "Bypass Maestro: ON" : "Bypass Maestro: OFF" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 67,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 57,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ _jsxDEV("button", {
					onClick: onOpenTestSuite,
					className: "px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 transition-colors shadow-sm",
					children: [
						/* @__PURE__ */ _jsxDEV(ShieldCheck, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 76,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("span", {
							className: "hidden md:inline",
							children: "Validación DSP (38 Tests)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 77,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("span", {
							className: "md:hidden",
							children: "Tests"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 78,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 72,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("button", {
					onClick: onOpenAndroidAudit,
					className: "px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors shadow-sm",
					children: [
						/* @__PURE__ */ _jsxDEV(Info, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 86,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("span", {
							className: "hidden md:inline",
							children: "Android 14 (API 34) & C++"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 87,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("span", {
							className: "md:hidden",
							children: "Android 14"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 88,
							columnNumber: 11
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 82,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("button", {
					onClick: onOpenZipDownload,
					className: "px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 transition-colors shadow-sm active:scale-95",
					title: "Descargar código fuente en archivo ZIP directamente a tu celular",
					children: [/* @__PURE__ */ _jsxDEV(Download, { className: "w-3.5 h-3.5 text-emerald-400" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Descargar ZIP" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 98,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 92,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("button", {
					onClick: onToggleEngine,
					className: `px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md ${isEngineActive ? masterBypass ? "bg-amber-500/20 text-amber-300 border border-amber-500/50" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-400 border border-neutral-700"}`,
					children: [/* @__PURE__ */ _jsxDEV(Power, { className: "w-4 h-4" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 112,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("span", { children: isEngineActive ? masterBypass ? "DSP BYPASS" : "DSP ACTIVO" : "INICIAR MOTOR" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 113,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 102,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 48,
			columnNumber: 7
		}, this)]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 26,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsT0FBTyxNQUFNLFNBQVMsYUFBYSxZQUFZLGFBQWEsZ0JBQWdCOzs7QUFhckYsT0FBTyxNQUFNLFVBQTJCLEVBQ3RDLGdCQUNBLGdCQUNBLG9CQUNBLGlCQUNBLG1CQUNBLGNBQ0Esc0JBQ0EsaUJBQ0k7Q0FDSixPQUNFLHdCQUFDLFVBQUQ7RUFBUSxXQUFVO1lBQWxCLENBRUUsd0JBQUMsT0FBRDtHQUFLLFdBQVU7YUFBZixDQUNFLHdCQUFDLE9BQUQ7SUFBSyxXQUFVO2NBQ2Isd0JBQUMsU0FBRCxFQUFTLFdBQVUsVUFBVzs7Ozs7R0FDM0I7Ozs7YUFDTCx3QkFBQyxPQUFELGFBQ0Usd0JBQUMsT0FBRDtJQUFLLFdBQVU7Y0FBZixDQUNFLHdCQUFDLE1BQUQ7S0FBSSxXQUFVO2VBQTZEO0lBRXZFOzs7O2NBQ0osd0JBQUMsUUFBRDtLQUFNLFdBQVU7ZUFBa0g7SUFFNUg7Ozs7WUFDSDs7Ozs7YUFDTCx3QkFBQyxLQUFEO0lBQUcsV0FBVTtjQUFzQztHQUVoRDs7OztXQUNBOzs7O1dBQ0Y7Ozs7O1lBR0wsd0JBQUMsT0FBRDtHQUFLLFdBQVU7YUFBZjtJQUVFLHdCQUFDLE9BQUQ7S0FBSyxXQUFVO2VBQWYsQ0FDRSx3QkFBQyxRQUFELEVBQU0sV0FBVSx3REFBOEQ7Ozs7ZUFDOUUsd0JBQUMsUUFBRCxZQUFPLGFBQWEsSUFBSSxHQUFHLFdBQVcsZUFBZSxFQUFFLE9BQU8sWUFBa0I7Ozs7YUFDN0U7Ozs7OztJQUdKLGtCQUNDLHdCQUFDLFVBQUQ7S0FDRSxTQUFTO0tBQ1QsV0FBVyxtR0FDVCxlQUNJLHVEQUNBO0tBRU4sT0FBTTtlQVBSLENBU0csZUFBZSx3QkFBQyxhQUFELEVBQWEsV0FBVSx5QkFBMEI7Ozs7Z0JBQUksd0JBQUMsWUFBRCxFQUFZLFdBQVUsMkJBQTRCOzs7O2VBQ3ZILHdCQUFDLFFBQUQsWUFBTyxlQUFlLHVCQUF1QixzQkFBNEI7Ozs7YUFDbkU7Ozs7OztJQUlWLHdCQUFDLFVBQUQ7S0FDRSxTQUFTO0tBQ1QsV0FBVTtlQUZaO01BSUUsd0JBQUMsYUFBRCxFQUFhLFdBQVUsY0FBZTs7Ozs7TUFDdEMsd0JBQUMsUUFBRDtPQUFNLFdBQVU7aUJBQW1CO01BQStCOzs7OztNQUNsRSx3QkFBQyxRQUFEO09BQU0sV0FBVTtpQkFBWTtNQUFXOzs7OztLQUNqQzs7Ozs7O0lBR1Isd0JBQUMsVUFBRDtLQUNFLFNBQVM7S0FDVCxXQUFVO2VBRlo7TUFJRSx3QkFBQyxNQUFELEVBQU0sV0FBVSxjQUFlOzs7OztNQUMvQix3QkFBQyxRQUFEO09BQU0sV0FBVTtpQkFBbUI7TUFBK0I7Ozs7O01BQ2xFLHdCQUFDLFFBQUQ7T0FBTSxXQUFVO2lCQUFZO01BQWdCOzs7OztLQUN0Qzs7Ozs7O0lBR1Isd0JBQUMsVUFBRDtLQUNFLFNBQVM7S0FDVCxXQUFVO0tBQ1YsT0FBTTtlQUhSLENBS0Usd0JBQUMsVUFBRCxFQUFVLFdBQVUsK0JBQWdDOzs7O2VBQ3BELHdCQUFDLFFBQUQsWUFBTSxnQkFBbUI7Ozs7YUFDbkI7Ozs7OztJQUdSLHdCQUFDLFVBQUQ7S0FDRSxTQUFTO0tBQ1QsV0FBVywrRkFDVCxpQkFDSSxlQUNFLDhEQUNBLHlFQUNGO2VBUFIsQ0FVRSx3QkFBQyxPQUFELEVBQU8sV0FBVSxVQUFXOzs7O2VBQzVCLHdCQUFDLFFBQUQsWUFBTyxpQkFBa0IsZUFBZSxlQUFlLGVBQWdCLGdCQUFzQjs7OzthQUN2Rjs7Ozs7O0dBQ0w7Ozs7O1VBQ0M7Ozs7OztBQUVaIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkhlYWRlci50c3giXSwidmVyc2lvbiI6Mywic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFBvd2VyLCBJbmZvLCBTbGlkZXJzLCBTaGllbGRDaGVjaywgVG9nZ2xlTGVmdCwgVG9nZ2xlUmlnaHQsIERvd25sb2FkIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgaXNFbmdpbmVBY3RpdmU6IGJvb2xlYW47XG4gIG9uVG9nZ2xlRW5naW5lOiAoKSA9PiB2b2lkO1xuICBvbk9wZW5BbmRyb2lkQXVkaXQ6ICgpID0+IHZvaWQ7XG4gIG9uT3BlblRlc3RTdWl0ZTogKCkgPT4gdm9pZDtcbiAgb25PcGVuWmlwRG93bmxvYWQ6ICgpID0+IHZvaWQ7XG4gIG1hc3RlckJ5cGFzczogYm9vbGVhbjtcbiAgb25Ub2dnbGVNYXN0ZXJCeXBhc3M6ICgpID0+IHZvaWQ7XG4gIHNhbXBsZVJhdGU6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IEhlYWRlcjogUmVhY3QuRkM8UHJvcHM+ID0gKHtcbiAgaXNFbmdpbmVBY3RpdmUsXG4gIG9uVG9nZ2xlRW5naW5lLFxuICBvbk9wZW5BbmRyb2lkQXVkaXQsXG4gIG9uT3BlblRlc3RTdWl0ZSxcbiAgb25PcGVuWmlwRG93bmxvYWQsXG4gIG1hc3RlckJ5cGFzcyxcbiAgb25Ub2dnbGVNYXN0ZXJCeXBhc3MsXG4gIHNhbXBsZVJhdGUsXG59KSA9PiB7XG4gIHJldHVybiAoXG4gICAgPGhlYWRlciBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTk1MC84MCBiYWNrZHJvcC1ibHVyIGJvcmRlci1iIGJvcmRlci1uZXV0cmFsLTgwMCBweC00IHB5LTMgZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtMyBzdGlja3kgdG9wLTAgei0zMFwiPlxuICAgICAgey8qIEJyYW5kICYgSWRlbnRpdHkgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy05IGgtOSByb3VuZGVkLXhsIGJnLWdyYWRpZW50LXRvLWJyIGZyb20tZW1lcmFsZC01MDAgdG8tc2t5LTYwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LXdoaXRlIHNoYWRvdy1tZCBzaGFkb3ctZW1lcmFsZC01MDAvMjBcIj5cbiAgICAgICAgICA8U2xpZGVycyBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtYmFzZSBmb250LWJvbGQgdGV4dC13aGl0ZSB0cmFja2luZy10aWdodCBsZWFkaW5nLW5vbmVcIj5cbiAgICAgICAgICAgICAgQXVkaW9EU1AgRW5naW5lIFByb1xuICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB4LTEuNSBweS0wLjUgcm91bmRlZCB0ZXh0LVsxMHB4XSBmb250LWJvbGQgYmctbmV1dHJhbC04MDAgdGV4dC1lbWVyYWxkLTQwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAgICAzMi1CSVQgRkxPQVQg4oCiIDMyIEJBTkRTXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTFweF0gdGV4dC1uZXV0cmFsLTQwMCBtdC0wLjVcIj5cbiAgICAgICAgICAgIFByb2Nlc2Fkb3IgZGUgQXVkaW8gRGlnaXRhbCBwb3IgU29mdHdhcmUgcGFyYSBBbmRyb2lkICYgRm9ybWF0b3MgUENNXG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogQWN0aW9uIENvbnRyb2xzICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIgZ2FwLTIuNVwiPlxuICAgICAgICB7LyogU2FtcGxlIFJhdGUgSW5kaWNhdG9yICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhpZGRlbiBzbTpmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHB4LTIuNSBweS0xIHJvdW5kZWQtbGcgYmctbmV1dHJhbC05MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCB0ZXh0LVsxMXB4XSBmb250LW1vbm8gdGV4dC1uZXV0cmFsLTQwMFwiPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInctMS41IGgtMS41IHJvdW5kZWQtZnVsbCBiZy1lbWVyYWxkLTQwMCBhbmltYXRlLXB1bHNlXCI+PC9zcGFuPlxuICAgICAgICAgIDxzcGFuPntzYW1wbGVSYXRlID4gMCA/IGAke3NhbXBsZVJhdGUudG9Mb2NhbGVTdHJpbmcoKX0gSHpgIDogJzQ4LDAwMCBIeid9PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogTWFzdGVyIEJ5cGFzcyBidXR0b24gKi99XG4gICAgICAgIHtpc0VuZ2luZUFjdGl2ZSAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25Ub2dnbGVNYXN0ZXJCeXBhc3N9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1zZW1pYm9sZCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHRyYW5zaXRpb24tY29sb3JzIGJvcmRlciAke1xuICAgICAgICAgICAgICBtYXN0ZXJCeXBhc3NcbiAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci01MDAvMjAgdGV4dC1hbWJlci0zMDAgYm9yZGVyLWFtYmVyLTUwMC81MCdcbiAgICAgICAgICAgICAgICA6ICdiZy1uZXV0cmFsLTkwMCB0ZXh0LW5ldXRyYWwtMzAwIGJvcmRlci1uZXV0cmFsLTgwMCBob3Zlcjp0ZXh0LXdoaXRlJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICB0aXRsZT1cIkJ5cGFzcyBNYWVzdHJvIChkZXNhY3RpdmEgdG9kbyBlbCBwcm9jZXNhbWllbnRvIG1hbnRlbmllbmRvIGVsIGF1ZGlvIGFjdGl2bylcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIHttYXN0ZXJCeXBhc3MgPyA8VG9nZ2xlUmlnaHQgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWFtYmVyLTQwMFwiIC8+IDogPFRvZ2dsZUxlZnQgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LW5ldXRyYWwtNTAwXCIgLz59XG4gICAgICAgICAgICA8c3Bhbj57bWFzdGVyQnlwYXNzID8gJ0J5cGFzcyBNYWVzdHJvOiBPTicgOiAnQnlwYXNzIE1hZXN0cm86IE9GRid9PC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBBdXRvbWF0ZWQgRFNQIFRlc3QgU3VpdGUgQnV0dG9uICovfVxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17b25PcGVuVGVzdFN1aXRlfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LXNlbWlib2xkIGJnLW5ldXRyYWwtOTAwIGhvdmVyOmJnLW5ldXRyYWwtODAwIHRleHQtc2t5LTQwMCBib3JkZXIgYm9yZGVyLXNreS01MDAvMzAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0cmFuc2l0aW9uLWNvbG9ycyBzaGFkb3ctc21cIlxuICAgICAgICA+XG4gICAgICAgICAgPFNoaWVsZENoZWNrIGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4gbWQ6aW5saW5lXCI+VmFsaWRhY2nDs24gRFNQICgzOCBUZXN0cyk8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibWQ6aGlkZGVuXCI+VGVzdHM8L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIHsvKiBBbmRyb2lkIEFyY2hpdGVjdHVyZSAmIEFQSXMgQXVkaXRvciBCdXR0b24gKi99XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvbk9wZW5BbmRyb2lkQXVkaXR9XG4gICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgYmctbmV1dHJhbC05MDAgaG92ZXI6YmctbmV1dHJhbC04MDAgdGV4dC1lbWVyYWxkLTQwMCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNTAwLzMwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdHJhbnNpdGlvbi1jb2xvcnMgc2hhZG93LXNtXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxJbmZvIGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4gbWQ6aW5saW5lXCI+QW5kcm9pZCAxNCAoQVBJIDM0KSAmIEMrKzwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtZDpoaWRkZW5cIj5BbmRyb2lkIDE0PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICB7LyogRGlyZWN0IERvd25sb2FkIFpJUCBCdXR0b24gKENydWNpYWwgZm9yIE1vYmlsZS9BbmRyb2lkIFVzZXJzKSAqL31cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uT3BlblppcERvd25sb2FkfVxuICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LWJvbGQgYmctZW1lcmFsZC02MDAvMjAgaG92ZXI6YmctZW1lcmFsZC02MDAvMzAgdGV4dC1lbWVyYWxkLTMwMCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNTAwLzUwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgdHJhbnNpdGlvbi1jb2xvcnMgc2hhZG93LXNtIGFjdGl2ZTpzY2FsZS05NVwiXG4gICAgICAgICAgdGl0bGU9XCJEZXNjYXJnYXIgY8OzZGlnbyBmdWVudGUgZW4gYXJjaGl2byBaSVAgZGlyZWN0YW1lbnRlIGEgdHUgY2VsdWxhclwiXG4gICAgICAgID5cbiAgICAgICAgICA8RG93bmxvYWQgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjUgdGV4dC1lbWVyYWxkLTQwMFwiIC8+XG4gICAgICAgICAgPHNwYW4+RGVzY2FyZ2FyIFpJUDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgey8qIE1hc3RlciBQb3dlciAvIEVuZ2luZSBBY3RpdmF0aW9uICovfVxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17b25Ub2dnbGVFbmdpbmV9XG4gICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMy41IHB5LTEuNSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1ib2xkIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRyYW5zaXRpb24tYWxsIHNoYWRvdy1tZCAke1xuICAgICAgICAgICAgaXNFbmdpbmVBY3RpdmVcbiAgICAgICAgICAgICAgPyBtYXN0ZXJCeXBhc3NcbiAgICAgICAgICAgICAgICA/ICdiZy1hbWJlci01MDAvMjAgdGV4dC1hbWJlci0zMDAgYm9yZGVyIGJvcmRlci1hbWJlci01MDAvNTAnXG4gICAgICAgICAgICAgICAgOiAnYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSBzaGFkb3ctZW1lcmFsZC02MDAvMzAnXG4gICAgICAgICAgICAgIDogJ2JnLW5ldXRyYWwtODAwIGhvdmVyOmJnLW5ldXRyYWwtNzAwIHRleHQtbmV1dHJhbC00MDAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCdcbiAgICAgICAgICB9YH1cbiAgICAgICAgPlxuICAgICAgICAgIDxQb3dlciBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICA8c3Bhbj57aXNFbmdpbmVBY3RpdmUgPyAobWFzdGVyQnlwYXNzID8gJ0RTUCBCWVBBU1MnIDogJ0RTUCBBQ1RJVk8nKSA6ICdJTklDSUFSIE1PVE9SJ308L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9oZWFkZXI+XG4gICk7XG59O1xuIl19