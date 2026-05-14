import * as Tone from 'tone';

export interface ClickOptions {
	accentFrequency?: number;
	regularFrequency?: number;
	duration?: string;
}

/**
 * Click Sound Layer
 * Generates and plays click sounds using Tone.js
 */
export class MetronomeClick {
	private synth: Tone.Synth;
	private accentFrequency: number;
	private regularFrequency: number;
	private duration: string;

	constructor(options: ClickOptions = {}) {
		this.accentFrequency = options.accentFrequency ?? 800;
		this.regularFrequency = options.regularFrequency ?? 500;
		this.duration = options.duration ?? '0.05';

		this.synth = new Tone.Synth({
			oscillator: { type: 'sine' },
			envelope: {
				attack: 0.002,
				decay: 0.1,
				sustain: 0,
				release: 0.05
			}
		}).toDestination();
	}

	/**
	 * Play a click sound (accent or regular)
	 */
	play(isAccent: boolean = false, time?: string | number): void {
		const frequency = isAccent ? this.accentFrequency : this.regularFrequency;
		this.synth.triggerAttackRelease(frequency, this.duration, time);
	}

	/**
	 * Set accent frequency
	 */
	setAccentFrequency(frequency: number): void {
		this.accentFrequency = frequency;
	}

	/**
	 * Set regular frequency
	 */
	setRegularFrequency(frequency: number): void {
		this.regularFrequency = frequency;
	}

	/**
	 * Set volume
	 */
	setVolume(volume: number): void {
		this.synth.volume.value = Tone.gainToDb(volume);
	}

	/**
	 * Dispose resources
	 */
	dispose(): void {
		this.synth.dispose();
	}
}

export default MetronomeClick;
