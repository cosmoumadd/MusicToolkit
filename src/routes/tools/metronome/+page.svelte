<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { metronomeStore } from '$lib/stores/metronome';
	import MetronomeEngine from '$lib/audio/metronome/engine';
	import BeatIndicator from '$lib/components/metronome/BeatIndicator.svelte';
	import TempoControl from '$lib/components/metronome/TempoControl.svelte';
	import BackToTools from '$lib/components/tools/BackToTools.svelte';

	let state = $derived($metronomeStore);
	let engine: MetronomeEngine;
	let tapTimes: number[] = [];

	const tempoName = (bpm: number) => {
		if (bpm < 60) return 'Largo';
		if (bpm < 76) return 'Adagio';
		if (bpm < 108) return 'Andante';
		if (bpm < 120) return 'Moderato';
		if (bpm < 168) return 'Allegro';
		return 'Presto';
	};

	onMount(() => {
		engine = new MetronomeEngine();
	});

	onDestroy(() => engine?.dispose());

	const handlePlayPause = async () => {
		try {
			await engine?.toggle();
		} catch (error) {
			console.error('Failed to start metronome:', error);
			metronomeStore.setPlaying(false);
		}
	};

	const handleBpmChange = (bpm: number) => engine?.setBpm(bpm);

	const handleTap = () => {
		const now = performance.now();
		if (tapTimes.length && now - tapTimes.at(-1)! > 2000) tapTimes = [];
		tapTimes = [...tapTimes.slice(-4), now];
		if (tapTimes.length < 2) return;

		const intervals = tapTimes.slice(1).map((time, index) => time - tapTimes[index]);
		const average = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
		handleBpmChange(Math.round(60000 / average));
	};

	const handleKeyboard = (event: KeyboardEvent) => {
		const target = event.target as HTMLElement;
		if (event.code !== 'Space' || ['INPUT', 'BUTTON', 'TEXTAREA'].includes(target.tagName)) return;
		event.preventDefault();
		handlePlayPause();
	};
</script>

<svelte:window onkeydown={handleKeyboard} />

<svelte:head>
	<title>Online Metronome | Music Toolkit</title>
	<meta
		name="description"
		content="A precise online metronome with live BPM control, time signatures, accents and tap tempo."
	/>
</svelte:head>

<div
	class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-3 py-4 sm:px-6 sm:py-12"
>
	<div class="mx-auto max-w-3xl">
		<BackToTools />
		<header class="mb-3 text-center sm:mb-8">
			<p class="mb-2 text-sm font-semibold tracking-[0.25em] text-cyan-400 uppercase">
				Practice with precision
			</p>
			<h1 class="mb-3 text-4xl font-bold text-white sm:text-5xl">🥁 Find Your Pulse</h1>
			<p class="text-slate-400">
				A focused online metronome that keeps every practice session in time.
			</p>
		</header>

		<section
			class="mb-3 rounded-2xl border border-slate-700 bg-slate-800 p-3 shadow-2xl sm:mb-6 sm:p-8"
		>
			<div class="mb-2 text-center text-sm font-semibold tracking-wider text-cyan-400 uppercase">
				{tempoName(state.bpm)} · {state.bpm} BPM
			</div>

			<div class="my-3 sm:my-8">
				<BeatIndicator
					beats={state.timeSignature.beats}
					currentBeat={state.currentBeat}
					isPlaying={state.isPlaying}
				/>
			</div>

			<TempoControl bpm={state.bpm} onChange={handleBpmChange} onTap={handleTap} />

			<div class="mt-3 flex gap-2 sm:mt-6 sm:gap-3">
				<button
					onclick={handlePlayPause}
					class="flex-1 rounded-xl px-4 py-2.5 font-bold text-white transition sm:px-6 sm:py-4 sm:text-lg {state.isPlaying
						? 'bg-rose-600 hover:bg-rose-500'
						: 'bg-cyan-600 hover:bg-cyan-500'}"
				>
					{state.isPlaying ? '■ Stop' : '▶ Start'}
				</button>
				<button
					onclick={() => engine?.reset()}
					class="rounded-xl bg-slate-700 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-600 sm:px-6 sm:py-4"
				>
					Reset
				</button>
			</div>
			<p class="mt-3 hidden text-center text-xs text-slate-500 sm:block">
				Press Space to start or stop
			</p>
		</section>

		<section class="mb-6 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2">
			<div
				class="col-span-2 rounded-xl border border-slate-700 bg-slate-800 p-3 sm:col-span-1 sm:p-6"
			>
				<h2 class="mb-2 text-sm font-semibold text-white sm:mb-4 sm:text-lg">Time Signature</h2>
				<div class="grid grid-cols-5 gap-2">
					{#each [2, 3, 4, 5, 6] as beats (beats)}
						<button
							onclick={() => engine?.setTimeSignature(beats, 4)}
							class="rounded-lg px-2 py-2 text-sm font-semibold transition {state.timeSignature
								.beats === beats
								? 'bg-cyan-600 text-white'
								: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
						>
							{beats}/4
						</button>
					{/each}
				</div>
				<p class="mt-3 hidden text-xs text-slate-500 sm:block">
					Your selection stays set when the metronome stops.
				</p>
			</div>

			<div class="rounded-xl border border-slate-700 bg-slate-800 p-3 sm:p-6">
				<div class="mb-2 flex items-center justify-between sm:mb-4">
					<h2 class="text-sm font-semibold text-white sm:text-lg">Volume</h2>
					<span class="text-sm text-slate-400">{Math.round(state.volume * 100)}%</span>
				</div>
				<div class="flex items-center gap-2 sm:gap-4">
					<span aria-hidden="true">🔈</span>
					<input
						type="range"
						min="0"
						max="1"
						step="0.05"
						value={state.volume}
						oninput={(event) => engine?.setVolume(Number(event.currentTarget.value))}
						aria-label="Volume"
						class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-400"
					/>
					<span aria-hidden="true">🔊</span>
				</div>
			</div>

			<div class="rounded-xl border border-slate-700 bg-slate-800 p-3 sm:p-6 md:col-span-2">
				<button
					onclick={() => engine?.toggleAccent()}
					aria-pressed={state.accentEnabled}
					class="w-full rounded-lg px-2 py-2 text-sm font-semibold transition sm:px-4 sm:py-3 sm:text-base {state.accentEnabled
						? 'bg-emerald-600 text-white hover:bg-emerald-500'
						: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
				>
					{state.accentEnabled ? '✓ First-beat accent on' : 'First-beat accent off'}
				</button>
			</div>
		</section>
	</div>
</div>
