const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/firehoseConsumer.ts"], // Entry point of your project
    outfile: "./dist/bundle.js", // Output bundle file
    bundle: true, // Bundle all dependencies
    platform: "node", // Target Node.js environment
    target: "node20", // Node.js version to target
    sourcemap: true, // Generate source maps
    logLevel: "info", // Show build information
  })
  .catch(() => process.exit(1));
