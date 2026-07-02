<script lang="ts">
	import { base } from '$app/paths';
	import { onDestroy } from 'svelte';
	import * as Tone from 'tone';

	type Stage = 'setup' | 'playing' | 'result';
	type Difficulty = 'easy' | 'intermediate' | 'difficult';
	type Interval = { name: string; semitones: number };

	const allIntervals: Interval[] = [
		{ name: 'Minor 2nd', semitones: 1 },
		{ name: 'Major 2nd', semitones: 2 },
		{ name: 'Minor 3rd', semitones: 3 },
		{ name: 'Major 3rd', semitones: 4 },
		{ name: 'Perfect 4th', semitones: 5 },
		{ name: 'Tritone', semitones: 6 },
		{ name: 'Perfect 5th', semitones: 7 },
		{ name: 'Minor 6th', semitones: 8 },
		{ name: 'Major 6th', semitones: 9 },
		{ name: 'Minor 7th', semitones: 10 },
		{ name: 'Major 7th', semitones: 11 },
		{ name: 'Octave', semitones: 12 }
	];
	const difficultyOptions = {
		easy: { label: 'Easy', count: 4, questions: 10, intervals: [1, 4, 7, 12], color: 'emerald' },
		intermediate: {
			label: 'Intermediate',
			count: 7,
			questions: 20,
			intervals: [1, 2, 3, 4, 5, 7, 12],
			color: 'amber'
		},
		difficult: {
			label: 'Difficult',
			count: 12,
			questions: 30,
			intervals: allIntervals.map((item) => item.semitones),
			color: 'rose'
		}
	};

	let stage = $state<Stage>('setup');
	let difficulty = $state<Difficulty>('easy');
	let question = $state(1);
	let score = $state(0);
	let answer = $state<Interval>(allIntervals[6]);
	let options = $state<Interval[]>([]);
	let answered = $state(false);
	let correct = $state(false);
	let selectedAnswer = $state('');
	let synth: Tone.Synth | undefined;

	let settings = $derived(difficultyOptions[difficulty]);
	let percentage = $derived(Math.round((score / settings.questions) * 100));

	function shuffled<T>(items: T[]) {
		return [...items].sort(() => Math.random() - 0.5);
	}

	function createQuestion() {
		const pool = allIntervals.filter((item) => settings.intervals.includes(item.semitones));
		let next = pool[Math.floor(Math.random() * pool.length)];
		if (pool.length > 1)
			while (next.semitones === answer.semitones)
				next = pool[Math.floor(Math.random() * pool.length)];
		answer = next;
		options = shuffled(pool);
		answered = false;
		selectedAnswer = '';
	}

	async function playInterval() {
		await Tone.start();
		synth ??= new Tone.Synth({
			oscillator: { type: 'triangle8' },
			envelope: { attack: 0.01, decay: 0.3, sustain: 0.25, release: 0.6 }
		}).toDestination();
		const start = Tone.now();
		synth.triggerAttackRelease('C4', '8n', start);
		synth.triggerAttackRelease(
			Tone.Frequency('C4').transpose(answer.semitones).toNote(),
			'8n',
			start + 0.65
		);
	}

	async function startGame() {
		stage = 'playing';
		question = 1;
		score = 0;
		createQuestion();
		await playInterval();
	}

	function chooseAnswer(interval: Interval) {
		if (answered) return;
		selectedAnswer = interval.name;
		correct = interval.semitones === answer.semitones;
		if (correct) score += 1;
		answered = true;
	}

	async function celebrate() {
		if (percentage !== 100) return;
		await Tone.start();
		synth ??= new Tone.Synth().toDestination();
		const start = Tone.now();
		['C5', 'E5', 'G5', 'C6'].forEach((note, index) =>
			synth?.triggerAttackRelease(note, '16n', start + index * 0.14)
		);
	}

	async function nextQuestion() {
		if (question === settings.questions) {
			stage = 'result';
			await celebrate();
			return;
		}
		question += 1;
		createQuestion();
		await playInterval();
	}

	function judgement() {
		if (percentage === 100)
			return {
				text: 'OMG!',
				emoji: '🎉',
				classes: 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-300'
			};
		if (percentage >= 90)
			return {
				text: 'Bravo!!',
				emoji: '👏',
				classes: 'border-amber-400 bg-amber-500/15 text-amber-300'
			};
		if (percentage >= 70)
			return {
				text: 'Nice!',
				emoji: '✨',
				classes: 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
			};
		if (percentage >= 50)
			return {
				text: 'Not bad!',
				emoji: '👍',
				classes: 'border-sky-400 bg-sky-500/15 text-sky-300'
			};
		return {
			text: 'Keep going!',
			emoji: '💪',
			classes: 'border-rose-400 bg-rose-500/15 text-rose-300'
		};
	}

	onDestroy(() => synth?.dispose());
</script>

<svelte:head
	><title>Interval Trainer Game | Music Toolkit</title><meta
		name="description"
		content="Test your ear by identifying musical intervals at three difficulty levels."
	/></svelte:head
>

<div
	class="min-h-[calc(100vh-180px)] bg-[radial-gradient(circle_at_top,#451a03_0,#0f172a_42%,#020617_100%)] px-4 py-12 sm:px-6"
>
	<div class="mx-auto max-w-4xl">
		<a
			href={`${base}/games`}
			class="mb-7 inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-600"
			>← Back to games</a
		>
		<header class="mb-8 text-center">
			<p class="mb-2 text-sm font-semibold tracking-[.25em] text-amber-400 uppercase">
				Train your musical ear
			</p>
			<h1 class="text-4xl font-bold text-white sm:text-5xl">👂 Interval Trainer</h1>
			<p class="mt-3 text-slate-400">Hear two notes and identify the distance between them.</p>
		</header>

		{#if stage === 'setup'}
			<section class="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-2xl sm:p-8">
				<h2 class="text-center text-2xl font-black text-white">Choose your difficulty</h2>
				<p class="mt-2 text-center text-slate-400">The game stays silent until you press Play.</p>
				<div class="mt-7 grid gap-4 sm:grid-cols-3">
					{#each Object.entries(difficultyOptions) as [id, option]}
						<button
							onclick={() => (difficulty = id as Difficulty)}
							class="rounded-xl border p-5 text-left transition hover:-translate-y-1 {difficulty ===
							id
								? 'border-amber-400 bg-amber-500/15'
								: 'border-slate-600 bg-slate-900 hover:border-slate-400'}"
						>
							<strong class="block text-xl text-white">{option.label}</strong><span
								class="mt-2 block text-sm text-slate-300">{option.count} choices</span
							><span class="text-sm text-slate-400">{option.questions} questions</span>
						</button>
					{/each}
				</div>
				<button
					onclick={startGame}
					class="mt-7 w-full rounded-xl bg-amber-500 py-4 text-lg font-black text-slate-950 transition hover:bg-amber-400"
					>▶ Play {settings.label}</button
				>
			</section>
		{:else if stage === 'playing'}
			<section class="rounded-2xl border border-slate-700 bg-slate-800 p-5 shadow-2xl sm:p-8">
				<div class="mb-6 flex items-center justify-between">
					<span class="font-bold text-amber-300">Question {question} / {settings.questions}</span
					><span class="font-bold text-slate-300">Score: {score}</span>
				</div>
				<div class="mb-7 h-2 overflow-hidden rounded-full bg-slate-700">
					<div
						class="h-full bg-amber-400 transition-all"
						style:width={`${(question / settings.questions) * 100}%`}
					></div>
				</div>
				<div class="mb-7 rounded-xl border border-amber-400/20 bg-slate-900 p-7 text-center">
					<button
						onclick={playInterval}
						class="rounded-xl bg-amber-500 px-7 py-4 text-lg font-black text-slate-950 transition hover:scale-105 hover:bg-amber-400"
						>🔊 Play again</button
					>
					<p class="mt-3 text-sm text-slate-400">Listen to both notes, then choose one answer.</p>
				</div>
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{#each options as interval}
						<button
							disabled={answered}
							onclick={() => chooseAnswer(interval)}
							class="rounded-xl border px-3 py-3 font-semibold transition {answered &&
							interval.semitones === answer.semitones
								? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
								: answered && interval.name === selectedAnswer
									? 'border-rose-400 bg-rose-500/20 text-rose-200'
									: 'border-slate-600 bg-slate-700 text-white hover:border-amber-400 hover:bg-slate-600'} disabled:cursor-default"
							>{interval.name}</button
						>
					{/each}
				</div>
				{#if answered}
					{#key question}
						<div
							class="feedback-pop mt-6 rounded-xl border p-5 text-center {correct
								? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
								: 'border-rose-400 bg-rose-500/15 text-rose-300'}"
						>
							<span class="text-4xl" aria-hidden="true">{correct ? '✅' : '❌'}</span>
							<p class="mt-2 text-xl font-black">{correct ? 'Correct!' : 'Wrong answer'}</p>
							{#if !correct}<p class="mt-1 text-sm text-slate-300">
									The answer is {answer.name}.
								</p>{/if}
						</div>
					{/key}
					<button
						onclick={nextQuestion}
						class="mt-4 w-full rounded-xl bg-slate-100 py-3 font-black text-slate-900 transition hover:bg-white"
						>{question === settings.questions ? 'See results' : 'Next question →'}</button
					>
				{/if}
			</section>
		{:else}
			{@const result = judgement()}
			<section
				class="result-pop rounded-2xl border bg-slate-800 p-6 text-center shadow-2xl sm:p-10 {result.classes}"
			>
				<div class="text-7xl" aria-hidden="true">{result.emoji}</div>
				<p class="mt-4 text-5xl font-black">{result.text}</p>
				<p class="mt-5 text-2xl font-bold text-white">{score} / {settings.questions}</p>
				<p class="mt-1 text-lg text-slate-300">{percentage}% correct on {settings.label}</p>
				<button
					onclick={() => (stage = 'setup')}
					class="mt-8 rounded-xl bg-white px-8 py-4 font-black text-slate-900 transition hover:scale-105"
					>Play again</button
				>
			</section>
		{/if}
	</div>
</div>

<style>
	.feedback-pop {
		animation: pop-in 350ms cubic-bezier(0.2, 0.9, 0.25, 1.3);
	}
	.result-pop {
		animation: rise-in 500ms ease-out;
	}
	@keyframes pop-in {
		from {
			opacity: 0;
			transform: scale(0.75);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes rise-in {
		from {
			opacity: 0;
			transform: translateY(24px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.feedback-pop,
		.result-pop {
			animation: none;
		}
	}
</style>
