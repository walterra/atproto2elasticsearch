import WebSocket from "isomorphic-ws";
import * as transformer from "node-es-transformer";
import { Transform, Readable } from "stream";

// Elasticsearch connection configuration
const esTransformer = transformer({
  clientOptions: {
    node: "http://localhost:9200", // Your Elasticsearch node URL
  },
  index: "bluesky-firehose",
  bulkSize: 1000, // Number of documents per bulk request
});

// Firehose WebSocket URL
const FIREHOSE_URL = "wss://bsky.network/xrpc/com.atproto.sync.subscribeRepos";

// Custom transformation logic for RepoCommitEvent
const transformStream = new Transform({
  objectMode: true,
  transform(event, encoding, callback) {
    try {
      // Transform event into Elasticsearch document
      const document = {
        index: { _id: `${event.repo}-${event.seq}` }, // Unique ID
        doc: {
          repo: event.repo,
          ops: event.ops,
          blocks: event.blocks,
          seq: event.seq,
          time: event.time,
        },
      };
      callback(null, document);
    } catch (error) {
      callback(error);
    }
  },
});

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

// Pipe data through the transformation and ingestion pipeline
firehoseStream.pipe(transformStream).pipe(esTransformer);
