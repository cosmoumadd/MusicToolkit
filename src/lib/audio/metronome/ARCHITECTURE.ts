/**
 * METRONOME ARCHITECTURE GUIDE
 * 
 * 5 Steps → Complete 3-Layer Modular Design
 * 
 * QUICK START:
 * 1. UI Component imports MetronomeEngine
 * 2. Engine imports Transport, Click, Scheduler, and Store
 * 3. Each layer is independent and testable
 * 4. Store keeps UI in sync with engine
 * 
 * LAYER STRUCTURE:
 * 
 * ┌─────────────────────────────────────┐
 * │ UI Layer (Svelte Component)         │
 * │ src/routes/tools/metronome/         │
 * └──────────────────┬──────────────────┘
 *                    │
 *          ┌─────────▼─────────┐
 *          │ Svelte Store      │
 *          │ metronomeStore    │
 *          │ (State Mgmt)      │
 *          └─────────▲─────────┘
 *                    │
 * ┌──────────────────┴──────────────────┐
 * │ Orchestrator (engine.ts)            │
 * │ MetronomeEngine                     │
 * └──────────────────┬──────────────────┘
 *                    │
 *    ┌───────────────┼───────────────┐
 *    │               │               │
 * ┌──▼──┐        ┌──▼──┐        ┌──▼────┐
 * │Trans-│        │Click│        │Sche-  │
 * │port  │        │(Sound)│      │duler  │
 * │      │        │      │       │(Beats)│
 * └──────┘        └──────┘       └───────┘
 * 
 * AUDIO ENGINE COMPONENTS:
 * 
 * transport.ts - MetronomeTransport
 * ├── initialize() - Start audio context
 * ├── start() - Start timing
 * ├── stop() - Stop timing
 * ├── setBpm(bpm) - Set tempo
 * ├── getNow() - Get current time
 * └── schedule() - Schedule callbacks
 * 
 * click.ts - MetronomeClick
 * ├── play(isAccent) - Generate click sound
 * ├── setAccentFrequency() - Set accent pitch
 * ├── setRegularFrequency() - Set regular pitch
 * ├── setVolume() - Control volume
 * └── dispose() - Clean up
 * 
 * scheduler.ts - MetronomeScheduler
 * ├── start() - Begin beat scheduling
 * ├── stop() - Stop scheduling
 * ├── updateBpm() - Change tempo
 * ├── updateTimeSignature() - Change time signature
 * ├── updateAccent() - Toggle accent
 * └── getCurrentBeat() - Get current beat position
 * 
 * HOW IT WORKS:
 * 
 * 1. User clicks "Start" → UI calls engine.start()
 * 2. Engine initializes Tone.js audio context
 * 3. Engine creates Scheduler with current settings
 * 4. Transport starts Tone.js timing (bpm setting)
 * 5. Scheduler schedules first beat immediately
 * 6. For each beat:
 *    - Click.play() generates sound (accent or regular)
 *    - Scheduler schedules next beat
 *    - beatDuration = (60 / BPM) * (4 / beatDuration)
 * 7. UI updates via Svelte store subscription
 * 
 * USER INTERACTIONS:
 * 
 * BPM Change:
 *   UI → handleBpmChange()
 *     → metronomeStore.setBpm()
 *     → engine.setBpm()
 *     → scheduler.updateBpm()
 *     → transport.setBpm()
 * 
 * Time Signature Change:
 *   UI → handleTimeSignatureChange()
 *     → metronomeStore.setTimeSignature()
 *     → engine.setTimeSignature()
 *     → scheduler.updateTimeSignature()
 * 
 * Volume Change:
 *   UI → handleVolumeChange()
 *     → metronomeStore.setVolume()
 *     → engine.setVolume()
 *     → click.setVolume()
 * 
 * TIMING ACCURACY:
 * 
 * Tone.js Transport provides precise timing using:
 * - Web Audio API for sample-accurate scheduling
 * - Transport.schedule() for future callbacks
 * - All scheduling is sample-accurate
 * 
 * The scheduler.ts file:
 * - Calculates beatDuration in seconds
 * - Schedules next beat with "+Xs" format (Tone notation)
 * - Maintains currentBeat counter for accent logic
 * 
 * EXTENDING THE ARCHITECTURE:
 * 
 * To add a new feature:
 * 1. Add state to metronomeStore if needed
 * 2. Add handler to engine.ts
 * 3. Add logic to appropriate layer (transport/click/scheduler)
 * 4. Call handler from UI component
 * 5. Subscribe to store changes for UI updates
 * 
 * Example: Add tempo tapping
 * 1. Store: Add tempoTapTimes: number[]
 * 2. Engine: Add tapTempo(currentTime) method
 * 3. Scheduler: No change needed
 * 4. UI: Add tap button, call engine.tapTempo(Date.now())
 * 
 * FILE LOCATIONS:
 * 
 * Audio Engine:
 * src/lib/audio/metronome/
 * ├── transport.ts
 * ├── click.ts
 * ├── scheduler.ts
 * ├── engine.ts
 * └── index.ts (exports)
 * 
 * State:
 * src/lib/stores/metronome.ts
 * 
 * UI:
 * src/routes/tools/metronome/+page.svelte
 * 
 * PERFORMANCE NOTES:
 * 
 * - Tone.js scheduling is optimized and sample-accurate
 * - Each layer has minimal overhead
 * - Store subscriptions use Svelte's efficient reactivity
 * - No unnecessary re-renders due to $derived
 * - Engine is garbage-collected on component destroy
 */

export const architectureGuide = 'See comments in this file';
