import { Readable } from "stream";
import { Firehose } from "@skyware/firehose";
import type { Logger } from "pino";

type FirehoseStreamOptions = {
  logger: Logger;
  onDocsPerSecond?: (docsPerSecond: number) => void;
  firehoseOptions?: Record<string, unknown>;
};

export class FirehoseStream extends Readable {
  private firehose: Firehose;
  private docsPerSecond = 0;
  private interval?: NodeJS.Timeout;
  private onDocsPerSecond?: (docsPerSecond: number) => void;
  private logger: Logger;

  constructor({ logger, onDocsPerSecond, firehoseOptions }: FirehoseStreamOptions) {
    super({ objectMode: true });
    this.logger = logger;
    this.onDocsPerSecond = onDocsPerSecond;
    this.firehose = new Firehose({
      autoReconnect: true,
      ...(firehoseOptions ?? {}),
    });

    this.setupListeners();
    this.firehose.start();

    this.interval = setInterval(() => {
      if (this.onDocsPerSecond) {
        this.onDocsPerSecond(this.docsPerSecond);
      }
      this.docsPerSecond = 0;
    }, 1000);
  }

  _read() {
    // No-op; data is pushed when received from WebSocket
  }

  override destroy(error?: Error): this {
    if (this.interval) clearInterval(this.interval);
    return super.destroy(error);
  }

  private setupListeners() {
    this.firehose.on("info", (info) => {
      this.logger.info({ info }, "Firehose info");
    });

    this.firehose.on("websocketError", (error) => {
      this.logger.error({ err: error }, "Firehose websocketError");
    });

    this.firehose.on("error", (error) => {
      this.logger.error({ err: error }, "Firehose error");
    });

    this.firehose.on("commit", (message: any) => {
      try {
        if (!message?.ops) return;

        for (const op of message.ops) {
          if (
            op.action === "create" &&
            op.record?.["$type"] === "app.bsky.feed.post"
          ) {
            this.docsPerSecond++;
            const uri = `at://${message.repo}/${op.path}`;
            const postId = op.path.split("/")[1];
            const url = `https://bsky.app/profile/${message.repo}/post/${postId}`;

            const data = {
              repo: message.repo,
              path: op.path,
              uri,
              url,
              record: op.record,
              timestamp: message.time,
            };

            this.push(`${JSON.stringify(data)}\n`);
          }
        }
      } catch (error) {
        this.logger.error({ err: error }, "Error processing message");
      }
    });
  }
}
