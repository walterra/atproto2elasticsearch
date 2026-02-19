# atproto2elasticsearch

CLI tool that connects to the Bluesky (AT Protocol) firehose and indexes posts into Elasticsearch using `node-es-transformer`.

## Project Overview

This project streams live AT Protocol events, converts relevant records into NDJSON, and ships them to Elasticsearch using buffered bulk indexing.

**Key Features:**
- Real-time firehose ingestion
- Buffered bulk indexing via `node-es-transformer`
- Progress bars for firehose and Elasticsearch throughput
- Configurable via environment variables

## Architecture

- **Built with**: TypeScript + esbuild bundle
- **Node.js**: v22+ (see `.nvmrc`)
- **CLI entry**: `src/cli.ts` → `dist/cli.js`
- **Library entry**: `src/index.ts` → `dist/index.js`
- **Core modules**: `src/config.ts`, `src/firehoseStream.ts`, `src/mappings.ts`
- **CLI**: `bin/atproto2elasticsearch.js`

## Development Commands

**Package Manager: This project uses `yarn`, not `npm`**

```bash
# Install dependencies
yarn

# Build the bundle + type declarations
yarn build

# Run tests
yarn test

# Typecheck

yarn typecheck

# Run the CLI locally
yarn start
```

## Runtime Configuration

Set these environment variables (via `.env` or shell):

- `ES_NODE` (required): Elasticsearch URL, e.g. `https://user:pass@localhost:9200`
- `ES_INDEX` (optional): Target index name (default: `bluesky-firehose-ner-0001`)
- `ES_BUFFER_KB` (optional): Bulk buffer size in KB (default: `5120`)
- `ES_TLS_REJECT_UNAUTHORIZED` (optional): Set to `true` for TLS verification
- `ES_PIPELINE` (optional): Ingest pipeline name
- `LOG_LEVEL` (optional): `pino` log level (default: `info`)
- `PROGRESS` (optional): Enable progress bars (`true`/`false`)

## Logging

- Uses `pino` for structured logging
- Logs firehose info and errors to stderr

## Release Process

- Uses Changesets for versioning and automated releases
- Add a changeset with `yarn changeset` for every release-worthy change
- See `RELEASE.md` for the full workflow

## Code Style & Conventions

- Use async/await for async operations
- Keep CLI output minimal and structured
- No emojis, no anthropomorphism, no exclamation marks in docs and changelogs
- Prefer explicit configuration via env vars
