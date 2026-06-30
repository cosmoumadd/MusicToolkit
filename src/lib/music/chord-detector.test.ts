import { describe, expect, it } from 'vitest';
import { detectChord, noteAtFret, notesForChord } from './chord-detector';

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
});
