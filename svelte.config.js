import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/MusicToolkit' : '',
    },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        if (path === '/') {
          return;
        }
        throw new Error(message);
      }
    }
  }
};

export default config;