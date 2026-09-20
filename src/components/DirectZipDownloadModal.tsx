const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"];const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"]; const _Fragment = __vite__cjsImport3_react_jsxDevRuntime["Fragment"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { X, Download, Smartphone, Check, FileArchive, Loader2, Info } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
import { downloadProjectZip } from "/src/utils/zipDownloader.ts";
var _jsxFileName = "/app/applet/src/components/DirectZipDownloadModal.tsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const DirectZipDownloadModal = ({ isOpen, onClose }) => {
	const [isDownloading, setIsDownloading] = useState(false);
	const [progressMsg, setProgressMsg] = useState("");
	const [downloadSuccess, setDownloadSuccess] = useState(false);
	if (!isOpen) return null;
	const handleStartDownload = async () => {
		try {
			setIsDownloading(true);
			setDownloadSuccess(false);
			await downloadProjectZip((msg) => setProgressMsg(msg));
			setDownloadSuccess(true);
		} catch (err) {
			console.error(err);
			setProgressMsg("Error al empaquetar archivos.");
		} finally {
			setIsDownloading(false);
		}
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
		children: /* @__PURE__ */ _jsxDEV("div", {
			className: "bg-neutral-900 border border-neutral-700 w-full max-w-lg rounded-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-200",
			children: [
				/* @__PURE__ */ _jsxDEV("div", {
					className: "px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ _jsxDEV("div", {
							className: "w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400",
							children: /* @__PURE__ */ _jsxDEV(Download, { className: "w-5 h-5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 39,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 38,
							columnNumber: 13
						}, this), /* @__PURE__ */ _jsxDEV("div", { children: [/* @__PURE__ */ _jsxDEV("h2", {
							className: "text-base font-bold text-white tracking-tight",
							children: "Descargar Proyecto ZIP (Móvil / Android)"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 42,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("p", {
							className: "text-xs text-neutral-400",
							children: "Optimizado para descarga directa en teléfonos celulares"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 45,
							columnNumber: 15
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 41,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 37,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: onClose,
						className: "p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors",
						children: /* @__PURE__ */ _jsxDEV(X, { className: "w-5 h-5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 54,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 50,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 36,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "p-5 space-y-4 text-sm leading-relaxed",
					children: [
						/* @__PURE__ */ _jsxDEV("div", {
							className: "p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2",
							children: [/* @__PURE__ */ _jsxDEV("div", {
								className: "flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider",
								children: [/* @__PURE__ */ _jsxDEV(Smartphone, { className: "w-4 h-4" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 62,
									columnNumber: 15
								}, this), "Contenido del archivo ZIP empaquetado:"]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 61,
								columnNumber: 13
							}, this), /* @__PURE__ */ _jsxDEV("ul", {
								className: "text-xs text-neutral-300 space-y-1.5 list-disc list-inside",
								children: [
									/* @__PURE__ */ _jsxDEV("li", { children: "Código fuente completo (React 19 + TypeScript + Vite)" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 66,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("li", { children: "Motor DSP de 10 etapas en punto flotante 32-bit" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 67,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("li", { children: "Filtros Robert Bristow-Johnson y 32 bandas ISO" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 68,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("li", { children: [/* @__PURE__ */ _jsxDEV("strong", {
										className: "text-white",
										children: "Android 14 (API 34)"
									}, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 69,
										columnNumber: 19
									}, this), ": Manifiesto con ForegroundService y servicio Kotlin"] }, void 0, true, {
										fileName: _jsxFileName,
										lineNumber: 69,
										columnNumber: 15
									}, this),
									/* @__PURE__ */ _jsxDEV("li", { children: "Suite de validación matemática con 38 pruebas" }, void 0, false, {
										fileName: _jsxFileName,
										lineNumber: 70,
										columnNumber: 15
									}, this)
								]
							}, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 65,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 60,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("div", {
							className: "p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs flex items-start gap-2.5",
							children: [/* @__PURE__ */ _jsxDEV(Info, { className: "w-4 h-4 text-sky-400 shrink-0 mt-0.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 75,
								columnNumber: 13
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: [
								"Al tocar el botón, tu celular descargará el archivo ",
								/* @__PURE__ */ _jsxDEV("strong", {
									className: "text-white font-mono",
									children: "AudioDSP-Engine-Pro-Android14-API34.zip"
								}, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 77,
									columnNumber: 67
								}, this),
								" directamente a tu carpeta de ",
								/* @__PURE__ */ _jsxDEV("strong", { children: "Descargas" }, void 0, false, {
									fileName: _jsxFileName,
									lineNumber: 77,
									columnNumber: 186
								}, this),
								" sin requerir PC ni extensiones."
							] }, void 0, true, {
								fileName: _jsxFileName,
								lineNumber: 76,
								columnNumber: 13
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 74,
							columnNumber: 11
						}, this),
						progressMsg && /* @__PURE__ */ _jsxDEV("div", {
							className: "p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-emerald-400 flex items-center gap-2",
							children: [isDownloading ? /* @__PURE__ */ _jsxDEV(Loader2, { className: "w-4 h-4 animate-spin text-emerald-400 shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 32
							}, this) : /* @__PURE__ */ _jsxDEV(Check, { className: "w-4 h-4 text-emerald-400 shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 83,
								columnNumber: 105
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: progressMsg }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 84,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 13
						}, this),
						downloadSuccess && /* @__PURE__ */ _jsxDEV("div", {
							className: "p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 font-medium",
							children: [/* @__PURE__ */ _jsxDEV(Check, { className: "w-4 h-4 text-emerald-400 shrink-0" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 90,
								columnNumber: 15
							}, this), /* @__PURE__ */ _jsxDEV("span", { children: "¡Archivo ZIP descargado exitosamente en tu teléfono! Revisa tu barra de notificaciones o la carpeta Descargas." }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 91,
								columnNumber: 15
							}, this)]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 89,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 59,
					columnNumber: 9
				}, this),
				/* @__PURE__ */ _jsxDEV("div", {
					className: "px-5 py-4 border-t border-neutral-800 bg-neutral-950/70 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ _jsxDEV("button", {
						onClick: onClose,
						className: "px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white transition-colors",
						children: "Cerrar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 98,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("button", {
						onClick: handleStartDownload,
						disabled: isDownloading,
						className: `px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg transition-all ${isDownloading ? "bg-neutral-800 text-neutral-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 active:scale-95"}`,
						children: isDownloading ? /* @__PURE__ */ _jsxDEV(_Fragment, { children: [/* @__PURE__ */ _jsxDEV(Loader2, { className: "w-4 h-4 animate-spin" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 116,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Generando ZIP..." }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 117,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 115,
							columnNumber: 15
						}, this) : /* @__PURE__ */ _jsxDEV(_Fragment, { children: [/* @__PURE__ */ _jsxDEV(FileArchive, { className: "w-4 h-4" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("span", { children: "Descargar ZIP en mi Celular" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 122,
							columnNumber: 17
						}, this)] }, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 120,
							columnNumber: 15
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 105,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 97,
					columnNumber: 9
				}, this)
			]
		}, void 0, true, {
			fileName: _jsxFileName,
			lineNumber: 33,
			columnNumber: 7
		}, this)
	}, void 0, false, {
		fileName: _jsxFileName,
		lineNumber: 32,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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QkFBQyxPQUFEO0tBQUssV0FBVTtlQUFmLENBQ0Usd0JBQUMsVUFBRDtNQUNFLFNBQVM7TUFDVCxXQUFVO2dCQUNYO0tBRU87Ozs7ZUFFUix3QkFBQyxVQUFEO01BQ0UsU0FBUztNQUNULFVBQVU7TUFDVixXQUFXLHdHQUNULGdCQUNJLHVEQUNBO2dCQUdMLGdCQUNDLGdEQUNFLHdCQUFDLFNBQUQsRUFBUyxXQUFVLHVCQUF3Qjs7OztnQkFDM0Msd0JBQUMsUUFBRCxZQUFNLG1CQUFzQjs7OztjQUM1Qjs7OztpQkFFRixnREFDRSx3QkFBQyxhQUFELEVBQWEsV0FBVSxVQUFXOzs7O2dCQUNsQyx3QkFBQyxRQUFELFlBQU0sOEJBQWlDOzs7O2NBQ3ZDOzs7OztLQUVFOzs7O2FBQ0w7Ozs7OztHQUVGOzs7Ozs7Q0FDRjs7Ozs7QUFFVCIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJEaXJlY3RaaXBEb3dubG9hZE1vZGFsLnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBYLCBEb3dubG9hZCwgU21hcnRwaG9uZSwgQ2hlY2ssIEZpbGVBcmNoaXZlLCBMb2FkZXIyLCBJbmZvIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCB7IGRvd25sb2FkUHJvamVjdFppcCB9IGZyb20gJy4uL3V0aWxzL3ppcERvd25sb2FkZXInO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBpc09wZW46IGJvb2xlYW47XG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjb25zdCBEaXJlY3RaaXBEb3dubG9hZE1vZGFsOiBSZWFjdC5GQzxQcm9wcz4gPSAoeyBpc09wZW4sIG9uQ2xvc2UgfSkgPT4ge1xuICBjb25zdCBbaXNEb3dubG9hZGluZywgc2V0SXNEb3dubG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtwcm9ncmVzc01zZywgc2V0UHJvZ3Jlc3NNc2ddID0gdXNlU3RhdGUoJycpO1xuICBjb25zdCBbZG93bmxvYWRTdWNjZXNzLCBzZXREb3dubG9hZFN1Y2Nlc3NdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIGlmICghaXNPcGVuKSByZXR1cm4gbnVsbDtcblxuICBjb25zdCBoYW5kbGVTdGFydERvd25sb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzZXRJc0Rvd25sb2FkaW5nKHRydWUpO1xuICAgICAgc2V0RG93bmxvYWRTdWNjZXNzKGZhbHNlKTtcbiAgICAgIGF3YWl0IGRvd25sb2FkUHJvamVjdFppcCgobXNnKSA9PiBzZXRQcm9ncmVzc01zZyhtc2cpKTtcbiAgICAgIHNldERvd25sb2FkU3VjY2Vzcyh0cnVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHNldFByb2dyZXNzTXNnKCdFcnJvciBhbCBlbXBhcXVldGFyIGFyY2hpdm9zLicpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRJc0Rvd25sb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGluc2V0LTAgei01MCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTQgYmctYmxhY2svODAgYmFja2Ryb3AtYmx1ci1zbVwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTkwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIHctZnVsbCBtYXgtdy1sZyByb3VuZGVkLTJ4bCBmbGV4IGZsZXgtY29sIHNoYWRvdy0yeGwgb3ZlcmZsb3ctaGlkZGVuIHRleHQtbmV1dHJhbC0yMDBcIj5cbiAgICAgICAgXG4gICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHgtNSBweS00IGJvcmRlci1iIGJvcmRlci1uZXV0cmFsLTgwMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gYmctbmV1dHJhbC05NTAvNjBcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctOSBoLTkgcm91bmRlZC14bCBiZy1lbWVyYWxkLTUwMC8yMCBib3JkZXIgYm9yZGVyLWVtZXJhbGQtNTAwLzQwIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRleHQtZW1lcmFsZC00MDBcIj5cbiAgICAgICAgICAgICAgPERvd25sb2FkIGNsYXNzTmFtZT1cInctNSBoLTVcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC1iYXNlIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIHRyYWNraW5nLXRpZ2h0XCI+XG4gICAgICAgICAgICAgICAgRGVzY2FyZ2FyIFByb3llY3RvIFpJUCAoTcOzdmlsIC8gQW5kcm9pZClcbiAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LW5ldXRyYWwtNDAwXCI+XG4gICAgICAgICAgICAgICAgT3B0aW1pemFkbyBwYXJhIGRlc2NhcmdhIGRpcmVjdGEgZW4gdGVsw6lmb25vcyBjZWx1bGFyZXNcbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IHJvdW5kZWQtbGcgaG92ZXI6YmctbmV1dHJhbC04MDAgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8WCBjbGFzc05hbWU9XCJ3LTUgaC01XCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIEJvZHkgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC01IHNwYWNlLXktNCB0ZXh0LXNtIGxlYWRpbmctcmVsYXhlZFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zLjUgcm91bmRlZC14bCBiZy1uZXV0cmFsLTk1MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHNwYWNlLXktMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LXhzIGZvbnQtYm9sZCB0ZXh0LWVtZXJhbGQtNDAwIHVwcGVyY2FzZSB0cmFja2luZy13aWRlclwiPlxuICAgICAgICAgICAgICA8U21hcnRwaG9uZSBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgQ29udGVuaWRvIGRlbCBhcmNoaXZvIFpJUCBlbXBhcXVldGFkbzpcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1uZXV0cmFsLTMwMCBzcGFjZS15LTEuNSBsaXN0LWRpc2MgbGlzdC1pbnNpZGVcIj5cbiAgICAgICAgICAgICAgPGxpPkPDs2RpZ28gZnVlbnRlIGNvbXBsZXRvIChSZWFjdCAxOSArIFR5cGVTY3JpcHQgKyBWaXRlKTwvbGk+XG4gICAgICAgICAgICAgIDxsaT5Nb3RvciBEU1AgZGUgMTAgZXRhcGFzIGVuIHB1bnRvIGZsb3RhbnRlIDMyLWJpdDwvbGk+XG4gICAgICAgICAgICAgIDxsaT5GaWx0cm9zIFJvYmVydCBCcmlzdG93LUpvaG5zb24geSAzMiBiYW5kYXMgSVNPPC9saT5cbiAgICAgICAgICAgICAgPGxpPjxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC13aGl0ZVwiPkFuZHJvaWQgMTQgKEFQSSAzNCk8L3N0cm9uZz46IE1hbmlmaWVzdG8gY29uIEZvcmVncm91bmRTZXJ2aWNlIHkgc2VydmljaW8gS290bGluPC9saT5cbiAgICAgICAgICAgICAgPGxpPlN1aXRlIGRlIHZhbGlkYWNpw7NuIG1hdGVtw6F0aWNhIGNvbiAzOCBwcnVlYmFzPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMy41IHJvdW5kZWQteGwgYmctc2t5LTUwMC8xMCBib3JkZXIgYm9yZGVyLXNreS01MDAvMzAgdGV4dC1za3ktMjAwIHRleHQteHMgZmxleCBpdGVtcy1zdGFydCBnYXAtMi41XCI+XG4gICAgICAgICAgICA8SW5mbyBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtc2t5LTQwMCBzaHJpbmstMCBtdC0wLjVcIiAvPlxuICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgIEFsIHRvY2FyIGVsIGJvdMOzbiwgdHUgY2VsdWxhciBkZXNjYXJnYXLDoSBlbCBhcmNoaXZvIDxzdHJvbmcgY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LW1vbm9cIj5BdWRpb0RTUC1FbmdpbmUtUHJvLUFuZHJvaWQxNC1BUEkzNC56aXA8L3N0cm9uZz4gZGlyZWN0YW1lbnRlIGEgdHUgY2FycGV0YSBkZSA8c3Ryb25nPkRlc2Nhcmdhczwvc3Ryb25nPiBzaW4gcmVxdWVyaXIgUEMgbmkgZXh0ZW5zaW9uZXMuXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7cHJvZ3Jlc3NNc2cgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTMgcm91bmRlZC1sZyBiZy1uZXV0cmFsLTk1MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHRleHQteHMgZm9udC1tb25vIHRleHQtZW1lcmFsZC00MDAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICAgICAge2lzRG93bmxvYWRpbmcgPyA8TG9hZGVyMiBjbGFzc05hbWU9XCJ3LTQgaC00IGFuaW1hdGUtc3BpbiB0ZXh0LWVtZXJhbGQtNDAwIHNocmluay0wXCIgLz4gOiA8Q2hlY2sgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWVtZXJhbGQtNDAwIHNocmluay0wXCIgLz59XG4gICAgICAgICAgICAgIDxzcGFuPntwcm9ncmVzc01zZ308L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge2Rvd25sb2FkU3VjY2VzcyAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMyByb3VuZGVkLWxnIGJnLWVtZXJhbGQtNTAwLzIwIGJvcmRlciBib3JkZXItZW1lcmFsZC01MDAvNDAgdGV4dC14cyB0ZXh0LWVtZXJhbGQtMjAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGZvbnQtbWVkaXVtXCI+XG4gICAgICAgICAgICAgIDxDaGVjayBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtZW1lcmFsZC00MDAgc2hyaW5rLTBcIiAvPlxuICAgICAgICAgICAgICA8c3Bhbj7CoUFyY2hpdm8gWklQIGRlc2NhcmdhZG8gZXhpdG9zYW1lbnRlIGVuIHR1IHRlbMOpZm9ubyEgUmV2aXNhIHR1IGJhcnJhIGRlIG5vdGlmaWNhY2lvbmVzIG8gbGEgY2FycGV0YSBEZXNjYXJnYXMuPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIEZvb3RlciBhY3Rpb25zICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInB4LTUgcHktNCBib3JkZXItdCBib3JkZXItbmV1dHJhbC04MDAgYmctbmV1dHJhbC05NTAvNzAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0zXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTQgcHktMiByb3VuZGVkLXhsIHRleHQteHMgZm9udC1zZW1pYm9sZCB0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIENlcnJhclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIFxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVN0YXJ0RG93bmxvYWR9XG4gICAgICAgICAgICBkaXNhYmxlZD17aXNEb3dubG9hZGluZ31cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTUgcHktMi41IHJvdW5kZWQteGwgdGV4dC14cyBmb250LWJvbGQgdGV4dC13aGl0ZSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBzaGFkb3ctbGcgdHJhbnNpdGlvbi1hbGwgJHtcbiAgICAgICAgICAgICAgaXNEb3dubG9hZGluZ1xuICAgICAgICAgICAgICAgID8gJ2JnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC00MDAgY3Vyc29yLW5vdC1hbGxvd2VkJ1xuICAgICAgICAgICAgICAgIDogJ2JnLWVtZXJhbGQtNjAwIGhvdmVyOmJnLWVtZXJhbGQtNTAwIHNoYWRvdy1lbWVyYWxkLTYwMC8zMCBhY3RpdmU6c2NhbGUtOTUnXG4gICAgICAgICAgICB9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7aXNEb3dubG9hZGluZyA/IChcbiAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICA8TG9hZGVyMiBjbGFzc05hbWU9XCJ3LTQgaC00IGFuaW1hdGUtc3BpblwiIC8+XG4gICAgICAgICAgICAgICAgPHNwYW4+R2VuZXJhbmRvIFpJUC4uLjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxGaWxlQXJjaGl2ZSBjbGFzc05hbWU9XCJ3LTQgaC00XCIgLz5cbiAgICAgICAgICAgICAgICA8c3Bhbj5EZXNjYXJnYXIgWklQIGVuIG1pIENlbHVsYXI8L3NwYW4+XG4gICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdfQ==