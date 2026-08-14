# MusicToolkit

MusicToolkit is a browser-based music-learning companion built with SvelteKit. It combines practical tools, short theory references, and ear-training games so learners can connect notation, sound, and interaction.

Live site: [cosmoumadd.github.io/MusicToolkit](https://cosmoumadd.github.io/MusicToolkit/)

## Development

The reproducible toolchain is:

- Node.js: read from [`.nvmrc`](.nvmrc)
- npm: read from `packageManager` in [`package.json`](package.json)

Use these pinned versions when installing or changing dependencies. Developers may test another supported Node.js LTS release without changing the repository pins; see [Deployment and version policy](docs/deployment.md) for the compatibility guidance and upgrade checklist.

```sh
nvm install
nvm use
npm install --global "$(node --print 'require("./package.json").packageManager')"
npm ci
npm run dev
```

If your version manager does not read `.nvmrc`, install the version written in that file manually.

## Quality checks

```sh
npm run test:unit -- --run
npm run check
npm run build
```

The production build is written to `build/`. Internal links must continue to work under the `/MusicToolkit` GitHub Pages base path.

## Deployment

Pushes to `main` are tested, built, and deployed through GitHub Actions. Repository Settings → Pages → Build and deployment must use **GitHub Actions** as its source.

See [Deployment and version policy](docs/deployment.md) for the workflow stages, pinned action versions, troubleshooting, and safe dependency/runtime upgrades.
