<script lang="ts">
	import { base } from '$app/paths';

	const tools = [
		{
			path: 'metronome',
			icon: '⏱️',
			name: 'Metronome',
			description: 'Keep your timing perfect with an interactive metronome.',
			color: 'cyan'
		},
		{
			path: 'chord-detector',
			icon: '🎹',
			name: 'Chord Detector',
			description: 'Identify chords by listening or by playing them.',
			color: 'violet'
		},
		{
			path: 'scale-finder',
			icon: '🎼',
			name: 'Scale Finder',
			description: 'Explore scales and their patterns across the keyboard.',
			color: 'emerald'
		},
		{
			path: 'tuner',
			icon: '🎸',
			name: 'Tuner',
			description: 'Tune an instrument with live microphone pitch feedback.',
			color: 'rose'
		},
		{
			path: 'chord-progression-builder',
			icon: '🎶',
			name: 'Chord Progression Builder',
			description: 'Combine diatonic chords and hear your progression.',
			color: 'sky'
		},
		{
			path: 'rhythm',
			icon: '🥁',
			name: 'Rhythm',
			description: 'Build and play a repeating rhythm pattern.',
			color: 'orange'
		},
		{
			path: 'circle-of-fifths',
			icon: '⭕',
			name: 'Circle of Fifths',
			description: 'Explore keys, related chords, memorable theory, and quick learner Q&A.',
			color: 'teal',
			wide: true
		}
	];

	const colorClasses: Record<string, string> = {
		cyan: 'hover:border-cyan-500 hover:shadow-cyan-950/40 hover:[&_h2]:text-cyan-300',
		violet: 'hover:border-violet-500 hover:shadow-violet-950/40 hover:[&_h2]:text-violet-300',
		emerald: 'hover:border-emerald-500 hover:shadow-emerald-950/40 hover:[&_h2]:text-emerald-300',
		rose: 'hover:border-rose-400 hover:shadow-rose-950/40 hover:[&_h2]:text-rose-300',
		sky: 'hover:border-sky-400 hover:shadow-sky-950/40 hover:[&_h2]:text-sky-300',
		orange: 'hover:border-orange-400 hover:shadow-orange-950/40 hover:[&_h2]:text-orange-300',
		teal: 'hover:border-teal-400 hover:shadow-teal-950/40 hover:[&_h2]:text-teal-300'
	};
</script>

<svelte:head><title>Music Tools | Music Toolkit</title></svelte:head>
<div class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-4 text-4xl font-bold text-white">🧰 Music Tools</h1>
		<p class="mb-8 text-slate-400">
			Essential music tools to help you practice, experiment, and improve your musical skills.
		</p>
		<div class="grid gap-6 md:grid-cols-2">
			{#each tools as tool (tool.path)}
				<a
					href={`${base}/tools/${tool.path}`}
					class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg [&_h2]:transition-colors {colorClasses[
						tool.color
					]} {tool.wide ? 'md:col-span-2' : ''}"
				>
					<h2 class="mb-2 text-2xl font-bold text-white">{tool.icon} {tool.name}</h2>
					<p class="text-slate-400">{tool.description}</p>
				</a>
			{/each}
		</div>
	</div>
</div>
