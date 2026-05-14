import MetronomeTransport from './transport';
import MetronomeClick from './click';

export interface SchedulerConfig {
	bpm: number;
	timeSignature: { beats: number; beatDuration: number };
	accentEnabled: boolean;
}

/**
 * Scheduler Layer
 * Manages beat scheduling and audio playback coordination
 */
export class MetronomeScheduler {
	private transport: MetronomeTransport;
	private click: MetronomeClick;
	private config: SchedulerConfig;
	private currentBeat: number = 0;
	private scheduleId: number | null = null;
	private beatDuration: number = 0.5; // seconds

	constructor(transport: MetronomeTransport, click: MetronomeClick, config: SchedulerConfig) {
		this.transport = transport;
		this.click = click;
		this.config = config;
		this.calculateBeatDuration();
	}

	/**
	 * Calculate beat duration in seconds
	 */
	private calculateBeatDuration(): void {
		const bpm = this.transport.getBpm();
		this.beatDuration = (60 / bpm) * (4 / this.config.timeSignature.beatDuration);
	}

	/**
	 * Start scheduling beats
	 */
	start(): void {
		this.currentBeat = 0;
		this.scheduleNextBeat(this.transport.getNow());
	}

	/**
	 * Stop scheduling
	 */
	stop(): void {
		if (this.scheduleId) {
			this.transport.clearSchedule(this.scheduleId);
			this.scheduleId = null;
		}
		this.currentBeat = 0;
	}

	/**
	 * Update BPM and recalculate beat duration
	 */
	updateBpm(bpm: number): void {
		this.transport.setBpm(bpm);
		this.calculateBeatDuration();
	}

	/**
	 * Update time signature
	 */
	updateTimeSignature(beats: number, beatDuration: number): void {
		this.config.timeSignature = { beats, beatDuration };
		this.calculateBeatDuration();
	}

	/**
	 * Update accent setting
	 */
	updateAccent(enabled: boolean): void {
		this.config.accentEnabled = enabled;
	}

	/**
	 * Schedule the next beat
	 */
	private scheduleNextBeat(time: number): void {
		const isAccent = this.config.accentEnabled && this.currentBeat === 0;

		// Play click
		this.click.play(isAccent, time);

		// Move to next beat
		this.currentBeat = (this.currentBeat + 1) % this.config.timeSignature.beats;

		// Schedule next beat
		this.scheduleId = this.transport.schedule(
			() => this.scheduleNextBeat(this.transport.getNow()),
			`+${this.beatDuration.toFixed(2)}s` as any
		);
	}

	/**
	 * Get current beat
	 */
	getCurrentBeat(): number {
		return this.currentBeat;
	}

	/**
	 * Get beat duration in milliseconds
	 */
	getBeatDurationMs(): number {
		return this.beatDuration * 1000;
	}
}

export default MetronomeScheduler;
