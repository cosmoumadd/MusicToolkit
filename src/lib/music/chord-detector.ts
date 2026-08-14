import { Chord, Note } from 'tonal';

export const pitchClasses = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export type ChordPlaybackStyle = 'together' | 'arpeggio-then-chord';

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

export function buildChordVoicing(notes: string[], octave = 3): string[] {
	const uniqueNotes = notes.filter(
		(note, index) => notes.findIndex((item) => Note.chroma(item) === Note.chroma(note)) === index
	);
	const rootChroma = Note.chroma(uniqueNotes[0]);
	if (rootChroma === undefined) return [];

	return uniqueNotes
		.map((note) => ({ note: Note.pitchClass(note), chroma: Note.chroma(note) }))
		.filter((item): item is { note: string; chroma: number } => item.chroma !== undefined)
		.sort((a, b) => ((a.chroma - rootChroma + 12) % 12) - ((b.chroma - rootChroma + 12) % 12))
		.map(({ note, chroma }) => `${note}${octave + (chroma < rootChroma ? 1 : 0)}`);
}

export function createChordPlaybackEvents(notes: string[], style: ChordPlaybackStyle): string[][] {
	if (!notes.length) return [];
	if (style === 'arpeggio-then-chord') return [...notes.map((note) => [note]), notes];
	return [notes];
}
