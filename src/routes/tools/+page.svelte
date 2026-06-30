<script lang="ts">
	import { base } from '$app/paths'; // use base path for correct linking in production
</script>

<div class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-4 text-4xl font-bold text-white">🛠️ Tools</h1>
		<p class="mb-8 text-slate-400">
			Essential music tools to help you practice, experiment, and improve your musical skills.
		</p>

		<div class="grid gap-6 md:grid-cols-2">
			<a
				href="{base}/tools/metronome"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-cyan-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-cyan-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">⏱️ Metronome</h2>
				<p class="text-slate-400">Keep your timing perfect with an interactive metronome.</p>
			</a>

			<a
				href="{base}/tools/chord-detector"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-violet-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-violet-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🎯 Chord Detector</h2>
				<p class="text-slate-400">Identify chords by listening or by playing them.</p>
			</a>

			<a
				href="{base}/tools/scale-finder"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-emerald-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-emerald-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🎼 Scale Finder</h2>
				<p class="text-slate-400">Explore scales and their patterns across the keyboard.</p>
			</a>

			<a
				href="{base}/tools/interval-trainer"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-amber-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-amber-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">📊 Interval Trainer</h2>
				<p class="text-slate-400">Train your ear to recognize different intervals.</p>
			</a>
		</div>
	</div>
</div>
