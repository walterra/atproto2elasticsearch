const esbuild = require("esbuild");

const shared = {
  platform: "node",
  target: "node22",
  sourcemap: true,
  logLevel: "info",
  format: "cjs",
};

Promise.all([
  esbuild.build({
    ...shared,
    entryPoints: ["./src/cli.ts"],
    outfile: "./dist/cli.js",
    bundle: true,
  }),
  esbuild.build({
    ...shared,
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.js",
    bundle: false,
  }),
  esbuild.build({
    ...shared,
    entryPoints: [
      "./src/config.ts",
      "./src/mappings.ts",
      "./src/firehoseStream.ts",
    ],
    outdir: "./dist",
    bundle: false,
  }),
]).catch(() => process.exit(1));
