const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"];const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"]; const _Fragment = __vite__cjsImport3_react_jsxDevRuntime["Fragment"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { DSPTestSuite } from "/src/audio/dspTestSuite.ts";
import { CheckCircle2, XCircle, Play, RefreshCw, X, ShieldCheck, Terminal } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/DSPValidationModal.tsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const DSPValidationModal = ({ isOpen, onClose }) => {
	const [isRunning, setIsRunning] = useState(false);
	const [results, setResults] = useState([]);
	const [passedCount, setPassedCount] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("all");
	if (!isOpen) return null;
	const handleRunTests = async () => {
		setIsRunning(true);
		setResults([]);
		// Slight tick to let UI refresh
		setTimeout(async () => {
			const suite = await DSPTestSuite.runAllTests();
			setResults(suite.results);
			setPassedCount(suite.passedCount);
			setTotalCount(suite.totalCount);
			setIsRunning(false);
		}, 100);
	};
	const categories = ["all", ...Array.from(new Set(results.map((r) => r.category)))];
	const filteredResults = selectedCategory === "all" ? results : results.filter((r) => r.category === selectedCategory);
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in",
		children: /* @__PURE__ */ _jsxDEV("div", {
			className: "bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden",
			children: [
				/* @__PURE__ */ _jsxDEV("div", {
					className: "p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
							children: /* @__PURE__ */ _jsxDEV(ShieldCheck, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 46,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ _jsxDEV("h3", {
								className: "text-base font-bold text-white",
								children: "Suite de Validación Automatizada DSP"
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 50,
								columnNumber: 17
							}, this), totalCount > 0 && /* @__PURE__ */ _jsxDEV("span", {
								className: `px-2 py-0.5 rounded text-xs font-mono font-bold ${passedCount === totalCount ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-rose-500/20 text-rose-300 border border-rose-500/40"}`,
								children: [
									passedCount,
									" / ",
									totalCount,
									" APROBADAS (100%)"
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 54,
								columnNumber: 19
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 49,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-xs text-neutral-400",
							children: "Verificación matemática de filtros biquad, 32 bandas ISO, dinámica MDRC, limitación y PCM"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 65,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 48,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 44,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("button", {
							onClick: handleRunTests,
							disabled: isRunning,
							className: "px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-md shadow-emerald-900/30",
							children: isRunning ? /* @__PURE__ */ _jsxDEV(_Fragment, { children: [/* @__PURE__ */ _jsxDEV(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 79,
								columnNumber: 19
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Calculando..." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 80,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 78,
								columnNumber: 17
							}, this) : /* @__PURE__ */ _jsxDEV(_Fragment, { children: [/* @__PURE__ */ _jsxDEV(Play, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 84,
								columnNumber: 19
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: results.length === 0 ? "Ejecutar Validación" : "Re-ejecutar Pruebas" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 85,
								columnNumber: 19
							}, this)] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 17
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("button", {
							onClick: onClose,
							className: "p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors",
							children: /* @__PURE__ */ _jsxDEV(X, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 93,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 71,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 43,
					columnNumber: 9
				}, this),
				results.length > 0 && /* @__PURE__ */ _jsxDEV("div", {
					className: "px-5 py-2.5 bg-neutral-950/40 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs",
					children: [/* @__PURE__ */ _jsxDEV("span", {
						className: "text-neutral-400 text-[11px] font-semibold",
						children: "Módulos:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 101,
						columnNumber: 13
					}, this), categories.map((cat) => /* @__PURE__ */ _jsxDEV("button", {
						onClick: () => setSelectedCategory(cat),
						className: `px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? "bg-neutral-800 text-white font-bold" : "text-neutral-400 hover:text-neutral-200"}`,
						children: cat === "all" ? `Todos (${results.length})` : cat
					}, cat, false, {
						fileName: _jsxFileName,
						lineNumber: 103,
						columnNumber: 15
					}, this))]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 100,
					columnNumber: 11
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin",
					children: [
						results.length === 0 && !isRunning && /* @__PURE__ */ _jsxDEV("div", {
							className: "text-center py-16 text-neutral-400 space-y-3",
							children: [
								/* @__PURE__ */ _jsxDEV(Terminal, { className: "w-12 h-12 mx-auto text-neutral-600" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 122,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("p", {
									className: "text-sm font-medium text-neutral-300",
									children: "Presiona \"Ejecutar Validación\" para correr las pruebas automáticas."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 123,
									columnNumber: 15
								}, this),
								/* @__PURE__ */ _jsxDEV("p", {
									className: "text-xs text-neutral-500 max-w-md mx-auto",
									children: "La suite evalúa numéricamente la respuesta en frecuencia de cada una de las 32 bandas ISO, los filtros de tono, el crossover MDRC, la saturación tanh del limiter y la precisión de cuantificación PCM de 16 y 32 bits."
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 126,
									columnNumber: 15
								}, this)
							]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 13
						}, this),
						isRunning && /* @__PURE__ */ _jsxDEV("div", {
							className: "text-center py-16 text-neutral-400 space-y-3",
							children: [/* @__PURE__ */ _jsxDEV(RefreshCw, { className: "w-10 h-10 mx-auto text-emerald-400 animate-spin" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 136,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("p", {
								className: "text-sm text-neutral-200",
								children: "Evaluando funciones de transferencia biquad y dinámica..."
							}, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 137,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 135,
							columnNumber: 13
						}, this),
						filteredResults.map((test) => /* @__PURE__ */ _jsxDEV("div", {
							className: `p-3 rounded-xl border transition-all ${test.passed ? "bg-neutral-950/70 border-neutral-800/80 hover:border-emerald-500/40" : "bg-rose-950/20 border-rose-800/40"}`,
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ _jsxDEV("div", {
									className: "flex items-start gap-2.5",
									children: [test.passed ? /* @__PURE__ */ _jsxDEV(CheckCircle2, { className: "w-4 h-4 text-emerald-400 shrink-0 mt-0.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 155,
										columnNumber: 21
									}, this) : /* @__PURE__ */ _jsxDEV(XCircle, { className: "w-4 h-4 text-rose-400 shrink-0 mt-0.5" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 157,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ _jsxDEV("span", {
											className: "text-xs font-bold text-white",
											children: test.name
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 161,
											columnNumber: 23
										}, this), /* @__PURE__ */ _jsxDEV("span", {
											className: "text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400",
											children: test.category
										}, void 0, false, {
											fileName: _jsxFileName,
											lineNumber: 162,
											columnNumber: 23
										}, this)]
									}, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 160,
										columnNumber: 21
									}, this), /* @__PURE__ */ _jsxDEV("p", {
										className: "text-[11px] text-neutral-400 mt-1",
										children: test.details
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 166,
										columnNumber: 21
									}, this)] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 159,
										columnNumber: 19
									}, this)]
								}, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 153,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("div", {
									className: "text-right shrink-0",
									children: /* @__PURE__ */ _jsxDEV("span", {
										className: `text-[11px] font-mono font-bold ${test.passed ? "text-emerald-400" : "text-rose-400"}`,
										children: test.passed ? "PASS" : "FAIL"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 171,
										columnNumber: 19
									}, this)
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 170,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 152,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-neutral-800/60 text-[11px] font-mono",
								children: [/* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-500",
									children: "Esperado: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 183,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-300",
									children: test.expected
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 184,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 182,
									columnNumber: 17
								}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("span", {
									className: "text-neutral-500",
									children: "Medido: "
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 187,
									columnNumber: 19
								}, this), /* @__PURE__ */ _jsxDEV("span", {
									className: "text-emerald-300 font-semibold",
									children: test.measured
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 188,
									columnNumber: 19
								}, this)] }, void 0, true, {
									fileName: _jsxFileName,
									lineNumber: 186,
									columnNumber: 17
								}, this)]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 181,
								columnNumber: 15
							}, this)]
						}, test.id, true, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 13
						}, this))
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 119,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400",
					children: [/* @__PURE__ */ _jsxDEV("span", { children: "Pruebas matemáticas 100% deterministas basadas en ecuaciones de audio RBJ" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 197,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: onClose,
						className: "px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium",
						children: "Cerrar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 198,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 196,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 41,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 40,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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UztTQUNwQjs7Ozs7UUFDSDs7OztnQkFDRjs7Ozs7aUJBRUwsd0JBQUMsT0FBRDtRQUFLLFdBQVU7a0JBQWYsQ0FDRSx3QkFBQyxPQUFELGFBQ0Usd0JBQUMsUUFBRDtTQUFNLFdBQVU7bUJBQW1CO1FBQWdCOzs7O2tCQUNuRCx3QkFBQyxRQUFEO1NBQU0sV0FBVTttQkFBb0IsS0FBSztRQUFlOzs7O2dCQUNyRDs7OztrQkFDTCx3QkFBQyxPQUFELGFBQ0Usd0JBQUMsUUFBRDtTQUFNLFdBQVU7bUJBQW1CO1FBQWM7Ozs7a0JBQ2pELHdCQUFDLFFBQUQ7U0FBTSxXQUFVO21CQUFrQyxLQUFLO1FBQWU7Ozs7Z0JBQ25FOzs7O2dCQUNGOzs7OztlQUNGO1NBOUNFLEtBQUs7Ozs7YUE4Q1AsQ0FDTjtLQUNFOzs7Ozs7SUFHTCx3QkFBQyxPQUFEO0tBQUssV0FBVTtlQUFmLENBQ0Usd0JBQUMsUUFBRCxZQUFNLDRFQUErRTs7OztlQUNyRix3QkFBQyxVQUFEO01BQ0UsU0FBUztNQUNULFdBQVU7Z0JBQ1g7S0FFTzs7OzthQUNMOzs7Ozs7R0FDRjs7Ozs7O0NBQ0Y7Ozs7O0FBRVQiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiRFNQVmFsaWRhdGlvbk1vZGFsLnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBEU1BUZXN0U3VpdGUsIFRlc3RSZXN1bHQgfSBmcm9tICcuLi9hdWRpby9kc3BUZXN0U3VpdGUnO1xuaW1wb3J0IHsgQ2hlY2tDaXJjbGUyLCBYQ2lyY2xlLCBQbGF5LCBSZWZyZXNoQ3csIFgsIFNoaWVsZENoZWNrLCBUZXJtaW5hbCB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGlzT3BlbjogYm9vbGVhbjtcbiAgb25DbG9zZTogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IERTUFZhbGlkYXRpb25Nb2RhbDogUmVhY3QuRkM8UHJvcHM+ID0gKHsgaXNPcGVuLCBvbkNsb3NlIH0pID0+IHtcbiAgY29uc3QgW2lzUnVubmluZywgc2V0SXNSdW5uaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3Jlc3VsdHMsIHNldFJlc3VsdHNdID0gdXNlU3RhdGU8VGVzdFJlc3VsdFtdPihbXSk7XG4gIGNvbnN0IFtwYXNzZWRDb3VudCwgc2V0UGFzc2VkQ291bnRdID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFt0b3RhbENvdW50LCBzZXRUb3RhbENvdW50XSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbc2VsZWN0ZWRDYXRlZ29yeSwgc2V0U2VsZWN0ZWRDYXRlZ29yeV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCdhbGwnKTtcblxuICBpZiAoIWlzT3BlbikgcmV0dXJuIG51bGw7XG5cbiAgY29uc3QgaGFuZGxlUnVuVGVzdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgc2V0SXNSdW5uaW5nKHRydWUpO1xuICAgIHNldFJlc3VsdHMoW10pO1xuICAgIC8vIFNsaWdodCB0aWNrIHRvIGxldCBVSSByZWZyZXNoXG4gICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzdWl0ZSA9IGF3YWl0IERTUFRlc3RTdWl0ZS5ydW5BbGxUZXN0cygpO1xuICAgICAgc2V0UmVzdWx0cyhzdWl0ZS5yZXN1bHRzKTtcbiAgICAgIHNldFBhc3NlZENvdW50KHN1aXRlLnBhc3NlZENvdW50KTtcbiAgICAgIHNldFRvdGFsQ291bnQoc3VpdGUudG90YWxDb3VudCk7XG4gICAgICBzZXRJc1J1bm5pbmcoZmFsc2UpO1xuICAgIH0sIDEwMCk7XG4gIH07XG5cbiAgY29uc3QgY2F0ZWdvcmllcyA9IFsnYWxsJywgLi4uQXJyYXkuZnJvbShuZXcgU2V0KHJlc3VsdHMubWFwKChyKSA9PiByLmNhdGVnb3J5KSkpXTtcblxuICBjb25zdCBmaWx0ZXJlZFJlc3VsdHMgPVxuICAgIHNlbGVjdGVkQ2F0ZWdvcnkgPT09ICdhbGwnXG4gICAgICA/IHJlc3VsdHNcbiAgICAgIDogcmVzdWx0cy5maWx0ZXIoKHIpID0+IHIuY2F0ZWdvcnkgPT09IHNlbGVjdGVkQ2F0ZWdvcnkpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC00IGJnLWJsYWNrLzgwIGJhY2tkcm9wLWJsdXItc20gYW5pbWF0ZS1mYWRlLWluXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLW5ldXRyYWwtOTAwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAgcm91bmRlZC0yeGwgdy1mdWxsIG1heC13LTR4bCBtYXgtaC1bODV2aF0gZmxleCBmbGV4LWNvbCBzaGFkb3ctMnhsIG92ZXJmbG93LWhpZGRlblwiPlxuICAgICAgICB7LyogTW9kYWwgSGVhZGVyICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBzbTpwLTUgYm9yZGVyLWIgYm9yZGVyLW5ldXRyYWwtODAwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBiZy1uZXV0cmFsLTk1MC84MFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yIHJvdW5kZWQteGwgYmctZW1lcmFsZC01MDAvMTAgYm9yZGVyIGJvcmRlci1lbWVyYWxkLTUwMC8zMCB0ZXh0LWVtZXJhbGQtNDAwXCI+XG4gICAgICAgICAgICAgIDxTaGllbGRDaGVjayBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWJhc2UgZm9udC1ib2xkIHRleHQtd2hpdGVcIj5cbiAgICAgICAgICAgICAgICAgIFN1aXRlIGRlIFZhbGlkYWNpw7NuIEF1dG9tYXRpemFkYSBEU1BcbiAgICAgICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgICAgIHt0b3RhbENvdW50ID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0yIHB5LTAuNSByb3VuZGVkIHRleHQteHMgZm9udC1tb25vIGZvbnQtYm9sZCAke1xuICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZENvdW50ID09PSB0b3RhbENvdW50XG4gICAgICAgICAgICAgICAgICAgICAgICA/ICdiZy1lbWVyYWxkLTUwMC8yMCB0ZXh0LWVtZXJhbGQtMzAwIGJvcmRlciBib3JkZXItZW1lcmFsZC01MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICdiZy1yb3NlLTUwMC8yMCB0ZXh0LXJvc2UtMzAwIGJvcmRlciBib3JkZXItcm9zZS01MDAvNDAnXG4gICAgICAgICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7cGFzc2VkQ291bnR9IC8ge3RvdGFsQ291bnR9IEFQUk9CQURBUyAoMTAwJSlcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwXCI+XG4gICAgICAgICAgICAgICAgVmVyaWZpY2FjacOzbiBtYXRlbcOhdGljYSBkZSBmaWx0cm9zIGJpcXVhZCwgMzIgYmFuZGFzIElTTywgZGluw6FtaWNhIE1EUkMsIGxpbWl0YWNpw7NuIHkgUENNXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVSdW5UZXN0c31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2lzUnVubmluZ31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMy41IHB5LTIgcm91bmRlZC1sZyBiZy1lbWVyYWxkLTYwMCBob3ZlcjpiZy1lbWVyYWxkLTUwMCB0ZXh0LXdoaXRlIGZvbnQtbWVkaXVtIHRleHQteHMgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0cmFuc2l0aW9uLWNvbG9ycyBkaXNhYmxlZDpvcGFjaXR5LTUwIHNoYWRvdy1tZCBzaGFkb3ctZW1lcmFsZC05MDAvMzBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXNSdW5uaW5nID8gKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8UmVmcmVzaEN3IGNsYXNzTmFtZT1cInctMy41IGgtMy41IGFuaW1hdGUtc3BpblwiIC8+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5DYWxjdWxhbmRvLi4uPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICA8UGxheSBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj57cmVzdWx0cy5sZW5ndGggPT09IDAgPyAnRWplY3V0YXIgVmFsaWRhY2nDs24nIDogJ1JlLWVqZWN1dGFyIFBydWViYXMnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBvbkNsaWNrPXtvbkNsb3NlfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTIgcm91bmRlZC1sZyB0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtd2hpdGUgaG92ZXI6YmctbmV1dHJhbC04MDAgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8WCBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogQ2F0ZWdvcmllcyBCYXIgKi99XG4gICAgICAgIHtyZXN1bHRzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNSBweS0yLjUgYmctbmV1dHJhbC05NTAvNDAgYm9yZGVyLWIgYm9yZGVyLW5ldXRyYWwtODAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIG92ZXJmbG93LXgtYXV0byBzY3JvbGxiYXItbm9uZSB0ZXh0LXhzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwIHRleHQtWzExcHhdIGZvbnQtc2VtaWJvbGRcIj5Nw7NkdWxvczo8L3NwYW4+XG4gICAgICAgICAgICB7Y2F0ZWdvcmllcy5tYXAoKGNhdCkgPT4gKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAga2V5PXtjYXR9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VsZWN0ZWRDYXRlZ29yeShjYXQpfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTIuNSBweS0xIHJvdW5kZWQtbWQgdGV4dC14cyBmb250LW1lZGl1bSB3aGl0ZXNwYWNlLW5vd3JhcCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRDYXRlZ29yeSA9PT0gY2F0XG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLW5ldXRyYWwtODAwIHRleHQtd2hpdGUgZm9udC1ib2xkJ1xuICAgICAgICAgICAgICAgICAgICA6ICd0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtbmV1dHJhbC0yMDAnXG4gICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7Y2F0ID09PSAnYWxsJyA/IGBUb2RvcyAoJHtyZXN1bHRzLmxlbmd0aH0pYCA6IGNhdH1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogQ29udGVudCBCb2R5ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG8gcC01IHNwYWNlLXktMyBzY3JvbGxiYXItdGhpblwiPlxuICAgICAgICAgIHtyZXN1bHRzLmxlbmd0aCA9PT0gMCAmJiAhaXNSdW5uaW5nICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktMTYgdGV4dC1uZXV0cmFsLTQwMCBzcGFjZS15LTNcIj5cbiAgICAgICAgICAgICAgPFRlcm1pbmFsIGNsYXNzTmFtZT1cInctMTIgaC0xMiBteC1hdXRvIHRleHQtbmV1dHJhbC02MDBcIiAvPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtbmV1dHJhbC0zMDBcIj5cbiAgICAgICAgICAgICAgICBQcmVzaW9uYSBcIkVqZWN1dGFyIFZhbGlkYWNpw7NuXCIgcGFyYSBjb3JyZXIgbGFzIHBydWViYXMgYXV0b23DoXRpY2FzLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTUwMCBtYXgtdy1tZCBteC1hdXRvXCI+XG4gICAgICAgICAgICAgICAgTGEgc3VpdGUgZXZhbMO6YSBudW3DqXJpY2FtZW50ZSBsYSByZXNwdWVzdGEgZW4gZnJlY3VlbmNpYSBkZSBjYWRhIHVuYSBkZSBsYXMgMzIgYmFuZGFzIElTTyxcbiAgICAgICAgICAgICAgICBsb3MgZmlsdHJvcyBkZSB0b25vLCBlbCBjcm9zc292ZXIgTURSQywgbGEgc2F0dXJhY2nDs24gdGFuaCBkZWwgbGltaXRlciB5IGxhIHByZWNpc2nDs24gZGVcbiAgICAgICAgICAgICAgICBjdWFudGlmaWNhY2nDs24gUENNIGRlIDE2IHkgMzIgYml0cy5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtpc1J1bm5pbmcgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBweS0xNiB0ZXh0LW5ldXRyYWwtNDAwIHNwYWNlLXktM1wiPlxuICAgICAgICAgICAgICA8UmVmcmVzaEN3IGNsYXNzTmFtZT1cInctMTAgaC0xMCBteC1hdXRvIHRleHQtZW1lcmFsZC00MDAgYW5pbWF0ZS1zcGluXCIgLz5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LW5ldXRyYWwtMjAwXCI+XG4gICAgICAgICAgICAgICAgRXZhbHVhbmRvIGZ1bmNpb25lcyBkZSB0cmFuc2ZlcmVuY2lhIGJpcXVhZCB5IGRpbsOhbWljYS4uLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge2ZpbHRlcmVkUmVzdWx0cy5tYXAoKHRlc3QpID0+IChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXt0ZXN0LmlkfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BwLTMgcm91bmRlZC14bCBib3JkZXIgdHJhbnNpdGlvbi1hbGwgJHtcbiAgICAgICAgICAgICAgICB0ZXN0LnBhc3NlZFxuICAgICAgICAgICAgICAgICAgPyAnYmctbmV1dHJhbC05NTAvNzAgYm9yZGVyLW5ldXRyYWwtODAwLzgwIGhvdmVyOmJvcmRlci1lbWVyYWxkLTUwMC80MCdcbiAgICAgICAgICAgICAgICAgIDogJ2JnLXJvc2UtOTUwLzIwIGJvcmRlci1yb3NlLTgwMC80MCdcbiAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1zdGFydCBqdXN0aWZ5LWJldHdlZW4gZ2FwLTNcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQgZ2FwLTIuNVwiPlxuICAgICAgICAgICAgICAgICAge3Rlc3QucGFzc2VkID8gKFxuICAgICAgICAgICAgICAgICAgICA8Q2hlY2tDaXJjbGUyIGNsYXNzTmFtZT1cInctNCBoLTQgdGV4dC1lbWVyYWxkLTQwMCBzaHJpbmstMCBtdC0wLjVcIiAvPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPFhDaXJjbGUgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LXJvc2UtNDAwIHNocmluay0wIG10LTAuNVwiIC8+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgZm9udC1ib2xkIHRleHQtd2hpdGVcIj57dGVzdC5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LW1vbm8gcHgtMS41IHB5LTAuNSByb3VuZGVkIGJnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC00MDBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0ZXN0LmNhdGVnb3J5fVxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzExcHhdIHRleHQtbmV1dHJhbC00MDAgbXQtMVwiPnt0ZXN0LmRldGFpbHN9PC9wPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtcmlnaHQgc2hyaW5rLTBcIj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtWzExcHhdIGZvbnQtbW9ubyBmb250LWJvbGQgJHtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXN0LnBhc3NlZCA/ICd0ZXh0LWVtZXJhbGQtNDAwJyA6ICd0ZXh0LXJvc2UtNDAwJ1xuICAgICAgICAgICAgICAgICAgICB9YH1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAge3Rlc3QucGFzc2VkID8gJ1BBU1MnIDogJ0ZBSUwnfVxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgc206Z3JpZC1jb2xzLTIgZ2FwLTIgbXQtMiBwdC0yIGJvcmRlci10IGJvcmRlci1uZXV0cmFsLTgwMC82MCB0ZXh0LVsxMXB4XSBmb250LW1vbm9cIj5cbiAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1uZXV0cmFsLTUwMFwiPkVzcGVyYWRvOiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtMzAwXCI+e3Rlc3QuZXhwZWN0ZWR9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNTAwXCI+TWVkaWRvOiA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWVtZXJhbGQtMzAwIGZvbnQtc2VtaWJvbGRcIj57dGVzdC5tZWFzdXJlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBNb2RhbCBGb290ZXIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IGJvcmRlci10IGJvcmRlci1uZXV0cmFsLTgwMCBiZy1uZXV0cmFsLTk1MC84MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwXCI+XG4gICAgICAgICAgPHNwYW4+UHJ1ZWJhcyBtYXRlbcOhdGljYXMgMTAwJSBkZXRlcm1pbmlzdGFzIGJhc2FkYXMgZW4gZWN1YWNpb25lcyBkZSBhdWRpbyBSQko8L3NwYW4+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMS41IHJvdW5kZWQtbGcgYmctbmV1dHJhbC04MDAgaG92ZXI6YmctbmV1dHJhbC03MDAgdGV4dC13aGl0ZSBmb250LW1lZGl1bVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgQ2VycmFyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuIl19