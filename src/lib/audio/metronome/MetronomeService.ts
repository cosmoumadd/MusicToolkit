import * as Tone from 'tone';
import MetronomeAudioEngine from './MetronomeAudioEngine';
import MetronomeLogic, { type MetronomeState } from '$lib/theory/metronome/MetronomeLogic';

/**
 * Metronome Service
 * Orchestrates Audio Engine and Music Logic layers
 */
export class MetronomeService {
	private audioEngine: MetronomeAudioEngine;
	private logic: MetronomeLogic;
	private isPlaying: boolean = false;
	private eventId: string | null = null;
	private subscribers: ((state: MetronomeState & { isPlaying: boolean }) => void)[] = [];

	constructor() {
		this.audioEngine = new MetronomeAudioEngine();
		this.logic = new MetronomeLogic();
	}

	/**
	 * Initialize the service (must be called on user interaction)
	 */
	async initialize(): Promise<void> {
		await this.audioEngine.initialize();
	}

	/**
	 * Start the metronome
	 */
	async start(): Promise<void> {
		await this.initialize();

		if (this.isPlaying) return;

		this.isPlaying = true;
		this.logic.resetBeat();
		this.audioEngine.setTempo(this.logic.getBpm());
		this.audioEngine.start();

		// Schedule first click immediately
		this.scheduleNextClick(Tone.now());

		this.notifySubscribers();
	}

	/**
	 * Stop the metronome
	 */
	stop(): void {
		if (!this.isPlaying) return;

		this.isPlaying = false;
		this.audioEngine.stop();
		this.logic.resetBeat();

		if (this.eventId) {
			Tone.Transport.clear(this.eventId);
			this.eventId = null;
		}

		this.notifySubscribers();
	}

	/**
	 * Toggle metronome on/off
	 */
	async toggle(): Promise<void> {
		if (this.isPlaying) {
			this.stop();
		} else {
			await this.start();
		}
	}

	/**
	 * Set BPM
	 */
	setBpm(bpm: number): void {
		this.logic.setBpm(bpm);
		this.audioEngine.setTempo(bpm);
		this.notifySubscribers();
	}

	/**
	 * Get BPM
	 */
	getBpm(): number {
		return this.logic.getBpm();
	}

	/**
	 * Set time signature
	 */
	setTimeSignature(beats: number, beatDuration: number): void {
		this.logic.setTimeSignature(beats, beatDuration);
		this.notifySubscribers();
	}

	/**
	 * Get time signature
	 */
	getTimeSignature() {
		return this.logic.getTimeSignature();
	}

	/**
	 * Set volume
	 */
	setVolume(volume: number): void {
		this.logic.setVolume(volume);
		this.notifySubscribers();
	}

	/**
	 * Get volume
	 */
	getVolume(): number {
		return this.logic.getVolume();
	}

	/**
	 * Toggle accent
	 */
	toggleAccent(): void {
		this.logic.toggleAccent();
		this.notifySubscribers();
	}

	/**
	 * Get current state
	 */
	getState(): MetronomeState & { isPlaying: boolean } {
		return {
			...this.logic.getState(),
			isPlaying: this.isPlaying
		};
	}

	/**
	 * Subscribe to state changes
	 */
	subscribe(callback: (state: MetronomeState & { isPlaying: boolean }) => void): () => void {
		this.subscribers.push(callback);

		// Return unsubscribe function
		return () => {
			this.subscribers = this.subscribers.filter((sub) => sub !== callback);
		};
	}

	/**
	 * Notify all subscribers of state change
	 */
	private notifySubscribers(): void {
		const state = this.getState();
		this.subscribers.forEach((callback) => callback(state));
	}

	/**
	 * Schedule next click
	 */
	private scheduleNextClick(time: number): void {
		const beatDuration = this.logic.getBeatDuration() / 1000; // Convert to seconds
		const frequency = this.logic.getNextBeatFrequency();
		const volume = this.logic.getVolume();

		// Schedule the click
		this.audioEngine.playClick(frequency, time);

		// Schedule next click if still playing
		if (this.isPlaying) {
			this.eventId = this.audioEngine.schedule(
				() => this.scheduleNextClick(Tone.now()),
				Tone.Time(beatDuration)
			);
		}
	}

	/**
	 * Dispose resources
	 */
	dispose(): void {
		this.stop();
		this.audioEngine.dispose();
		this.subscribers = [];
	}
}

export default MetronomeService;
