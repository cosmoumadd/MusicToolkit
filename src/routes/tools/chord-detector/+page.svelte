<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { base } from '$app/paths';
	import PianoKeyboard from '$lib/components/music/PianoKeyboard.svelte';
	import BackToTools from '$lib/components/tools/BackToTools.svelte';
	import detectorData from '$lib/data/chord-detector.json';
	import {
		buildChordVoicing,
		createChordPlaybackEvents,
		detectChord,
		noteAtFret,
		notesForChord,
		type ChordPlaybackStyle
	} from '$lib/music/chord-detector';
	import { Note } from 'tonal';
	import * as Tone from 'tone';

	type Instrument = (typeof detectorData.instruments)[number];
	type Quality = (typeof detectorData.qualities)[number];

	let instrumentId = $state('piano');
	let selectedNotes = $state<string[]>([]);
	let selectedRoot = $state('C');
	let selectedQuality = $state('major');
	let playbackInstrument = $state('piano');
	let playbackStyle = $state<ChordPlaybackStyle>('together');
	let settingsOpen = $state(false);
	let isPlaying = $state(false);
	let synth: Tone.PolySynth | undefined;
	let playbackTimer: ReturnType<typeof setTimeout> | undefined;
	let settingsDialog = $state<HTMLDialogElement>();

	const playbackInstruments = [
		{ id: 'piano', name: 'Piano' },
		{ id: 'guitar', name: 'Guitar' },
		{ id: 'strings', name: 'Strings' },
		{ id: 'organ', name: 'Organ' }
	];

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
		stopPlayback();
	}

	function reset() {
		selectedNotes = [];
		selectedRoot = 'C';
		selectedQuality = 'major';
		stopPlayback();
	}

	function stopPlayback() {
		if (playbackTimer) clearTimeout(playbackTimer);
		playbackTimer = undefined;
		isPlaying = false;
		synth?.releaseAll();
		synth?.dispose();
		synth = undefined;
	}

	function createSynth() {
		if (playbackInstrument === 'guitar') {
			return new Tone.PolySynth(Tone.Synth, {
				volume: -8,
				oscillator: { type: 'triangle' },
				envelope: { attack: 0.002, decay: 0.35, sustain: 0.08, release: 0.4 }
			}).toDestination();
		}

		if (playbackInstrument === 'strings') {
			return new Tone.PolySynth(Tone.Synth, {
				volume: -12,
				oscillator: { type: 'sawtooth' },
				envelope: { attack: 0.35, decay: 0.4, sustain: 0.65, release: 1.5 }
			}).toDestination();
		}

		if (playbackInstrument === 'organ') {
			return new Tone.PolySynth(Tone.Synth, {
				volume: -11,
				oscillator: { type: 'sine4' },
				envelope: { attack: 0.03, decay: 0.15, sustain: 0.8, release: 0.6 }
			}).toDestination();
		}

		return new Tone.PolySynth(Tone.Synth, {
			volume: -9,
			oscillator: { type: 'triangle8' },
			envelope: { attack: 0.005, decay: 0.5, sustain: 0.2, release: 1 }
		}).toDestination();
	}

	function changePlaybackInstrument(id: string) {
		playbackInstrument = id;
		stopPlayback();
	}

	async function openSettings() {
		if (settingsOpen) return;
		settingsOpen = true;
		await tick();
		settingsDialog?.showModal();
	}

	function closeSettings() {
		settingsDialog?.close();
	}

	function closeFromBackdrop(event: MouseEvent) {
		if (event.target === settingsDialog) closeSettings();
	}

	function closeFromKeyboard(event: KeyboardEvent) {
		if (settingsOpen && event.key === 'Escape') {
			event.preventDefault();
			closeSettings();
		}
	}

	async function playChord() {
		if (!selectedNotes.length) return;
		await Tone.start();
		stopPlayback();
		synth = createSynth();
		const notes = buildChordVoicing(selectedNotes);
		const events = createChordPlaybackEvents(notes, playbackStyle);
		const stepDuration = playbackStyle === 'together' ? 0 : 0.42;
		const start = Tone.now() + 0.05;
		isPlaying = true;
		events.forEach((eventNotes, index) => {
			const isFinalChord = playbackStyle === 'together' || index === events.length - 1;
			synth?.triggerAttackRelease(
				eventNotes,
				isFinalChord ? 1.5 : 0.32,
				start + index * stepDuration
			);
		});
		const playbackLength = (events.length - 1) * stepDuration + 1.55;
		playbackTimer = setTimeout(() => (isPlaying = false), playbackLength * 1000);
	}

	onDestroy(stopPlayback);
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
				<div class="flex flex-col items-stretch gap-2 sm:items-end">
					<button
						type="button"
						onclick={reset}
						class="rounded-xl border border-slate-600 bg-slate-700 px-5 py-3 font-semibold text-white transition hover:bg-slate-600"
					>
						Reset
					</button>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={openSettings}
							aria-label="Chord playback settings"
							aria-expanded={settingsOpen}
							aria-haspopup="dialog"
							class="rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-xl leading-none text-white transition hover:bg-slate-600"
						>
							<span aria-hidden="true">⚙</span>
						</button>
						<button
							type="button"
							onclick={playChord}
							disabled={!selectedNotes.length || isPlaying}
							class="flex-1 rounded-xl bg-violet-600 px-5 py-3 font-semibold whitespace-nowrap text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
						>
							{isPlaying ? 'Playing…' : '▶ Play chord'}
						</button>
					</div>
				</div>
			</div>

			{#if settingsOpen}
				<dialog
					bind:this={settingsDialog}
					onclose={() => (settingsOpen = false)}
					onclick={closeFromBackdrop}
					onkeydown={closeFromKeyboard}
					aria-labelledby="playback-settings-title"
					class="m-auto max-h-[calc(100vh-2rem)] w-[min(30rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900 p-0 text-left text-slate-200 shadow-2xl backdrop:bg-slate-950/75 backdrop:backdrop-blur-sm"
				>
					<header class="flex items-center justify-between border-b border-slate-700 px-5 py-4">
						<div>
							<p class="text-xs font-bold tracking-widest text-violet-400 uppercase">Play chord</p>
							<h2 id="playback-settings-title" class="mt-1 text-xl font-black text-white">
								Playback settings
							</h2>
						</div>
						<button
							type="button"
							onclick={closeSettings}
							aria-label="Close playback settings"
							class="rounded-lg px-3 py-2 text-2xl leading-none text-slate-400 transition hover:bg-slate-800 hover:text-white"
						>
							<span aria-hidden="true">×</span>
						</button>
					</header>

					<div class="p-5">
						<fieldset>
							<legend class="mb-3 text-sm font-bold text-white">Sound</legend>
							<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
								{#each playbackInstruments as voice (voice.id)}
									<button
										type="button"
										onclick={() => changePlaybackInstrument(voice.id)}
										aria-pressed={playbackInstrument === voice.id}
										class="rounded-lg border px-3 py-2 text-sm font-semibold transition {playbackInstrument ===
										voice.id
											? 'border-violet-400 bg-violet-500/15 text-white'
											: 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500'}"
									>
										{voice.name}
									</button>
								{/each}
							</div>
						</fieldset>

						<fieldset class="mt-5 border-t border-slate-700 pt-5">
							<legend class="mb-2 text-sm font-bold text-white">Playback</legend>
							<label class="flex cursor-pointer gap-3 rounded-lg p-3 hover:bg-slate-800">
								<input
									type="radio"
									name="playback-style"
									value="together"
									checked={playbackStyle === 'together'}
									onchange={() => (playbackStyle = 'together')}
									class="mt-1 accent-violet-500"
								/>
								<span
									><strong class="block text-sm text-white">Together</strong><span
										class="text-xs text-slate-400">Play all chord notes at once.</span
									></span
								>
							</label>
							<label class="mt-1 flex cursor-pointer gap-3 rounded-lg p-3 hover:bg-slate-800">
								<input
									type="radio"
									name="playback-style"
									value="arpeggio-then-chord"
									checked={playbackStyle === 'arpeggio-then-chord'}
									onchange={() => (playbackStyle = 'arpeggio-then-chord')}
									class="mt-1 accent-violet-500"
								/>
								<span
									><strong class="block text-sm text-white">One by one, then together</strong><span
										class="text-xs text-slate-400">Hear each note before the full chord.</span
									></span
								>
							</label>
							<p class="mt-2 text-xs text-slate-500">Notes are voiced within one octave.</p>
						</fieldset>
					</div>

					<footer class="flex justify-end border-t border-slate-700 px-5 py-4">
						<button
							type="button"
							onclick={closeSettings}
							class="rounded-lg bg-violet-600 px-5 py-2.5 font-bold text-white transition hover:bg-violet-500"
						>
							Done
						</button>
					</footer>
				</dialog>
			{/if}

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
