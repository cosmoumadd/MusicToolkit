import * as Tone from 'tone';

/**
 * Audio Engine for Metronome
 * Handles all audio synthesis and playback using Tone.js
 */
export class MetronomeAudioEngine {
	private synth: Tone.Synth;
	private now: Tone.Transport;
	private isInitialized = false;

	constructor() {
		this.synth = new Tone.Synth({
			oscillator: { type: 'sine' },
			envelope: {
				attack: 0.002,
				decay: 0.1,
				sustain: 0,
				release: 0.05
			}
		}).toDestination();

		this.now = Tone.Transport;
	}

	/**
	 * Initialize audio context (must be called on user interaction)
	 */
	async initialize(): Promise<void> {
		if (this.isInitialized) return;
		await Tone.start();
		this.isInitialized = true;
	}

	/**
	 * Play a click sound at specified frequency and time
	 */
	playClick(frequency: number, time?: Tone.Time): void {
		if (!this.isInitialized) return;
		this.synth.triggerAttackRelease(frequency, '0.05', time);
	}

	/**
	 * Start transport (clock)
	 */
	start(): void {
		if (!this.isInitialized) return;
		Tone.Transport.start();
	}

	/**
	 * Stop transport (clock)
	 */
	stop(): void {
		Tone.Transport.stop();
		Tone.Transport.cancel();
	}

	/**
	 * Set tempo (BPM)
	 */
	setTempo(bpm: number): void {
		Tone.Transport.bpm.value = bpm;
	}

	/**
	 * Get transport time
	 */
	getTime(): string {
		return Tone.Transport.seconds.toFixed(2);
	}

	/**
	 * Schedule a callback at specific time
	 */
	schedule(callback: () => void, time: Tone.Time): string {
		return Tone.Transport.schedule(callback, time);
	}

	/**
	 * Dispose all resources
	 */
	dispose(): void {
		this.synth.dispose();
	}
}

export default MetronomeAudioEngine;
