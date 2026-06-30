import { Chord, Note } from 'tonal';

export const pitchClasses = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const chromaticSharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chromaticFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function noteAtFret(openNote: string, fret: number): string {
	const midi = Note.midi(openNote);
	return midi === null ? openNote : Note.fromMidi(midi + fret);
}

export function notesForChord(root: string, intervals: number[]): string[] {
	const rootMidi = Note.chroma(root);
	if (rootMidi === undefined) return [];

	const chromatic = root.includes('b') ? chromaticFlats : chromaticSharps;
	return intervals.map((interval) => chromatic[(rootMidi + interval) % 12]);
}

export function detectChord(notes: string[]): string {
	if (notes.length < 2) return 'Unknown';

	const match = Chord.detect(notes)[0];
	if (!match) return 'Unknown';

	return match.endsWith('M') ? match.slice(0, -1) : match;
}
