import { Note } from 'tonal';

const chromaticSharps = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const chromaticFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export function buildScale(root: string, intervals: number[], octave = 3): string[] {
	const chroma = Note.chroma(root);
	if (chroma === undefined) return [];

	const chromatic = root.includes('b') ? chromaticFlats : chromaticSharps;
	return [...intervals, 12].map((interval) => {
		const distance = chroma + interval;
		return `${chromatic[distance % 12]}${octave + Math.floor(distance / 12)}`;
	});
}

export function belongsToScale(note: string, scaleNotes: string[]): boolean {
	const chroma = Note.chroma(note);
	return scaleNotes.some((scaleNote) => Note.chroma(scaleNote) === chroma);
}
