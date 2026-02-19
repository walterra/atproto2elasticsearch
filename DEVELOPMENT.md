# Development

## Prerequisites

- Node.js 22+ (see `.nvmrc`)
- Yarn

## Setup

```bash
yarn
```

## Build

```bash
yarn build
```

## Run the CLI locally

```bash
ES_NODE=https://<username>:<password>@localhost:9200 \
  yarn start
```

## Local Elasticsearch

For local development, use the Docker Compose file in `examples/docker-compose.yml`.

```bash
cd examples

docker compose up -d
```

## Tests

```bash
yarn test
yarn typecheck
```
