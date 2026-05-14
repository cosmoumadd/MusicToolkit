<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { metronomeStore } from '$lib/stores/metronome';
	import MetronomeEngine from '$lib/audio/metronome/engine';

	let state = $derived($metronomeStore);
	let engine: MetronomeEngine;

	onMount(() => {
		engine = new MetronomeEngine();
	});

	onDestroy(() => {
		if (engine) {
			engine.dispose();
		}
	});

	const handlePlayPause = async () => {
		if (engine) {
			if (state.isPlaying) {
				// Update store immediately for instant feedback
				metronomeStore.setPlaying(false);
				engine.stop();
			} else {
				// Update store immediately for instant feedback
				metronomeStore.setPlaying(true);
				try {
					await engine.start();
				} catch (error) {
					console.error('Failed to start metronome:', error);
					// Revert store on error
					metronomeStore.setPlaying(false);
				}
			}
		}
	};

	const handleBpmChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const bpm = parseInt(target.value, 10);
		metronomeStore.setBpm(bpm);
		if (engine) {
			engine.setBpm(bpm);
		}
	};

	const handleTimeSignatureChange = (beats: number) => {
		metronomeStore.setTimeSignature(beats, 4);
		if (engine) {
			engine.setTimeSignature(beats, 4);
		}
	};

	const handleVolumeChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const volume = parseFloat(target.value);
		metronomeStore.setVolume(volume);
		if (engine) {
			engine.setVolume(volume);
		}
	};

	const handleAccentToggle = () => {
		metronomeStore.toggleAccent();
		if (engine) {
			engine.toggleAccent();
		}
	};

	const handleReset = () => {
		if (engine && state.isPlaying) {
			engine.stop();
		}
		metronomeStore.reset();
	};
</script>

<div class="min-h-[calc(100vh-180px)] bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-6">
	<div class="max-w-2xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl font-bold text-white mb-2">⏱️ Metronome</h1>
			<p class="text-slate-400">Keep your timing perfect with an interactive metronome.</p>
		</div>

		<!-- Main Display Card -->
		<div class="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-6 shadow-xl">
			<!-- BPM Display -->
			<div class="text-center mb-8">
				<div class="text-7xl font-bold text-blue-400 font-mono">{state.bpm}</div>
				<div class="text-slate-400 text-lg mt-2">Beats Per Minute</div>
			</div>

			<!-- Beat Indicator -->
			<div class="flex justify-center gap-2 mb-8">
				{#each Array(state.timeSignature.beats) as _, i}
					<div
						class="w-12 h-12 rounded-full border-2 transition-all {state.currentBeat === i &&
						state.isPlaying
							? 'bg-blue-500 border-blue-400 scale-110'
							: 'bg-slate-700 border-slate-600'}"
					></div>
				{/each}
			</div>

			<!-- BPM Slider -->
			<div class="mb-8">
				<input
					type="range"
					min="40"
					max="300"
					value={state.bpm}
					oninput={handleBpmChange}
					class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				/>
				<div class="flex justify-between text-xs text-slate-500 mt-2 px-1">
					<span>40</span>
					<span>300</span>
				</div>
			</div>

			<!-- Play/Pause & Reset Buttons -->
			<div class="flex gap-4 mb-6">
				<button
					onclick={handlePlayPause}
					class="flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 {state.isPlaying
						? 'bg-red-600 hover:bg-red-700 text-white'
						: 'bg-blue-600 hover:bg-blue-700 text-white'}"
				>
					{state.isPlaying ? '⏸ Stop' : '▶ Start'}
				</button>
				<button
					onclick={handleReset}
					class="py-4 px-6 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-all"
				>
					Reset
				</button>
			</div>
		</div>

		<!-- Settings Section -->
		<div class="grid md:grid-cols-2 gap-6 mb-6">
			<!-- Time Signature -->
			<div class="bg-slate-800 rounded-lg p-6 border border-slate-700">
				<h3 class="text-lg font-semibold text-white mb-4">Time Signature</h3>
				<div class="flex gap-2">
					{#each [2, 3, 4, 5, 6] as beats}
						<button
							onclick={() => handleTimeSignatureChange(beats)}
							class="flex-1 py-2 px-3 rounded font-semibold text-sm transition-all {state
								.timeSignature.beats === beats
								? 'bg-blue-600 text-white'
								: 'bg-slate-700 text-slate-300 hover:bg-slate-600'}"
						>
							{beats}/4
						</button>
					{/each}
				</div>
			</div>

			<!-- Volume Control -->
			<div class="bg-slate-800 rounded-lg p-6 border border-slate-700">
				<h3 class="text-lg font-semibold text-white mb-4">Volume</h3>
				<div class="flex items-center gap-4">
					<span class="text-sm text-slate-400">🔇</span>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={state.volume}
						oninput={handleVolumeChange}
						class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
					/>
					<span class="text-sm text-slate-400">🔊</span>
				</div>
				<div class="text-center mt-2 text-sm text-slate-400">
					{(state.volume * 100).toFixed(0)}%
				</div>
			</div>

			<!-- Accent Settings -->
			<div class="md:col-span-2 bg-slate-800 rounded-lg p-6 border border-slate-700">
				<button
					onclick={handleAccentToggle}
					class="w-full py-3 px-4 rounded-lg font-semibold transition-all {state.accentEnabled
						? 'bg-green-600 hover:bg-green-700 text-white'
						: 'bg-slate-700 hover:bg-slate-600 text-slate-300'}"
				>
					{state.accentEnabled ? '✓ Accent Enabled' : '✗ Accent Disabled'}
				</button>
				<p class="text-xs text-slate-500 mt-3">
					{state.accentEnabled
						? 'First beat sounds higher (accent)'
						: 'All beats sound the same'}
				</p>
			</div>
		</div>

		<!-- State Info -->
		<div class="bg-slate-800 rounded-lg p-6 border border-slate-700">
			<h3 class="text-lg font-semibold text-white mb-4">Current Settings</h3>
			<div class="space-y-2 text-sm text-slate-400 font-mono">
				<p class="flex justify-between">
					<span>BPM</span>
					<span class="text-blue-400 font-semibold">{state.bpm}</span>
				</p>
				<p class="flex justify-between">
					<span>Time Signature</span>
					<span class="text-blue-400 font-semibold"
						>{state.timeSignature.beats}/{state.timeSignature.beatDuration}</span
					>
				</p>
				<p class="flex justify-between">
					<span>Volume</span>
					<span class="text-blue-400 font-semibold">{(state.volume * 100).toFixed(0)}%</span>
				</p>
				<p class="flex justify-between">
					<span>Accent</span>
					<span class="text-blue-400 font-semibold"
						>{state.accentEnabled ? 'Enabled' : 'Disabled'}</span
					>
				</p>
				<p class="flex justify-between">
					<span>Status</span>
					<span class="text-blue-400 font-semibold">{state.isPlaying ? '🔴 Playing' : '⭕ Stopped'}</span>
				</p>
			</div>
		</div>

		<!-- Note -->
		<div class="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700 text-center text-sm text-slate-400">
			<p>🎵 Tone.js audio engine integrated - Ready to play!</p>
		</div>
	</div>
</div>
