import { MetronomeTransport } from './transport';
import { MetronomeClick } from './click';
import { MetronomeScheduler, type SchedulerConfig } from './scheduler';
import { metronomeStore } from '$lib/stores/metronome';

/**
 * Unified Metronome Engine
 * Orchestrates Transport + Click + Scheduler with the Svelte Store
 * 
 * Architecture:
 * - Transport: Manages Tone.js Transport timing
 * - Click: Generates click sounds
 * - Scheduler: Schedules beats with accent logic
 * - Store: Syncs UI state
 */
export class MetronomeEngine {
	private transport: MetronomeTransport;
	private click: MetronomeClick;
	private scheduler: MetronomeScheduler | null = null;
	private initialized = false;

	constructor() {
		this.transport = new MetronomeTransport();
		this.click = new MetronomeClick({
			accentFrequency: 800,
			regularFrequency: 500,
			duration: '0.05'
		});
	}

	/**
	 * Initialize engine (must be called on user interaction)
	 */
	async initialize(): Promise<void> {
		if (this.initialized) return;
		await this.transport.initialize();
		this.initialized = true;
	}

	/**
	 * Start the metronome
	 */
	async start(): Promise<void> {
		await this.initialize();

		const state = {
			bpm: 120,
			timeSignature: { beats: 4, beatDuration: 4 },
			accentEnabled: true
		};

		// Get current state from store
		metronomeStore.subscribe((s) => {
			state.bpm = s.bpm;
			state.timeSignature = s.timeSignature;
			state.accentEnabled = s.accentEnabled;
		})();

		// Create scheduler
		this.scheduler = new MetronomeScheduler(this.transport, this.click, {
			bpm: state.bpm,
			timeSignature: state.timeSignature,
			accentEnabled: state.accentEnabled
		});

		this.transport.setBpm(state.bpm);
		this.transport.start();
		this.scheduler.start();

		metronomeStore.setPlaying(true);
	}

	/**
	 * Stop the metronome
	 */
	stop(): void {
		if (this.scheduler) {
			this.scheduler.stop();
			this.scheduler = null;
		}

		this.transport.stop();
		metronomeStore.reset();
	}

	/**
	 * Toggle play/pause
	 */
	async toggle(): Promise<void> {
		const unsubscribe = metronomeStore.subscribe((state) => {
			if (state.isPlaying) {
				this.stop();
			} else {
				this.start();
			}
		})();
		unsubscribe();
	}

	/**
	 * Update BPM
	 */
	setBpm(bpm: number): void {
		metronomeStore.setBpm(bpm);
		if (this.scheduler) {
			this.scheduler.updateBpm(bpm);
		}
	}

	/**
	 * Update time signature
	 */
	setTimeSignature(beats: number, beatDuration: number): void {
		metronomeStore.setTimeSignature(beats, beatDuration);
		if (this.scheduler) {
			this.scheduler.updateTimeSignature(beats, beatDuration);
		}
	}

	/**
	 * Update volume
	 */
	setVolume(volume: number): void {
		metronomeStore.setVolume(volume);
		this.click.setVolume(volume);
	}

	/**
	 * Toggle accent
	 */
	toggleAccent(): void {
		metronomeStore.toggleAccent();
		const unsubscribe = metronomeStore.subscribe((state) => {
			if (this.scheduler) {
				this.scheduler.updateAccent(state.accentEnabled);
			}
		})();
		unsubscribe();
	}

	/**
	 * Dispose resources
	 */
	dispose(): void {
		this.stop();
		this.click.dispose();
		this.transport.dispose();
	}
}

export default MetronomeEngine;
