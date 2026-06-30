import { Note } from 'tonal';

export type PlaybackStyle = 'scale' | 'up-down' | 'contrary' | 'arpeggio';

export function createPlaybackEvents(notes: string[], style: PlaybackStyle): string[][] {
	if (!notes.length) return [];

	if (style === 'up-down') {
		return [...notes, ...notes.slice(0, -1).reverse()].map((note) => [note]);
	}

	if (style === 'arpeggio') {
		const indexes = [0, 2, 4, notes.length - 1];
		return [...new Set(indexes)]
			.filter((index) => index < notes.length)
			.map((index) => [notes[index]]);
	}

	if (style === 'contrary') {
		const rootMidi = Note.midi(notes[0]);
		if (rootMidi === null) return [];

		return notes.map((note) => {
			const midi = Note.midi(note);
			if (midi === null) return [note];
			const upper = Note.fromMidi(midi + 12);
			const lower = Note.fromMidi(rootMidi - (midi - rootMidi));
			return upper === lower ? [upper] : [lower, upper];
		});
	}

	return notes.map((note) => [note]);
}
