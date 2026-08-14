---
name: music-toolkit-guidelines
description: Repository-specific engineering and product guidelines for MusicToolkit, a SvelteKit music-learning web app. Use when planning, implementing, reviewing, debugging, or testing changes to its Svelte pages, interactive music tools, ear-training games, music-theory logic, Tone.js or Web Audio playback, microphone input, navigation, styling, and learning content.
---

# Music Toolkit Guidelines

Build focused, musically correct, learner-friendly changes that fit the existing application.

## Understand the Product

Treat MusicToolkit as a browser-based learning companion, not merely a collection of calculators.

- Organize experiences under `Tools`, `Learn`, or `Games` according to the user's goal.
- Help learners connect theory, sound, and interaction. Prefer visible or audible feedback over unexplained output.
- Keep explanations concise, encouraging, and useful to beginners without making the underlying theory inaccurate.
- Preserve the dark slate visual language, responsive layouts, clear accent colors, and direct task-oriented labels unless a redesign is requested.

## Map Changes to the Repository

Use the existing boundaries before adding new ones:

- Put route UI in `src/routes/**/+page.svelte`.
- Put reusable UI in `src/lib/components`.
- Put pure music-theory transformations in `src/lib/music` and test them independently.
- Put shared audio-engine behavior in `src/lib/audio`; keep the metronome's transport, scheduler, click, engine, and store separation intact.
- Put reusable structured theory data in `src/lib/data` rather than duplicating it in components.
- Use `$app/paths` and `base` for internal links so GitHub Pages and other base-path deployments continue to work.
- Use Tonal for established note, interval, scale, and chord operations instead of recreating music-theory primitives.
- Use Tone.js or Web Audio only where sound generation, scheduling, or microphone analysis requires it.

Inspect nearby code and tests before choosing an implementation pattern. Match existing Svelte 5 runes, TypeScript, Tailwind utilities, naming, and formatting.

## Work Deliberately

Before editing:

1. Restate the learner outcome and the smallest observable behavior that satisfies it.
2. Identify assumptions about notation, enharmonic spelling, octave numbering, tuning reference, tempo, meter, playback order, and browser permissions.
3. Trace the relevant route, pure logic, data, state, and audio lifecycle.
4. Define verification: pure unit cases, Svelte checks, build, and browser interaction as appropriate.

If multiple musical interpretations are valid, expose the choice or document the convention. Do not silently mix conventions.

## Keep Changes Simple and Surgical

- Implement only the requested behavior.
- Prefer a small pure function over music logic embedded in a large Svelte component.
- Reuse existing components and data when they genuinely fit; do not introduce abstraction for one call site.
- Match surrounding style and avoid unrelated cleanup.
- Remove only imports, state, or helpers made obsolete by the current change.
- Keep each changed line traceable to the learner outcome or its verification.

## Protect Musical Correctness

- Distinguish pitch class from absolute pitch and preserve octave information when playback depends on it.
- Handle sharps and flats intentionally. Preserve the user's spelling when practical and test enharmonic cases where they matter.
- Define interval values and scale formulas in semitones consistently.
- Avoid presenting a chord detection result as unique when the selected notes permit inversions or multiple interpretations.
- Keep displayed note names, played pitches, and answer evaluation derived from the same source of truth.
- Use musically representative fixtures rather than arbitrary strings in tests.
- For randomized games, test deterministic helpers separately and verify that every generated question has a valid answer.

## Handle Browser Audio Safely

- Start or resume audio only from a user gesture; browsers commonly block autoplay.
- Treat Tone.js synths, transports, timers, animation frames, audio contexts, media streams, and tracks as owned resources.
- Stop and dispose owned resources on replay, navigation, and component destruction. Avoid stacked schedules and duplicate playback.
- Keep timing calculations out of rendering code. Use audio-clock scheduling for timing-sensitive tools instead of assuming UI timers are precise.
- Make start, stop, replay, and tempo-change behavior idempotent.
- Request microphone access only when the learner starts a microphone feature. Explain denial or unavailable-device states and stop every track on cleanup.
- Guard browser-only APIs from server-side rendering.

## Design for Learning and Access

- Give each interaction a clear instruction, action, feedback state, and next step.
- Do not rely on color alone for correctness, timing, tuning, or selection feedback.
- Use semantic buttons and labels, visible keyboard focus, appropriate `aria-pressed` or live status, and usable touch targets.
- Respect `prefers-reduced-motion` for nonessential animation.
- Keep tools useful on small screens and avoid layouts that require precision tapping.
- Keep audio silent until the learner explicitly asks it to play.
- For scored activities, explain the correct answer after an error and keep difficulty progression understandable.

## Verify Proportionally

Run the narrowest relevant checks first, then broaden:

1. Add or update Vitest coverage for pure theory and event-sequence logic.
2. Run the affected test file, then `npm run check`.
3. Run `npm run lint` when source or formatting changes.
4. Run `npm run build` for routes, configuration, imports, or deployment-sensitive changes.
5. Use a browser check for sound, microphone permission, responsive layout, keyboard operation, and cleanup behavior that static checks cannot prove.

Test musical boundaries such as B/C and E/F, octave crossings, empty input, repeated notes, enharmonic spellings, minimum and maximum tempo, rapid start/stop, and denied microphone permission when relevant.

Do not claim audio quality, timing accuracy, microphone behavior, or visual usability from type checks alone. Report which checks ran and any behavior that still requires manual verification.

## Finish with a Learner-Centered Review

Before handing off, confirm:

- The feature teaches or assists a recognizable musical task.
- Theory labels, calculations, playback, and scoring agree.
- Internal links honor the configured base path.
- Audio and microphone resources have an explicit cleanup path.
- Loading, idle, active, success, error, and permission states are understandable where applicable.
- The change remains focused and the relevant checks pass.
