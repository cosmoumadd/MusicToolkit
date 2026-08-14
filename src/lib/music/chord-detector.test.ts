import { describe, expect, it } from 'vitest';
import {
	buildChordVoicing,
	createChordPlaybackEvents,
	detectChord,
	noteAtFret,
	notesForChord
} from './chord-detector';

describe('chord detector', () => {
	it('recognises common chord qualities', () => {
		expect(detectChord(['C', 'E', 'G'])).toBe('C');
		expect(detectChord(['E', 'G', 'B', 'D'])).toBe('Em7');
		expect(detectChord(['C', 'E', 'G#'])).toBe('Caug');
	});

	it('returns Unknown when the notes do not make a chord', () => {
		expect(detectChord([])).toBe('Unknown');
		expect(detectChord(['C'])).toBe('Unknown');
	});

	it('builds presets and fretboard notes', () => {
		expect(notesForChord('E', [0, 3, 7])).toEqual(['E', 'G', 'B']);
		expect(noteAtFret('E2', 3)).toBe('G2');
	});

	it('voices a chord from its first note within one octave', () => {
		expect(buildChordVoicing(['C', 'E', 'G'])).toEqual(['C3', 'E3', 'G3']);
		expect(buildChordVoicing(['G', 'D', 'B', 'G'])).toEqual(['G3', 'B3', 'D4']);
	});

	it('creates simultaneous and arpeggiated playback events', () => {
		const notes = ['C3', 'E3', 'G3'];
		expect(createChordPlaybackEvents(notes, 'together')).toEqual([notes]);
		expect(createChordPlaybackEvents(notes, 'arpeggio-then-chord')).toEqual([
			['C3'],
			['E3'],
			['G3'],
			notes
		]);
	});
});
