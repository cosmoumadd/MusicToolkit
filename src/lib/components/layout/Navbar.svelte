<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
	<div class="max-w-6xl mx-auto px-6 py-4">
		<div class="flex items-center justify-between">
			<!-- Logo/Brand -->
			<a href="./" class="flex items-center gap-2 hover:text-blue-400 transition-colors">
				<span class="text-xl font-bold text-white">🎵 MusicToolkit</span>
			</a>

			<!-- Navigation Links -->
			<div class="flex items-center gap-8">
				<a
					href="./"
					class="text-slate-400 hover:text-white transition-colors {$page.url.pathname === './'
						? 'text-white border-b-2 border-blue-500'
						: ''}"
				>
					Home
				</a>
				<a
					href="./tools"
					class="text-slate-400 hover:text-white transition-colors {$page.url.pathname.startsWith(
						'/tools'
					)
						? 'text-white border-b-2 border-blue-500'
						: ''}"
				>
					Tools
				</a>
				<a
					href="./learn"
					class="text-slate-400 hover:text-white transition-colors {$page.url.pathname.startsWith(
						'/learn'
					)
						? 'text-white border-b-2 border-blue-500'
						: ''}"
				>
					Learn
				</a>
				<a
					href="./games"
					class="text-slate-400 hover:text-white transition-colors {$page.url.pathname.startsWith(
						'/games'
					)
						? 'text-white border-b-2 border-blue-500'
						: ''}"
				>
					Games
				</a>
			</div>
		</div>
	</div>
</nav>
