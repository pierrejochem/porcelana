import { copyFileSync } from "node:fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime"],
  banner: { js: '"use client";' },
  onSuccess: async () => {
    copyFileSync("src/styles/porcelana.css", "dist/styles.css");
  }
});
