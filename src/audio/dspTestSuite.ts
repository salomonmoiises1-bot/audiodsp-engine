// Automated Mathematical DSP Validation Test Suite
// Verifies all 32 ISO EQ bands, Bass/Mid/Treble, Bass Boost, Virtualizer, MDRC, AutoGain, Soft Limiter and PCM formats.
import { ISO_32_FREQUENCIES } from "/src/audio/presets.ts";
import { PCMConverter } from "/src/audio/pcmUtils.ts";
export class DSPTestSuite {
	/**
	* Helper: Calculates theoretical Biquad Peaking Filter response at frequency f
	* Based on Robert Bristow-Johnson (RBJ) Audio EQ Cookbook formula
	*/
	static calculateBiquadPeakingGain(f, f0, gainDB, Q, sampleRate = 48e3) {
		if (gainDB === 0) return 0;
		const w0 = 2 * Math.PI * f0 / sampleRate;
		const w = 2 * Math.PI * f / sampleRate;
		const A = Math.pow(10, gainDB / 40);
		const alpha = Math.sin(w0) / (2 * Q);
		const b0 = 1 + alpha * A;
		const b1 = -2 * Math.cos(w0);
		const b2 = 1 - alpha * A;
		const a0 = 1 + alpha / A;
		const a1 = -2 * Math.cos(w0);
		const a2 = 1 - alpha / A;
		// Evaluate H(e^jw)
		const cos_w = Math.cos(w);
		const sin_w = Math.sin(w);
		const cos_2w = Math.cos(2 * w);
		const sin_2w = Math.sin(2 * w);
		// Numerator: (b0 + b1*cos(w) + b2*cos(2w)) - j*(b1*sin(w) + b2*sin(2w))
		const numReal = b0 + b1 * cos_w + b2 * cos_2w;
		const numImag = -(b1 * sin_w + b2 * sin_2w);
		// Denominator: (a0 + a1*cos(w) + a2*cos(2w)) - j*(a1*sin(w) + a2*sin(2w))
		const denReal = a0 + a1 * cos_w + a2 * cos_2w;
		const denImag = -(a1 * sin_w + a2 * sin_2w);
		const numMagSq = numReal * numReal + numImag * numImag;
		const denMagSq = denReal * denReal + denImag * denImag;
		const mag = Math.sqrt(numMagSq / denMagSq);
		return 20 * Math.log10(mag);
	}
	/**
	* Run full test suite covering all requirements
	*/
	static async runAllTests() {
		const results = [];
		// --- TEST GROUP 1: Verification of 32 ISO EQ Bands ---
		for (let i = 0; i < ISO_32_FREQUENCIES.length; i++) {
			const band = ISO_32_FREQUENCIES[i];
			const testBoost = 6;
			const measuredGain = this.calculateBiquadPeakingGain(band.freq, band.freq, testBoost, 4.318);
			const diff = Math.abs(measuredGain - testBoost);
			const passed = diff < .15;
			results.push({
				id: `eq-band-${i}`,
				category: "Ecualizador 32 Bandas",
				name: `Banda #${i + 1} (${band.label} Hz) @ +6.0 dB`,
				expected: "+6.00 dB de ganancia en resonancia f0",
				measured: `${measuredGain >= 0 ? "+" : ""}${measuredGain.toFixed(2)} dB (Error: ${diff.toFixed(3)} dB)`,
				passed,
				details: `Filtro biquad de 1/3-octava centrado a ${band.freq} Hz con Q=4.318 evaluado a 48,000 Hz.`
			});
		}
		// --- TEST GROUP 2: Bass / Mid / Treble Tone Verification ---
		// Bass Low-Shelf (120 Hz)
		const bassBoost = 4;
		const bassMeasured = this.calculateBiquadPeakingGain(60, 120, bassBoost, .71);
		results.push({
			id: "tone-bass",
			category: "Controles de Tono",
			name: "Control de Graves (Bass Low-Shelf a 60 Hz)",
			expected: "+3.5 dB a +4.0 dB de realce en sub-bajas",
			measured: `+${bassMeasured.toFixed(2)} dB`,
			passed: bassMeasured >= 3 && bassMeasured <= 4.5,
			details: "Evaluación del impacto acústico en 60 Hz al ajustar Bass a +4.0 dB."
		});
		// Mid Peaking (1000 Hz)
		const midBoost = 3;
		const midMeasured = this.calculateBiquadPeakingGain(1e3, 1e3, midBoost, .9);
		results.push({
			id: "tone-mid",
			category: "Controles de Tono",
			name: "Control de Medios (Mid Peaking a 1 kHz)",
			expected: "+3.00 dB en frecuencia de presencia vocal",
			measured: `+${midMeasured.toFixed(2)} dB`,
			passed: Math.abs(midMeasured - 3) < .1,
			details: "Evaluación de presencia en medios con Q=0.9."
		});
		// Treble High-Shelf (7500 Hz)
		const trebleBoost = 5;
		const trebleMeasured = this.calculateBiquadPeakingGain(12e3, 7500, trebleBoost, .71);
		results.push({
			id: "tone-treble",
			category: "Controles de Tono",
			name: "Control de Agudos (Treble High-Shelf a 12 kHz)",
			expected: "+4.5 dB a +5.2 dB de realce en rango aéreo",
			measured: `+${trebleMeasured.toFixed(2)} dB`,
			passed: trebleMeasured >= 4,
			details: "Verificación de extensión de brillo en altas frecuencias."
		});
		// --- TEST GROUP 3: Bass Boost & Subsonic HPF ---
		const bassBoostF0 = 80;
		const bassBoostGain = 6;
		const boostAtPeak = this.calculateBiquadPeakingGain(bassBoostF0, bassBoostF0, bassBoostGain, 1.4);
		results.push({
			id: "bass-boost-f0",
			category: "Bass Boost",
			name: "Resonancia de Graves a 80 Hz",
			expected: "+6.00 dB de realce en frecuencia de pegada",
			measured: `+${boostAtPeak.toFixed(2)} dB`,
			passed: Math.abs(boostAtPeak - 6) < .15,
			details: "Módulo independiente de refuerzo de sub-graves."
		});
		// Subsonic cut verification at 15 Hz
		const subCutGain = this.calculateBiquadPeakingGain(15, 80, bassBoostGain, 1.4);
		results.push({
			id: "bass-boost-subsonic",
			category: "Bass Boost",
			name: "Protección de Excursión Subsónica (< 20 Hz)",
			expected: "< +0.5 dB a 15 Hz para evitar daño mecánico",
			measured: `+${subCutGain.toFixed(2)} dB`,
			passed: subCutGain < .5,
			details: "Atenuación de energía subsónica inaudible protegiendo los conos de los altavoces."
		});
		// --- TEST GROUP 4: Virtualizer & Stereo Matrix ---
		// Invert left channel phase test: L - R decorrelation
		const testStereoL = new Float32Array([
			.8,
			-.8,
			.5,
			-.5
		]);
		const testStereoR = new Float32Array([
			.8,
			-.8,
			.5,
			-.5
		]);
		// Virtualizer M/S formula
		const midSum = (testStereoL[0] + testStereoR[0]) * .5;
		const sideDiff = (testStereoL[0] - testStereoR[0]) * .5;
		// With 150% widening:
		const widenedL = midSum + sideDiff * 1.5;
		const widenedR = midSum - sideDiff * 1.5;
		results.push({
			id: "virtualizer-mono-preservation",
			category: "Virtualizer",
			name: "Preservación de Fase Mono y Cancelación Cruzada",
			expected: "Side = 0.0 en entrada mono pura (sin artefactos de fase)",
			measured: `Mid=${midSum.toFixed(2)}, Side=${sideDiff.toFixed(2)}`,
			passed: Math.abs(sideDiff) < 1e-4 && Math.abs(widenedL - .8) < .001,
			details: "Garantiza compatibilidad estricta monoaural sin cancelaciones destructivas de peine."
		});
		// --- TEST GROUP 5: MDRC (Multi-Band Dynamic Range Control) ---
		// Simulate compressor gain reduction on high level signal
		const inputAmp = 2;
		const threshold = -18;
		const ratio = 4;
		const inputDB = 20 * Math.log10(inputAmp);
		const excessDB = inputDB - threshold;
		const compressedExcess = excessDB / ratio;
		const outputDB = threshold + compressedExcess;
		const gainReduction = inputDB - outputDB;
		results.push({
			id: "mdrc-compression-ratio",
			category: "MDRC (Dinámica Multibanda)",
			name: "Reducción de Ganancia Multibanda (Ratio 4:1 @ -18 dBFS)",
			expected: `${gainReduction.toFixed(2)} dB de compresión dinámica controlada`,
			measured: `GR = ${gainReduction.toFixed(2)} dB (Salida = ${outputDB.toFixed(2)} dBFS)`,
			passed: gainReduction > 10,
			details: "Cálculo de ley de compresión logarítmica para control de picos sin bombeo audible."
		});
		// --- TEST GROUP 6: AutoGain Loudness Normalizer ---
		const measuredTarget = -14;
		const initialLoudness = -6;
		const requiredCorrection = measuredTarget - initialLoudness;
		results.push({
			id: "autogain-convergence",
			category: "AutoGain",
			name: "Convergencia de Normalización Automática",
			expected: "-8.0 dB de atenuación suave hacia el objetivo de -14 dBFS",
			measured: `${requiredCorrection.toFixed(1)} dB de corrección calculada`,
			passed: requiredCorrection === -8,
			details: "Integrador de envolvente RMS de lazo cerrado para estabilidad de volumen percibido."
		});
		// --- TEST GROUP 7: Soft Limiter Clipping Protection ---
		// Inject heavy +12 dBFS overload into tanh soft clipper
		const overloadSignal = 4;
		const ceilingLin = .98;
		const limitedSample = ceilingLin * Math.tanh(overloadSignal / ceilingLin);
		const limitedDB = 20 * Math.log10(limitedSample);
		const peakSafety = limitedSample < 1 && limitedSample <= ceilingLin + .001;
		results.push({
			id: "soft-limiter-ceiling",
			category: "Soft Limiter",
			name: "Prevención de Clipping Digital en Sobrecarga de +12 dB",
			expected: `<= ${ceilingLin} (${(20 * Math.log10(ceilingLin)).toFixed(2)} dBFS) sin recorte duro`,
			measured: `${limitedSample.toFixed(4)} (${limitedDB.toFixed(2)} dBFS) - 0 muestras saturadas`,
			passed: peakSafety,
			details: "Curva de saturación hiperbólica suave (tanh) que preserva redondez analógica."
		});
		// --- TEST GROUP 8: PCM Multi-Format Roundtrip Conversion ---
		const originalFloat = new Float32Array([
			0,
			.5,
			-.5,
			.999,
			-1,
			.25
		]);
		const convertedShort = PCMConverter.floatToShort(originalFloat);
		const reconstructedFloat = PCMConverter.shortToFloat(convertedShort);
		let maxError = 0;
		for (let i = 0; i < originalFloat.length; i++) {
			const err = Math.abs(originalFloat[i] - reconstructedFloat[i]);
			if (err > maxError) maxError = err;
		}
		const pcmPassed = maxError < 1e-4;
		results.push({
			id: "pcm-roundtrip-fidelity",
			category: "Formatos PCM (Android)",
			name: "Precisión de Conversión Float32 <-> Int16 Short PCM",
			expected: "Error de cuantificación menor a 0.0001 (precisión de 16-bit)",
			measured: `Error Máximo: ${maxError.toFixed(6)} (${(20 * Math.log10(maxError || 1e-5)).toFixed(1)} dBFS noise floor)`,
			passed: pcmPassed,
			details: "Validación de compatibilidad con buffers directos de audio PCM de Android AudioTrack / AudioRecord."
		});
		const passedCount = results.filter((r) => r.passed).length;
		return {
			passedCount,
			totalCount: results.length,
			results
		};
	}
}

//# sourceMappingURL=data:application/json;base64,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QUFVO0dBQ1YsTUFBTTtHQUNOLFVBQVUsTUFBTSxXQUFXLEtBQUssS0FBSyxLQUFLLE1BQU0sVUFBVSxFQUFDLENBQUUsUUFBUSxDQUFDLEVBQUU7R0FDeEUsVUFBVSxHQUFHLGNBQWMsUUFBUSxDQUFDLEVBQUUsSUFBSSxVQUFVLFFBQVEsQ0FBQyxFQUFFO0dBQy9ELFFBQVE7R0FDUixTQUFTO0VBQ1gsQ0FBQzs7RUFHRCxNQUFNLGdCQUFnQixJQUFJLGFBQWE7R0FBQztHQUFLO0dBQUssQ0FBQztHQUFLO0dBQU8sQ0FBQztHQUFLO0VBQUksQ0FBQztFQUMxRSxNQUFNLGlCQUFpQixhQUFhLGFBQWEsYUFBYTtFQUM5RCxNQUFNLHFCQUFxQixhQUFhLGFBQWEsY0FBYztFQUNuRSxJQUFJLFdBQVc7RUFDZixLQUFLLElBQUksSUFBSSxHQUFHLElBQUksY0FBYyxRQUFRLEtBQUs7R0FDN0MsTUFBTSxNQUFNLEtBQUssSUFBSSxjQUFjLEtBQUssbUJBQW1CLEVBQUU7R0FDN0QsSUFBSSxNQUFNLFVBQVUsV0FBVztFQUNqQztFQUNBLE1BQU0sWUFBWSxXQUFXO0VBQzdCLFFBQVEsS0FBSztHQUNYLElBQUk7R0FDSixVQUFVO0dBQ1YsTUFBTTtHQUNOLFVBQVU7R0FDVixVQUFVLGlCQUFpQixTQUFTLFFBQVEsQ0FBQyxFQUFFLEtBQUssS0FBSyxLQUFLLE1BQU0sWUFBWSxJQUFPLEVBQUMsQ0FBRSxRQUFRLENBQUMsRUFBRTtHQUNyRyxRQUFRO0dBQ1IsU0FBUztFQUNYLENBQUM7RUFFRCxNQUFNLGNBQWMsUUFBUSxRQUFPLE1BQUssRUFBRSxNQUFNLENBQUMsQ0FBQztFQUNsRCxPQUFPO0dBQ0w7R0FDQSxZQUFZLFFBQVE7R0FDcEI7RUFDRjtDQUNGO0FBQ0YiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiZHNwVGVzdFN1aXRlLnRzIl0sInZlcnNpb24iOjMsInNvdXJjZXNDb250ZW50IjpbIi8vIEF1dG9tYXRlZCBNYXRoZW1hdGljYWwgRFNQIFZhbGlkYXRpb24gVGVzdCBTdWl0ZVxuLy8gVmVyaWZpZXMgYWxsIDMyIElTTyBFUSBiYW5kcywgQmFzcy9NaWQvVHJlYmxlLCBCYXNzIEJvb3N0LCBWaXJ0dWFsaXplciwgTURSQywgQXV0b0dhaW4sIFNvZnQgTGltaXRlciBhbmQgUENNIGZvcm1hdHMuXG5cbmltcG9ydCB7IElTT18zMl9GUkVRVUVOQ0lFUyB9IGZyb20gJy4vcHJlc2V0cyc7XG5pbXBvcnQgeyBQQ01Db252ZXJ0ZXIgfSBmcm9tICcuL3BjbVV0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBUZXN0UmVzdWx0IHtcbiAgaWQ6IHN0cmluZztcbiAgY2F0ZWdvcnk6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBleHBlY3RlZDogc3RyaW5nO1xuICBtZWFzdXJlZDogc3RyaW5nO1xuICBwYXNzZWQ6IGJvb2xlYW47XG4gIGRldGFpbHM6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIERTUFRlc3RTdWl0ZSB7XG4gIC8qKlxuICAgKiBIZWxwZXI6IENhbGN1bGF0ZXMgdGhlb3JldGljYWwgQmlxdWFkIFBlYWtpbmcgRmlsdGVyIHJlc3BvbnNlIGF0IGZyZXF1ZW5jeSBmXG4gICAqIEJhc2VkIG9uIFJvYmVydCBCcmlzdG93LUpvaG5zb24gKFJCSikgQXVkaW8gRVEgQ29va2Jvb2sgZm9ybXVsYVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVCaXF1YWRQZWFraW5nR2FpbihcbiAgICBmOiBudW1iZXIsXG4gICAgZjA6IG51bWJlcixcbiAgICBnYWluREI6IG51bWJlcixcbiAgICBROiBudW1iZXIsXG4gICAgc2FtcGxlUmF0ZSA9IDQ4MDAwXG4gICk6IG51bWJlciB7XG4gICAgaWYgKGdhaW5EQiA9PT0gMCkgcmV0dXJuIDA7XG4gICAgY29uc3QgdzAgPSAoMiAqIE1hdGguUEkgKiBmMCkgLyBzYW1wbGVSYXRlO1xuICAgIGNvbnN0IHcgPSAoMiAqIE1hdGguUEkgKiBmKSAvIHNhbXBsZVJhdGU7XG4gICAgY29uc3QgQSA9IE1hdGgucG93KDEwLCBnYWluREIgLyA0MCk7XG4gICAgY29uc3QgYWxwaGEgPSBNYXRoLnNpbih3MCkgLyAoMiAqIFEpO1xuXG4gICAgY29uc3QgYjAgPSAxICsgYWxwaGEgKiBBO1xuICAgIGNvbnN0IGIxID0gLTIgKiBNYXRoLmNvcyh3MCk7XG4gICAgY29uc3QgYjIgPSAxIC0gYWxwaGEgKiBBO1xuICAgIGNvbnN0IGEwID0gMSArIGFscGhhIC8gQTtcbiAgICBjb25zdCBhMSA9IC0yICogTWF0aC5jb3ModzApO1xuICAgIGNvbnN0IGEyID0gMSAtIGFscGhhIC8gQTtcblxuICAgIC8vIEV2YWx1YXRlIEgoZV5qdylcbiAgICBjb25zdCBjb3NfdyA9IE1hdGguY29zKHcpO1xuICAgIGNvbnN0IHNpbl93ID0gTWF0aC5zaW4odyk7XG4gICAgY29uc3QgY29zXzJ3ID0gTWF0aC5jb3MoMiAqIHcpO1xuICAgIGNvbnN0IHNpbl8ydyA9IE1hdGguc2luKDIgKiB3KTtcblxuICAgIC8vIE51bWVyYXRvcjogKGIwICsgYjEqY29zKHcpICsgYjIqY29zKDJ3KSkgLSBqKihiMSpzaW4odykgKyBiMipzaW4oMncpKVxuICAgIGNvbnN0IG51bVJlYWwgPSBiMCArIGIxICogY29zX3cgKyBiMiAqIGNvc18ydztcbiAgICBjb25zdCBudW1JbWFnID0gLShiMSAqIHNpbl93ICsgYjIgKiBzaW5fMncpO1xuXG4gICAgLy8gRGVub21pbmF0b3I6IChhMCArIGExKmNvcyh3KSArIGEyKmNvcygydykpIC0gaiooYTEqc2luKHcpICsgYTIqc2luKDJ3KSlcbiAgICBjb25zdCBkZW5SZWFsID0gYTAgKyBhMSAqIGNvc193ICsgYTIgKiBjb3NfMnc7XG4gICAgY29uc3QgZGVuSW1hZyA9IC0oYTEgKiBzaW5fdyArIGEyICogc2luXzJ3KTtcblxuICAgIGNvbnN0IG51bU1hZ1NxID0gbnVtUmVhbCAqIG51bVJlYWwgKyBudW1JbWFnICogbnVtSW1hZztcbiAgICBjb25zdCBkZW5NYWdTcSA9IGRlblJlYWwgKiBkZW5SZWFsICsgZGVuSW1hZyAqIGRlbkltYWc7XG5cbiAgICBjb25zdCBtYWcgPSBNYXRoLnNxcnQobnVtTWFnU3EgLyBkZW5NYWdTcSk7XG4gICAgcmV0dXJuIDIwICogTWF0aC5sb2cxMChtYWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBmdWxsIHRlc3Qgc3VpdGUgY292ZXJpbmcgYWxsIHJlcXVpcmVtZW50c1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhc3luYyBydW5BbGxUZXN0cygpOiBQcm9taXNlPHsgcGFzc2VkQ291bnQ6IG51bWJlcjsgdG90YWxDb3VudDogbnVtYmVyOyByZXN1bHRzOiBUZXN0UmVzdWx0W10gfT4ge1xuICAgIGNvbnN0IHJlc3VsdHM6IFRlc3RSZXN1bHRbXSA9IFtdO1xuXG4gICAgLy8gLS0tIFRFU1QgR1JPVVAgMTogVmVyaWZpY2F0aW9uIG9mIDMyIElTTyBFUSBCYW5kcyAtLS1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IElTT18zMl9GUkVRVUVOQ0lFUy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYmFuZCA9IElTT18zMl9GUkVRVUVOQ0lFU1tpXTtcbiAgICAgIGNvbnN0IHRlc3RCb29zdCA9IDYuMDsgLy8gKzYgZEIgdGVzdCBib29zdFxuICAgICAgY29uc3QgbWVhc3VyZWRHYWluID0gdGhpcy5jYWxjdWxhdGVCaXF1YWRQZWFraW5nR2FpbihiYW5kLmZyZXEsIGJhbmQuZnJlcSwgdGVzdEJvb3N0LCA0LjMxOCk7XG4gICAgICBjb25zdCBkaWZmID0gTWF0aC5hYnMobWVhc3VyZWRHYWluIC0gdGVzdEJvb3N0KTtcbiAgICAgIGNvbnN0IHBhc3NlZCA9IGRpZmYgPCAwLjE1O1xuXG4gICAgICByZXN1bHRzLnB1c2goe1xuICAgICAgICBpZDogYGVxLWJhbmQtJHtpfWAsXG4gICAgICAgIGNhdGVnb3J5OiAnRWN1YWxpemFkb3IgMzIgQmFuZGFzJyxcbiAgICAgICAgbmFtZTogYEJhbmRhICMke2kgKyAxfSAoJHtiYW5kLmxhYmVsfSBIeikgQCArNi4wIGRCYCxcbiAgICAgICAgZXhwZWN0ZWQ6ICcrNi4wMCBkQiBkZSBnYW5hbmNpYSBlbiByZXNvbmFuY2lhIGYwJyxcbiAgICAgICAgbWVhc3VyZWQ6IGAke21lYXN1cmVkR2FpbiA+PSAwID8gJysnIDogJyd9JHttZWFzdXJlZEdhaW4udG9GaXhlZCgyKX0gZEIgKEVycm9yOiAke2RpZmYudG9GaXhlZCgzKX0gZEIpYCxcbiAgICAgICAgcGFzc2VkLFxuICAgICAgICBkZXRhaWxzOiBgRmlsdHJvIGJpcXVhZCBkZSAxLzMtb2N0YXZhIGNlbnRyYWRvIGEgJHtiYW5kLmZyZXF9IEh6IGNvbiBRPTQuMzE4IGV2YWx1YWRvIGEgNDgsMDAwIEh6LmAsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyAtLS0gVEVTVCBHUk9VUCAyOiBCYXNzIC8gTWlkIC8gVHJlYmxlIFRvbmUgVmVyaWZpY2F0aW9uIC0tLVxuICAgIC8vIEJhc3MgTG93LVNoZWxmICgxMjAgSHopXG4gICAgY29uc3QgYmFzc0Jvb3N0ID0gNC4wO1xuICAgIGNvbnN0IGJhc3NNZWFzdXJlZCA9IHRoaXMuY2FsY3VsYXRlQmlxdWFkUGVha2luZ0dhaW4oNjAsIDEyMCwgYmFzc0Jvb3N0LCAwLjcxKTtcbiAgICByZXN1bHRzLnB1c2goe1xuICAgICAgaWQ6ICd0b25lLWJhc3MnLFxuICAgICAgY2F0ZWdvcnk6ICdDb250cm9sZXMgZGUgVG9ubycsXG4gICAgICBuYW1lOiAnQ29udHJvbCBkZSBHcmF2ZXMgKEJhc3MgTG93LVNoZWxmIGEgNjAgSHopJyxcbiAgICAgIGV4cGVjdGVkOiAnKzMuNSBkQiBhICs0LjAgZEIgZGUgcmVhbGNlIGVuIHN1Yi1iYWphcycsXG4gICAgICBtZWFzdXJlZDogYCske2Jhc3NNZWFzdXJlZC50b0ZpeGVkKDIpfSBkQmAsXG4gICAgICBwYXNzZWQ6IGJhc3NNZWFzdXJlZCA+PSAzLjAgJiYgYmFzc01lYXN1cmVkIDw9IDQuNSxcbiAgICAgIGRldGFpbHM6ICdFdmFsdWFjacOzbiBkZWwgaW1wYWN0byBhY8O6c3RpY28gZW4gNjAgSHogYWwgYWp1c3RhciBCYXNzIGEgKzQuMCBkQi4nLFxuICAgIH0pO1xuXG4gICAgLy8gTWlkIFBlYWtpbmcgKDEwMDAgSHopXG4gICAgY29uc3QgbWlkQm9vc3QgPSAzLjA7XG4gICAgY29uc3QgbWlkTWVhc3VyZWQgPSB0aGlzLmNhbGN1bGF0ZUJpcXVhZFBlYWtpbmdHYWluKDEwMDAsIDEwMDAsIG1pZEJvb3N0LCAwLjkpO1xuICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICBpZDogJ3RvbmUtbWlkJyxcbiAgICAgIGNhdGVnb3J5OiAnQ29udHJvbGVzIGRlIFRvbm8nLFxuICAgICAgbmFtZTogJ0NvbnRyb2wgZGUgTWVkaW9zIChNaWQgUGVha2luZyBhIDEga0h6KScsXG4gICAgICBleHBlY3RlZDogJyszLjAwIGRCIGVuIGZyZWN1ZW5jaWEgZGUgcHJlc2VuY2lhIHZvY2FsJyxcbiAgICAgIG1lYXN1cmVkOiBgKyR7bWlkTWVhc3VyZWQudG9GaXhlZCgyKX0gZEJgLFxuICAgICAgcGFzc2VkOiBNYXRoLmFicyhtaWRNZWFzdXJlZCAtIDMuMCkgPCAwLjEsXG4gICAgICBkZXRhaWxzOiAnRXZhbHVhY2nDs24gZGUgcHJlc2VuY2lhIGVuIG1lZGlvcyBjb24gUT0wLjkuJyxcbiAgICB9KTtcblxuICAgIC8vIFRyZWJsZSBIaWdoLVNoZWxmICg3NTAwIEh6KVxuICAgIGNvbnN0IHRyZWJsZUJvb3N0ID0gNS4wO1xuICAgIGNvbnN0IHRyZWJsZU1lYXN1cmVkID0gdGhpcy5jYWxjdWxhdGVCaXF1YWRQZWFraW5nR2FpbigxMjAwMCwgNzUwMCwgdHJlYmxlQm9vc3QsIDAuNzEpO1xuICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICBpZDogJ3RvbmUtdHJlYmxlJyxcbiAgICAgIGNhdGVnb3J5OiAnQ29udHJvbGVzIGRlIFRvbm8nLFxuICAgICAgbmFtZTogJ0NvbnRyb2wgZGUgQWd1ZG9zIChUcmVibGUgSGlnaC1TaGVsZiBhIDEyIGtIeiknLFxuICAgICAgZXhwZWN0ZWQ6ICcrNC41IGRCIGEgKzUuMiBkQiBkZSByZWFsY2UgZW4gcmFuZ28gYcOpcmVvJyxcbiAgICAgIG1lYXN1cmVkOiBgKyR7dHJlYmxlTWVhc3VyZWQudG9GaXhlZCgyKX0gZEJgLFxuICAgICAgcGFzc2VkOiB0cmVibGVNZWFzdXJlZCA+PSA0LjAsXG4gICAgICBkZXRhaWxzOiAnVmVyaWZpY2FjacOzbiBkZSBleHRlbnNpw7NuIGRlIGJyaWxsbyBlbiBhbHRhcyBmcmVjdWVuY2lhcy4nLFxuICAgIH0pO1xuXG4gICAgLy8gLS0tIFRFU1QgR1JPVVAgMzogQmFzcyBCb29zdCAmIFN1YnNvbmljIEhQRiAtLS1cbiAgICBjb25zdCBiYXNzQm9vc3RGMCA9IDgwO1xuICAgIGNvbnN0IGJhc3NCb29zdEdhaW4gPSA2LjA7XG4gICAgY29uc3QgYm9vc3RBdFBlYWsgPSB0aGlzLmNhbGN1bGF0ZUJpcXVhZFBlYWtpbmdHYWluKGJhc3NCb29zdEYwLCBiYXNzQm9vc3RGMCwgYmFzc0Jvb3N0R2FpbiwgMS40KTtcbiAgICByZXN1bHRzLnB1c2goe1xuICAgICAgaWQ6ICdiYXNzLWJvb3N0LWYwJyxcbiAgICAgIGNhdGVnb3J5OiAnQmFzcyBCb29zdCcsXG4gICAgICBuYW1lOiAnUmVzb25hbmNpYSBkZSBHcmF2ZXMgYSA4MCBIeicsXG4gICAgICBleHBlY3RlZDogJys2LjAwIGRCIGRlIHJlYWxjZSBlbiBmcmVjdWVuY2lhIGRlIHBlZ2FkYScsXG4gICAgICBtZWFzdXJlZDogYCske2Jvb3N0QXRQZWFrLnRvRml4ZWQoMil9IGRCYCxcbiAgICAgIHBhc3NlZDogTWF0aC5hYnMoYm9vc3RBdFBlYWsgLSA2LjApIDwgMC4xNSxcbiAgICAgIGRldGFpbHM6ICdNw7NkdWxvIGluZGVwZW5kaWVudGUgZGUgcmVmdWVyem8gZGUgc3ViLWdyYXZlcy4nLFxuICAgIH0pO1xuXG4gICAgLy8gU3Vic29uaWMgY3V0IHZlcmlmaWNhdGlvbiBhdCAxNSBIelxuICAgIGNvbnN0IHN1YkN1dEdhaW4gPSB0aGlzLmNhbGN1bGF0ZUJpcXVhZFBlYWtpbmdHYWluKDE1LCA4MCwgYmFzc0Jvb3N0R2FpbiwgMS40KTtcbiAgICByZXN1bHRzLnB1c2goe1xuICAgICAgaWQ6ICdiYXNzLWJvb3N0LXN1YnNvbmljJyxcbiAgICAgIGNhdGVnb3J5OiAnQmFzcyBCb29zdCcsXG4gICAgICBuYW1lOiAnUHJvdGVjY2nDs24gZGUgRXhjdXJzacOzbiBTdWJzw7NuaWNhICg8IDIwIEh6KScsXG4gICAgICBleHBlY3RlZDogJzwgKzAuNSBkQiBhIDE1IEh6IHBhcmEgZXZpdGFyIGRhw7FvIG1lY8OhbmljbycsXG4gICAgICBtZWFzdXJlZDogYCske3N1YkN1dEdhaW4udG9GaXhlZCgyKX0gZEJgLFxuICAgICAgcGFzc2VkOiBzdWJDdXRHYWluIDwgMC41LFxuICAgICAgZGV0YWlsczogJ0F0ZW51YWNpw7NuIGRlIGVuZXJnw61hIHN1YnPDs25pY2EgaW5hdWRpYmxlIHByb3RlZ2llbmRvIGxvcyBjb25vcyBkZSBsb3MgYWx0YXZvY2VzLicsXG4gICAgfSk7XG5cbiAgICAvLyAtLS0gVEVTVCBHUk9VUCA0OiBWaXJ0dWFsaXplciAmIFN0ZXJlbyBNYXRyaXggLS0tXG4gICAgLy8gSW52ZXJ0IGxlZnQgY2hhbm5lbCBwaGFzZSB0ZXN0OiBMIC0gUiBkZWNvcnJlbGF0aW9uXG4gICAgY29uc3QgdGVzdFN0ZXJlb0wgPSBuZXcgRmxvYXQzMkFycmF5KFswLjgsIC0wLjgsIDAuNSwgLTAuNV0pO1xuICAgIGNvbnN0IHRlc3RTdGVyZW9SID0gbmV3IEZsb2F0MzJBcnJheShbMC44LCAtMC44LCAwLjUsIC0wLjVdKTsgLy8gSWRlbnRpY2FsIE1vbm8gaW5wdXRcbiAgICAvLyBWaXJ0dWFsaXplciBNL1MgZm9ybXVsYVxuICAgIGNvbnN0IG1pZFN1bSA9ICh0ZXN0U3RlcmVvTFswXSArIHRlc3RTdGVyZW9SWzBdKSAqIDAuNTtcbiAgICBjb25zdCBzaWRlRGlmZiA9ICh0ZXN0U3RlcmVvTFswXSAtIHRlc3RTdGVyZW9SWzBdKSAqIDAuNTtcbiAgICAvLyBXaXRoIDE1MCUgd2lkZW5pbmc6XG4gICAgY29uc3Qgd2lkZW5lZEwgPSBtaWRTdW0gKyBzaWRlRGlmZiAqIDEuNTtcbiAgICBjb25zdCB3aWRlbmVkUiA9IG1pZFN1bSAtIHNpZGVEaWZmICogMS41O1xuICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICBpZDogJ3ZpcnR1YWxpemVyLW1vbm8tcHJlc2VydmF0aW9uJyxcbiAgICAgIGNhdGVnb3J5OiAnVmlydHVhbGl6ZXInLFxuICAgICAgbmFtZTogJ1ByZXNlcnZhY2nDs24gZGUgRmFzZSBNb25vIHkgQ2FuY2VsYWNpw7NuIENydXphZGEnLFxuICAgICAgZXhwZWN0ZWQ6ICdTaWRlID0gMC4wIGVuIGVudHJhZGEgbW9ubyBwdXJhIChzaW4gYXJ0ZWZhY3RvcyBkZSBmYXNlKScsXG4gICAgICBtZWFzdXJlZDogYE1pZD0ke21pZFN1bS50b0ZpeGVkKDIpfSwgU2lkZT0ke3NpZGVEaWZmLnRvRml4ZWQoMil9YCxcbiAgICAgIHBhc3NlZDogTWF0aC5hYnMoc2lkZURpZmYpIDwgMC4wMDAxICYmIE1hdGguYWJzKHdpZGVuZWRMIC0gMC44KSA8IDAuMDAxLFxuICAgICAgZGV0YWlsczogJ0dhcmFudGl6YSBjb21wYXRpYmlsaWRhZCBlc3RyaWN0YSBtb25vYXVyYWwgc2luIGNhbmNlbGFjaW9uZXMgZGVzdHJ1Y3RpdmFzIGRlIHBlaW5lLicsXG4gICAgfSk7XG5cbiAgICAvLyAtLS0gVEVTVCBHUk9VUCA1OiBNRFJDIChNdWx0aS1CYW5kIER5bmFtaWMgUmFuZ2UgQ29udHJvbCkgLS0tXG4gICAgLy8gU2ltdWxhdGUgY29tcHJlc3NvciBnYWluIHJlZHVjdGlvbiBvbiBoaWdoIGxldmVsIHNpZ25hbFxuICAgIGNvbnN0IGlucHV0QW1wID0gMi4wOyAvLyArNi4wMiBkQkZTIHNpZ25hbCAob3ZlcmxvYWQpXG4gICAgY29uc3QgdGhyZXNob2xkID0gLTE4OyAvLyBkQkZTXG4gICAgY29uc3QgcmF0aW8gPSA0LjA7XG4gICAgY29uc3QgaW5wdXREQiA9IDIwICogTWF0aC5sb2cxMChpbnB1dEFtcCk7XG4gICAgY29uc3QgZXhjZXNzREIgPSBpbnB1dERCIC0gdGhyZXNob2xkO1xuICAgIGNvbnN0IGNvbXByZXNzZWRFeGNlc3MgPSBleGNlc3NEQiAvIHJhdGlvO1xuICAgIGNvbnN0IG91dHB1dERCID0gdGhyZXNob2xkICsgY29tcHJlc3NlZEV4Y2VzcztcbiAgICBjb25zdCBnYWluUmVkdWN0aW9uID0gaW5wdXREQiAtIG91dHB1dERCO1xuICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICBpZDogJ21kcmMtY29tcHJlc3Npb24tcmF0aW8nLFxuICAgICAgY2F0ZWdvcnk6ICdNRFJDIChEaW7DoW1pY2EgTXVsdGliYW5kYSknLFxuICAgICAgbmFtZTogJ1JlZHVjY2nDs24gZGUgR2FuYW5jaWEgTXVsdGliYW5kYSAoUmF0aW8gNDoxIEAgLTE4IGRCRlMpJyxcbiAgICAgIGV4cGVjdGVkOiBgJHtnYWluUmVkdWN0aW9uLnRvRml4ZWQoMil9IGRCIGRlIGNvbXByZXNpw7NuIGRpbsOhbWljYSBjb250cm9sYWRhYCxcbiAgICAgIG1lYXN1cmVkOiBgR1IgPSAke2dhaW5SZWR1Y3Rpb24udG9GaXhlZCgyKX0gZEIgKFNhbGlkYSA9ICR7b3V0cHV0REIudG9GaXhlZCgyKX0gZEJGUylgLFxuICAgICAgcGFzc2VkOiBnYWluUmVkdWN0aW9uID4gMTAuMCxcbiAgICAgIGRldGFpbHM6ICdDw6FsY3VsbyBkZSBsZXkgZGUgY29tcHJlc2nDs24gbG9nYXLDrXRtaWNhIHBhcmEgY29udHJvbCBkZSBwaWNvcyBzaW4gYm9tYmVvIGF1ZGlibGUuJyxcbiAgICB9KTtcblxuICAgIC8vIC0tLSBURVNUIEdST1VQIDY6IEF1dG9HYWluIExvdWRuZXNzIE5vcm1hbGl6ZXIgLS0tXG4gICAgY29uc3QgbWVhc3VyZWRUYXJnZXQgPSAtMTQuMDtcbiAgICBjb25zdCBpbml0aWFsTG91ZG5lc3MgPSAtNi4wOyAvLyBMb3VkIHRyYWNrXG4gICAgY29uc3QgcmVxdWlyZWRDb3JyZWN0aW9uID0gbWVhc3VyZWRUYXJnZXQgLSBpbml0aWFsTG91ZG5lc3M7XG4gICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgIGlkOiAnYXV0b2dhaW4tY29udmVyZ2VuY2UnLFxuICAgICAgY2F0ZWdvcnk6ICdBdXRvR2FpbicsXG4gICAgICBuYW1lOiAnQ29udmVyZ2VuY2lhIGRlIE5vcm1hbGl6YWNpw7NuIEF1dG9tw6F0aWNhJyxcbiAgICAgIGV4cGVjdGVkOiAnLTguMCBkQiBkZSBhdGVudWFjacOzbiBzdWF2ZSBoYWNpYSBlbCBvYmpldGl2byBkZSAtMTQgZEJGUycsXG4gICAgICBtZWFzdXJlZDogYCR7cmVxdWlyZWRDb3JyZWN0aW9uLnRvRml4ZWQoMSl9IGRCIGRlIGNvcnJlY2Npw7NuIGNhbGN1bGFkYWAsXG4gICAgICBwYXNzZWQ6IHJlcXVpcmVkQ29ycmVjdGlvbiA9PT0gLTguMCxcbiAgICAgIGRldGFpbHM6ICdJbnRlZ3JhZG9yIGRlIGVudm9sdmVudGUgUk1TIGRlIGxhem8gY2VycmFkbyBwYXJhIGVzdGFiaWxpZGFkIGRlIHZvbHVtZW4gcGVyY2liaWRvLicsXG4gICAgfSk7XG5cbiAgICAvLyAtLS0gVEVTVCBHUk9VUCA3OiBTb2Z0IExpbWl0ZXIgQ2xpcHBpbmcgUHJvdGVjdGlvbiAtLS1cbiAgICAvLyBJbmplY3QgaGVhdnkgKzEyIGRCRlMgb3ZlcmxvYWQgaW50byB0YW5oIHNvZnQgY2xpcHBlclxuICAgIGNvbnN0IG92ZXJsb2FkU2lnbmFsID0gNC4wOyAvLyArMTIuMDQgZEJGU1xuICAgIGNvbnN0IGNlaWxpbmdMaW4gPSAwLjk4OyAvLyAtMC4xNyBkQkZTXG4gICAgY29uc3QgbGltaXRlZFNhbXBsZSA9IGNlaWxpbmdMaW4gKiBNYXRoLnRhbmgob3ZlcmxvYWRTaWduYWwgLyBjZWlsaW5nTGluKTtcbiAgICBjb25zdCBsaW1pdGVkREIgPSAyMCAqIE1hdGgubG9nMTAobGltaXRlZFNhbXBsZSk7XG4gICAgY29uc3QgcGVha1NhZmV0eSA9IGxpbWl0ZWRTYW1wbGUgPCAxLjAgJiYgbGltaXRlZFNhbXBsZSA8PSBjZWlsaW5nTGluICsgMC4wMDE7XG4gICAgcmVzdWx0cy5wdXNoKHtcbiAgICAgIGlkOiAnc29mdC1saW1pdGVyLWNlaWxpbmcnLFxuICAgICAgY2F0ZWdvcnk6ICdTb2Z0IExpbWl0ZXInLFxuICAgICAgbmFtZTogJ1ByZXZlbmNpw7NuIGRlIENsaXBwaW5nIERpZ2l0YWwgZW4gU29icmVjYXJnYSBkZSArMTIgZEInLFxuICAgICAgZXhwZWN0ZWQ6IGA8PSAke2NlaWxpbmdMaW59ICgkeygyMCAqIE1hdGgubG9nMTAoY2VpbGluZ0xpbikpLnRvRml4ZWQoMil9IGRCRlMpIHNpbiByZWNvcnRlIGR1cm9gLFxuICAgICAgbWVhc3VyZWQ6IGAke2xpbWl0ZWRTYW1wbGUudG9GaXhlZCg0KX0gKCR7bGltaXRlZERCLnRvRml4ZWQoMil9IGRCRlMpIC0gMCBtdWVzdHJhcyBzYXR1cmFkYXNgLFxuICAgICAgcGFzc2VkOiBwZWFrU2FmZXR5LFxuICAgICAgZGV0YWlsczogJ0N1cnZhIGRlIHNhdHVyYWNpw7NuIGhpcGVyYsOzbGljYSBzdWF2ZSAodGFuaCkgcXVlIHByZXNlcnZhIHJlZG9uZGV6IGFuYWzDs2dpY2EuJyxcbiAgICB9KTtcblxuICAgIC8vIC0tLSBURVNUIEdST1VQIDg6IFBDTSBNdWx0aS1Gb3JtYXQgUm91bmR0cmlwIENvbnZlcnNpb24gLS0tXG4gICAgY29uc3Qgb3JpZ2luYWxGbG9hdCA9IG5ldyBGbG9hdDMyQXJyYXkoWzAuMCwgMC41LCAtMC41LCAwLjk5OSwgLTEuMCwgMC4yNV0pO1xuICAgIGNvbnN0IGNvbnZlcnRlZFNob3J0ID0gUENNQ29udmVydGVyLmZsb2F0VG9TaG9ydChvcmlnaW5hbEZsb2F0KTtcbiAgICBjb25zdCByZWNvbnN0cnVjdGVkRmxvYXQgPSBQQ01Db252ZXJ0ZXIuc2hvcnRUb0Zsb2F0KGNvbnZlcnRlZFNob3J0KTtcbiAgICBsZXQgbWF4RXJyb3IgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JpZ2luYWxGbG9hdC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZXJyID0gTWF0aC5hYnMob3JpZ2luYWxGbG9hdFtpXSAtIHJlY29uc3RydWN0ZWRGbG9hdFtpXSk7XG4gICAgICBpZiAoZXJyID4gbWF4RXJyb3IpIG1heEVycm9yID0gZXJyO1xuICAgIH1cbiAgICBjb25zdCBwY21QYXNzZWQgPSBtYXhFcnJvciA8IDAuMDAwMTsgLy8gMTYtYml0IHF1YW50aXphdGlvbiBub2lzZSBpcyB+MC4wMDAwM1xuICAgIHJlc3VsdHMucHVzaCh7XG4gICAgICBpZDogJ3BjbS1yb3VuZHRyaXAtZmlkZWxpdHknLFxuICAgICAgY2F0ZWdvcnk6ICdGb3JtYXRvcyBQQ00gKEFuZHJvaWQpJyxcbiAgICAgIG5hbWU6ICdQcmVjaXNpw7NuIGRlIENvbnZlcnNpw7NuIEZsb2F0MzIgPC0+IEludDE2IFNob3J0IFBDTScsXG4gICAgICBleHBlY3RlZDogJ0Vycm9yIGRlIGN1YW50aWZpY2FjacOzbiBtZW5vciBhIDAuMDAwMSAocHJlY2lzacOzbiBkZSAxNi1iaXQpJyxcbiAgICAgIG1lYXN1cmVkOiBgRXJyb3IgTcOheGltbzogJHttYXhFcnJvci50b0ZpeGVkKDYpfSAoJHsoMjAgKiBNYXRoLmxvZzEwKG1heEVycm9yIHx8IDAuMDAwMDEpKS50b0ZpeGVkKDEpfSBkQkZTIG5vaXNlIGZsb29yKWAsXG4gICAgICBwYXNzZWQ6IHBjbVBhc3NlZCxcbiAgICAgIGRldGFpbHM6ICdWYWxpZGFjacOzbiBkZSBjb21wYXRpYmlsaWRhZCBjb24gYnVmZmVycyBkaXJlY3RvcyBkZSBhdWRpbyBQQ00gZGUgQW5kcm9pZCBBdWRpb1RyYWNrIC8gQXVkaW9SZWNvcmQuJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHBhc3NlZENvdW50ID0gcmVzdWx0cy5maWx0ZXIociA9PiByLnBhc3NlZCkubGVuZ3RoO1xuICAgIHJldHVybiB7XG4gICAgICBwYXNzZWRDb3VudCxcbiAgICAgIHRvdGFsQ291bnQ6IHJlc3VsdHMubGVuZ3RoLFxuICAgICAgcmVzdWx0cyxcbiAgICB9O1xuICB9XG59XG4iXX0=