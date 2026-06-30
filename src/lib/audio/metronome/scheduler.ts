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
	private onBeat: (beat: number) => void;

	constructor(
		transport: MetronomeTransport,
		click: MetronomeClick,
		config: SchedulerConfig,
		onBeat: (beat: number) => void
	) {
		this.transport = transport;
		this.click = click;
		this.config = config;
		this.onBeat = onBeat;
	}

	/**
	 * Start scheduling beats
	 */
	start(): void {
		this.currentBeat = 0;
		this.scheduleId = this.transport.scheduleRepeat(
			(time) => this.playBeat(time),
			`${this.config.timeSignature.beatDuration}n`
		);
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
	}

	/**
	 * Update time signature
	 */
	updateTimeSignature(beats: number, beatDuration: number): void {
		this.config.timeSignature = { beats, beatDuration };
		this.currentBeat %= beats;
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
	private playBeat(time: number): void {
		const isAccent = this.config.accentEnabled && this.currentBeat === 0;

		this.click.play(isAccent, time);
		this.onBeat(this.currentBeat);

		this.currentBeat = (this.currentBeat + 1) % this.config.timeSignature.beats;
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
		return (60000 / this.transport.getBpm()) * (4 / this.config.timeSignature.beatDuration);
	}
}

export default MetronomeScheduler;
