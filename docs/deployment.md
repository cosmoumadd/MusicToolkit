# Deployment and version policy

MusicToolkit is a static SvelteKit site deployed to GitHub Pages by [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml). GitHub Pages must be configured with **GitHub Actions** as the build and deployment source; do not also configure deployment from a branch.

## Runtime versions

| Tool    | CI and recommended local version | Where it is configured                                | Other local choices                                                                                                                                                                   |
| ------- | -------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js | `24.12.0`                        | [`.nvmrc`](../.nvmrc)                                 | Node.js `22.12.0` or newer 22.x LTS may be used for feature work if all checks pass. Prefer the pinned version for dependency or lockfile changes.                                    |
| npm     | `11.6.2`                         | `packageManager` in [`package.json`](../package.json) | Keep npm at the pinned version when running `npm install` or committing `package-lock.json`. A different npm release may resolve platform-specific optional dependencies differently. |

The workflow reads these files instead of duplicating runtime numbers. This keeps local development, lockfile generation, and CI aligned. In particular, Node.js 22 may ship with an older npm; install the repository's npm version explicitly before running `npm ci`.

```sh
nvm install
nvm use
npm install --global "$(node --print 'require("./package.json").packageManager')"
npm ci
```

Using another Node.js version locally is an evaluation choice, not a change to the supported CI version. Before sharing work produced with an alternative version, run the full quality checks and confirm that `package-lock.json` did not change unexpectedly.

## Deployment workflow

Every push to `main`, or a manual `workflow_dispatch`, performs these stages:

1. Check out the repository.
2. Install the Node.js version from `.nvmrc` and the npm version from `package.json`.
3. Restore npm's download cache and install exactly from `package-lock.json` with `npm ci`.
4. Run unit tests and Svelte/TypeScript checks.
5. Build the static site into `build/`.
6. Upload the Pages artifact and deploy it to the `github-pages` environment.

The workflow currently pins these GitHub Actions major versions:

| Action                          | Version | Purpose                                    |
| ------------------------------- | ------- | ------------------------------------------ |
| `actions/checkout`              | `v6`    | Check out the commit.                      |
| `actions/setup-node`            | `v6`    | Install Node.js and restore the npm cache. |
| `actions/configure-pages`       | `v5`    | Configure Pages metadata for the build.    |
| `actions/upload-pages-artifact` | `v4`    | Package the generated `build/` directory.  |
| `actions/deploy-pages`          | `v5`    | Deploy the artifact to GitHub Pages.       |

Action versions remain in the workflow because they are deployment implementation details. Update them deliberately, one action at a time, and verify a complete Pages run.

## Changing versions safely

For a planned runtime or dependency-tool upgrade:

1. Create a dedicated branch.
2. Change `.nvmrc` for Node.js and/or `packageManager` in `package.json` for npm.
3. Activate those exact versions locally and run `npm install` to refresh the lockfile when required.
4. Review `package-lock.json`, especially platform-specific optional packages such as native or WASM bindings.
5. Run:

   ```sh
   npm run test:unit -- --run
   npm run check
   npm run build
   ```

6. Push the branch and confirm CI before merging to `main`.
7. Update the version table in this document when the supported choices change.

Do not replace `npm ci` with `npm install` in CI simply to bypass a lockfile error. First confirm that Node.js and npm match the repository pins, then regenerate and review the lockfile with the pinned toolchain.

## Troubleshooting

### `npm ci` reports a lockfile mismatch

Check `node --version` and `npm --version` first. The repository previously encountered missing `@emnapi` optional WASM dependencies when a runner used a different npm release from the one that generated `package-lock.json`. Matching the pinned npm version should be the first correction.

### Deployment remains queued

A queued Pages deployment is separate from the build. Check whether another run is already deploying to the `github-pages` environment, cancel obsolete queued runs if appropriate, and rerun the newest workflow. The deploy job has a 20-minute limit and `deploy-pages` has a 15-minute status timeout.

### `punycode` deprecation warning

This warning can come from an action's Node.js dependencies. It is not by itself a deployment failure; use the final error and exit status to diagnose the run.
