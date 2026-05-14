/**
 * Time Signature Interface
 */
export interface TimeSignature {
	beats: number; // numerator (e.g., 4 in 4/4)
	beatDuration: number; // denominator (e.g., 4 in 4/4, means quarter note)
}

/**
 * Metronome State
 */
export interface MetronomeState {
	bpm: number;
	timeSignature: TimeSignature;
	isPlaying: boolean;
	volume: number;
	accentEnabled: boolean;
}

/**
 * Music Logic Layer for Metronome
 * Pure business logic for metronome behavior
 */
export class MetronomeLogic {
	private bpm: number = 120;
	private timeSignature: TimeSignature = { beats: 4, beatDuration: 4 };
	private volume: number = 1;
	private accentEnabled: boolean = true;
	private currentBeat: number = 0;

	/**
	 * Get current BPM
	 */
	getBpm(): number {
		return this.bpm;
	}

	/**
	 * Set BPM (valid range: 40-300)
	 */
	setBpm(bpm: number): void {
		this.bpm = Math.max(40, Math.min(300, bpm));
	}

	/**
	 * Get beat duration in milliseconds
	 */
	getBeatDuration(): number {
		return (60000 / this.bpm) * (4 / this.timeSignature.beatDuration);
	}

	/**
	 * Get time signature
	 */
	getTimeSignature(): TimeSignature {
		return { ...this.timeSignature };
	}

	/**
	 * Set time signature
	 */
	setTimeSignature(beats: number, beatDuration: number): void {
		this.timeSignature = { beats, beatDuration };
	}

	/**
	 * Get volume
	 */
	getVolume(): number {
		return this.volume;
	}

	/**
	 * Set volume (0-1)
	 */
	setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
	}

	/**
	 * Toggle accent
	 */
	toggleAccent(): void {
		this.accentEnabled = !this.accentEnabled;
	}

	/**
	 * Check if accent is enabled
	 */
	isAccentEnabled(): boolean {
		return this.accentEnabled;
	}

	/**
	 * Get current beat (0 to timeSignature.beats - 1)
	 */
	getCurrentBeat(): number {
		return this.currentBeat;
	}

	/**
	 * Increment beat and return frequency for click
	 * Accent beat (first beat) is higher frequency
	 */
	getNextBeatFrequency(): number {
		const isAccent = this.accentEnabled && this.currentBeat === 0;
		this.currentBeat = (this.currentBeat + 1) % this.timeSignature.beats;

		// Accent: 800Hz, Regular: 500Hz
		return isAccent ? 800 : 500;
	}

	/**
	 * Reset beat counter
	 */
	resetBeat(): void {
		this.currentBeat = 0;
	}

	/**
	 * Get current state
	 */
	getState(): Omit<MetronomeState, 'isPlaying'> {
		return {
			bpm: this.bpm,
			timeSignature: { ...this.timeSignature },
			volume: this.volume,
			accentEnabled: this.accentEnabled
		};
	}
}

export default MetronomeLogic;
