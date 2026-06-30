import * as Tone from 'tone';

/**
 * Transport Layer
 * Manages Tone.js Transport for timing and scheduling
 */
export class MetronomeTransport {
	private initialized = false;

	/**
	 * Initialize audio context (must be called on user interaction)
	 */
	async initialize(): Promise<void> {
		if (this.initialized) return;
		await Tone.start();
		this.initialized = true;
	}

	/**
	 * Start transport
	 */
	start(): void {
		if (Tone.Transport.state === 'started') return;
		Tone.Transport.start();
	}

	/**
	 * Stop transport and clear scheduled events
	 */
	stop(): void {
		Tone.Transport.stop();
		Tone.Transport.cancel();
	}

	/**
	 * Check if transport is running
	 */
	isRunning(): boolean {
		return Tone.Transport.state === 'started';
	}

	/**
	 * Set BPM
	 */
	setBpm(bpm: number): void {
		Tone.Transport.bpm.value = bpm;
	}

	/**
	 * Get current BPM
	 */
	getBpm(): number {
		return Tone.Transport.bpm.value;
	}

	/**
	 * Get current time
	 */
	getNow(): number {
		return Tone.now();
	}

	/**
	 * Schedule a callback at a specific time
	 */
	schedule(callback: () => void, time: string | number): number {
		return Tone.Transport.schedule(callback, time);
	}

	/**
	 * Schedule a callback on a musical interval so live BPM changes stay in sync.
	 */
	scheduleRepeat(callback: (time: number) => void, interval: string): number {
		return Tone.Transport.scheduleRepeat(callback, interval);
	}

	/**
	 * Clear a scheduled event
	 */
	clearSchedule(id: number): void {
		Tone.Transport.clear(id);
	}

	/**
	 * Dispose resources
	 */
	dispose(): void {
		Tone.Transport.cancel();
	}
}

export default MetronomeTransport;
