<script lang="ts">
	import { base } from '$app/paths'; // use base path for correct linking in production
</script>

<div class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-4 text-4xl font-bold text-white">📚 Learn</h1>
		<p class="mb-8 text-slate-400">
			Comprehensive music theory lessons to build a strong musical foundation.
		</p>

		<div class="grid gap-6 md:grid-cols-2">
			<a
				href="{base}/learn/chords"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-rose-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-rose-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🎸 Chords</h2>
				<p class="text-slate-400">Learn chord construction, voicings, and progressions.</p>
			</a>

			<a
				href="{base}/learn/scales"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-emerald-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-emerald-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🎵 Scales</h2>
				<p class="text-slate-400">Master major, minor, pentatonic, and many more scales.</p>
			</a>

			<a
				href="{base}/learn/intervals"
				class="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-all duration-1000 hover:scale-105 hover:border-sky-500 [&_h2]:transition-colors [&_h2]:duration-1000 hover:[&_h2]:text-sky-300"
			>
				<h2 class="mb-2 text-2xl font-bold text-white">🎼 Intervals</h2>
				<p class="text-slate-400">
					Understand the distances between notes and their characteristics.
				</p>
			</a>
		</div>
	</div>
</div>
