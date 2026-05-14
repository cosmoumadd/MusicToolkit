import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/MusicToolkit' : '',
    },
    prerender: {
      // fix 1: tell the crawler to ignore missing id for anchors (like #/) instead of throwing an error
      handleMissingId: 'ignore',

      // ignore missing routes during prerendering, but only for the expected ones
      handleHttpError: ({ path, referrer, message }) => {
        // this function will be called whenever a route is missing during prerendering
        const missingRoutes = [
          '/MusicToolkit/tools/chord-detector',
          '/MusicToolkit/tools/scale-finder',
          '/MusicToolkit/tools/interval-trainer',
          '/MusicToolkit/games/guess-chord',
          '/MusicToolkit/games/ear-training',
          '/MusicToolkit/games/rhythm-game',
          '/MusicToolkit/learn/chords',
          '/MusicToolkit/learn/scales',
          '/MusicToolkit/learn/intervals'
        ];

        // fix 2: ignore missing routes that are expected due to the way we handle routing in SvelteKit (like the ones with # or the base path)
        if (
          missingRoutes.includes(path) || 
          path === '/' || 
          path === '/MusicToolkit/' || 
          path.includes('#')
        ) {
          return;
        }

        // if the missing route is not expected, throw an error to alert the developer
        throw new Error(message);
      }
    }
  }
};

export default config;