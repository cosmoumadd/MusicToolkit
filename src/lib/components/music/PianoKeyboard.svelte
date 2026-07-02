<script lang="ts">
	import { Note } from 'tonal';

	interface Props {
		selectedNotes?: string[];
		interactive?: boolean;
		onNoteClick?: (note: string) => void;
		accent?: 'emerald' | 'violet';
	}

	let {
		selectedNotes = [],
		interactive = false,
		onNoteClick,
		accent = 'emerald'
	}: Props = $props();

	const whiteKeys = [
		'C3',
		'D3',
		'E3',
		'F3',
		'G3',
		'A3',
		'B3',
		'C4',
		'D4',
		'E4',
		'F4',
		'G4',
		'A4',
		'B4'
	];
	const blackKeys = [
		{ note: 'Db3', afterWhite: 0 },
		{ note: 'Eb3', afterWhite: 1 },
		{ note: 'Gb3', afterWhite: 3 },
		{ note: 'Ab3', afterWhite: 4 },
		{ note: 'Bb3', afterWhite: 5 },
		{ note: 'Db4', afterWhite: 7 },
		{ note: 'Eb4', afterWhite: 8 },
		{ note: 'Gb4', afterWhite: 10 },
		{ note: 'Ab4', afterWhite: 11 },
		{ note: 'Bb4', afterWhite: 12 }
	];

	const isSelected = (note: string) =>
		selectedNotes.some((selected) => Note.chroma(selected) === Note.chroma(note));
	const blackKeyLeft = (afterWhite: number) => `${((afterWhite + 1) / whiteKeys.length) * 100}%`;
	const selectedWhiteClass = () =>
		accent === 'violet'
			? 'bg-violet-400 text-violet-950 shadow-[inset_0_-18px_30px_rgba(139,92,246,0.25)]'
			: 'bg-emerald-400 text-emerald-950 shadow-[inset_0_-18px_30px_rgba(16,185,129,0.25)]';
	const selectedBlackClass = () =>
		accent === 'violet' ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white';
</script>

<div class="rounded-xl bg-slate-950 p-2 sm:p-6">
	<div class="relative h-36 w-full sm:h-52" aria-label="Two octave piano keyboard">
		<div class="flex h-full">
			{#each whiteKeys as note (note)}
				<button
					type="button"
					disabled={!interactive}
					onclick={() => onNoteClick?.(note)}
					aria-pressed={interactive ? isSelected(note) : undefined}
					class="flex min-w-0 flex-1 items-end justify-center rounded-b-md border border-slate-400 pb-2 text-[8px] font-bold transition sm:pb-3 sm:text-xs {interactive
						? 'cursor-pointer hover:bg-slate-100'
						: 'cursor-default'} {isSelected(note)
						? selectedWhiteClass()
						: 'bg-white text-slate-700'}"
				>
					{note}
				</button>
			{/each}
		</div>
		{#each blackKeys as key (key.note)}
			<button
				type="button"
				disabled={!interactive}
				onclick={() => onNoteClick?.(key.note)}
				aria-pressed={interactive ? isSelected(key.note) : undefined}
				class="absolute top-0 z-10 flex h-[62%] w-[5%] -translate-x-1/2 items-end justify-center overflow-hidden rounded-b-md border border-slate-950 pb-1 text-[0px] font-bold shadow-lg transition sm:w-[4.5%] sm:pb-2 sm:text-[10px] {interactive
					? 'cursor-pointer hover:bg-slate-700'
					: 'cursor-default'} {isSelected(key.note)
					? selectedBlackClass()
					: 'bg-slate-900 text-slate-300'}"
				style:left={blackKeyLeft(key.afterWhite)}
			>
				{key.note}
			</button>
		{/each}
	</div>
</div>
