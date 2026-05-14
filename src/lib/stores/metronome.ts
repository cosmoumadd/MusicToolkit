import { writable, type Writable } from 'svelte/store';

export interface MetronomeState {
	bpm: number;
	timeSignature: { beats: number; beatDuration: number };
	isPlaying: boolean;
	volume: number;
	accentEnabled: boolean;
	currentBeat: number;
}

const initialState: MetronomeState = {
	bpm: 120,
	timeSignature: { beats: 4, beatDuration: 4 },
	isPlaying: false,
	volume: 1,
	accentEnabled: true,
	currentBeat: 0
};

function createMetronomeStore(): Writable<MetronomeState> {
	const { subscribe, set, update } = writable<MetronomeState>(initialState);

	return {
		subscribe,
		set,
		update,
		setBpm: (bpm: number) => update((state) => ({ ...state, bpm: Math.max(40, Math.min(300, bpm)) })),
		setTimeSignature: (beats: number, beatDuration: number) =>
			update((state) => ({ ...state, timeSignature: { beats, beatDuration } })),
		setVolume: (volume: number) =>
			update((state) => ({ ...state, volume: Math.max(0, Math.min(1, volume)) })),
		toggleAccent: () => update((state) => ({ ...state, accentEnabled: !state.accentEnabled })),
		setPlaying: (isPlaying: boolean) => update((state) => ({ ...state, isPlaying })),
		setCurrentBeat: (currentBeat: number) => update((state) => ({ ...state, currentBeat })),
		reset: () => set(initialState)
	};
}

export const metronomeStore = createMetronomeStore();
