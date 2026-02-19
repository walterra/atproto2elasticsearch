# Performance

Performance depends on Elasticsearch throughput, network latency, and the rate of incoming firehose traffic.

## Characteristics

- Streaming ingestion with backpressure handled by `node-es-transformer`
- Bulk indexing tuned by `ES_BUFFER_KB`
- CPU and memory usage scale with event volume

## Benchmarks

Formal benchmarks are not yet published. If you have production measurements, please open an issue so they can be documented.
