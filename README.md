WORK IN PROGRESS

# atproto2elasticsearch

atproto2elasticsearch connects to the Bluesky (AT Protocol) firehose, processes events, and indexes them into an Elasticsearch cluster. This allows you to perform powerful search and analytics on real-time Bluesky data.

## run via `npx`

```bash
ES_NODE=https://<username>:<password>@localhost:9200 npx atproto2elasticsearch
```

## setup

- Create a `.env` file and add your Elasticsearch endpoint, e.g. `ES_NODE=https://<username>:<password>@localhost:9200`.
- Run `yarn`, `yarn build` and `yarn start`.

## feedback

[Create an issue](https://github.com/walterra/atproto2elasticsearch/issues) in the repo or contact me on Bluesky: https://bsky.app/profile/walterra.dev
