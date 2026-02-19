export interface Atproto2ElasticsearchConfig {
  esNode: string;
  indexName: string;
  bufferSizeKb: number;
  rejectUnauthorized: boolean;
  pipeline?: string;
  logLevel: string;
  progress: boolean;
}

export const DEFAULT_CONFIG: Atproto2ElasticsearchConfig = {
  esNode: "http://localhost:9200",
  indexName: "bluesky-firehose-ner-0001",
  bufferSizeKb: 5120,
  rejectUnauthorized: false,
  pipeline: undefined,
  logLevel: "info",
  progress: true,
};

const TRUE_VALUES = new Set(["1", "true", "yes", "on"]);
const FALSE_VALUES = new Set(["0", "false", "no", "off"]);

export function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (TRUE_VALUES.has(normalized)) return true;
  if (FALSE_VALUES.has(normalized)) return false;
  return fallback;
}

export function parsePositiveInt(
  value: string | undefined,
  fallback: number
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export function loadConfig(
  env: NodeJS.ProcessEnv = process.env
): Atproto2ElasticsearchConfig {
  return {
    esNode: env.ES_NODE ?? DEFAULT_CONFIG.esNode,
    indexName: env.ES_INDEX ?? DEFAULT_CONFIG.indexName,
    bufferSizeKb: parsePositiveInt(
      env.ES_BUFFER_KB,
      DEFAULT_CONFIG.bufferSizeKb
    ),
    rejectUnauthorized: parseBoolean(
      env.ES_TLS_REJECT_UNAUTHORIZED,
      DEFAULT_CONFIG.rejectUnauthorized
    ),
    pipeline: env.ES_PIPELINE || undefined,
    logLevel: env.LOG_LEVEL ?? DEFAULT_CONFIG.logLevel,
    progress: parseBoolean(env.PROGRESS, DEFAULT_CONFIG.progress),
  };
}
