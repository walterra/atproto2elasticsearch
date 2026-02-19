const { startIngestion, loadConfig, defaultMappings } = require("atproto2elasticsearch");

const config = loadConfig({
  ES_NODE: "http://localhost:9200",
  ES_INDEX: "bluesky-firehose-0001",
});

startIngestion({
  config,
  mappings: defaultMappings,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
