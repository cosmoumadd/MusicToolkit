<script lang="ts">
	import { onDestroy } from 'svelte';
	import { base } from '$app/paths';
	import PianoKeyboard from '$lib/components/music/PianoKeyboard.svelte';
	import BackToTools from '$lib/components/tools/BackToTools.svelte';
	import detectorData from '$lib/data/chord-detector.json';
	import { detectChord, noteAtFret, notesForChord } from '$lib/music/chord-detector';
	import { Note } from 'tonal';
	import * as Tone from 'tone';

	type Instrument = (typeof detectorData.instruments)[number];
	type Quality = (typeof detectorData.qualities)[number];

	let instrumentId = $state('piano');
	let selectedNotes = $state<string[]>([]);
	let selectedRoot = $state('C');
	let selectedQuality = $state('major');
	let synth: Tone.PolySynth | undefined;

	let instrument = $derived(
		detectorData.instruments.find((item) => item.id === instrumentId) as Instrument
	);
	let chordName = $derived(detectChord(selectedNotes));
	const pitchClass = (note: string) => NoteName(note);

	function NoteName(note: string): string {
		return note
			.replace(/-?\d+$/, '')
			.replace('D#', 'Eb')
			.replace('G#', 'Ab')
			.replace('A#', 'Bb');
	}

	function isSelected(note: string): boolean {
		return selectedNotes.some((selected) => Note.chroma(selected) === Note.chroma(note));
	}

	function toggleNote(note: string) {
		const name = pitchClass(note);
		selectedNotes = isSelected(name)
			? selectedNotes.filter((selected) => Note.chroma(selected) !== Note.chroma(name))
			: [...selectedNotes, name];
	}

	function applyPreset(root = selectedRoot, qualityId = selectedQuality) {
		selectedRoot = root;
		selectedQuality = qualityId;
		const quality = detectorData.qualities.find((item) => item.id === qualityId) as Quality;
		selectedNotes = notesForChord(root, quality.intervals);
	}

	function changeInstrument(id: string) {
		instrumentId = id;
		selectedNotes = [];
	}

	function reset() {
		selectedNotes = [];
		selectedRoot = 'C';
		selectedQuality = 'major';
	}

	async function playChord() {
		if (!selectedNotes.length) return;
		await Tone.start();
		synth ??= new Tone.PolySynth(Tone.Synth, {
			volume: -9,
			oscillator: { type: 'triangle8' },
			envelope: { attack: 0.005, decay: 0.5, sustain: 0.2, release: 1 }
		}).toDestination();
		const notes = [...new Set(selectedNotes.map((note) => `${Note.pitchClass(note)}3`))];
		synth.triggerAttackRelease(notes, '2n');
	}

	onDestroy(() => synth?.dispose());
</script>

<svelte:head>
	<title>Interactive Chord Detector | Music Toolkit</title>
	<meta
		name="description"
		content="Select notes on a two-octave piano, guitar or ukulele and identify the chord instantly."
	/>
</svelte:head>

<div
	class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-6xl">
		<BackToTools />
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[0.25em] text-violet-400 uppercase">
				Build it. Hear it. Name it.
			</p>
			<h1 class="mb-3 text-4xl font-bold text-white sm:text-5xl">🎯 Chord Detector</h1>
			<p class="text-slate-400">
				Choose an instrument and tap notes to identify a chord instantly.
			</p>
		</header>

		<section class="mb-6 rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-2xl sm:p-8">
			<div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<p class="text-xs font-bold tracking-widest text-slate-400 uppercase">Detected chord</p>
					<div class="mt-1 text-5xl font-black text-white" aria-live="polite">{chordName}</div>
					<p class="mt-2 min-h-6 text-sm text-violet-300">
						{selectedNotes.length
							? selectedNotes.join(' • ')
							: 'Select at least two notes to begin'}
					</p>
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						onclick={playChord}
						disabled={!selectedNotes.length}
						class="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Play chord
					</button>
					<button
						type="button"
						onclick={reset}
						class="rounded-xl border border-slate-600 bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-600"
					>
						Reset
					</button>
				</div>
			</div>

			<div class="mb-5 sm:mb-7">
				<p class="mb-3 text-sm font-semibold text-white">Display instrument</p>
				<div
					class="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-3 [&::-webkit-scrollbar]:hidden"
				>
					{#each detectorData.instruments as item (item.id)}
						<button
							type="button"
							onclick={() => changeInstrument(item.id)}
							class="min-w-fit rounded-xl border px-4 py-3 text-left transition sm:min-w-0 sm:p-4 {instrumentId ===
							item.id
								? 'border-violet-400 bg-violet-500/15'
								: 'border-slate-700 bg-slate-900/50 hover:border-slate-500'}"
						>
							<span class="text-2xl" aria-hidden="true">{item.icon}</span>
							<span class="ml-2 font-bold text-white">{item.name}</span>
							<span class="mt-1 hidden text-xs text-slate-400 sm:block">{item.description}</span>
						</button>
					{/each}
				</div>
				<p class="mt-3 text-xs text-slate-500">
					Chord detection uses pitched instruments; unpitched drums do not contain chord notes.
				</p>
			</div>

			<div class="rounded-xl bg-slate-950 p-2 sm:p-4">
				{#if instrument.id === 'piano'}
					<PianoKeyboard {selectedNotes} interactive onNoteClick={toggleNote} accent="violet" />
				{:else}
					<div
						class="space-y-1 overflow-x-auto sm:space-y-2"
						aria-label={`${instrument.name} fretboard`}
					>
						<div
							class="grid min-w-[520px] grid-cols-[34px_repeat(13,minmax(0,1fr))] text-center text-[9px] text-slate-500 sm:min-w-[760px] sm:grid-cols-[48px_repeat(13,minmax(46px,1fr))] sm:text-xs"
						>
							<span>String</span>
							{#each Array.from({ length: 13 }, (_, fret) => fret as number) as fret}
								<span>{fret}</span>
							{/each}
						</div>
						{#each instrument.strings ?? [] as openNote (openNote)}
							<div
								class="grid min-w-[520px] grid-cols-[34px_repeat(13,minmax(0,1fr))] items-center sm:min-w-[760px] sm:grid-cols-[48px_repeat(13,minmax(46px,1fr))]"
							>
								<span class="text-center text-xs font-bold text-slate-300">{openNote}</span>
								{#each Array.from({ length: 13 }, (_, fret) => fret as number) as fret}
									{@const note = noteAtFret(openNote, fret)}
									<button
										type="button"
										onclick={() => toggleNote(note)}
										aria-pressed={isSelected(note)}
										class="h-8 overflow-hidden border-y border-r border-amber-900/70 text-[9px] font-semibold transition sm:h-10 sm:text-xs {isSelected(
											note
										)
											? 'bg-violet-500 text-white'
											: 'bg-amber-950/60 text-amber-100 hover:bg-amber-900'}"
									>
										{pitchClass(note)}
									</button>
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</section>

		<section class="mb-8 rounded-2xl border border-slate-700 bg-slate-800 p-5 sm:p-8">
			<div class="mb-5">
				<h2 class="text-xl font-bold text-white">Common chord shortcuts</h2>
				<p class="mt-1 text-sm text-slate-400">Choose a root, then a common chord quality.</p>
			</div>
			<div class="mb-5 flex flex-wrap gap-2">
				{#each detectorData.roots as root (root)}
					<button
						type="button"
						onclick={() => applyPreset(root)}
						class="h-10 min-w-10 rounded-lg px-3 font-bold transition {selectedRoot === root
							? 'bg-violet-600 text-white'
							: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
					>
						{root}
					</button>
				{/each}
			</div>
			<div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
				{#each detectorData.qualities as quality (quality.id)}
					<button
						type="button"
						onclick={() => applyPreset(selectedRoot, quality.id)}
						class="rounded-lg border px-3 py-3 text-left transition {selectedQuality === quality.id
							? 'border-violet-400 bg-violet-500/15 text-white'
							: 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500'}"
					>
						<span class="block font-bold">{selectedRoot}{quality.symbol}</span>
						<span class="text-xs text-slate-400">{quality.label}</span>
					</button>
				{/each}
			</div>
		</section>

		<a
			href={`${base}/games/guess-chord`}
			class="group block overflow-hidden rounded-2xl border border-fuchsia-400/40 bg-gradient-to-r from-violet-700 via-fuchsia-700 to-rose-600 p-1 shadow-xl shadow-fuchsia-950/30 transition hover:-translate-y-1 hover:shadow-fuchsia-900/40"
		>
			<div
				class="flex flex-col items-start justify-between gap-5 rounded-xl bg-slate-950/25 p-7 backdrop-blur sm:flex-row sm:items-center"
			>
				<div>
					<p class="text-sm font-bold tracking-widest text-fuchsia-100 uppercase">Coming next</p>
					<h2 class="mt-1 text-2xl font-black text-white sm:text-3xl">
						Think your ears know chords?
					</h2>
					<p class="mt-2 text-fuchsia-100">Put them to the test in Guess the Chord.</p>
				</div>
				<span
					class="rounded-xl bg-white px-5 py-3 font-black text-violet-700 transition group-hover:scale-105"
				>
					Challenge yourself →
				</span>
			</div>
		</a>
	</div>
</div>
