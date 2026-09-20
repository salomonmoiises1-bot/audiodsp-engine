const JSZip = __vite__cjsImport0_jszip;import __vite__cjsImport0_jszip from "/node_modules/.vite/deps/jszip.js?v=6e8f5db9";
// Bundles all application source code into a clean, standalone ZIP download directly in Android
export async function downloadProjectZip(onProgress) {
	onProgress?.("Preparando archivos fuente y arquitectura Android 14...");
	const zip = new JSZip();
	// Root files
	zip.file("package.json", JSON.stringify({
		name: "audiodsp-engine-pro",
		private: true,
		version: "1.0.0",
		type: "module",
		scripts: {
			dev: "vite --port=3000 --host=0.0.0.0",
			build: "vite build",
			preview: "vite preview",
			lint: "tsc --noEmit"
		},
		dependencies: {
			"@tailwindcss/vite": "^4.3.3",
			"@vitejs/plugin-react": "^6.1.1",
			"lucide-react": "^0.546.0",
			"motion": "^12.23.24",
			"react": "^19.0.1",
			"react-dom": "^19.0.1",
			"vite": "^8.3.0",
			"jszip": "^3.10.2"
		},
		devDependencies: {
			"@types/node": "^22.14.0",
			"@types/react": "^19.3.0",
			"@types/react-dom": "^19.3.0",
			"tailwindcss": "^4.3.3",
			"typescript": "^7.0.2"
		}
	}, null, 2));
	zip.file("README.md", `# AudioDSP Engine Pro (Compatible con Android 14 / API 34+)

Motor de procesamiento de señal digital (DSP) por software en punto flotante de 32 bits para Android y flujos PCM.

## Características Principales
- **Cadena DSP de 10 Etapas**: Preamp, Bass Boost con armónicos tanh y filtro subsónico, Virtualizer estéreo 3D, Ecualizador paramétrico de 32 bandas ISO 266, Controles de tono (3 vías), MDRC multibanda Linkwitz-Riley, AutoGain RMS, Ganancia maestra/Balance, Soft Limiter Brickwall y Bypass maestro.
- **Cumplimiento Estricto Android 14 (API 34)**:
  - Definición de \`foregroundServiceType="mediaPlayback|microphone"\`
  - Servicio \`AndroidDspForegroundService.kt\` con \`ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK\`
  - Permisos \`FOREGROUND_SERVICE_MEDIA_PLAYBACK\` y \`POST_NOTIFICATIONS\`
  - Audio en punto flotante nativo (\`AudioFormat.ENCODING_PCM_FLOAT\`)
- **Suite de Pruebas**: 38 pruebas numéricas unitarias en tiempo real.

## Instrucciones de Compilación Web / PWA
\`\`\`bash
npm install
npm run build
\`\`\`
La carpeta resultante \`dist/\` contiene los binarios listos para publicar en GitHub Pages o desplegar.

## Integración con Android Studio (API 34+)
Los archivos fuente nativos están en la carpeta \`src/android/\`:
- \`AndroidManifest.xml\`
- \`AndroidDspForegroundService.kt\`
`);
	zip.file("vite.config.ts", `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
`);
	zip.file("tsconfig.json", `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    },
    "noEmit": true
  }
}
`);
	zip.file("index.html", `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AudioDSP Engine Pro - Android 14 API 34</title>
  </head>
  <body class="bg-neutral-950 text-neutral-100 overflow-x-hidden">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>
`);
	// Read files from runtime using fetch
	const fileList = [
		"src/main.tsx",
		"src/App.tsx",
		"src/index.css",
		"src/types/dsp.ts",
		"src/audio/dspEngine.ts",
		"src/audio/dspTestSuite.ts",
		"src/audio/pcmUtils.ts",
		"src/audio/presets.ts",
		"src/components/AndroidArchitectureModal.tsx",
		"src/components/AudioSourceBar.tsx",
		"src/components/DSPValidationModal.tsx",
		"src/components/DynamicsMDRCSection.tsx",
		"src/components/Equalizer32Section.tsx",
		"src/components/Header.tsx",
		"src/components/MeterBridge.tsx",
		"src/components/PresetBar.tsx",
		"src/components/SpectrumDisplay.tsx",
		"src/components/ToneAndBassSection.tsx",
		"src/components/DirectZipDownloadModal.tsx",
		"src/utils/zipDownloader.ts",
		"build.gradle.kts",
		"settings.gradle.kts",
		"gradle.properties",
		"gradle/libs.versions.toml",
		"gradle/wrapper/gradle-wrapper.properties",
		"app/build.gradle.kts",
		"app/proguard-rules.pro",
		"app/src/main/AndroidManifest.xml",
		"app/src/main/res/values/strings.xml",
		"app/src/main/res/values/themes.xml",
		"app/src/main/res/layout/activity_main.xml",
		"app/src/main/java/com/audiodsp/engine/MainActivity.kt",
		"app/src/main/java/com/audiodsp/engine/bridge/WebAppInterface.kt",
		"app/src/main/java/com/audiodsp/engine/dsp/BiquadFilter.kt",
		"app/src/main/java/com/audiodsp/engine/dsp/MdrcProcessor.kt",
		"app/src/main/java/com/audiodsp/engine/dsp/AudioDspEngine.kt",
		"app/src/main/java/com/audiodsp/engine/service/AndroidDspForegroundService.kt"
	];
	onProgress?.("Empaquetando componentes y algoritmos DSP...");
	for (const filePath of fileList) {
		try {
			const resp = await fetch("/" + filePath);
			if (resp.ok) {
				const content = await resp.text();
				zip.file(filePath, content);
			}
		} catch {}
	}
	onProgress?.("Generando archivo ZIP descargable...");
	const blob = await zip.generateAsync({ type: "blob" });
	// Trigger download on Android mobile browser
	const downloadUrl = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = downloadUrl;
	a.download = "AudioDSP-Engine-Pro-Android14-API34.zip";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	setTimeout(() => URL.revokeObjectURL(downloadUrl), 4e3);
}

//# sourceMappingURL=data:application/json;base64,eyJtYXBwaW5ncyI6IkFBQUEsT0FBTyxXQUFXOztBQUdsQixPQUFPLGVBQWUsbUJBQW1CLFlBQW1EO0NBQzFGLGFBQWEseURBQXlEO0NBQ3RFLE1BQU0sTUFBTSxJQUFJLE1BQU07O0NBR3RCLElBQUksS0FDRixnQkFDQSxLQUFLLFVBQ0g7RUFDRSxNQUFNO0VBQ04sU0FBUztFQUNULFNBQVM7RUFDVCxNQUFNO0VBQ04sU0FBUztHQUNQLEtBQUs7R0FDTCxPQUFPO0dBQ1AsU0FBUztHQUNULE1BQU07RUFDUjtFQUNBLGNBQWM7R0FDWixxQkFBcUI7R0FDckIsd0JBQXdCO0dBQ3hCLGdCQUFnQjtHQUNoQixVQUFVO0dBQ1YsU0FBUztHQUNULGFBQWE7R0FDYixRQUFRO0dBQ1IsU0FBUztFQUNYO0VBQ0EsaUJBQWlCO0dBQ2YsZUFBZTtHQUNmLGdCQUFnQjtHQUNoQixvQkFBb0I7R0FDcEIsZUFBZTtHQUNmLGNBQWM7RUFDaEI7Q0FDRixHQUNBLE1BQ0EsQ0FDRixDQUNGO0NBRUEsSUFBSSxLQUNGLGFBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXlCRjtDQUVBLElBQUksS0FDRixrQkFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FrQkY7Q0FFQSxJQUFJLEtBQ0YsaUJBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQkY7Q0FFQSxJQUFJLEtBQ0YsY0FDQTs7Ozs7Ozs7Ozs7O0NBYUY7O0NBR0EsTUFBTSxXQUFXO0VBQ2Y7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Q0FDRjtDQUVBLGFBQWEsOENBQThDO0NBQzNELEtBQUssTUFBTSxZQUFZLFVBQVU7RUFDL0IsSUFBSTtHQUNGLE1BQU0sT0FBTyxNQUFNLE1BQU0sTUFBTSxRQUFRO0dBQ3ZDLElBQUksS0FBSyxJQUFJO0lBQ1gsTUFBTSxVQUFVLE1BQU0sS0FBSyxLQUFLO0lBQ2hDLElBQUksS0FBSyxVQUFVLE9BQU87R0FDNUI7RUFDRixRQUFRLENBRVI7Q0FDRjtDQUVBLGFBQWEsc0NBQXNDO0NBQ25ELE1BQU0sT0FBTyxNQUFNLElBQUksY0FBYyxFQUFFLE1BQU0sT0FBTyxDQUFDOztDQUdyRCxNQUFNLGNBQWMsSUFBSSxnQkFBZ0IsSUFBSTtDQUM1QyxNQUFNLElBQUksU0FBUyxjQUFjLEdBQUc7Q0FDcEMsRUFBRSxPQUFPO0NBQ1QsRUFBRSxXQUFXO0NBQ2IsU0FBUyxLQUFLLFlBQVksQ0FBQztDQUMzQixFQUFFLE1BQU07Q0FDUixTQUFTLEtBQUssWUFBWSxDQUFDO0NBQzNCLGlCQUFpQixJQUFJLGdCQUFnQixXQUFXLEdBQUcsR0FBSTtBQUN6RCIsIm5hbWVzIjpbXSwic291cmNlcyI6WyJ6aXBEb3dubG9hZGVyLnRzIl0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBKU1ppcCBmcm9tICdqc3ppcCc7XG5cbi8vIEJ1bmRsZXMgYWxsIGFwcGxpY2F0aW9uIHNvdXJjZSBjb2RlIGludG8gYSBjbGVhbiwgc3RhbmRhbG9uZSBaSVAgZG93bmxvYWQgZGlyZWN0bHkgaW4gQW5kcm9pZFxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkUHJvamVjdFppcChvblByb2dyZXNzPzogKG1zZzogc3RyaW5nKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gIG9uUHJvZ3Jlc3M/LignUHJlcGFyYW5kbyBhcmNoaXZvcyBmdWVudGUgeSBhcnF1aXRlY3R1cmEgQW5kcm9pZCAxNC4uLicpO1xuICBjb25zdCB6aXAgPSBuZXcgSlNaaXAoKTtcblxuICAvLyBSb290IGZpbGVzXG4gIHppcC5maWxlKFxuICAgICdwYWNrYWdlLmpzb24nLFxuICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAge1xuICAgICAgICBuYW1lOiAnYXVkaW9kc3AtZW5naW5lLXBybycsXG4gICAgICAgIHByaXZhdGU6IHRydWUsXG4gICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIHR5cGU6ICdtb2R1bGUnLFxuICAgICAgICBzY3JpcHRzOiB7XG4gICAgICAgICAgZGV2OiAndml0ZSAtLXBvcnQ9MzAwMCAtLWhvc3Q9MC4wLjAuMCcsXG4gICAgICAgICAgYnVpbGQ6ICd2aXRlIGJ1aWxkJyxcbiAgICAgICAgICBwcmV2aWV3OiAndml0ZSBwcmV2aWV3JyxcbiAgICAgICAgICBsaW50OiAndHNjIC0tbm9FbWl0JyxcbiAgICAgICAgfSxcbiAgICAgICAgZGVwZW5kZW5jaWVzOiB7XG4gICAgICAgICAgJ0B0YWlsd2luZGNzcy92aXRlJzogJ140LjMuMycsXG4gICAgICAgICAgJ0B2aXRlanMvcGx1Z2luLXJlYWN0JzogJ142LjEuMScsXG4gICAgICAgICAgJ2x1Y2lkZS1yZWFjdCc6ICdeMC41NDYuMCcsXG4gICAgICAgICAgJ21vdGlvbic6ICdeMTIuMjMuMjQnLFxuICAgICAgICAgICdyZWFjdCc6ICdeMTkuMC4xJyxcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ14xOS4wLjEnLFxuICAgICAgICAgICd2aXRlJzogJ144LjMuMCcsXG4gICAgICAgICAgJ2pzemlwJzogJ14zLjEwLjInLFxuICAgICAgICB9LFxuICAgICAgICBkZXZEZXBlbmRlbmNpZXM6IHtcbiAgICAgICAgICAnQHR5cGVzL25vZGUnOiAnXjIyLjE0LjAnLFxuICAgICAgICAgICdAdHlwZXMvcmVhY3QnOiAnXjE5LjMuMCcsXG4gICAgICAgICAgJ0B0eXBlcy9yZWFjdC1kb20nOiAnXjE5LjMuMCcsXG4gICAgICAgICAgJ3RhaWx3aW5kY3NzJzogJ140LjMuMycsXG4gICAgICAgICAgJ3R5cGVzY3JpcHQnOiAnXjcuMC4yJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBudWxsLFxuICAgICAgMlxuICAgIClcbiAgKTtcblxuICB6aXAuZmlsZShcbiAgICAnUkVBRE1FLm1kJyxcbiAgICBgIyBBdWRpb0RTUCBFbmdpbmUgUHJvIChDb21wYXRpYmxlIGNvbiBBbmRyb2lkIDE0IC8gQVBJIDM0KylcblxuTW90b3IgZGUgcHJvY2VzYW1pZW50byBkZSBzZcOxYWwgZGlnaXRhbCAoRFNQKSBwb3Igc29mdHdhcmUgZW4gcHVudG8gZmxvdGFudGUgZGUgMzIgYml0cyBwYXJhIEFuZHJvaWQgeSBmbHVqb3MgUENNLlxuXG4jIyBDYXJhY3RlcsOtc3RpY2FzIFByaW5jaXBhbGVzXG4tICoqQ2FkZW5hIERTUCBkZSAxMCBFdGFwYXMqKjogUHJlYW1wLCBCYXNzIEJvb3N0IGNvbiBhcm3Ds25pY29zIHRhbmggeSBmaWx0cm8gc3Vic8OzbmljbywgVmlydHVhbGl6ZXIgZXN0w6lyZW8gM0QsIEVjdWFsaXphZG9yIHBhcmFtw6l0cmljbyBkZSAzMiBiYW5kYXMgSVNPIDI2NiwgQ29udHJvbGVzIGRlIHRvbm8gKDMgdsOtYXMpLCBNRFJDIG11bHRpYmFuZGEgTGlua3dpdHotUmlsZXksIEF1dG9HYWluIFJNUywgR2FuYW5jaWEgbWFlc3RyYS9CYWxhbmNlLCBTb2Z0IExpbWl0ZXIgQnJpY2t3YWxsIHkgQnlwYXNzIG1hZXN0cm8uXG4tICoqQ3VtcGxpbWllbnRvIEVzdHJpY3RvIEFuZHJvaWQgMTQgKEFQSSAzNCkqKjpcbiAgLSBEZWZpbmljacOzbiBkZSBcXGBmb3JlZ3JvdW5kU2VydmljZVR5cGU9XCJtZWRpYVBsYXliYWNrfG1pY3JvcGhvbmVcIlxcYFxuICAtIFNlcnZpY2lvIFxcYEFuZHJvaWREc3BGb3JlZ3JvdW5kU2VydmljZS5rdFxcYCBjb24gXFxgU2VydmljZUluZm8uRk9SRUdST1VORF9TRVJWSUNFX1RZUEVfTUVESUFfUExBWUJBQ0tcXGBcbiAgLSBQZXJtaXNvcyBcXGBGT1JFR1JPVU5EX1NFUlZJQ0VfTUVESUFfUExBWUJBQ0tcXGAgeSBcXGBQT1NUX05PVElGSUNBVElPTlNcXGBcbiAgLSBBdWRpbyBlbiBwdW50byBmbG90YW50ZSBuYXRpdm8gKFxcYEF1ZGlvRm9ybWF0LkVOQ09ESU5HX1BDTV9GTE9BVFxcYClcbi0gKipTdWl0ZSBkZSBQcnVlYmFzKio6IDM4IHBydWViYXMgbnVtw6lyaWNhcyB1bml0YXJpYXMgZW4gdGllbXBvIHJlYWwuXG5cbiMjIEluc3RydWNjaW9uZXMgZGUgQ29tcGlsYWNpw7NuIFdlYiAvIFBXQVxuXFxgXFxgXFxgYmFzaFxubnBtIGluc3RhbGxcbm5wbSBydW4gYnVpbGRcblxcYFxcYFxcYFxuTGEgY2FycGV0YSByZXN1bHRhbnRlIFxcYGRpc3QvXFxgIGNvbnRpZW5lIGxvcyBiaW5hcmlvcyBsaXN0b3MgcGFyYSBwdWJsaWNhciBlbiBHaXRIdWIgUGFnZXMgbyBkZXNwbGVnYXIuXG5cbiMjIEludGVncmFjacOzbiBjb24gQW5kcm9pZCBTdHVkaW8gKEFQSSAzNCspXG5Mb3MgYXJjaGl2b3MgZnVlbnRlIG5hdGl2b3MgZXN0w6FuIGVuIGxhIGNhcnBldGEgXFxgc3JjL2FuZHJvaWQvXFxgOlxuLSBcXGBBbmRyb2lkTWFuaWZlc3QueG1sXFxgXG4tIFxcYEFuZHJvaWREc3BGb3JlZ3JvdW5kU2VydmljZS5rdFxcYFxuYFxuICApO1xuXG4gIHppcC5maWxlKFxuICAgICd2aXRlLmNvbmZpZy50cycsXG4gICAgYGltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIHRhaWx3aW5kY3NzKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4nKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgfSxcbn0pO1xuYFxuICApO1xuXG4gIHppcC5maWxlKFxuICAgICd0c2NvbmZpZy5qc29uJyxcbiAgICBge1xuICBcImNvbXBpbGVyT3B0aW9uc1wiOiB7XG4gICAgXCJ0YXJnZXRcIjogXCJFUzIwMjJcIixcbiAgICBcInVzZURlZmluZUZvckNsYXNzRmllbGRzXCI6IGZhbHNlLFxuICAgIFwibW9kdWxlXCI6IFwiRVNOZXh0XCIsXG4gICAgXCJ0eXBlc1wiOiBbXCJ2aXRlL2NsaWVudFwiXSxcbiAgICBcImxpYlwiOiBbXCJFUzIwMjJcIiwgXCJET01cIiwgXCJET00uSXRlcmFibGVcIl0sXG4gICAgXCJza2lwTGliQ2hlY2tcIjogdHJ1ZSxcbiAgICBcIm1vZHVsZVJlc29sdXRpb25cIjogXCJidW5kbGVyXCIsXG4gICAgXCJpc29sYXRlZE1vZHVsZXNcIjogdHJ1ZSxcbiAgICBcIm1vZHVsZURldGVjdGlvblwiOiBcImZvcmNlXCIsXG4gICAgXCJhbGxvd0pzXCI6IHRydWUsXG4gICAgXCJqc3hcIjogXCJyZWFjdC1qc3hcIixcbiAgICBcInBhdGhzXCI6IHtcbiAgICAgIFwiQC8qXCI6IFtcIi4vKlwiXVxuICAgIH0sXG4gICAgXCJub0VtaXRcIjogdHJ1ZVxuICB9XG59XG5gXG4gICk7XG5cbiAgemlwLmZpbGUoXG4gICAgJ2luZGV4Lmh0bWwnLFxuICAgIGA8IWRvY3R5cGUgaHRtbD5cbjxodG1sIGxhbmc9XCJlc1wiPlxuICA8aGVhZD5cbiAgICA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIiAvPlxuICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCIgLz5cbiAgICA8dGl0bGU+QXVkaW9EU1AgRW5naW5lIFBybyAtIEFuZHJvaWQgMTQgQVBJIDM0PC90aXRsZT5cbiAgPC9oZWFkPlxuICA8Ym9keSBjbGFzcz1cImJnLW5ldXRyYWwtOTUwIHRleHQtbmV1dHJhbC0xMDAgb3ZlcmZsb3cteC1oaWRkZW5cIj5cbiAgICA8ZGl2IGlkPVwicm9vdFwiPjwvZGl2PlxuICAgIDxzY3JpcHQgdHlwZT1cIm1vZHVsZVwiIHNyYz1cIi9zcmMvbWFpbi50c3hcIj48L3NjcmlwdD5cbiAgPC9ib2R5PlxuPC9odG1sPlxuYFxuICApO1xuXG4gIC8vIFJlYWQgZmlsZXMgZnJvbSBydW50aW1lIHVzaW5nIGZldGNoXG4gIGNvbnN0IGZpbGVMaXN0ID0gW1xuICAgICdzcmMvbWFpbi50c3gnLFxuICAgICdzcmMvQXBwLnRzeCcsXG4gICAgJ3NyYy9pbmRleC5jc3MnLFxuICAgICdzcmMvdHlwZXMvZHNwLnRzJyxcbiAgICAnc3JjL2F1ZGlvL2RzcEVuZ2luZS50cycsXG4gICAgJ3NyYy9hdWRpby9kc3BUZXN0U3VpdGUudHMnLFxuICAgICdzcmMvYXVkaW8vcGNtVXRpbHMudHMnLFxuICAgICdzcmMvYXVkaW8vcHJlc2V0cy50cycsXG4gICAgJ3NyYy9jb21wb25lbnRzL0FuZHJvaWRBcmNoaXRlY3R1cmVNb2RhbC50c3gnLFxuICAgICdzcmMvY29tcG9uZW50cy9BdWRpb1NvdXJjZUJhci50c3gnLFxuICAgICdzcmMvY29tcG9uZW50cy9EU1BWYWxpZGF0aW9uTW9kYWwudHN4JyxcbiAgICAnc3JjL2NvbXBvbmVudHMvRHluYW1pY3NNRFJDU2VjdGlvbi50c3gnLFxuICAgICdzcmMvY29tcG9uZW50cy9FcXVhbGl6ZXIzMlNlY3Rpb24udHN4JyxcbiAgICAnc3JjL2NvbXBvbmVudHMvSGVhZGVyLnRzeCcsXG4gICAgJ3NyYy9jb21wb25lbnRzL01ldGVyQnJpZGdlLnRzeCcsXG4gICAgJ3NyYy9jb21wb25lbnRzL1ByZXNldEJhci50c3gnLFxuICAgICdzcmMvY29tcG9uZW50cy9TcGVjdHJ1bURpc3BsYXkudHN4JyxcbiAgICAnc3JjL2NvbXBvbmVudHMvVG9uZUFuZEJhc3NTZWN0aW9uLnRzeCcsXG4gICAgJ3NyYy9jb21wb25lbnRzL0RpcmVjdFppcERvd25sb2FkTW9kYWwudHN4JyxcbiAgICAnc3JjL3V0aWxzL3ppcERvd25sb2FkZXIudHMnLFxuICAgIC8vIEFuZHJvaWQgUHJvamVjdCBDb3JlXG4gICAgJ2J1aWxkLmdyYWRsZS5rdHMnLFxuICAgICdzZXR0aW5ncy5ncmFkbGUua3RzJyxcbiAgICAnZ3JhZGxlLnByb3BlcnRpZXMnLFxuICAgICdncmFkbGUvbGlicy52ZXJzaW9ucy50b21sJyxcbiAgICAnZ3JhZGxlL3dyYXBwZXIvZ3JhZGxlLXdyYXBwZXIucHJvcGVydGllcycsXG4gICAgJ2FwcC9idWlsZC5ncmFkbGUua3RzJyxcbiAgICAnYXBwL3Byb2d1YXJkLXJ1bGVzLnBybycsXG4gICAgJ2FwcC9zcmMvbWFpbi9BbmRyb2lkTWFuaWZlc3QueG1sJyxcbiAgICAnYXBwL3NyYy9tYWluL3Jlcy92YWx1ZXMvc3RyaW5ncy54bWwnLFxuICAgICdhcHAvc3JjL21haW4vcmVzL3ZhbHVlcy90aGVtZXMueG1sJyxcbiAgICAnYXBwL3NyYy9tYWluL3Jlcy9sYXlvdXQvYWN0aXZpdHlfbWFpbi54bWwnLFxuICAgICdhcHAvc3JjL21haW4vamF2YS9jb20vYXVkaW9kc3AvZW5naW5lL01haW5BY3Rpdml0eS5rdCcsXG4gICAgJ2FwcC9zcmMvbWFpbi9qYXZhL2NvbS9hdWRpb2RzcC9lbmdpbmUvYnJpZGdlL1dlYkFwcEludGVyZmFjZS5rdCcsXG4gICAgJ2FwcC9zcmMvbWFpbi9qYXZhL2NvbS9hdWRpb2RzcC9lbmdpbmUvZHNwL0JpcXVhZEZpbHRlci5rdCcsXG4gICAgJ2FwcC9zcmMvbWFpbi9qYXZhL2NvbS9hdWRpb2RzcC9lbmdpbmUvZHNwL01kcmNQcm9jZXNzb3Iua3QnLFxuICAgICdhcHAvc3JjL21haW4vamF2YS9jb20vYXVkaW9kc3AvZW5naW5lL2RzcC9BdWRpb0RzcEVuZ2luZS5rdCcsXG4gICAgJ2FwcC9zcmMvbWFpbi9qYXZhL2NvbS9hdWRpb2RzcC9lbmdpbmUvc2VydmljZS9BbmRyb2lkRHNwRm9yZWdyb3VuZFNlcnZpY2Uua3QnLFxuICBdO1xuXG4gIG9uUHJvZ3Jlc3M/LignRW1wYXF1ZXRhbmRvIGNvbXBvbmVudGVzIHkgYWxnb3JpdG1vcyBEU1AuLi4nKTtcbiAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBmaWxlTGlzdCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2goJy8nICsgZmlsZVBhdGgpO1xuICAgICAgaWYgKHJlc3Aub2spIHtcbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IHJlc3AudGV4dCgpO1xuICAgICAgICB6aXAuZmlsZShmaWxlUGF0aCwgY29udGVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBGYWxsYmFja1xuICAgIH1cbiAgfVxuXG4gIG9uUHJvZ3Jlc3M/LignR2VuZXJhbmRvIGFyY2hpdm8gWklQIGRlc2NhcmdhYmxlLi4uJyk7XG4gIGNvbnN0IGJsb2IgPSBhd2FpdCB6aXAuZ2VuZXJhdGVBc3luYyh7IHR5cGU6ICdibG9iJyB9KTtcblxuICAvLyBUcmlnZ2VyIGRvd25sb2FkIG9uIEFuZHJvaWQgbW9iaWxlIGJyb3dzZXJcbiAgY29uc3QgZG93bmxvYWRVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICBhLmhyZWYgPSBkb3dubG9hZFVybDtcbiAgYS5kb3dubG9hZCA9ICdBdWRpb0RTUC1FbmdpbmUtUHJvLUFuZHJvaWQxNC1BUEkzNC56aXAnO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICBhLmNsaWNrKCk7XG4gIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XG4gIHNldFRpbWVvdXQoKCkgPT4gVVJMLnJldm9rZU9iamVjdFVSTChkb3dubG9hZFVybCksIDQwMDApO1xufVxuIl19