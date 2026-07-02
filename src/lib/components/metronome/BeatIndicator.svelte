<script lang="ts">
	let { beats, currentBeat, isPlaying } = $props<{
		beats: number;
		currentBeat: number;
		isPlaying: boolean;
	}>();
</script>

<div class="flex flex-wrap justify-center gap-2" aria-label={`Beat ${currentBeat + 1} of ${beats}`}>
	{#each Array.from({ length: beats }, (_, index) => index) as index (index)}
		<div
			class="h-7 w-7 rounded-full border-2 transition-all duration-75 sm:h-12 sm:w-12 {currentBeat ===
				index && isPlaying
				? 'scale-110 border-cyan-300 bg-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.8)]'
				: 'border-slate-600 bg-slate-700'}"
			aria-hidden="true"
		></div>
	{/each}
</div>
