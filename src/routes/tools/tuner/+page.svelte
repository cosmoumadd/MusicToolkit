<script lang="ts">
	import { onDestroy } from 'svelte';
	import BackToTools from '$lib/components/tools/BackToTools.svelte';

	let listening = $state(false);
	let note = $state('--');
	let frequency = $state(0);
	let cents = $state(0);
	let message = $state('Allow microphone access, then play one clear note.');
	let context: AudioContext | undefined;
	let stream: MediaStream | undefined;
	let frame = 0;

	function detectPitch(buffer: Float32Array, sampleRate: number) {
		let rms = 0;
		for (const sample of buffer) rms += sample * sample;
		if (Math.sqrt(rms / buffer.length) < 0.015) return 0;
		let bestOffset = -1;
		let bestCorrelation = 0;
		for (
			let offset = Math.floor(sampleRate / 1000);
			offset < Math.min(Math.floor(sampleRate / 60), buffer.length / 2);
			offset++
		) {
			let correlation = 0;
			for (let i = 0; i < buffer.length - offset; i++)
				correlation += buffer[i] * buffer[i + offset];
			if (correlation > bestCorrelation) {
				bestCorrelation = correlation;
				bestOffset = offset;
			}
		}
		return bestOffset > 0 ? sampleRate / bestOffset : 0;
	}

	function updatePitch(analyser: AnalyserNode) {
		const buffer = new Float32Array(analyser.fftSize);
		analyser.getFloatTimeDomainData(buffer);
		const detected = detectPitch(buffer, analyser.context.sampleRate);
		if (detected) {
			const midi = Math.round(69 + 12 * Math.log2(detected / 440));
			const names = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
			note = `${names[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
			frequency = detected;
			cents = Math.round(1200 * Math.log2(detected / (440 * 2 ** ((midi - 69) / 12))));
			message = Math.abs(cents) <= 5 ? 'In tune' : cents < 0 ? 'Tune higher' : 'Tune lower';
		}
		frame = requestAnimationFrame(() => updatePitch(analyser));
	}

	async function start() {
		if (listening) return stop();
		try {
			stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			context = new AudioContext();
			const analyser = context.createAnalyser();
			analyser.fftSize = 2048;
			context.createMediaStreamSource(stream).connect(analyser);
			listening = true;
			message = 'Listening...';
			updatePitch(analyser);
		} catch {
			message = 'Microphone access was not available. Check your browser permission.';
		}
	}

	function stop() {
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame);
		stream?.getTracks().forEach((track) => track.stop());
		void context?.close();
		stream = undefined;
		context = undefined;
		listening = false;
		message = 'Microphone stopped.';
	}

	onDestroy(stop);
</script>

<svelte:head
	><title>Online Tuner | Music Toolkit</title><meta
		name="description"
		content="Tune your instrument with live microphone pitch and cents feedback."
	/></svelte:head
>
<div
	class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-3xl">
		<BackToTools />
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[.25em] text-rose-400 uppercase">
				Find the center of every note
			</p>
			<h1 class="text-4xl font-bold text-white sm:text-5xl">Tuner</h1>
			<p class="mt-3 text-slate-400">Live pitch feedback from your microphone.</p>
		</header>
		<section
			class="rounded-2xl border border-slate-700 bg-slate-800 p-5 text-center shadow-2xl sm:p-8"
		>
			<div class="mx-auto mb-6 max-w-lg rounded-[2rem] border border-rose-400/20 bg-slate-950 p-8">
				<p class="text-sm font-bold tracking-widest text-slate-400 uppercase">Detected note</p>
				<div class="my-3 text-7xl font-black text-white" aria-live="polite">{note}</div>
				<p
					class="text-lg font-bold {Math.abs(cents) <= 5 && frequency
						? 'text-emerald-400'
						: 'text-rose-300'}"
				>
					{message}
				</p>
				<div
					class="relative mt-8 h-3 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400"
				>
					<span
						class="absolute top-1/2 h-7 w-1 -translate-y-1/2 rounded bg-white transition-all"
						style:left={`calc(${Math.max(0, Math.min(100, cents + 50))}% - 2px)`}
					></span>
				</div>
				<div class="mt-2 flex justify-between text-xs text-slate-500">
					<span>-50 cents</span><span>0</span><span>+50 cents</span>
				</div>
				<p class="mt-6 font-mono text-slate-300">
					{frequency
						? `${frequency.toFixed(1)} Hz / ${cents > 0 ? '+' : ''}${cents} cents`
						: 'Waiting for a note'}
				</p>
			</div>
			<button
				onclick={start}
				class="w-full rounded-xl py-4 text-lg font-black text-white {listening
					? 'bg-rose-600 hover:bg-rose-500'
					: 'bg-emerald-600 hover:bg-emerald-500'}"
				>{listening ? 'Stop microphone' : 'Start microphone'}</button
			>
			<p class="mt-4 text-sm text-slate-400">
				For the clearest result, play one sustained note near the microphone and mute other strings.
			</p>
		</section>
	</div>
</div>
