# Project notes

## Releasing

Releases are automated via GitHub Actions. The `publish-npm.yml` workflow triggers on `release: [released]`.

To ship:

```bash
gh release create vX.Y.Z --target main --title vX.Y.Z --notes "..."
```

The workflow:

- Reads the tag, strips the `v` prefix, runs `npm version <X.Y.Z> --no-git-tag-version`.
- Builds, lints, and publishes to npm via `NPM_TOKEN`.

Do **not** run `pnpm release` / `n8n-node release` manually, and do **not** bump `package.json` by hand — the tag drives the version.
