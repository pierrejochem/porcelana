// Bundles the preview gallery into preview/dist. Usage: pnpm --filter @porcelana/ui preview
import { build, context } from "esbuild";
import { copyFileSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");
mkdirSync(out, { recursive: true });
copyFileSync(join(here, "index.html"), join(out, "index.html"));
// Static assets: favicon, social image, sitemap.
if (existsSync(join(here, "public"))) cpSync(join(here, "public"), out, { recursive: true });

const options = {
  entryPoints: { app: join(here, "main.tsx") },
  outdir: out,
  bundle: true,
  format: "esm",
  jsx: "automatic",
  minify: true,
  sourcemap: true,
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info"
};

if (process.argv.includes("--serve")) {
  const ctx = await context(options);
  const { port } = await ctx.serve({ servedir: out, port: 5173 });
  console.log(`Preview on http://localhost:${port}`);
} else {
  await build(options);
}
