import WebSocket from "isomorphic-ws";
// @ts-expect-error
import transformer from "node-es-transformer";
import { Readable } from "stream";
import * as dotenv from "dotenv";
dotenv.config();

const esNode = process.env.ES_NODE || "http://localhost:9200";

// Firehose WebSocket URL
const FIREHOSE_URL = "wss://bsky.network/xrpc/com.atproto.sync.subscribeRepos";

// Firehose Readable Stream
class FirehoseStream extends Readable {
  private ws: WebSocket;

  constructor() {
    super({ objectMode: true });
    this.ws = new WebSocket(FIREHOSE_URL);
    this.setupListeners();
  }

  private setupListeners() {
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data.toString());
        if (data.repo) {
          this.push(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed. Reconnecting...");
      setTimeout(() => this.reconnect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private reconnect() {
    this.ws = new WebSocket(FIREHOSE_URL);
    this.setupListeners();
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
  targetIndexName: "bluesky-firehose",
  stream: firehoseStream,
  bulkSize: 1000, // Number of documents per bulk request
});
