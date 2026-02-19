import type { Mappings } from "node-es-transformer";

export type ElasticsearchMappings = Mappings;

export const defaultMappings: ElasticsearchMappings = {
  properties: {
    repo: { type: "keyword" },
    path: { type: "keyword" },
    uri: { type: "keyword" },
    url: { type: "keyword" },
    timestamp: { type: "date" },
    record: { type: "object", enabled: true },
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
};
