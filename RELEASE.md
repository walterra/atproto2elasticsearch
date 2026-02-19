# Release Process

Complete guide for releasing new versions of atproto2elasticsearch.

## Prerequisites

Before creating any release:

- [ ] `yarn build` succeeds locally
- [ ] `yarn test` and `yarn typecheck` succeed
- [ ] Dependency audit reviewed (`yarn audit`, `yarn outdated`)
- [ ] No uncommitted changes
- [ ] On `main` branch

## Release Workflow

This project uses [Changesets](https://github.com/changesets/changesets) for automated version management and releases.

### 1. Make Changes and Add Changeset

When you make changes that should be released:

```bash
# Make your changes
git checkout -b feature/my-change

# Add a changeset
yarn changeset
```

**Changeset prompts:**
1. Select version bump type:
   - **patch**: bug fixes, docs, internal refactors
   - **minor**: new features, non-breaking additions
   - **major**: breaking changes, API removals
2. Write a concise summary (appears in CHANGELOG.md)

**One changeset per PR** - combine all changes into a single changeset.

**Commit the changeset file:**

```bash
git add .changeset/your-changeset-name.md
git commit -m "feat: describe change"
git push
```

### 2. Merge to Main

After PR review and approval, merge to `main`.

### 3. Automatic Release PR Creation

When changesets are pushed to `main`, the release workflow automatically:

1. Detects changesets
2. Creates/updates a release PR titled "release vX.Y.Z"
3. The PR includes:
   - Version bump in `package.json`
   - Updated `CHANGELOG.md` with changeset summaries
   - Consumes (removes) the changeset files

### 4. Review and Merge Release PR

Before merging the release PR, verify:

- [ ] Version number is correct
- [ ] CHANGELOG.md entries are accurate
- [ ] CI checks pass
- [ ] No unintended changes in the diff

Merge the release PR to trigger the release.

### 5. Automatic GitHub Release Creation

After the release PR merges to `main`, the release workflow:

1. Checks for a matching git tag
2. If missing, creates:
   - Git tag (e.g., `v1.2.3`)
   - GitHub release with CHANGELOG excerpt

### 6. Automatic npm Publishing

When a GitHub release is published, the publish workflow:

1. Builds the package
2. Publishes to npm with provenance

## Manual Release (Emergency)

If the automated process fails, you can manually release.

### Build and Test Package

```bash
# Ensure clean state
git checkout main
git pull origin main
yarn install --frozen-lockfile

# Build
yarn build

# Tests
yarn test
yarn typecheck

# Dry-run packaging
npm pack --dry-run
```

### Manual GitHub Release

```bash
VERSION="1.0.0"  # Update this

git tag -a "v${VERSION}" -m "Release v${VERSION}"
git push origin "v${VERSION}"

gh release create "v${VERSION}" \
  --title "v${VERSION}" \
  --notes "See CHANGELOG.md for details"
```

### Manual npm Publish

**Only do this if automatic publishing fails.**

```bash
npm pack
npm publish --dry-run

npm login
npm publish --access public
```
