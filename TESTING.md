# Testing

## Automated Tests

```bash
yarn test
yarn typecheck
```

Unit tests cover configuration parsing and default mappings. Typechecking validates the public API and internal modules.

## Manual Testing

1. Start Elasticsearch (see `examples/docker-compose.yml`).
2. Set `ES_NODE` in a `.env` file.
3. Run `yarn start` and verify that documents are indexed.
