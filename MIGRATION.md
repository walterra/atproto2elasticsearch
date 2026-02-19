# Migration

## From 1.0.0-alpha to 1.0.0

No breaking changes are planned for the CLI. The following additions are available in the stable release:

- Optional environment variables: `ES_TLS_REJECT_UNAUTHORIZED`, `ES_PIPELINE`, `LOG_LEVEL`, `PROGRESS`
- Programmatic API exports (`startIngestion`, `loadConfig`, `defaultMappings`)
- Documented default index mappings

If you are already running the CLI, no action is required unless you want to use the new options.
