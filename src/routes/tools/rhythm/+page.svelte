<script lang="ts">
	import { onDestroy } from 'svelte';
	import BackToTools from '$lib/components/tools/BackToTools.svelte';
	import * as Tone from 'tone';
	let steps = $state([
		true,
		false,
		false,
		false,
		true,
		false,
		true,
		false,
		true,
		false,
		false,
		false,
		true,
		false,
		true,
		false
	]);
	let bpm = $state(100);
	let current = $state(-1);
	let playing = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;
	let synth: Tone.MembraneSynth | undefined;
	function stop() {
		if (timer) clearInterval(timer);
		timer = undefined;
		current = -1;
		playing = false;
	}
	async function togglePlay() {
		if (playing) return stop();
		await Tone.start();
		synth ??= new Tone.MembraneSynth({ volume: -5 }).toDestination();
		playing = true;
		let index = 0;
		const tick = () => {
			current = index;
			if (steps[index]) synth?.triggerAttackRelease(index % 4 === 0 ? 'C2' : 'G2', '16n');
			index = (index + 1) % 16;
		};
		tick();
		timer = setInterval(tick, 60000 / bpm / 4);
	}
	function updateTempo(value: number) {
		bpm = value;
		if (playing) {
			stop();
			void togglePlay();
		}
	}
	onDestroy(() => {
		stop();
		synth?.dispose();
	});
</script>

<svelte:head><title>Rhythm Builder | Music Toolkit</title></svelte:head>
<div
	class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-5xl">
		<BackToTools />
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[.25em] text-orange-400 uppercase">
				Build the groove
			</p>
			<h1 class="text-4xl font-bold text-white sm:text-5xl">Rhythm</h1>
			<p class="mt-3 text-slate-400">
				Switch steps on or off to create a repeating one-bar pattern.
			</p>
		</header>
		<section class="rounded-2xl border border-slate-700 bg-slate-800 p-5 sm:p-8">
			<div class="mb-7 flex items-center gap-5">
				<label class="font-semibold text-white" for="tempo">Tempo</label><input
					id="tempo"
					type="range"
					min="50"
					max="180"
					value={bpm}
					oninput={(event) => updateTempo(Number(event.currentTarget.value))}
					class="flex-1 accent-orange-400"
				/><span class="w-20 text-right font-black text-orange-300">{bpm} BPM</span>
			</div>
			<div class="grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-16">
				{#each steps as active, index}<button
						aria-pressed={active}
						onclick={() => (steps[index] = !steps[index])}
						class="aspect-square rounded-lg border text-sm font-black transition {active
							? 'border-orange-300 bg-orange-500 text-slate-950'
							: 'border-slate-600 bg-slate-900 text-slate-500'} {current === index
							? 'ring-4 ring-white/60'
							: ''}">{index + 1}</button
					>{/each}
			</div>
			<div class="mt-7 flex gap-3">
				<button
					onclick={togglePlay}
					class="flex-1 rounded-xl py-4 text-lg font-black text-white {playing
						? 'bg-rose-600'
						: 'bg-orange-600'}">{playing ? 'Stop' : 'Play rhythm'}</button
				><button
					onclick={() => (steps = steps.map(() => false))}
					class="rounded-xl bg-slate-700 px-6 font-bold text-white">Clear</button
				>
			</div>
			<p class="mt-4 text-sm text-slate-400">
				Strong beats are numbered 1, 5, 9, and 13. Start there, then add notes between them for
				syncopation.
			</p>
		</section>
	</div>
</div>
