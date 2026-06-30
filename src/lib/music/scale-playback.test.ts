import { describe, expect, it } from 'vitest';
import { createPlaybackEvents } from './scale-playback';

const scale = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

describe('scale playback styles', () => {
	it('plays a scale in one direction', () => {
		expect(createPlaybackEvents(scale, 'scale')).toEqual(scale.map((note) => [note]));
	});

	it('plays up and down without repeating the top note', () => {
		const events = createPlaybackEvents(scale, 'up-down');
		expect(events).toHaveLength(15);
		expect(events.at(-1)).toEqual(['C3']);
	});

	it('creates two voices moving in contrary motion', () => {
		const events = createPlaybackEvents(scale, 'contrary');
		expect(events[0]).toEqual(['C3', 'C4']);
		expect(events.at(-1)).toEqual(['C2', 'C5']);
	});

	it('selects chord tones for an arpeggio', () => {
		expect(createPlaybackEvents(scale, 'arpeggio')).toEqual([['C3'], ['E3'], ['G3'], ['C4']]);
	});
});
