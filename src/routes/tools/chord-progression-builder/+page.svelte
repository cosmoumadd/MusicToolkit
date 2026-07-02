<script lang="ts">
	import { onDestroy } from 'svelte';
	import BackToTools from '$lib/components/tools/BackToTools.svelte';
	import { Note } from 'tonal';
	import * as Tone from 'tone';

	const keys = ['C', 'D', 'E', 'F', 'G', 'A'];
	const degrees = [
		{ numeral: 'I', offset: 0, quality: '' },
		{ numeral: 'ii', offset: 2, quality: 'm' },
		{ numeral: 'iii', offset: 4, quality: 'm' },
		{ numeral: 'IV', offset: 5, quality: '' },
		{ numeral: 'V', offset: 7, quality: '' },
		{ numeral: 'vi', offset: 9, quality: 'm' }
	];
	let key = $state('C');
	let progression = $state<number[]>([0, 4, 5, 3]);
	let synth: Tone.PolySynth | undefined;
	const degreeRoot = (index: number) =>
		Note.pitchClass(Note.fromMidi((Note.midi(`${key}3`) ?? 48) + degrees[index].offset));
	const chordName = (index: number) => `${degreeRoot(index)}${degrees[index].quality}`;
	const chordNotes = (index: number) => {
		const root = (Note.midi(`${key}3`) ?? 48) + degrees[index].offset;
		const third = degrees[index].quality === 'm' ? 3 : 4;
		return [root, root + third, root + 7].map(Note.fromMidi);
	};
	async function play() {
		await Tone.start();
		synth ??= new Tone.PolySynth(Tone.Synth).toDestination();
		const now = Tone.now();
		progression.forEach((degree, i) =>
			synth?.triggerAttackRelease(chordNotes(degree), '2n', now + i)
		);
	}
	onDestroy(() => synth?.dispose());
</script>

<svelte:head><title>Chord Progression Builder | Music Toolkit</title></svelte:head>
<div
	class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-5xl">
		<BackToTools />
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[.25em] text-sky-400 uppercase">
				Turn harmony into a story
			</p>
			<h1 class="text-4xl font-bold text-white sm:text-5xl">Chord Progression Builder</h1>
			<p class="mt-3 text-slate-400">Choose a key, arrange diatonic chords, and hear the result.</p>
		</header>
		<section class="rounded-2xl border border-slate-700 bg-slate-800 p-5 sm:p-8">
			<p class="mb-3 font-semibold text-white">Key</p>
			<div class="mb-7 flex flex-wrap gap-2">
				{#each keys as item}<button
						onclick={() => (key = item)}
						class="rounded-lg px-4 py-2 font-bold {key === item
							? 'bg-sky-500 text-slate-950'
							: 'bg-slate-700 text-white'}">{item} major</button
					>{/each}
			</div>
			<p class="mb-3 font-semibold text-white">Add a chord</p>
			<div class="mb-7 grid grid-cols-3 gap-3 sm:grid-cols-6">
				{#each degrees as degree, index}<button
						onclick={() => (progression = [...progression, index])}
						class="rounded-xl border border-slate-600 bg-slate-900 p-3 text-white hover:border-sky-400"
						><span class="block text-lg font-black">{degree.numeral}</span><span
							class="text-sm text-sky-300">{chordName(index)}</span
						></button
					>{/each}
			</div>
			<div class="mb-6 grid gap-3 sm:grid-cols-4">
				{#each progression as degree, index}<button
						onclick={() => (progression = progression.filter((_, i) => i !== index))}
						class="rounded-xl bg-sky-500/15 p-5 text-left text-white ring-1 ring-sky-400/30"
						><span class="text-xs text-sky-300">{index + 1}. {degrees[degree].numeral}</span><strong
							class="block text-2xl">{chordName(degree)}</strong
						><span class="text-xs text-slate-400">Click to remove</span></button
					>{/each}
			</div>
			<div class="flex gap-3">
				<button
					onclick={play}
					disabled={!progression.length}
					class="flex-1 rounded-xl bg-sky-500 py-4 font-black text-slate-950 disabled:opacity-40"
					>Play progression</button
				><button
					onclick={() => (progression = [])}
					class="rounded-xl bg-slate-700 px-5 font-bold text-white">Clear</button
				>
			</div>
		</section>
	</div>
</div>
