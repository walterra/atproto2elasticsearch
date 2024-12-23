// @ts-expect-error
import transformer from "node-es-transformer";
import { Readable } from "stream";
import * as dotenv from "dotenv";
import { Firehose } from "@skyware/firehose";

dotenv.config();

const esNode = process.env.ES_NODE || "http://localhost:9200";
const targetIndexName = process.env.ES_INDEX || "bluesky-firehose";

// Firehose Readable Stream
class FirehoseStream extends Readable {
  private firehose: Firehose;

  constructor() {
    super({ objectMode: true });
    this.firehose = new Firehose({
      autoReconnect: true,
    });
    this.setupListeners();
    this.firehose.start();
  }

  private setupListeners() {
    console.log("setupListeners");
    this.firehose.on("websocketError", (error) => {
      console.error("Firehose websocketError:", error);
    });

    this.firehose.on("error", (error) => {
      console.error("Firehose error:", error);
    });

    this.firehose.on("commit", (message) => {
      for (const op of message.ops) {
        if (
          op.action === "create" &&
          op.record["$type"] === "app.bsky.feed.post"
        ) {
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
    });
  }

  _read() {
    // No-op; data is pushed when received from WebSocket
  }
}

// Create a Firehose stream
const firehoseStream = new FirehoseStream();

// Elasticsearch connection configuration
const esTransformer = transformer({
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
    },
  },
});
