<script lang="ts">
	import { base } from '$app/paths';

	const games = [
		{
			path: 'guess-chord',
			icon: '🎹',
			name: 'Guess the Chord',
			description: 'Listen to a chord and identify what it is.',
			classes: 'hover:border-violet-500 hover:shadow-violet-950/40 hover:[&_h2]:text-violet-300'
		},
		{
			path: 'ear-training',
			icon: '🎧',
			name: 'Perfect Pitch',
			description: 'Advanced ear training with notes, scales, and progressions.',
			classes: 'hover:border-fuchsia-500 hover:shadow-fuchsia-950/40 hover:[&_h2]:text-fuchsia-300'
		},
		{
			path: 'rhythm-game',
			icon: '🥁',
			name: 'Rhythm Game',
			description: 'Practice rhythm patterns and timing accuracy.',
			classes: 'hover:border-orange-500 hover:shadow-orange-950/40 hover:[&_h2]:text-orange-300'
		},
		{
			path: 'interval-trainer',
			icon: '👂',
			name: 'Interval Trainer',
			description: 'Listen closely and identify the distance between two notes.',
			classes: 'hover:border-amber-400 hover:shadow-amber-950/40 hover:[&_h2]:text-amber-300'
		}
	];
</script>

<svelte:head><title>Music Games | Music Toolkit</title></svelte:head>
<div class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-4 text-4xl font-bold text-white">🎮 Music Games</h1>
		<p class="mb-8 text-slate-400">
			Make learning fun with interactive ear training games and challenges.
		</p>
		<div class="grid gap-6 md:grid-cols-2">
			{#each games as game (game.path)}
				<a
					href={`${base}/games/${game.path}`}
					class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg [&_h2]:transition-colors {game.classes}"
				>
					<h2 class="mb-2 text-2xl font-bold text-white">{game.icon} {game.name}</h2>
					<p class="text-slate-400">{game.description}</p>
				</a>
			{/each}
		</div>
	</div>
</div>
