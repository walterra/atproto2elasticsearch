// @ts-expect-error
import transformer from "node-es-transformer";
import { Readable } from "stream";
import * as dotenv from "dotenv";
import { Firehose } from "@skyware/firehose";
import cliProgress from "cli-progress";

dotenv.config();

const esNode = process.env.ES_NODE || "http://localhost:9200";
const targetIndexName = process.env.ES_INDEX || "bluesky-firehose-ner-0001";

// create a new progress bar instance and use shades_classic theme
const multiBar = new cliProgress.MultiBar(
  {
    format: "{title}: {bar} | {value} docs/s",
    hideCursor: true,
  },
  cliProgress.Presets.shades_classic
);
let maxThroughput = 10;
const firehoseBar = multiBar.create(maxThroughput, 0, { title: "Firehose " });
const esBar = multiBar.create(maxThroughput, 0, { title: "ES Ingest" });

// Firehose Readable Stream
class FirehoseStream extends Readable {
  private firehose: Firehose;
  private docsPerSecond = 0;

  constructor() {
    super({ objectMode: true });
    this.firehose = new Firehose({
      autoReconnect: true,
    });
    this.setupListeners();
    this.firehose.start();

    setInterval(() => {
      maxThroughput = Math.max(this.docsPerSecond, maxThroughput);
      firehoseBar.start(maxThroughput, this.docsPerSecond, {
        title: "Firehose ",
      });
      this.docsPerSecond = 0;
    }, 1000);
  }

  private setupListeners() {
    this.firehose.on("info", (info) => {
      console.error("Firehose info:", info);
    });

    this.firehose.on("websocketError", (error) => {
      console.error("Firehose websocketError:", error);
    });

    this.firehose.on("error", (error) => {
      console.error("Firehose error:", error);
    });

    this.firehose.on("commit", (message) => {
      try {
        for (const op of message.ops) {
          if (
            op.action === "create" &&
            op.record["$type"] === "app.bsky.feed.post"
          ) {
            this.docsPerSecond++;
            const uri = "at://" + message.repo + "/" + op.path;
            const url = `https://bsky.app/profile/${message.repo}/post/${
              op.path.split("/")[1]
            }`;

            // Create the object to be pushed
            const data = {
              repo: message.repo,
              path: op.path,
              uri,
              url,
              record: op.record,
              timestamp: message.time,
            };

            // Push the stringified version of the data
            this.push(JSON.stringify(data) + "\n"); // Convert to string before pushing
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
  }

  _read() {
    // No-op; data is pushed when received from WebSocket
  }
}

// Create a Firehose stream
const firehoseStream = new FirehoseStream();

// Elasticsearch connection configuration
transformer({
  targetClientConfig: {
    node: esNode,
    tls: { rejectUnauthorized: false },
  },
  targetIndexName,
  stream: firehoseStream,
  bufferSize: 10,
  mappings: {
    properties: {
      repo: { type: "keyword" },
      timestamp: { type: "date" },
      ner: {
        properties: {
          entities: {
            type: "nested",
            properties: {
              class_name: { type: "keyword" },
              entity: { type: "keyword" },
              class_probability: { type: "long" },
              start_pos: { type: "long" },
              end_pos: { type: "long" },
            },
          },
          model_id: { type: "keyword" },
          predicted_value: { type: "keyword" },
        },
      },
    },
  },
  // pipeline: "ml_ner",
}).then((esTransformer) => {
  esTransformer.events.on("docsPerSecond", (docsPerSecond) => {
    // console.log(`ES Throughput: ${throughput.docsPerSecond} docs/s`);
    maxThroughput = Math.max(docsPerSecond, maxThroughput);
    esBar.start(maxThroughput, docsPerSecond, {
      title: "ES Ingest",
    });
  });
});
