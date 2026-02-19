# atproto2elasticsearch

[![npm version](https://img.shields.io/npm/v/atproto2elasticsearch.svg)](https://www.npmjs.com/package/atproto2elasticsearch)
[![npm downloads](https://img.shields.io/npm/dm/atproto2elasticsearch.svg)](https://www.npmjs.com/package/atproto2elasticsearch)
[![CI](https://github.com/walterra/atproto2elasticsearch/actions/workflows/ci.yml/badge.svg)](https://github.com/walterra/atproto2elasticsearch/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/atproto2elasticsearch.svg)](LICENSE)

atproto2elasticsearch connects to the Bluesky (AT Protocol) firehose, processes events, and indexes posts into Elasticsearch. It is a CLI tool built on top of `node-es-transformer` for buffered bulk indexing.

## Features

- Real-time firehose ingestion
- Buffered bulk indexing via `node-es-transformer`
- Progress output for firehose and Elasticsearch throughput
- Configurable through environment variables

## Installation

Use `npx` for one-off runs or install globally.

```bash
npx atproto2elasticsearch

# or
npm install -g atproto2elasticsearch
atproto2elasticsearch
```

## Quickstart

1. Start Elasticsearch (see `examples/docker-compose.yml`).
2. Create a `.env` file with your Elasticsearch URL:

```bash
ES_NODE=https://<username>:<password>@localhost:9200
```

3. Run the CLI:

```bash
npx atproto2elasticsearch
```

## Configuration

All configuration is done through environment variables.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ES_NODE` | yes | `http://localhost:9200` | Elasticsearch URL |
| `ES_INDEX` | no | `bluesky-firehose-ner-0001` | Target index name |
| `ES_BUFFER_KB` | no | `5120` | Buffer size in KB for bulk indexing |
| `ES_TLS_REJECT_UNAUTHORIZED` | no | `false` | Set to `true` to enforce TLS certificate validation |
| `ES_PIPELINE` | no | none | Optional ingest pipeline name |
| `LOG_LEVEL` | no | `info` | Logger level for `pino` |
| `PROGRESS` | no | `true` | Enable progress bars (`true`/`false`) |

## Default Index Mapping

The default mapping is exported as `defaultMappings` for programmatic use. It includes core fields (`repo`, `path`, `uri`, `url`, `timestamp`, `record`) plus optional NER fields. If you use an ingest pipeline that adds `ner`, keep the nested mapping as-is.

## Programmatic Usage

You can also import the module and start ingestion programmatically.

```js
const { startIngestion, loadConfig, defaultMappings } = require("atproto2elasticsearch");

const config = loadConfig({
  ES_NODE: "https://user:pass@localhost:9200",
  ES_INDEX: "bluesky-firehose-0001",
});

startIngestion({
  config,
  mappings: defaultMappings,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## Development

```bash
# Install dependencies
npm install -g yarn

yarn

yarn build

yarn test

yarn typecheck
```

## Documentation

- [Development](DEVELOPMENT.md)
- [Testing](TESTING.md)
- [Performance](PERFORMANCE.md)
- [Versioning](VERSIONING.md)
- [Release process](RELEASE.md)
- [Security policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT
