# Porcelana

Tactile React components on Radix primitives: porcelain surfaces, cobalt accents, a night theme, and every control built for touch and screen readers.

| Package | |
| --- | --- |
| [`@porcelana/ui`](packages/ui) | ~35 components, tokens and styles |
| [`@porcelana/icons`](packages/icons) | 51 tree-shakable stroke icons |

**Live gallery:** https://pierrejochem.github.io/porcelana/ (deployed from `main`)

## Develop

```bash
pnpm install
pnpm preview        # gallery at http://localhost:5173
pnpm test           # vitest + Testing Library + jest-axe
pnpm verify         # lint, typecheck, tests with coverage, build, package checks
```

Requires Node ≥ 20 and pnpm 10 (`corepack enable`).

## Releasing

Releases are automated with [Changesets](https://github.com/changesets/changesets):

1. In your PR, run `pnpm changeset`, pick patch, minor or major and describe the change. CI fails without one if a package changed.
2. Each PR gets **preview builds** from [pkg.pr.new](https://pkg.pr.new), and a bot comments the install command.
3. When the PR is merged to `main`, the Release workflow opens a **"Version Packages"** PR that bumps versions and writes the changelogs.
4. When that PR is merged, the workflow runs `pnpm verify` and **publishes to npm with provenance**. It also creates GitHub releases.

### One-time setup

1. **npm:** create the `porcelana` organisation on npmjs.com, then create a granular access token with publish rights on `@porcelana/*`.
2. **GitHub → Settings → Secrets → Actions:** add the token as `NPM_TOKEN`.
3. **GitHub → Settings → Actions → General:** allow GitHub Actions to create and approve pull requests.
4. Install the [pkg.pr.new GitHub App](https://github.com/apps/pkg-pr-new) on this repo for PR preview packages.
5. **GitHub → Settings → Pages:** set the source to "GitHub Actions" for the gallery.

After the first publish you can switch to npm **trusted publishing** (OIDC) and delete the token.

## Structure

```
packages/
  icons/   createIcon + generated icons (scripts/gen_icons.py)
  ui/      src/components, src/styles/porcelana.css, preview/ (gallery)
.changeset/  pending release notes
.github/     CI, release, gallery deploy, dependabot
```

## License

MIT © Pierre Jochem
