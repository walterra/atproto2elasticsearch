import transformer from "node-es-transformer";
import cliProgress from "cli-progress";
import pino from "pino";
import { FirehoseStream } from "./firehoseStream";
import {
  defaultMappings,
  type ElasticsearchMappings,
} from "./mappings";
import { loadConfig, type Atproto2ElasticsearchConfig } from "./config";

export type { Atproto2ElasticsearchConfig, ElasticsearchMappings };
export { loadConfig, defaultMappings, FirehoseStream };

export interface StartIngestionOptions {
  config?: Partial<Atproto2ElasticsearchConfig>;
  env?: NodeJS.ProcessEnv;
  mappings?: ElasticsearchMappings;
  logger?: pino.Logger;
  firehoseOptions?: Record<string, unknown>;
}

export async function startIngestion(options: StartIngestionOptions = {}) {
  const baseConfig = loadConfig(options.env);
  const config: Atproto2ElasticsearchConfig = {
    ...baseConfig,
    ...(options.config ?? {}),
  };

  const logger =
    options.logger ??
    pino({ name: "atproto2elasticsearch", level: config.logLevel }, pino.destination(2));

  const progress = config.progress
    ? new cliProgress.MultiBar(
        {
          format: "{title}: {bar} | {value} docs/s",
          hideCursor: true,
        },
        cliProgress.Presets.shades_classic
      )
    : null;

  let maxThroughput = 10;
  const firehoseBar = progress
    ? progress.create(maxThroughput, 0, { title: "Firehose " })
    : null;
  const esBar = progress
    ? progress.create(maxThroughput, 0, { title: "ES Ingest" })
    : null;

  const updateFirehose = (docsPerSecond: number) => {
    if (!progress) return;
    maxThroughput = Math.max(docsPerSecond, maxThroughput);
    firehoseBar?.start(maxThroughput, docsPerSecond, { title: "Firehose " });
  };

  const updateEs = (docsPerSecond: number) => {
    if (!progress) return;
    maxThroughput = Math.max(docsPerSecond, maxThroughput);
    esBar?.start(maxThroughput, docsPerSecond, { title: "ES Ingest" });
  };

  const firehoseStream = new FirehoseStream({
    logger,
    onDocsPerSecond: updateFirehose,
    firehoseOptions: options.firehoseOptions,
  });

  const esTransformer = await transformer({
    targetClientConfig: {
      node: config.esNode,
      tls: { rejectUnauthorized: config.rejectUnauthorized },
    },
    targetIndexName: config.indexName,
    stream: firehoseStream,
    bufferSize: config.bufferSizeKb,
    mappings: options.mappings ?? defaultMappings,
    pipeline: config.pipeline,
  });

  if (esTransformer?.events?.on) {
    esTransformer.events.on("docsPerSecond", updateEs);
  }

  return { config, esTransformer, firehoseStream };
}
