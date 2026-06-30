<script lang="ts">
	import { onDestroy } from 'svelte';
	import scaleData from '$lib/data/scales.json';
	import { belongsToScale, buildScale } from '$lib/music/scale-finder';
	import { createPlaybackEvents, type PlaybackStyle } from '$lib/music/scale-playback';
	import { Note } from 'tonal';
	import * as Tone from 'tone';

	type ScaleDefinition = (typeof scaleData.scales)[number];

	const whiteKeys = [
		'C3',
		'D3',
		'E3',
		'F3',
		'G3',
		'A3',
		'B3',
		'C4',
		'D4',
		'E4',
		'F4',
		'G4',
		'A4',
		'B4'
	];
	const blackKeys = [
		{ note: 'Db3', afterWhite: 0 },
		{ note: 'Eb3', afterWhite: 1 },
		{ note: 'Gb3', afterWhite: 3 },
		{ note: 'Ab3', afterWhite: 4 },
		{ note: 'Bb3', afterWhite: 5 },
		{ note: 'Db4', afterWhite: 7 },
		{ note: 'Eb4', afterWhite: 8 },
		{ note: 'Gb4', afterWhite: 10 },
		{ note: 'Ab4', afterWhite: 11 },
		{ note: 'Bb4', afterWhite: 12 }
	];

	let selectedRoot = $state('C');
	let selectedScaleId = $state('major');
	let selectedVoiceId = $state('grand');
	let selectedPlaybackStyle = $state<PlaybackStyle>('scale');
	let tempo = $state(120);
	let isPlaying = $state(false);
	let synth: Tone.PolySynth | undefined;
	let playbackTimer: ReturnType<typeof setTimeout> | undefined;

	let selectedScale = $derived(
		scaleData.scales.find((scale) => scale.id === selectedScaleId) as ScaleDefinition
	);
	let scaleNotes = $derived(buildScale(selectedRoot, selectedScale.intervals));

	const noteLabel = (note: string) => Note.pitchClass(note);
	const isScaleNote = (note: string) => belongsToScale(note, scaleNotes);
	const blackKeyLeft = (afterWhite: number) => `${((afterWhite + 1) / whiteKeys.length) * 100}%`;

	function createSynth() {
		if (selectedVoiceId === 'epiano') {
			return new Tone.PolySynth(Tone.Synth, {
				volume: -9,
				oscillator: { type: 'sine4' },
				envelope: { attack: 0.01, decay: 0.55, sustain: 0.3, release: 0.8 }
			}).toDestination();
		}

		if (selectedVoiceId === 'guitar') {
			return new Tone.PolySynth(Tone.Synth, {
				volume: -8,
				oscillator: { type: 'triangle' },
				envelope: { attack: 0.002, decay: 0.3, sustain: 0.08, release: 0.35 }
			}).toDestination();
		}

		if (selectedVoiceId === 'synth') {
			return new Tone.PolySynth(Tone.Synth, {
				volume: -11,
				oscillator: { type: 'sawtooth' },
				envelope: { attack: 0.02, decay: 0.2, sustain: 0.35, release: 0.3 }
			}).toDestination();
		}

		return new Tone.PolySynth(Tone.Synth, {
			volume: -8,
			oscillator: { type: 'triangle8' },
			envelope: { attack: 0.005, decay: 0.8, sustain: 0.18, release: 1.2 }
		}).toDestination();
	}

	function playScale() {
		isPlaying = true;
		void Tone.start().catch(() => (isPlaying = false));
		synth?.dispose();
		synth = createSynth();
		if (playbackTimer) clearTimeout(playbackTimer);
		const events = createPlaybackEvents(scaleNotes, selectedPlaybackStyle);
		const stepDuration = 30 / tempo;
		const start = Tone.now() + 0.05;
		events.forEach((notes, index) =>
			synth?.triggerAttackRelease(notes, stepDuration * 0.82, start + index * stepDuration)
		);
		playbackTimer = setTimeout(
			() => (isPlaying = false),
			events.length * stepDuration * 1000 + 100
		);
	}

	function reset() {
		selectedRoot = 'C';
		selectedScaleId = 'major';
		selectedVoiceId = 'grand';
		selectedPlaybackStyle = 'scale';
		tempo = 120;
		isPlaying = false;
		synth?.dispose();
		synth = undefined;
		if (playbackTimer) clearTimeout(playbackTimer);
	}

	onDestroy(() => {
		if (playbackTimer) clearTimeout(playbackTimer);
		synth?.dispose();
	});
</script>

<svelte:head>
	<title>Interactive Scale Finder | Music Toolkit</title>
	<meta
		name="description"
		content="Explore major, minor, pentatonic and modal scales on a realistic two-octave piano."
	/>
</svelte:head>

<div
	class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-6xl">
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[0.25em] text-emerald-400 uppercase">
				See the pattern. Hear the color.
			</p>
			<h1 class="mb-3 text-4xl font-bold text-white sm:text-5xl">🎼 Scale Finder</h1>
			<p class="text-slate-400">Choose a root and scale to reveal its notes across the piano.</p>
		</header>

		<section class="mb-6 rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-2xl sm:p-8">
			<div class="mb-7 grid gap-6 lg:grid-cols-[1fr_1.35fr]">
				<div class="min-w-0">
					<p class="mb-3 text-sm font-semibold text-white">1. Choose a root note</p>
					<div class="flex flex-wrap gap-2">
						{#each scaleData.roots as root (root)}
							<button
								type="button"
								onclick={() => (selectedRoot = root)}
								class="h-10 min-w-10 rounded-lg px-3 font-bold transition {selectedRoot === root
									? 'bg-emerald-600 text-white'
									: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
							>
								{root}
							</button>
						{/each}
					</div>
				</div>

				<div class="min-w-0">
					<p class="mb-3 text-sm font-semibold text-white">2. Choose a scale</p>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{#each scaleData.scales as scale (scale.id)}
							<button
								type="button"
								onclick={() => (selectedScaleId = scale.id)}
								class="min-w-0 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition {selectedScaleId ===
								scale.id
									? 'border-emerald-400 bg-emerald-500/15 text-white'
									: 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500'}"
							>
								{scale.name}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div
				class="mb-7 grid gap-5 rounded-xl border border-slate-700 bg-slate-900/50 p-5 lg:grid-cols-3"
			>
				<div>
					<p class="mb-3 text-sm font-semibold text-white">3. Choose a sound</p>
					<div class="grid grid-cols-2 gap-2">
						{#each scaleData.voices as voice (voice.id)}
							<button
								type="button"
								onclick={() => (selectedVoiceId = voice.id)}
								class="rounded-lg border p-3 text-left transition {selectedVoiceId === voice.id
									? 'border-cyan-400 bg-cyan-500/15'
									: 'border-slate-700 bg-slate-800 hover:border-slate-500'}"
							>
								<span class="font-bold text-white">{voice.icon} {voice.name}</span>
								<span class="mt-1 block text-xs text-slate-400">{voice.description}</span>
							</button>
						{/each}
					</div>
				</div>

				<div>
					<p class="mb-3 text-sm font-semibold text-white">4. Choose a play style</p>
					<div class="grid grid-cols-2 gap-2">
						{#each scaleData.playbackStyles as style (style.id)}
							<button
								type="button"
								onclick={() => (selectedPlaybackStyle = style.id as PlaybackStyle)}
								class="rounded-lg border p-3 text-left transition {selectedPlaybackStyle ===
								style.id
									? 'border-violet-400 bg-violet-500/15'
									: 'border-slate-700 bg-slate-800 hover:border-slate-500'}"
							>
								<span class="font-bold text-white">{style.name}</span>
								<span class="mt-1 block text-xs text-slate-400">{style.description}</span>
							</button>
						{/each}
					</div>
				</div>

				<div>
					<div class="mb-3 flex items-center justify-between">
						<p class="text-sm font-semibold text-white">5. Adjust the speed</p>
						<span class="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-bold text-amber-300">
							{tempo} BPM
						</span>
					</div>
					<input
						type="range"
						min="60"
						max="240"
						step="5"
						value={tempo}
						oninput={(event) => (tempo = Number(event.currentTarget.value))}
						aria-label="Playback speed"
						class="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-amber-400"
					/>
					<div class="mt-3 flex justify-between text-xs text-slate-500">
						<span>Slow · 60</span>
						<span>Fast · 240</span>
					</div>
					<p class="mt-5 text-sm leading-relaxed text-slate-400">
						Start slowly enough to hear every note clearly, then raise the tempo as the pattern
						becomes familiar.
					</p>
				</div>
			</div>

			<div
				class="mb-5 rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/70 to-slate-900 p-5 sm:p-6"
			>
				<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<p class="text-sm font-bold tracking-widest text-emerald-400 uppercase">
							Current scale
						</p>
						<h2 class="mt-1 text-3xl font-black text-white">{selectedRoot} {selectedScale.name}</h2>
						<p class="mt-1 font-medium text-emerald-200">{selectedScale.mood}</p>
					</div>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={reset}
							class="rounded-xl bg-slate-700 px-4 py-3 font-bold text-white transition hover:bg-slate-600"
						>
							↺ Reset
						</button>
						<button
							type="button"
							onclick={playScale}
							class="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500"
						>
							{isPlaying ? '▶ Play again' : '▶ Play scale'}
						</button>
					</div>
				</div>
				<p class="mt-5 leading-relaxed text-slate-300">{selectedScale.description}</p>
				<p class="mt-3 rounded-lg bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
					<span class="font-bold text-amber-300">💡 Practice tip:</span>
					{selectedScale.tip}
				</p>
			</div>

			<div class="overflow-x-auto rounded-xl bg-slate-950 p-4 sm:p-6">
				<div class="relative h-52 min-w-[760px]" aria-label="Two octave piano keyboard">
					<div class="flex h-full">
						{#each whiteKeys as note (note)}
							<div
								class="flex flex-1 items-end justify-center rounded-b-md border border-slate-400 pb-3 text-xs font-bold {isScaleNote(
									note
								)
									? 'bg-emerald-400 text-emerald-950 shadow-[inset_0_-18px_30px_rgba(16,185,129,0.25)]'
									: 'bg-white text-slate-700'}"
							>
								{note}
							</div>
						{/each}
					</div>
					{#each blackKeys as key (key.note)}
						<div
							class="absolute top-0 z-10 flex h-[62%] w-[4.5%] -translate-x-1/2 items-end justify-center rounded-b-md border border-slate-950 pb-2 text-[10px] font-bold shadow-lg {isScaleNote(
								key.note
							)
								? 'bg-emerald-600 text-white'
								: 'bg-slate-900 text-slate-300'}"
							style:left={blackKeyLeft(key.afterWhite)}
						>
							{key.note}
						</div>
					{/each}
				</div>
			</div>

			<div class="mt-5 flex flex-wrap items-center gap-2" aria-live="polite">
				<span class="mr-2 text-sm font-semibold text-slate-400">Notes:</span>
				{#each scaleNotes as note, index (`${note}-${index}`)}
					<span class="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-300">
						{noteLabel(note)}
					</span>
				{/each}
			</div>
		</section>
	</div>
</div>
