const test = require("node:test");
const assert = require("node:assert/strict");
const { defaultMappings } = require("../dist/index.js");

test("default mappings include core fields", () => {
  const { properties } = defaultMappings;

  assert.equal(properties.repo.type, "keyword");
  assert.equal(properties.path.type, "keyword");
  assert.equal(properties.uri.type, "keyword");
  assert.equal(properties.url.type, "keyword");
  assert.equal(properties.timestamp.type, "date");
  assert.equal(properties.record.type, "object");
});

test("default mappings include NER nested mapping", () => {
  const { properties } = defaultMappings;

  assert.equal(properties.ner.properties.entities.type, "nested");
  assert.equal(
    properties.ner.properties.entities.properties.class_name.type,
    "keyword"
  );
});
