# Contributing

Thanks for considering a contribution. This project is maintained by a single person, so please open an issue before investing time in larger changes.

## Before You Start

- Open an issue describing the change or bug.
- Wait for maintainer approval before starting major work.
- Keep changes focused and scoped to the agreed goal.

## Development Setup

```bash
# Install dependencies
yarn

# Build the bundle + type declarations
yarn build

# Run tests
yarn test

# Typecheck
yarn typecheck
```

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

- Add one changeset per PR: `yarn changeset`
- Choose the correct bump (patch/minor/major)
- Keep the summary concise and user-facing

## Commit Messages

Use Commitizen:

```bash
npx cz
```

## Code Style

- Use async/await for async operations
- Keep CLI output minimal and structured
- No emojis, no anthropomorphism, no exclamation marks in docs and changelogs
- Prefer explicit configuration via env vars
