WORK IN PROGRESS

# atproto2elasticsearch

atproto2elasticsearch connects to the Bluesky (AT Protocol) firehose, processes events, and indexes them into an Elasticsearch cluster. This allows users to perform powerful search and analytics on real-time Bluesky data.

## setup

- Create a `.env` file and add your Elasticsearch endpoint, e.g. `ES_NODE=https://elastic:<password>@localhost:9200`.
- Run `yarn`, `yarn build` and `yarn start`.

## feedback

[Create an issue](https://github.com/walterra/atproto2elasticsearch/issues) in the repo or contact me on Bluesky: https://bsky.app/profile/walterra.dev
