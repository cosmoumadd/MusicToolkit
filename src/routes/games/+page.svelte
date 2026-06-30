<script lang="ts">
	import { base } from '$app/paths'; // use base path for correct linking in production
</script>

<div class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-4 text-4xl font-bold text-white">🎮 Games</h1>
		<p class="mb-8 text-slate-400">
			Make learning fun with interactive ear training games and challenges.
		</p>

		<div class="grid gap-6 md:grid-cols-2">
			<a
				href="{base}/games/guess-chord"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-violet-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-violet-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🎯 Guess the Chord</h2>
				<p class="text-slate-400">Listen to a chord and identify what it is.</p>
			</a>

			<a
				href="{base}/games/ear-training"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-fuchsia-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-fuchsia-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">👂 Ear Training</h2>
				<p class="text-slate-400">
					Advanced ear training with intervals, scales, and progressions.
				</p>
			</a>

			<a
				href="{base}/games/rhythm-game"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-orange-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-orange-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🥁 Rhythm Game</h2>
				<p class="text-slate-400">Practice rhythm patterns and timing accuracy.</p>
			</a>
		</div>
	</div>
</div>
