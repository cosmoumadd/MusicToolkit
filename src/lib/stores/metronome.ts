import { writable, type Readable } from 'svelte/store';

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

export interface MetronomeStore extends Readable<MetronomeState> {
	setBpm: (bpm: number) => void;
	setTimeSignature: (beats: number, beatDuration: number) => void;
	setVolume: (volume: number) => void;
	toggleAccent: () => void;
	setPlaying: (isPlaying: boolean) => void;
	setCurrentBeat: (currentBeat: number) => void;
	reset: () => void;
}

function createMetronomeStore(): MetronomeStore {
	const { subscribe, set, update } = writable<MetronomeState>(initialState);

	return {
		subscribe,
		setBpm: (bpm: number) =>
			update((state) => ({ ...state, bpm: Math.max(40, Math.min(300, bpm)) })),
		setTimeSignature: (beats: number, beatDuration: number) =>
			update((state) => ({ ...state, timeSignature: { beats, beatDuration } })),
		setVolume: (volume: number) =>
			update((state) => ({ ...state, volume: Math.max(0, Math.min(1, volume)) })),
		toggleAccent: () => update((state) => ({ ...state, accentEnabled: !state.accentEnabled })),
		setPlaying: (isPlaying: boolean) => update((state) => ({ ...state, isPlaying })),
		setCurrentBeat: (currentBeat: number) => update((state) => ({ ...state, currentBeat })),
		reset: () => set({ ...initialState, timeSignature: { ...initialState.timeSignature } })
	};
}

export const metronomeStore = createMetronomeStore();
