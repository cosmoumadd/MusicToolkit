<script lang="ts">
	let { bpm, onChange, onTap } = $props<{
		bpm: number;
		onChange: (bpm: number) => void;
		onTap: () => void;
	}>();

	const update = (event: Event) => {
		const value = Number((event.currentTarget as HTMLInputElement).value);
		if (Number.isFinite(value)) onChange(value);
	};
</script>

<div class="space-y-4">
	<div class="flex items-center justify-center gap-3">
		<button
			class="h-12 w-12 rounded-full bg-slate-700 text-2xl font-bold text-white transition hover:bg-slate-600"
			onclick={() => onChange(bpm - 1)}
			aria-label="Decrease tempo"
		>
			&minus;
		</button>
		<label class="relative">
			<span class="sr-only">Tempo in beats per minute</span>
			<input
				type="number"
				min="40"
				max="300"
				value={bpm}
				oninput={update}
				class="w-36 rounded-xl border-slate-600 bg-slate-900 text-center font-mono text-5xl font-bold text-cyan-300"
			/>
		</label>
		<button
			class="h-12 w-12 rounded-full bg-slate-700 text-2xl font-bold text-white transition hover:bg-slate-600"
			onclick={() => onChange(bpm + 1)}
			aria-label="Increase tempo"
		>
			+
		</button>
	</div>

	<input
		type="range"
		min="40"
		max="300"
		value={bpm}
		oninput={update}
		aria-label="Tempo"
		class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-cyan-400"
	/>
	<div class="flex justify-between text-xs text-slate-500"><span>40</span><span>300 BPM</span></div>
	<button
		onclick={onTap}
		class="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 font-semibold text-white hover:border-cyan-400 hover:bg-slate-600"
	>
		Tap Tempo
	</button>
</div>
