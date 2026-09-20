const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useEffect = __vite__cjsImport0_react["useEffect"]; const useRef = __vite__cjsImport0_react["useRef"];const _jsxDEV = __vite__cjsImport3_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { dspEngine } from "/src/audio/dspEngine.ts";
import { Mic, Upload, Radio, Square, Play, Pause, Repeat, AlertCircle } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/AudioSourceBar.tsx";
import __vite__cjsImport3_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const AudioSourceBar = ({ currentSource, onSourceChange }) => {
	const [isPlayingFile, setIsPlayingFile] = useState(false);
	const [fileProgress, setFileProgress] = useState(0);
	const [fileDuration, setFileDuration] = useState(0);
	const [fileName, setFileName] = useState("");
	const [isLooping, setIsLooping] = useState(true);
	const [synthType, setSynthType] = useState("sweep");
	const [synthFreq, setSynthFreq] = useState(440);
	const [micError, setMicError] = useState(null);
	const fileInputRef = useRef(null);
	// Monitor audio element timeupdate for file playback
	useEffect(() => {
		const audio = dspEngine.getAudioElement();
		if (!audio) return;
		const onTimeUpdate = () => {
			setFileProgress(audio.currentTime);
			setFileDuration(audio.duration || 0);
		};
		const onPlay = () => setIsPlayingFile(true);
		const onPause = () => setIsPlayingFile(false);
		audio.addEventListener("timeupdate", onTimeUpdate);
		audio.addEventListener("play", onPlay);
		audio.addEventListener("pause", onPause);
		return () => {
			audio.removeEventListener("timeupdate", onTimeUpdate);
			audio.removeEventListener("play", onPlay);
			audio.removeEventListener("pause", onPause);
		};
	}, [currentSource]);
	const handleFileSelect = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setFileName(file.name);
		try {
			await dspEngine.setAudioSource("file", { file });
			onSourceChange("file");
			setIsPlayingFile(true);
		} catch (err) {
			console.error("Error loading audio file:", err);
		}
	};
	const togglePlayPauseFile = () => {
		const audio = dspEngine.getAudioElement();
		if (!audio) return;
		if (audio.paused) {
			audio.play();
			setIsPlayingFile(true);
		} else {
			audio.pause();
			setIsPlayingFile(false);
		}
	};
	const handleSeek = (e) => {
		const audio = dspEngine.getAudioElement();
		if (!audio) return;
		const time = parseFloat(e.target.value);
		audio.currentTime = time;
		setFileProgress(time);
	};
	const handleToggleMic = async () => {
		setMicError(null);
		if (currentSource === "mic") {
			dspEngine.stopCurrentSource();
			onSourceChange("none");
		} else {
			try {
				await dspEngine.setAudioSource("mic");
				onSourceChange("mic");
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Permiso de micrófono denegado";
				setMicError(msg);
			}
		}
	};
	const handleToggleSynth = async (type = synthType) => {
		if (currentSource === "synth" && type === synthType) {
			dspEngine.stopCurrentSource();
			onSourceChange("none");
		} else {
			setSynthType(type);
			await dspEngine.setAudioSource("synth", {
				synthType: type,
				synthFreq
			});
			onSourceChange("synth");
		}
	};
	const handleSynthFreqChange = (f) => {
		setSynthFreq(f);
		dspEngine.setSynthFrequency(f);
	};
	const handleStopAll = () => {
		dspEngine.stopCurrentSource();
		onSourceChange("none");
		setIsPlayingFile(false);
	};
	const formatTime = (secs) => {
		if (isNaN(secs) || secs < 0) return "0:00";
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex flex-col gap-3",
		children: [
			/* @__PURE__ */ _jsxDEV("div", {
				className: "flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-neutral-800",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ _jsxDEV("span", {
						className: "text-xs font-semibold text-white",
						children: "Fuente de Audio Real:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 131,
						columnNumber: 11
					}, this), /* @__PURE__ */ _jsxDEV("span", {
						className: "text-[10px] text-neutral-400 font-mono",
						children: currentSource === "file" ? "Archivo Local Activo" : currentSource === "mic" ? "Micrófono Físico en Vivo" : currentSource === "synth" ? `Generador (${synthType})` : "Sin señal (Silencio)"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 11
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 130,
					columnNumber: 9
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ _jsxDEV("input", {
							ref: fileInputRef,
							type: "file",
							accept: "audio/*",
							onChange: handleFileSelect,
							className: "hidden"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 146,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => fileInputRef.current?.click(),
							className: `px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${currentSource === "file" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800"}`,
							children: [/* @__PURE__ */ _jsxDEV(Upload, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 161,
								columnNumber: 13
							}, this), fileName ? "Cambiar Archivo" : "Cargar Archivo"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 153,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: handleToggleMic,
							className: `px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${currentSource === "mic" ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse" : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800"}`,
							children: [/* @__PURE__ */ _jsxDEV(Mic, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 174,
								columnNumber: 13
							}, this), currentSource === "mic" ? "Detener Mic" : "Micrófono en Vivo"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 166,
							columnNumber: 11
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => handleToggleSynth(synthType),
							className: `px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${currentSource === "synth" ? "bg-sky-500/20 text-sky-300 border-sky-500/50" : "bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800"}`,
							children: [/* @__PURE__ */ _jsxDEV(Radio, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 187,
								columnNumber: 13
							}, this), "Señales de Calibración"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 179,
							columnNumber: 11
						}, this),
						currentSource !== "none" && /* @__PURE__ */ _jsxDEV("button", {
							onClick: handleStopAll,
							className: "px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors flex items-center gap-1",
							title: "Detener audio",
							children: [/* @__PURE__ */ _jsxDEV(Square, { className: "w-3.5 h-3.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 198,
								columnNumber: 15
							}, this), "Silencio"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 193,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 144,
					columnNumber: 9
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 129,
				columnNumber: 7
			}, this),
			micError && /* @__PURE__ */ _jsxDEV("div", {
				className: "p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2",
				children: [/* @__PURE__ */ _jsxDEV(AlertCircle, { className: "w-4 h-4 shrink-0 text-rose-400" }, void 0, false, {
					fileName: _jsxFileName,
					lineNumber: 208,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("span", { children: [
					"Error de captura: ",
					micError,
					". Asegúrate de permitir el acceso al micrófono en el navegador."
				] }, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 209,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 207,
				columnNumber: 9
			}, this),
			currentSource === "file" && /* @__PURE__ */ _jsxDEV("div", {
				className: "p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col gap-2",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ _jsxDEV("span", {
						className: "text-white font-medium truncate max-w-xs",
						children: fileName
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 217,
						columnNumber: 13
					}, this), /* @__PURE__ */ _jsxDEV("span", {
						className: "font-mono text-neutral-400 text-[11px]",
						children: [
							formatTime(fileProgress),
							" / ",
							formatTime(fileDuration)
						]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 218,
						columnNumber: 13
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 216,
					columnNumber: 11
				}, this), /* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: togglePlayPauseFile,
							className: "p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-colors",
							children: isPlayingFile ? /* @__PURE__ */ _jsxDEV(Pause, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 228,
								columnNumber: 32
							}, this) : /* @__PURE__ */ _jsxDEV(Play, { className: "w-4 h-4 ml-0.5" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 228,
								columnNumber: 64
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 224,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "0",
							max: fileDuration || 100,
							step: "0.1",
							value: fileProgress,
							onChange: handleSeek,
							className: "flex-1 accent-emerald-500 cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 231,
							columnNumber: 13
						}, this),
						/* @__PURE__ */ _jsxDEV("button", {
							onClick: () => {
								const audio = dspEngine.getAudioElement();
								if (audio) {
									audio.loop = !isLooping;
									setIsLooping(!isLooping);
								}
							},
							className: `p-1.5 rounded transition-colors ${isLooping ? "text-emerald-400 bg-emerald-950/40" : "text-neutral-500 hover:text-white"}`,
							title: "Repetir en bucle",
							children: /* @__PURE__ */ _jsxDEV(Repeat, { className: "w-4 h-4" }, void 0, false, {
								fileName: _jsxFileName,
								lineNumber: 254,
								columnNumber: 15
							}, this)
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 241,
							columnNumber: 13
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 223,
					columnNumber: 11
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 215,
				columnNumber: 9
			}, this),
			currentSource === "synth" && /* @__PURE__ */ _jsxDEV("div", {
				className: "p-3 rounded-lg bg-neutral-950 border border-neutral-800 flex flex-col gap-3",
				children: [/* @__PURE__ */ _jsxDEV("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ _jsxDEV("span", {
							className: "text-xs text-neutral-400",
							children: "Tipo de Onda:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 265,
							columnNumber: 15
						}, this), /* @__PURE__ */ _jsxDEV("div", {
							className: "flex rounded bg-neutral-900 border border-neutral-800 p-0.5 text-xs",
							children: [
								"sweep",
								"sine",
								"pink_noise",
								"white_noise"
							].map((t) => /* @__PURE__ */ _jsxDEV("button", {
								onClick: () => handleToggleSynth(t),
								className: `px-2.5 py-1 rounded transition-colors ${synthType === t ? "bg-sky-600 text-white font-medium" : "text-neutral-400 hover:text-white"}`,
								children: t === "sweep" ? "Barrido 20Hz-20kHz" : t === "sine" ? "Tono Senoidal" : t === "pink_noise" ? "Ruido Rosa (1/f)" : "Ruido Blanco"
							}, t, false, {
								fileName: _jsxFileName,
								lineNumber: 268,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 266,
							columnNumber: 15
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 264,
						columnNumber: 13
					}, this), synthType === "sine" && /* @__PURE__ */ _jsxDEV("div", {
						className: "flex items-center gap-2 text-xs",
						children: [/* @__PURE__ */ _jsxDEV("span", {
							className: "text-neutral-400",
							children: "Frecuencia:"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 289,
							columnNumber: 17
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							className: "font-mono text-sky-400 font-bold",
							children: [synthFreq, " Hz"]
						}, void 0, true, {
							fileName: _jsxFileName,
							lineNumber: 290,
							columnNumber: 17
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 288,
						columnNumber: 15
					}, this)]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 263,
					columnNumber: 11
				}, this), synthType === "sine" && /* @__PURE__ */ _jsxDEV("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ _jsxDEV("span", {
							className: "text-[10px] text-neutral-500 font-mono",
							children: "20 Hz"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 297,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ _jsxDEV("input", {
							type: "range",
							min: "20",
							max: "5000",
							step: "1",
							value: synthFreq,
							onChange: (e) => handleSynthFreqChange(parseInt(e.target.value)),
							className: "flex-1 accent-sky-400 cursor-pointer"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 298,
							columnNumber: 15
						}, this),
						/* @__PURE__ */ _jsxDEV("span", {
							className: "text-[10px] text-neutral-500 font-mono",
							children: "5 kHz"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 307,
							columnNumber: 15
						}, this)
					]
				}, void 0, true, {
					fileName: _jsxFileName,
					lineNumber: 296,
					columnNumber: 13
				}, this)]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 262,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 127,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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Y0FBYyxVQUNiLHdCQUFDLE9BQUQ7S0FBSyxXQUFVO2VBQWY7TUFDRSx3QkFBQyxRQUFEO09BQU0sV0FBVTtpQkFBeUM7TUFBVzs7Ozs7TUFDcEUsd0JBQUMsU0FBRDtPQUNFLE1BQUs7T0FDTCxLQUFJO09BQ0osS0FBSTtPQUNKLE1BQUs7T0FDTCxPQUFPO09BQ1AsV0FBVSxNQUFLLHNCQUFzQixTQUFTLEVBQUUsT0FBTyxLQUFLLENBQUM7T0FDN0QsV0FBVTtNQUNYOzs7OztNQUNELHdCQUFDLFFBQUQ7T0FBTSxXQUFVO2lCQUF5QztNQUFXOzs7OztLQUNqRTs7Ozs7WUFFSjs7Ozs7O0VBRUo7Ozs7OztBQUVUIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkF1ZGlvU291cmNlQmFyLnRzeCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZHNwRW5naW5lIH0gZnJvbSAnLi4vYXVkaW8vZHNwRW5naW5lJztcbmltcG9ydCB7IEF1ZGlvU291cmNlVHlwZSwgU3ludGhTaWduYWxUeXBlIH0gZnJvbSAnLi4vdHlwZXMvZHNwJztcbmltcG9ydCB7IE1pYywgVXBsb2FkLCBSYWRpbywgU3F1YXJlLCBQbGF5LCBQYXVzZSwgUmVwZWF0LCBWb2x1bWUyLCBBbGVydENpcmNsZSB9IGZyb20gJ2x1Y2lkZS1yZWFjdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGN1cnJlbnRTb3VyY2U6IEF1ZGlvU291cmNlVHlwZTtcbiAgb25Tb3VyY2VDaGFuZ2U6IChzb3VyY2U6IEF1ZGlvU291cmNlVHlwZSkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEF1ZGlvU291cmNlQmFyOiBSZWFjdC5GQzxQcm9wcz4gPSAoeyBjdXJyZW50U291cmNlLCBvblNvdXJjZUNoYW5nZSB9KSA9PiB7XG4gIGNvbnN0IFtpc1BsYXlpbmdGaWxlLCBzZXRJc1BsYXlpbmdGaWxlXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2ZpbGVQcm9ncmVzcywgc2V0RmlsZVByb2dyZXNzXSA9IHVzZVN0YXRlKDApO1xuICBjb25zdCBbZmlsZUR1cmF0aW9uLCBzZXRGaWxlRHVyYXRpb25dID0gdXNlU3RhdGUoMCk7XG4gIGNvbnN0IFtmaWxlTmFtZSwgc2V0RmlsZU5hbWVdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG4gIGNvbnN0IFtpc0xvb3BpbmcsIHNldElzTG9vcGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcblxuICBjb25zdCBbc3ludGhUeXBlLCBzZXRTeW50aFR5cGVdID0gdXNlU3RhdGU8U3ludGhTaWduYWxUeXBlPignc3dlZXAnKTtcbiAgY29uc3QgW3N5bnRoRnJlcSwgc2V0U3ludGhGcmVxXSA9IHVzZVN0YXRlKDQ0MCk7XG4gIGNvbnN0IFttaWNFcnJvciwgc2V0TWljRXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3QgZmlsZUlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuXG4gIC8vIE1vbml0b3IgYXVkaW8gZWxlbWVudCB0aW1ldXBkYXRlIGZvciBmaWxlIHBsYXliYWNrXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgYXVkaW8gPSBkc3BFbmdpbmUuZ2V0QXVkaW9FbGVtZW50KCk7XG4gICAgaWYgKCFhdWRpbykgcmV0dXJuO1xuXG4gICAgY29uc3Qgb25UaW1lVXBkYXRlID0gKCkgPT4ge1xuICAgICAgc2V0RmlsZVByb2dyZXNzKGF1ZGlvLmN1cnJlbnRUaW1lKTtcbiAgICAgIHNldEZpbGVEdXJhdGlvbihhdWRpby5kdXJhdGlvbiB8fCAwKTtcbiAgICB9O1xuICAgIGNvbnN0IG9uUGxheSA9ICgpID0+IHNldElzUGxheWluZ0ZpbGUodHJ1ZSk7XG4gICAgY29uc3Qgb25QYXVzZSA9ICgpID0+IHNldElzUGxheWluZ0ZpbGUoZmFsc2UpO1xuXG4gICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIG9uVGltZVVwZGF0ZSk7XG4gICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigncGxheScsIG9uUGxheSk7XG4gICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBvblBhdXNlKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBhdWRpby5yZW1vdmVFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgb25UaW1lVXBkYXRlKTtcbiAgICAgIGF1ZGlvLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BsYXknLCBvblBsYXkpO1xuICAgICAgYXVkaW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBvblBhdXNlKTtcbiAgICB9O1xuICB9LCBbY3VycmVudFNvdXJjZV0pO1xuXG4gIGNvbnN0IGhhbmRsZUZpbGVTZWxlY3QgPSBhc3luYyAoZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXM/LlswXTtcbiAgICBpZiAoIWZpbGUpIHJldHVybjtcblxuICAgIHNldEZpbGVOYW1lKGZpbGUubmFtZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGRzcEVuZ2luZS5zZXRBdWRpb1NvdXJjZSgnZmlsZScsIHsgZmlsZSB9KTtcbiAgICAgIG9uU291cmNlQ2hhbmdlKCdmaWxlJyk7XG4gICAgICBzZXRJc1BsYXlpbmdGaWxlKHRydWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBhdWRpbyBmaWxlOicsIGVycik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHRvZ2dsZVBsYXlQYXVzZUZpbGUgPSAoKSA9PiB7XG4gICAgY29uc3QgYXVkaW8gPSBkc3BFbmdpbmUuZ2V0QXVkaW9FbGVtZW50KCk7XG4gICAgaWYgKCFhdWRpbykgcmV0dXJuO1xuICAgIGlmIChhdWRpby5wYXVzZWQpIHtcbiAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICAgIHNldElzUGxheWluZ0ZpbGUodHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF1ZGlvLnBhdXNlKCk7XG4gICAgICBzZXRJc1BsYXlpbmdGaWxlKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlU2VlayA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgIGNvbnN0IGF1ZGlvID0gZHNwRW5naW5lLmdldEF1ZGlvRWxlbWVudCgpO1xuICAgIGlmICghYXVkaW8pIHJldHVybjtcbiAgICBjb25zdCB0aW1lID0gcGFyc2VGbG9hdChlLnRhcmdldC52YWx1ZSk7XG4gICAgYXVkaW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICAgIHNldEZpbGVQcm9ncmVzcyh0aW1lKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVUb2dnbGVNaWMgPSBhc3luYyAoKSA9PiB7XG4gICAgc2V0TWljRXJyb3IobnVsbCk7XG4gICAgaWYgKGN1cnJlbnRTb3VyY2UgPT09ICdtaWMnKSB7XG4gICAgICBkc3BFbmdpbmUuc3RvcEN1cnJlbnRTb3VyY2UoKTtcbiAgICAgIG9uU291cmNlQ2hhbmdlKCdub25lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGRzcEVuZ2luZS5zZXRBdWRpb1NvdXJjZSgnbWljJyk7XG4gICAgICAgIG9uU291cmNlQ2hhbmdlKCdtaWMnKTtcbiAgICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikge1xuICAgICAgICBjb25zdCBtc2cgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogJ1Blcm1pc28gZGUgbWljcsOzZm9ubyBkZW5lZ2Fkbyc7XG4gICAgICAgIHNldE1pY0Vycm9yKG1zZyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZVRvZ2dsZVN5bnRoID0gYXN5bmMgKHR5cGU6IFN5bnRoU2lnbmFsVHlwZSA9IHN5bnRoVHlwZSkgPT4ge1xuICAgIGlmIChjdXJyZW50U291cmNlID09PSAnc3ludGgnICYmIHR5cGUgPT09IHN5bnRoVHlwZSkge1xuICAgICAgZHNwRW5naW5lLnN0b3BDdXJyZW50U291cmNlKCk7XG4gICAgICBvblNvdXJjZUNoYW5nZSgnbm9uZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRTeW50aFR5cGUodHlwZSk7XG4gICAgICBhd2FpdCBkc3BFbmdpbmUuc2V0QXVkaW9Tb3VyY2UoJ3N5bnRoJywgeyBzeW50aFR5cGU6IHR5cGUsIHN5bnRoRnJlcSB9KTtcbiAgICAgIG9uU291cmNlQ2hhbmdlKCdzeW50aCcpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVTeW50aEZyZXFDaGFuZ2UgPSAoZjogbnVtYmVyKSA9PiB7XG4gICAgc2V0U3ludGhGcmVxKGYpO1xuICAgIGRzcEVuZ2luZS5zZXRTeW50aEZyZXF1ZW5jeShmKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVTdG9wQWxsID0gKCkgPT4ge1xuICAgIGRzcEVuZ2luZS5zdG9wQ3VycmVudFNvdXJjZSgpO1xuICAgIG9uU291cmNlQ2hhbmdlKCdub25lJyk7XG4gICAgc2V0SXNQbGF5aW5nRmlsZShmYWxzZSk7XG4gIH07XG5cbiAgY29uc3QgZm9ybWF0VGltZSA9IChzZWNzOiBudW1iZXIpID0+IHtcbiAgICBpZiAoaXNOYU4oc2VjcykgfHwgc2VjcyA8IDApIHJldHVybiAnMDowMCc7XG4gICAgY29uc3QgbSA9IE1hdGguZmxvb3Ioc2VjcyAvIDYwKTtcbiAgICBjb25zdCBzID0gTWF0aC5mbG9vcihzZWNzICUgNjApO1xuICAgIHJldHVybiBgJHttfToke3MgPCAxMCA/ICcwJyA6ICcnfSR7c31gO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJiZy1uZXV0cmFsLTkwMC85MCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHJvdW5kZWQteGwgcC00IGZsZXggZmxleC1jb2wgZ2FwLTNcIj5cbiAgICAgIHsvKiBUb3AgU2VsZWN0b3IgQmFyICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0zIHBiLTIgYm9yZGVyLWIgYm9yZGVyLW5ldXRyYWwtODAwXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZVwiPkZ1ZW50ZSBkZSBBdWRpbyBSZWFsOjwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSB0ZXh0LW5ldXRyYWwtNDAwIGZvbnQtbW9ub1wiPlxuICAgICAgICAgICAge2N1cnJlbnRTb3VyY2UgPT09ICdmaWxlJ1xuICAgICAgICAgICAgICA/ICdBcmNoaXZvIExvY2FsIEFjdGl2bydcbiAgICAgICAgICAgICAgOiBjdXJyZW50U291cmNlID09PSAnbWljJ1xuICAgICAgICAgICAgICA/ICdNaWNyw7Nmb25vIEbDrXNpY28gZW4gVml2bydcbiAgICAgICAgICAgICAgOiBjdXJyZW50U291cmNlID09PSAnc3ludGgnXG4gICAgICAgICAgICAgID8gYEdlbmVyYWRvciAoJHtzeW50aFR5cGV9KWBcbiAgICAgICAgICAgICAgOiAnU2luIHNlw7FhbCAoU2lsZW5jaW8pJ31cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBTb3VyY2UgQWN0aW9uIEJ1dHRvbnMgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGdhcC0yXCI+XG4gICAgICAgICAgey8qIEZpbGUgQXVkaW8gUGlja2VyICovfVxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgcmVmPXtmaWxlSW5wdXRSZWZ9XG4gICAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgICBhY2NlcHQ9XCJhdWRpby8qXCJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVGaWxlU2VsZWN0fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaGlkZGVuXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGZpbGVJbnB1dFJlZi5jdXJyZW50Py5jbGljaygpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtbWVkaXVtIGJvcmRlciBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMS41IHRyYW5zaXRpb24tY29sb3JzICR7XG4gICAgICAgICAgICAgIGN1cnJlbnRTb3VyY2UgPT09ICdmaWxlJ1xuICAgICAgICAgICAgICAgID8gJ2JnLWVtZXJhbGQtNTAwLzIwIHRleHQtZW1lcmFsZC0zMDAgYm9yZGVyLWVtZXJhbGQtNTAwLzUwJ1xuICAgICAgICAgICAgICAgIDogJ2JnLW5ldXRyYWwtOTUwIGhvdmVyOmJnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC0zMDAgYm9yZGVyLW5ldXRyYWwtODAwJ1xuICAgICAgICAgICAgfWB9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFVwbG9hZCBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICB7ZmlsZU5hbWUgPyAnQ2FtYmlhciBBcmNoaXZvJyA6ICdDYXJnYXIgQXJjaGl2byd9XG4gICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICB7LyogTWljcm9waG9uZSBMaXZlIElucHV0ICovfVxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVRvZ2dsZU1pY31cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LW1lZGl1bSBib3JkZXIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICBjdXJyZW50U291cmNlID09PSAnbWljJ1xuICAgICAgICAgICAgICAgID8gJ2JnLXJvc2UtNTAwLzIwIHRleHQtcm9zZS0zMDAgYm9yZGVyLXJvc2UtNTAwLzUwIGFuaW1hdGUtcHVsc2UnXG4gICAgICAgICAgICAgICAgOiAnYmctbmV1dHJhbC05NTAgaG92ZXI6YmctbmV1dHJhbC04MDAgdGV4dC1uZXV0cmFsLTMwMCBib3JkZXItbmV1dHJhbC04MDAnXG4gICAgICAgICAgICB9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8TWljIGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz5cbiAgICAgICAgICAgIHtjdXJyZW50U291cmNlID09PSAnbWljJyA/ICdEZXRlbmVyIE1pYycgOiAnTWljcsOzZm9ubyBlbiBWaXZvJ31cbiAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgIHsvKiBTeW50aCBUZXN0IEdlbmVyYXRvciBUb2dnbGUgKi99XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlVG9nZ2xlU3ludGgoc3ludGhUeXBlKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHB4LTMgcHktMS41IHJvdW5kZWQtbGcgdGV4dC14cyBmb250LW1lZGl1bSBib3JkZXIgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTEuNSB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICBjdXJyZW50U291cmNlID09PSAnc3ludGgnXG4gICAgICAgICAgICAgICAgPyAnYmctc2t5LTUwMC8yMCB0ZXh0LXNreS0zMDAgYm9yZGVyLXNreS01MDAvNTAnXG4gICAgICAgICAgICAgICAgOiAnYmctbmV1dHJhbC05NTAgaG92ZXI6YmctbmV1dHJhbC04MDAgdGV4dC1uZXV0cmFsLTMwMCBib3JkZXItbmV1dHJhbC04MDAnXG4gICAgICAgICAgICB9YH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8UmFkaW8gY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgU2XDsWFsZXMgZGUgQ2FsaWJyYWNpw7NuXG4gICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICB7LyogU3RvcCAvIFNpbGVuY2UgKi99XG4gICAgICAgICAge2N1cnJlbnRTb3VyY2UgIT09ICdub25lJyAmJiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVN0b3BBbGx9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInB4LTIuNSBweS0xLjUgcm91bmRlZC1sZyB0ZXh0LXhzIGZvbnQtbWVkaXVtIGJnLW5ldXRyYWwtOTUwIGhvdmVyOmJnLW5ldXRyYWwtODAwIHRleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHRyYW5zaXRpb24tY29sb3JzIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xXCJcbiAgICAgICAgICAgICAgdGl0bGU9XCJEZXRlbmVyIGF1ZGlvXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPFNxdWFyZSBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgICAgIFNpbGVuY2lvXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogTWljIEVycm9yIE5vdGljZSAqL31cbiAgICAgIHttaWNFcnJvciAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0yLjUgcm91bmRlZCBiZy1yb3NlLTk1MC80MCBib3JkZXIgYm9yZGVyLXJvc2UtODAwLzYwIHRleHQteHMgdGV4dC1yb3NlLTMwMCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgIDxBbGVydENpcmNsZSBjbGFzc05hbWU9XCJ3LTQgaC00IHNocmluay0wIHRleHQtcm9zZS00MDBcIiAvPlxuICAgICAgICAgIDxzcGFuPkVycm9yIGRlIGNhcHR1cmE6IHttaWNFcnJvcn0uIEFzZWfDunJhdGUgZGUgcGVybWl0aXIgZWwgYWNjZXNvIGFsIG1pY3LDs2Zvbm8gZW4gZWwgbmF2ZWdhZG9yLjwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogRmlsZSBQbGF5ZXIgQ29udHJvbHMgKFNob3duIHdoZW4gZmlsZSBpcyBhY3RpdmUpICovfVxuICAgICAge2N1cnJlbnRTb3VyY2UgPT09ICdmaWxlJyAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC0zIHJvdW5kZWQtbGcgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCBmbGV4IGZsZXgtY29sIGdhcC0yXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gdGV4dC14c1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LW1lZGl1bSB0cnVuY2F0ZSBtYXgtdy14c1wiPntmaWxlTmFtZX08L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1uZXV0cmFsLTQwMCB0ZXh0LVsxMXB4XVwiPlxuICAgICAgICAgICAgICB7Zm9ybWF0VGltZShmaWxlUHJvZ3Jlc3MpfSAvIHtmb3JtYXRUaW1lKGZpbGVEdXJhdGlvbil9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zXCI+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RvZ2dsZVBsYXlQYXVzZUZpbGV9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMiByb3VuZGVkLWZ1bGwgYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHtpc1BsYXlpbmdGaWxlID8gPFBhdXNlIGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPiA6IDxQbGF5IGNsYXNzTmFtZT1cInctNCBoLTQgbWwtMC41XCIgLz59XG4gICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICAgIG1pbj1cIjBcIlxuICAgICAgICAgICAgICBtYXg9e2ZpbGVEdXJhdGlvbiB8fCAxMDB9XG4gICAgICAgICAgICAgIHN0ZXA9XCIwLjFcIlxuICAgICAgICAgICAgICB2YWx1ZT17ZmlsZVByb2dyZXNzfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17aGFuZGxlU2Vla31cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIGFjY2VudC1lbWVyYWxkLTUwMCBjdXJzb3ItcG9pbnRlclwiXG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhdWRpbyA9IGRzcEVuZ2luZS5nZXRBdWRpb0VsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoYXVkaW8pIHtcbiAgICAgICAgICAgICAgICAgIGF1ZGlvLmxvb3AgPSAhaXNMb29waW5nO1xuICAgICAgICAgICAgICAgICAgc2V0SXNMb29waW5nKCFpc0xvb3BpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcC0xLjUgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgIGlzTG9vcGluZyA/ICd0ZXh0LWVtZXJhbGQtNDAwIGJnLWVtZXJhbGQtOTUwLzQwJyA6ICd0ZXh0LW5ldXRyYWwtNTAwIGhvdmVyOnRleHQtd2hpdGUnXG4gICAgICAgICAgICAgIH1gfVxuICAgICAgICAgICAgICB0aXRsZT1cIlJlcGV0aXIgZW4gYnVjbGVcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8UmVwZWF0IGNsYXNzTmFtZT1cInctNCBoLTRcIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIFN5bnRoIEdlbmVyYXRvciBDb250cm9scyAoU2hvd24gd2hlbiBzeW50aCBpcyBhY3RpdmUpICovfVxuICAgICAge2N1cnJlbnRTb3VyY2UgPT09ICdzeW50aCcgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMyByb3VuZGVkLWxnIGJnLW5ldXRyYWwtOTUwIGJvcmRlciBib3JkZXItbmV1dHJhbC04MDAgZmxleCBmbGV4LWNvbCBnYXAtM1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBnYXAtMlwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtbmV1dHJhbC00MDBcIj5UaXBvIGRlIE9uZGE6PC9zcGFuPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggcm91bmRlZCBiZy1uZXV0cmFsLTkwMCBib3JkZXIgYm9yZGVyLW5ldXRyYWwtODAwIHAtMC41IHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICB7KFsnc3dlZXAnLCAnc2luZScsICdwaW5rX25vaXNlJywgJ3doaXRlX25vaXNlJ10gYXMgU3ludGhTaWduYWxUeXBlW10pLm1hcCh0ID0+IChcbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAga2V5PXt0fVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVUb2dnbGVTeW50aCh0KX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMi41IHB5LTEgcm91bmRlZCB0cmFuc2l0aW9uLWNvbG9ycyAke1xuICAgICAgICAgICAgICAgICAgICAgIHN5bnRoVHlwZSA9PT0gdCA/ICdiZy1za3ktNjAwIHRleHQtd2hpdGUgZm9udC1tZWRpdW0nIDogJ3RleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSdcbiAgICAgICAgICAgICAgICAgICAgfWB9XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt0ID09PSAnc3dlZXAnXG4gICAgICAgICAgICAgICAgICAgICAgPyAnQmFycmlkbyAyMEh6LTIwa0h6J1xuICAgICAgICAgICAgICAgICAgICAgIDogdCA9PT0gJ3NpbmUnXG4gICAgICAgICAgICAgICAgICAgICAgPyAnVG9ubyBTZW5vaWRhbCdcbiAgICAgICAgICAgICAgICAgICAgICA6IHQgPT09ICdwaW5rX25vaXNlJ1xuICAgICAgICAgICAgICAgICAgICAgID8gJ1J1aWRvIFJvc2EgKDEvZiknXG4gICAgICAgICAgICAgICAgICAgICAgOiAnUnVpZG8gQmxhbmNvJ31cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7c3ludGhUeXBlID09PSAnc2luZScgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIHRleHQteHNcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LW5ldXRyYWwtNDAwXCI+RnJlY3VlbmNpYTo8L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tb25vIHRleHQtc2t5LTQwMCBmb250LWJvbGRcIj57c3ludGhGcmVxfSBIejwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge3N5bnRoVHlwZSA9PT0gJ3NpbmUnICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTNcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1uZXV0cmFsLTUwMCBmb250LW1vbm9cIj4yMCBIejwvc3Bhbj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCJcbiAgICAgICAgICAgICAgICBtaW49XCIyMFwiXG4gICAgICAgICAgICAgICAgbWF4PVwiNTAwMFwiXG4gICAgICAgICAgICAgICAgc3RlcD1cIjFcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtzeW50aEZyZXF9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gaGFuZGxlU3ludGhGcmVxQ2hhbmdlKHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIGFjY2VudC1za3ktNDAwIGN1cnNvci1wb2ludGVyXCJcbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gdGV4dC1uZXV0cmFsLTUwMCBmb250LW1vbm9cIj41IGtIejwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG4iXX0=