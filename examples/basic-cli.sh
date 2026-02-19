#!/usr/bin/env bash
set -euo pipefail

export ES_NODE="http://localhost:9200"
export ES_INDEX="bluesky-firehose-0001"
export ES_BUFFER_KB="5120"

npx atproto2elasticsearch
