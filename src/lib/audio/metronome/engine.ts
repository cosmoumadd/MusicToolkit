import { MetronomeTransport } from './transport';
import { MetronomeClick } from './click';
import { MetronomeScheduler } from './scheduler';
import { metronomeStore } from '$lib/stores/metronome';
import { get } from 'svelte/store';

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

		if (get(metronomeStore).isPlaying) return;
		const state = get(metronomeStore);

		// Create scheduler
		this.scheduler = new MetronomeScheduler(
			this.transport,
			this.click,
			{
				bpm: state.bpm,
				timeSignature: state.timeSignature,
				accentEnabled: state.accentEnabled
			},
			(beat) => metronomeStore.setCurrentBeat(beat)
		);

		this.transport.setBpm(state.bpm);
		this.scheduler.start();
		this.transport.start();

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
		metronomeStore.setPlaying(false);
		metronomeStore.setCurrentBeat(0);
	}

	/**
	 * Toggle play/pause
	 */
	async toggle(): Promise<void> {
		if (get(metronomeStore).isPlaying) this.stop();
		else await this.start();
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
		this.scheduler?.updateAccent(get(metronomeStore).accentEnabled);
	}

	/**
	 * Restore the defaults. Unlike stop(), this intentionally clears settings.
	 */
	reset(): void {
		this.stop();
		metronomeStore.reset();
		this.transport.setBpm(get(metronomeStore).bpm);
		this.click.setVolume(get(metronomeStore).volume);
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
