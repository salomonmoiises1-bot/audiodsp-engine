const React = __vite__cjsImport0_react; const useState = __vite__cjsImport0_react["useState"]; const useRef = __vite__cjsImport0_react["useRef"];const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];import __vite__cjsImport0_react from "/node_modules/.vite/deps/react.js?v=6e8f5db9";
import { Bookmark, Plus, Save, Trash2, Download, Upload, RotateCcw } from "/node_modules/.vite/deps/lucide-react.js?v=6e8f5db9";
var _jsxFileName = "/app/applet/src/components/PresetBar.tsx";
import __vite__cjsImport2_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=6e8f5db9";
export const PresetBar = ({ currentPresetId, allPresets, onSelectPreset, onSavePreset, onDeletePreset, onExportPresets, onImportPresets, onResetFlat }) => {
	const [isCreating, setIsCreating] = useState(false);
	const [newPresetName, setNewPresetName] = useState("");
	const [newPresetCategory, setNewPresetCategory] = useState("Personalizado");
	const fileInputRef = useRef(null);
	const currentPreset = allPresets.find((p) => p.id === currentPresetId);
	const handleSaveSubmit = (e) => {
		e.preventDefault();
		if (!newPresetName.trim()) return;
		onSavePreset(newPresetName.trim(), newPresetCategory.trim());
		setNewPresetName("");
		setIsCreating(false);
	};
	const handleImportFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const json = JSON.parse(event.target?.result);
				if (Array.isArray(json)) {
					onImportPresets(json);
				}
			} catch (err) {
				console.error("Failed to import JSON presets", err);
			}
		};
		reader.readAsText(file);
	};
	return /* @__PURE__ */ _jsxDEV("div", {
		className: "bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3",
		children: [
			/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center gap-2 flex-1 min-w-[280px]",
				children: [
					/* @__PURE__ */ _jsxDEV(Bookmark, { className: "w-4 h-4 text-emerald-400 shrink-0" }, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 62,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("span", {
						className: "text-xs font-semibold text-white whitespace-nowrap",
						children: "Presets DSP:"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 63,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("select", {
						value: currentPresetId,
						onChange: (e) => {
							const found = allPresets.find((p) => p.id === e.target.value);
							if (found) onSelectPreset(found);
						},
						className: "flex-1 bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-medium",
						children: [/* @__PURE__ */ _jsxDEV("optgroup", {
							label: "Presets de Fábrica (Referencia de Audio)",
							children: allPresets.filter((p) => p.isFactory).map((p) => /* @__PURE__ */ _jsxDEV("option", {
								value: p.id,
								children: [
									p.name,
									" [",
									p.category,
									"]"
								]
							}, p.id, true, {
								fileName: _jsxFileName,
								lineNumber: 76,
								columnNumber: 17
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 72,
							columnNumber: 11
						}, this), allPresets.some((p) => !p.isFactory) && /* @__PURE__ */ _jsxDEV("optgroup", {
							label: "Presets de Usuario",
							children: allPresets.filter((p) => !p.isFactory).map((p) => /* @__PURE__ */ _jsxDEV("option", {
								value: p.id,
								children: [
									p.name,
									" (",
									p.category,
									")"
								]
							}, p.id, true, {
								fileName: _jsxFileName,
								lineNumber: 86,
								columnNumber: 19
							}, this))
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 82,
							columnNumber: 13
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 64,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 61,
				columnNumber: 7
			}, this),
			/* @__PURE__ */ _jsxDEV("div", {
				className: "flex items-center gap-1.5",
				children: [
					/* @__PURE__ */ _jsxDEV("button", {
						onClick: () => setIsCreating(true),
						className: "px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 flex items-center gap-1 transition-colors",
						title: "Guardar ajuste actual como nuevo preset",
						children: [/* @__PURE__ */ _jsxDEV(Plus, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 102,
							columnNumber: 11
						}, this), /* @__PURE__ */ _jsxDEV("span", {
							className: "hidden sm:inline",
							children: "Nuevo Preset"
						}, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 103,
							columnNumber: 11
						}, this)]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 97,
						columnNumber: 9
					}, this),
					currentPreset && !currentPreset.isFactory && /* @__PURE__ */ _jsxDEV("button", {
						onClick: () => onDeletePreset(currentPreset.id),
						className: "p-1.5 bg-neutral-800 hover:bg-rose-900/60 text-neutral-400 hover:text-rose-300 rounded-lg border border-neutral-700 transition-colors",
						title: "Eliminar preset de usuario",
						children: /* @__PURE__ */ _jsxDEV(Trash2, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 112,
							columnNumber: 13
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 107,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						onClick: onResetFlat,
						className: "p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg border border-neutral-700 transition-colors",
						title: "Restaurar a respuesta plana (Flat Reference)",
						children: /* @__PURE__ */ _jsxDEV(RotateCcw, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 121,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 116,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						onClick: onExportPresets,
						className: "p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg border border-neutral-700 transition-colors",
						title: "Exportar presets a JSON",
						children: /* @__PURE__ */ _jsxDEV(Download, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 129,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 124,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("input", {
						ref: fileInputRef,
						type: "file",
						accept: ".json",
						onChange: handleImportFile,
						className: "hidden"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 132,
						columnNumber: 9
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						onClick: () => fileInputRef.current?.click(),
						className: "p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-lg border border-neutral-700 transition-colors",
						title: "Importar presets desde JSON",
						children: /* @__PURE__ */ _jsxDEV(Upload, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 144,
							columnNumber: 11
						}, this)
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 139,
						columnNumber: 9
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 96,
				columnNumber: 7
			}, this),
			isCreating && /* @__PURE__ */ _jsxDEV("form", {
				onSubmit: handleSaveSubmit,
				className: "w-full mt-2 pt-2 border-t border-neutral-800 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ _jsxDEV("input", {
						type: "text",
						placeholder: "Nombre del preset...",
						value: newPresetName,
						onChange: (e) => setNewPresetName(e.target.value),
						className: "flex-1 min-w-[180px] bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500",
						autoFocus: true
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 154,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("input", {
						type: "text",
						placeholder: "Categoría (ej. Mastering, Voz, En Vivo)...",
						value: newPresetCategory,
						onChange: (e) => setNewPresetCategory(e.target.value),
						className: "w-44 bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 162,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						type: "submit",
						className: "px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors",
						children: [/* @__PURE__ */ _jsxDEV(Save, { className: "w-3.5 h-3.5" }, void 0, false, {
							fileName: _jsxFileName,
							lineNumber: 173,
							columnNumber: 13
						}, this), "Guardar"]
					}, void 0, true, {
						fileName: _jsxFileName,
						lineNumber: 169,
						columnNumber: 11
					}, this),
					/* @__PURE__ */ _jsxDEV("button", {
						type: "button",
						onClick: () => setIsCreating(false),
						className: "px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-lg text-xs transition-colors",
						children: "Cancelar"
					}, void 0, false, {
						fileName: _jsxFileName,
						lineNumber: 176,
						columnNumber: 11
					}, this)
				]
			}, void 0, true, {
				fileName: _jsxFileName,
				lineNumber: 150,
				columnNumber: 9
			}, this)
		]
	}, void 0, true, {
		fileName: _jsxFileName,
		lineNumber: 59,
		columnNumber: 5
	}, this);
};

//# sourceMappingURL=data:application/json;base64,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eCJdLCJ2ZXJzaW9uIjozLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IERTUFByZXNldCB9IGZyb20gJy4uL3R5cGVzL2RzcCc7XG5pbXBvcnQgeyBCb29rbWFyaywgUGx1cywgU2F2ZSwgVHJhc2gyLCBEb3dubG9hZCwgVXBsb2FkLCBSb3RhdGVDY3cgfSBmcm9tICdsdWNpZGUtcmVhY3QnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBjdXJyZW50UHJlc2V0SWQ6IHN0cmluZztcbiAgYWxsUHJlc2V0czogRFNQUHJlc2V0W107XG4gIG9uU2VsZWN0UHJlc2V0OiAocHJlc2V0OiBEU1BQcmVzZXQpID0+IHZvaWQ7XG4gIG9uU2F2ZVByZXNldDogKG5hbWU6IHN0cmluZywgY2F0ZWdvcnk6IHN0cmluZykgPT4gdm9pZDtcbiAgb25EZWxldGVQcmVzZXQ6IChpZDogc3RyaW5nKSA9PiB2b2lkO1xuICBvbkV4cG9ydFByZXNldHM6ICgpID0+IHZvaWQ7XG4gIG9uSW1wb3J0UHJlc2V0czogKHByZXNldHM6IERTUFByZXNldFtdKSA9PiB2b2lkO1xuICBvblJlc2V0RmxhdDogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IFByZXNldEJhcjogUmVhY3QuRkM8UHJvcHM+ID0gKHtcbiAgY3VycmVudFByZXNldElkLFxuICBhbGxQcmVzZXRzLFxuICBvblNlbGVjdFByZXNldCxcbiAgb25TYXZlUHJlc2V0LFxuICBvbkRlbGV0ZVByZXNldCxcbiAgb25FeHBvcnRQcmVzZXRzLFxuICBvbkltcG9ydFByZXNldHMsXG4gIG9uUmVzZXRGbGF0LFxufSkgPT4ge1xuICBjb25zdCBbaXNDcmVhdGluZywgc2V0SXNDcmVhdGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtuZXdQcmVzZXROYW1lLCBzZXROZXdQcmVzZXROYW1lXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW25ld1ByZXNldENhdGVnb3J5LCBzZXROZXdQcmVzZXRDYXRlZ29yeV0gPSB1c2VTdGF0ZSgnUGVyc29uYWxpemFkbycpO1xuICBjb25zdCBmaWxlSW5wdXRSZWYgPSB1c2VSZWY8SFRNTElucHV0RWxlbWVudD4obnVsbCk7XG5cbiAgY29uc3QgY3VycmVudFByZXNldCA9IGFsbFByZXNldHMuZmluZChwID0+IHAuaWQgPT09IGN1cnJlbnRQcmVzZXRJZCk7XG5cbiAgY29uc3QgaGFuZGxlU2F2ZVN1Ym1pdCA9IChlOiBSZWFjdC5Gb3JtRXZlbnQpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKCFuZXdQcmVzZXROYW1lLnRyaW0oKSkgcmV0dXJuO1xuICAgIG9uU2F2ZVByZXNldChuZXdQcmVzZXROYW1lLnRyaW0oKSwgbmV3UHJlc2V0Q2F0ZWdvcnkudHJpbSgpKTtcbiAgICBzZXROZXdQcmVzZXROYW1lKCcnKTtcbiAgICBzZXRJc0NyZWF0aW5nKGZhbHNlKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVJbXBvcnRGaWxlID0gKGU6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IGUudGFyZ2V0LmZpbGVzPy5bMF07XG4gICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gZXZlbnQgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QganNvbiA9IEpTT04ucGFyc2UoZXZlbnQudGFyZ2V0Py5yZXN1bHQgYXMgc3RyaW5nKTtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbikpIHtcbiAgICAgICAgICBvbkltcG9ydFByZXNldHMoanNvbik7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW1wb3J0IEpTT04gcHJlc2V0cycsIGVycik7XG4gICAgICB9XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctbmV1dHJhbC05MDAvOTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTgwMCByb3VuZGVkLXhsIHAtMyBmbGV4IGZsZXgtd3JhcCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC0zXCI+XG4gICAgICB7LyogUHJlc2V0IFNlbGVjdG9yIERyb3Bkb3duICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiBmbGV4LTEgbWluLXctWzI4MHB4XVwiPlxuICAgICAgICA8Qm9va21hcmsgY2xhc3NOYW1lPVwidy00IGgtNCB0ZXh0LWVtZXJhbGQtNDAwIHNocmluay0wXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LXNlbWlib2xkIHRleHQtd2hpdGUgd2hpdGVzcGFjZS1ub3dyYXBcIj5QcmVzZXRzIERTUDo8L3NwYW4+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICB2YWx1ZT17Y3VycmVudFByZXNldElkfVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gYWxsUHJlc2V0cy5maW5kKHAgPT4gcC5pZCA9PT0gZS50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgaWYgKGZvdW5kKSBvblNlbGVjdFByZXNldChmb3VuZCk7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCB0ZXh0LW5ldXRyYWwtMjAwIHRleHQteHMgcm91bmRlZC1sZyBweC0yLjUgcHktMS41IGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItZW1lcmFsZC01MDAgZm9udC1tZWRpdW1cIlxuICAgICAgICA+XG4gICAgICAgICAgPG9wdGdyb3VwIGxhYmVsPVwiUHJlc2V0cyBkZSBGw6FicmljYSAoUmVmZXJlbmNpYSBkZSBBdWRpbylcIj5cbiAgICAgICAgICAgIHthbGxQcmVzZXRzXG4gICAgICAgICAgICAgIC5maWx0ZXIocCA9PiBwLmlzRmFjdG9yeSlcbiAgICAgICAgICAgICAgLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAge3AubmFtZX0gW3twLmNhdGVnb3J5fV1cbiAgICAgICAgICAgICAgICA8L29wdGlvbj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9vcHRncm91cD5cbiAgICAgICAgICB7YWxsUHJlc2V0cy5zb21lKHAgPT4gIXAuaXNGYWN0b3J5KSAmJiAoXG4gICAgICAgICAgICA8b3B0Z3JvdXAgbGFiZWw9XCJQcmVzZXRzIGRlIFVzdWFyaW9cIj5cbiAgICAgICAgICAgICAge2FsbFByZXNldHNcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHAgPT4gIXAuaXNGYWN0b3J5KVxuICAgICAgICAgICAgICAgIC5tYXAocCA9PiAoXG4gICAgICAgICAgICAgICAgICA8b3B0aW9uIGtleT17cC5pZH0gdmFsdWU9e3AuaWR9PlxuICAgICAgICAgICAgICAgICAgICB7cC5uYW1lfSAoe3AuY2F0ZWdvcnl9KVxuICAgICAgICAgICAgICAgICAgPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L29wdGdyb3VwPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBQcmVzZXQgQWN0aW9uIEJ1dHRvbnMgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjVcIj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzQ3JlYXRpbmcodHJ1ZSl9XG4gICAgICAgICAgY2xhc3NOYW1lPVwicHgtMi41IHB5LTEuNSBiZy1uZXV0cmFsLTgwMCBob3ZlcjpiZy1uZXV0cmFsLTcwMCB0ZXh0LW5ldXRyYWwtMjAwIHJvdW5kZWQtbGcgdGV4dC14cyBmb250LW1lZGl1bSBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICB0aXRsZT1cIkd1YXJkYXIgYWp1c3RlIGFjdHVhbCBjb21vIG51ZXZvIHByZXNldFwiXG4gICAgICAgID5cbiAgICAgICAgICA8UGx1cyBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGlkZGVuIHNtOmlubGluZVwiPk51ZXZvIFByZXNldDwvc3Bhbj5cbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAge2N1cnJlbnRQcmVzZXQgJiYgIWN1cnJlbnRQcmVzZXQuaXNGYWN0b3J5ICYmIChcbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkRlbGV0ZVByZXNldChjdXJyZW50UHJlc2V0LmlkKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IGJnLW5ldXRyYWwtODAwIGhvdmVyOmJnLXJvc2UtOTAwLzYwIHRleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC1yb3NlLTMwMCByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgICAgdGl0bGU9XCJFbGltaW5hciBwcmVzZXQgZGUgdXN1YXJpb1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFRyYXNoMiBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e29uUmVzZXRGbGF0fVxuICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IGJnLW5ldXRyYWwtODAwIGhvdmVyOmJnLW5ldXRyYWwtNzAwIHRleHQtbmV1dHJhbC00MDAgaG92ZXI6dGV4dC13aGl0ZSByb3VuZGVkLWxnIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgIHRpdGxlPVwiUmVzdGF1cmFyIGEgcmVzcHVlc3RhIHBsYW5hIChGbGF0IFJlZmVyZW5jZSlcIlxuICAgICAgICA+XG4gICAgICAgICAgPFJvdGF0ZUNjdyBjbGFzc05hbWU9XCJ3LTMuNSBoLTMuNVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvbkV4cG9ydFByZXNldHN9XG4gICAgICAgICAgY2xhc3NOYW1lPVwicC0xLjUgYmctbmV1dHJhbC04MDAgaG92ZXI6YmctbmV1dHJhbC03MDAgdGV4dC1uZXV0cmFsLTQwMCBob3Zlcjp0ZXh0LXdoaXRlIHJvdW5kZWQtbGcgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgdGl0bGU9XCJFeHBvcnRhciBwcmVzZXRzIGEgSlNPTlwiXG4gICAgICAgID5cbiAgICAgICAgICA8RG93bmxvYWQgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZWY9e2ZpbGVJbnB1dFJlZn1cbiAgICAgICAgICB0eXBlPVwiZmlsZVwiXG4gICAgICAgICAgYWNjZXB0PVwiLmpzb25cIlxuICAgICAgICAgIG9uQ2hhbmdlPXtoYW5kbGVJbXBvcnRGaWxlfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImhpZGRlblwiXG4gICAgICAgIC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBmaWxlSW5wdXRSZWYuY3VycmVudD8uY2xpY2soKX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBiZy1uZXV0cmFsLTgwMCBob3ZlcjpiZy1uZXV0cmFsLTcwMCB0ZXh0LW5ldXRyYWwtNDAwIGhvdmVyOnRleHQtd2hpdGUgcm91bmRlZC1sZyBib3JkZXIgYm9yZGVyLW5ldXRyYWwtNzAwIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICB0aXRsZT1cIkltcG9ydGFyIHByZXNldHMgZGVzZGUgSlNPTlwiXG4gICAgICAgID5cbiAgICAgICAgICA8VXBsb2FkIGNsYXNzTmFtZT1cInctMy41IGgtMy41XCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFNhdmUgTmV3IFByZXNldCBNb2RhbCBCYXIgKi99XG4gICAgICB7aXNDcmVhdGluZyAmJiAoXG4gICAgICAgIDxmb3JtXG4gICAgICAgICAgb25TdWJtaXQ9e2hhbmRsZVNhdmVTdWJtaXR9XG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIG10LTIgcHQtMiBib3JkZXItdCBib3JkZXItbmV1dHJhbC04MDAgZmxleCBmbGV4LXdyYXAgaXRlbXMtY2VudGVyIGdhcC0yXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJOb21icmUgZGVsIHByZXNldC4uLlwiXG4gICAgICAgICAgICB2YWx1ZT17bmV3UHJlc2V0TmFtZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldE5ld1ByZXNldE5hbWUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleC0xIG1pbi13LVsxODBweF0gYmctbmV1dHJhbC05NTAgYm9yZGVyIGJvcmRlci1uZXV0cmFsLTcwMCB0ZXh0LW5ldXRyYWwtMjAwIHRleHQteHMgcm91bmRlZC1sZyBweC0yLjUgcHktMS41IGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItZW1lcmFsZC01MDBcIlxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgLz5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiQ2F0ZWdvcsOtYSAoZWouIE1hc3RlcmluZywgVm96LCBFbiBWaXZvKS4uLlwiXG4gICAgICAgICAgICB2YWx1ZT17bmV3UHJlc2V0Q2F0ZWdvcnl9XG4gICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXROZXdQcmVzZXRDYXRlZ29yeShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ3LTQ0IGJnLW5ldXRyYWwtOTUwIGJvcmRlciBib3JkZXItbmV1dHJhbC03MDAgdGV4dC1uZXV0cmFsLTIwMCB0ZXh0LXhzIHJvdW5kZWQtbGcgcHgtMi41IHB5LTEuNSBmb2N1czpvdXRsaW5lLW5vbmUgZm9jdXM6Ym9yZGVyLWVtZXJhbGQtNTAwXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJzdWJtaXRcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwicHgtMyBweS0xLjUgYmctZW1lcmFsZC02MDAgaG92ZXI6YmctZW1lcmFsZC01MDAgdGV4dC13aGl0ZSByb3VuZGVkLWxnIHRleHQteHMgZm9udC1zZW1pYm9sZCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSB0cmFuc2l0aW9uLWNvbG9yc1wiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPFNhdmUgY2xhc3NOYW1lPVwidy0zLjUgaC0zLjVcIiAvPlxuICAgICAgICAgICAgR3VhcmRhclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNDcmVhdGluZyhmYWxzZSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJweC0yLjUgcHktMS41IGJnLW5ldXRyYWwtODAwIGhvdmVyOmJnLW5ldXRyYWwtNzAwIHRleHQtbmV1dHJhbC00MDAgcm91bmRlZC1sZyB0ZXh0LXhzIHRyYW5zaXRpb24tY29sb3JzXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICBDYW5jZWxhclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcbiJdfQ==