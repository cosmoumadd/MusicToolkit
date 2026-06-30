import { describe, expect, it } from 'vitest';
import { belongsToScale, buildScale } from './scale-finder';

describe('scale finder', () => {
	it('builds a complete ascending scale', () => {
		expect(buildScale('C', [0, 2, 4, 5, 7, 9, 11])).toEqual([
			'C3',
			'D3',
			'E3',
			'F3',
			'G3',
			'A3',
			'B3',
			'C4'
		]);
	});

	it('supports roots with accidentals', () => {
		expect(buildScale('F#', [0, 2, 3, 5, 7, 8, 11])).toHaveLength(8);
		expect(buildScale('F#', [0, 2, 3, 5, 7, 8, 11])[0]).toBe('F#3');
		expect(buildScale('A', [0, 2, 3, 5, 7, 8, 11])[6]).toBe('G#4');
	});

	it('compares enharmonic notes by pitch', () => {
		expect(belongsToScale('G#4', ['Ab3', 'C4'])).toBe(true);
		expect(belongsToScale('A4', ['Ab3', 'C4'])).toBe(false);
	});
});
