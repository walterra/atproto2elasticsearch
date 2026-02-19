const test = require("node:test");
const assert = require("node:assert/strict");
const { loadConfig } = require("../dist/index.js");

test("loadConfig uses defaults", () => {
  const config = loadConfig({});
  assert.equal(config.esNode, "http://localhost:9200");
  assert.equal(config.indexName, "bluesky-firehose-ner-0001");
  assert.equal(config.bufferSizeKb, 5120);
  assert.equal(config.rejectUnauthorized, false);
  assert.equal(config.pipeline, undefined);
  assert.equal(config.logLevel, "info");
  assert.equal(config.progress, true);
});

test("loadConfig respects environment overrides", () => {
  const config = loadConfig({
    ES_NODE: "https://user:pass@es.example:9200",
    ES_INDEX: "bluesky-firehose-0001",
    ES_BUFFER_KB: "2048",
    ES_TLS_REJECT_UNAUTHORIZED: "true",
    ES_PIPELINE: "ml_ner",
    LOG_LEVEL: "debug",
    PROGRESS: "false",
  });

  assert.equal(config.esNode, "https://user:pass@es.example:9200");
  assert.equal(config.indexName, "bluesky-firehose-0001");
  assert.equal(config.bufferSizeKb, 2048);
  assert.equal(config.rejectUnauthorized, true);
  assert.equal(config.pipeline, "ml_ner");
  assert.equal(config.logLevel, "debug");
  assert.equal(config.progress, false);
});

test("loadConfig ignores invalid numeric values", () => {
  const config = loadConfig({
    ES_BUFFER_KB: "-1",
  });

  assert.equal(config.bufferSizeKb, 5120);
});
