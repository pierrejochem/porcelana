// Builds the docs site into preview/dist: props + tokens metadata, the client bundle,
// and one prerendered HTML file per page (crawlable, works without JavaScript).
// Usage: pnpm --filter @porcelana/ui preview:build   (or `preview` for a local server)
import { build, context } from "esbuild";
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");
const gen = join(here, "generated");
const serve = process.argv.includes("--serve");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
mkdirSync(gen, { recursive: true });

// 1. Metadata: props from the TypeScript types, tokens from the stylesheet.
execFileSync(process.execPath, [join(here, "gen-props.mjs")], { stdio: "inherit" });
writeFileSync(join(gen, "tokens.json"), JSON.stringify(readTokens(join(here, "..", "src", "styles", "porcelana.css")), null, 2));

function readTokens(cssPath) {
  const css = readFileSync(cssPath, "utf8");
  const block = (selector) => {
    const start = css.indexOf(selector);
    const open = css.indexOf("{", start);
    const close = css.indexOf("\n}", open);
    const vars = {};
    for (const m of css.slice(open + 1, close).matchAll(/(--pl-[\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim().replace(/\s+/g, " ");
    return vars;
  };
  const light = block('[data-theme="light"]');
  const white = block('[data-surface="white"] {');
  const night = block('[data-theme="night"] {');
  return Object.entries(light).map(([name, value]) => ({ name, light: value, white: white[name] ?? null, night: night[name] ?? null }));
}

// esbuild plugin: `import code from "./File.tsx?raw"` gives the file's text.
const rawPlugin = {
  name: "raw",
  setup(b) {
    b.onResolve({ filter: /\?raw$/ }, (args) => ({ path: join(args.resolveDir, args.path.replace(/\?raw$/, "")), namespace: "raw" }));
    b.onLoad({ filter: /.*/, namespace: "raw" }, (args) => ({ contents: readFileSync(args.path, "utf8"), loader: "text" }));
  }
};

const shared = {
  bundle: true,
  jsx: "automatic",
  plugins: [rawPlugin],
  alias: { "@porcelana/ui": join(here, "..", "src", "index.ts") },
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning"
};

// 2. Server bundle, used only to prerender.
const ssrFile = join(gen, "ssr.mjs");
await build({
  ...shared,
  entryPoints: [join(here, "ssr.tsx")],
  outfile: ssrFile,
  platform: "node",
  format: "esm",
  external: ["react", "react-dom", "react/jsx-runtime"],
  loader: { ".css": "empty" },
  // CommonJS dependencies call require("react"); give the ESM bundle a real require.
  banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' }
});
const { render, pages, SITE_URL } = await import(`${pathToFileURL(ssrFile).href}?t=${Date.now()}`);

// 3. Static assets and one HTML file per page.
if (existsSync(join(here, "public"))) cpSync(join(here, "public"), out, { recursive: true });
const template = readFileSync(join(here, "index.html"), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function fill({ title, description, canonical, base, page, jsonld, body, script = true }) {
  let html = template
    .replaceAll("{{TITLE}}", esc(title))
    .replaceAll("{{DESCRIPTION}}", esc(description))
    .replaceAll("{{CANONICAL}}", canonical)
    .replaceAll("{{BASE}}", base)
    .replaceAll("{{PAGE}}", page)
    .replace("{{JSONLD}}", JSON.stringify(jsonld).replace(/</g, "\\u003c"))
    .replace("{{BODY}}", () => body);
  if (!script) html = html.replace(/\s*<script type="module"[^>]*><\/script>/, "");
  return html;
}

for (const page of pages) {
  const depth = page.path.split("/").filter(Boolean).length;
  const base = depth === 0 ? "./" : "../".repeat(depth);
  const canonical = SITE_URL + page.path;
  const name = page.title.split(":")[0].split(" · ")[0];
  const jsonld = page.path
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Porcelana", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: `${page.section}: ${name}`, item: canonical }
        ]
      }
    : {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: "Porcelana UI",
        description: page.description,
        codeRepository: "https://github.com/pierrejochem/porcelana",
        programmingLanguage: ["TypeScript", "CSS"],
        runtimePlatform: "React",
        license: "https://opensource.org/licenses/MIT",
        author: { "@type": "Person", name: "Pierre Jochem", url: "https://github.com/pierrejochem" }
      };
  const dir = join(out, page.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "index.html"),
    fill({ title: page.title, description: page.description, canonical, base, page: page.path, jsonld, body: render(page.path, base) })
  );
}

writeFileSync(
  join(out, "404.html"),
  fill({
    title: "Page not found · Porcelana",
    description: "This page doesn't exist.",
    canonical: SITE_URL,
    base: "/porcelana/",
    page: "",
    jsonld: {},
    script: false,
    body: '<main style="padding:48px;font-family:system-ui,sans-serif"><h1>Page not found</h1><p><a href="/porcelana/">Go to the Porcelana docs</a></p></main>'
  })
);

writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><changefreq>weekly</changefreq><priority>${p.path ? "0.8" : "1.0"}</priority></url>`)
    .join("\n")}\n</urlset>\n`
);
console.log(`Prerendered ${pages.length} pages`);

// 4. Client bundle (or a dev server).
const clientOptions = {
  ...shared,
  entryPoints: { app: join(here, "main.tsx") },
  outdir: out,
  format: "esm",
  minify: true,
  sourcemap: true
};
if (serve) {
  const ctx = await context(clientOptions);
  const { port } = await ctx.serve({ servedir: out, port: 5173 });
  console.log(`Docs on http://localhost:${port}`);
} else {
  await build(clientOptions);
}
