<script lang="ts">
	import BackToTools from '$lib/components/tools/BackToTools.svelte';
	const keys = [
		{ major: 'C', minor: 'Am', accidental: 'No sharps or flats' },
		{ major: 'G', minor: 'Em', accidental: '1 sharp: F#' },
		{ major: 'D', minor: 'Bm', accidental: '2 sharps: F#, C#' },
		{ major: 'A', minor: 'F#m', accidental: '3 sharps' },
		{ major: 'E', minor: 'C#m', accidental: '4 sharps' },
		{ major: 'B', minor: 'G#m', accidental: '5 sharps' },
		{ major: 'F#', minor: 'D#m', accidental: '6 sharps' },
		{ major: 'Db', minor: 'Bbm', accidental: '5 flats' },
		{ major: 'Ab', minor: 'Fm', accidental: '4 flats' },
		{ major: 'Eb', minor: 'Cm', accidental: '3 flats' },
		{ major: 'Bb', minor: 'Gm', accidental: '2 flats: Bb, Eb' },
		{ major: 'F', minor: 'Dm', accidental: '1 flat: Bb' }
	];
	let selected = $state(0);
	const previous = $derived(keys[(selected + 11) % 12]);
	const current = $derived(keys[selected]);
	const next = $derived(keys[(selected + 1) % 12]);
</script>

<svelte:head><title>Circle of Fifths | Music Toolkit</title></svelte:head>
<div
	class="min-h-[calc(100vh-180px)] bg-[radial-gradient(circle_at_top,#134e4a_0,#0f172a_42%,#020617_100%)] px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-6xl">
		<BackToTools />
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[.25em] text-teal-300 uppercase">
				A map of musical relationships
			</p>
			<h1 class="text-4xl font-bold text-white sm:text-5xl">Circle of Fifths</h1>
			<p class="mt-3 text-slate-300">
				Select a key to reveal its relative minor and closest harmonic neighbors.
			</p>
		</header>
		<section class="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
			<div class="rounded-2xl border border-teal-400/20 bg-slate-900/80 p-5 sm:p-8">
				<div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
					{#each keys as item, index}<button
							onclick={() => (selected = index)}
							class="rounded-full border p-4 text-center transition {selected === index
								? 'scale-105 border-teal-300 bg-teal-400 text-slate-950'
								: 'border-slate-600 bg-slate-800 text-white hover:border-teal-400'}"
							><strong class="block text-2xl">{item.major}</strong><span class="text-xs"
								>{item.minor}</span
							></button
						>{/each}
				</div>
				<div class="mt-7 rounded-xl bg-teal-400/10 p-6 ring-1 ring-teal-400/30">
					<p class="text-sm font-bold tracking-wider text-teal-300 uppercase">
						{current.major} major
					</p>
					<p class="mt-2 text-3xl font-black text-white">Relative minor: {current.minor}</p>
					<p class="mt-2 text-slate-300">{current.accidental}</p>
					<p class="mt-4 text-sm text-slate-400">
						Closest keys: <strong class="text-white">{previous.major}</strong> (one step
						counter-clockwise) and <strong class="text-white">{next.major}</strong> (one step clockwise).
					</p>
				</div>
			</div>
			<aside class="space-y-6">
				<div class="rounded-2xl border border-slate-700 bg-slate-800 p-6">
					<h2 class="text-xl font-black text-white">Learning tips</h2>
					<p class="mt-3 text-slate-300">
						Move clockwise and each key gains one sharp. Move counter-clockwise and each key gains
						one flat.
					</p>
					<p class="mt-3 text-slate-300">
						Neighboring keys share six of their seven notes, so they make smooth key changes.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-700 bg-slate-800 p-6">
					<h2 class="text-xl font-black text-white">Quick Q&amp;A</h2>
					<details class="mt-4 border-b border-slate-700 pb-3">
						<summary class="cursor-pointer font-bold text-teal-300"
							>Why is it called a fifth?</summary
						>
						<p class="mt-2 text-sm text-slate-300">
							Each clockwise key starts a perfect fifth above the previous one: C to G, G to D, and
							so on.
						</p>
					</details>
					<details class="mt-3 border-b border-slate-700 pb-3">
						<summary class="cursor-pointer font-bold text-teal-300"
							>What is a relative minor?</summary
						>
						<p class="mt-2 text-sm text-slate-300">
							It uses the same notes and key signature as its paired major key, but has a different
							tonal center.
						</p>
					</details>
					<details class="mt-3">
						<summary class="cursor-pointer font-bold text-teal-300"
							>A useful songwriting trick?</summary
						>
						<p class="mt-2 text-sm text-slate-300">
							Choose a key, then borrow its two neighbors and relative minor for chords that
							naturally belong together.
						</p>
					</details>
				</div>
			</aside>
		</section>
	</div>
</div>
