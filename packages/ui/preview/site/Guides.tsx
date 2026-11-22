/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- scrollable code and tables must be keyboard-focusable to scroll (WCAG 2.1.1) */
import { useState } from "react";
import { Badge, Input, toast } from "@porcelana/ui";
import { Icon, iconPaths, SearchIcon, type IconName } from "@porcelana/icons";
import tokens from "../generated/tokens.json";
import { CodeBlock } from "./CodeBlock";

export function GettingStarted({ base }: { base: string }) {
  return (
    <article className="docs-article">
      <header className="docs-head">
        <h1>Getting started</h1>
        <p className="docs-lead">Install Porcelana, add the stylesheet once, and wrap your app in a ThemeProvider.</p>
      </header>

      <section aria-labelledby="install">
        <h2 id="install">1. Install</h2>
        <CodeBlock code="npm install @porcelana/ui @porcelana/icons" label="Terminal" />
        <p>
          Peer dependencies: React 18 or 19. Works with Next.js (the bundle ships <code>"use client"</code>), Vite and Remix. No Tailwind
          needed.
        </p>
      </section>

      <section aria-labelledby="styles">
        <h2 id="styles">2. Add the styles and a theme</h2>
        <CodeBlock
          label="App.tsx"
          code={`import "@porcelana/ui/styles.css";
import { ThemeProvider, Toaster } from "@porcelana/ui";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme="system">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}`}
        />
        <p>
          Optional fonts: the design uses <strong>Outfit</strong> and <strong>Barlow Condensed</strong> (numerals). Load them from Google
          Fonts or Fontsource; system fonts are the fallback.
        </p>
      </section>

      <section aria-labelledby="use">
        <h2 id="use">3. Use components</h2>
        <CodeBlock
          label="Settings.tsx"
          code={`import { Field, Input, Slider, Switch, Button, toast } from "@porcelana/ui";

export function Settings() {
  return (
    <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Saved" }); }}>
      <Field label="Alarm label"><Input defaultValue="Morning run" /></Field>
      <Switch label="Alarm" description="Weekdays at 06:00" defaultChecked />
      <Slider label="Volume" defaultValue={[62]} showValue formatValue={(v) => \`\${v}%\`} />
      <Button type="submit">Save</Button>
    </form>
  );
}`}
        />
        <p>
          Every component has a page with a live example and its props. Start with <a href={`${base}components/button/`}>Button</a> or{" "}
          <a href={`${base}components/data-table/`}>DataTable</a>.
        </p>
      </section>

      <section aria-labelledby="testing">
        <h2 id="testing">Testing your app</h2>
        <p>
          Components render in jsdom with Testing Library. Radix needs a few browser APIs that jsdom lacks (ResizeObserver, matchMedia,
          pointer capture); copy the stubs from <code>packages/ui/src/test/setup.ts</code> in the repo.
        </p>
      </section>
    </article>
  );
}

interface Token {
  name: string;
  light: string;
  white: string | null;
  night: string | null;
}

const isColor = (v: string) => /^#|^rgba?\(/.test(v.trim());

export function Theming() {
  const list = tokens as Token[];
  const groups: [string, (t: Token) => boolean][] = [
    ["Colors", (t) => isColor(t.light) && !t.name.includes("shadow")],
    ["Shadows", (t) => t.name.includes("shadow")],
    ["Radius, spacing and sizing", (t) => /radius|space|target/.test(t.name)],
    ["Type and motion", (t) => /font|ease|duration/.test(t.name)]
  ];
  return (
    <article className="docs-article">
      <header className="docs-head">
        <h1>Theming</h1>
        <p className="docs-lead">
          Every color, shadow, radius and spacing value is a CSS variable. Override them on <code>:root</code> or{" "}
          <code>[data-theme="night"]</code>.
        </p>
      </header>
      <CodeBlock
        label="brand.css"
        code={`:root {
  --pl-primary: #0a7d5a;
  --pl-primary-hover: #086b4d;
  --pl-primary-text: #0a7d5a;
}
[data-theme="night"] {
  --pl-primary: #19a77a;
  --pl-primary-text: #7fe0bd;
}`}
      />
      <h2>White surface</h2>
      <p>
        The default <strong>porcelain</strong> look relies on a light grey page for its soft, pressed shadows. On a pure white page those highlights
        disappear, so use <code>surface="white"</code>: raised elements get a hairline edge and a soft drop shadow, recessed ones become light grey
        wells. It applies to the light theme; night stays as it is.
      </p>
      <CodeBlock
        label="App.tsx"
        code={`<ThemeProvider theme="system" surface="white">
  <App />
</ThemeProvider>

/* or without React: <html data-surface="white"> */`}
      />
      <p>
        Keep text tokens at 4.5:1 contrast against their surfaces. Overriding <code>--pl-primary</code> doesn't change{" "}
        <code>--pl-primary-text</code>, so set both.
      </p>
      {groups.map(([title, test]) => {
        const rows = list.filter(test);
        if (!rows.length) return null;
        const id = title.toLowerCase().replace(/\W+/g, "-");
        return (
          <section key={title} aria-labelledby={id}>
            <h2 id={id}>{title}</h2>
            <div className="docs-table-wrap" role="region" aria-label={`${title} tokens`} tabIndex={0}>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Light</th>
                    <th scope="col">White surface</th>
                    <th scope="col">Night</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => (
                    <tr key={t.name}>
                      <th scope="row" data-label="Token">
                        <code>{t.name}</code>
                      </th>
                      {[t.light, t.white, t.night].map((v, i) => (
                        <td key={i} data-label={["Light", "White surface", "Night"][i]}>
                          {v ? (
                            <span className="docs-token">
                              {isColor(v) ? <span className="docs-swatch" style={{ background: v }} aria-hidden="true" /> : null}
                              <code>{v}</code>
                            </span>
                          ) : (
                            <span className="docs-muted">same</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </article>
  );
}

export function Icons() {
  const [q, setQ] = useState("");
  const names = (Object.keys(iconPaths) as IconName[]).filter((n) => n.includes(q.trim().toLowerCase()));
  const pascal = (n: string) => n.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join("") + "Icon";
  const copy = async (n: string) => {
    try {
      await navigator.clipboard.writeText(`<${pascal(n)} />`);
      toast({ title: `Copied <${pascal(n)} />`, tone: "neutral", duration: 2000 });
    } catch {
      /* ignore */
    }
  };
  return (
    <article className="docs-article">
      <header className="docs-head">
        <h1>Icons</h1>
        <p className="docs-lead">
          {Object.keys(iconPaths).length} round-cap stroke icons on a 24px grid in <code>@porcelana/icons</code>. Decorative by default; pass{" "}
          <code>title</code> to announce one.
        </p>
      </header>
      <CodeBlock
        label="Usage"
        code={`import { AlarmIcon, Icon } from "@porcelana/icons";

<AlarmIcon />                              // decorative (aria-hidden)
<AlarmIcon title="Alarm set" size={20} />  // announced as an image
<Icon name="chevron-down" strokeWidth={1.5} />`}
      />
      <div style={{ maxWidth: 360 }}>
        <Input
          type="search"
          aria-label="Filter icons"
          placeholder="Filter icons"
          icon={<SearchIcon size={18} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <p className="docs-muted" role="status">
        {names.length} icons{q ? ` matching “${q}”` : ""}. Click one to copy its JSX.
      </p>
      <ul className="docs-icons">
        {names.map((n) => (
          <li key={n}>
            <button type="button" onClick={() => copy(n)} aria-label={`Copy ${n} icon`}>
              <Icon name={n} size={24} />
              <span aria-hidden="true">{n}</span>
            </button>
          </li>
        ))}
      </ul>
      <p>
        <Badge tone="neutral">Tree-shakable</Badge> Import named components (<code>AlarmIcon</code>) to bundle only what you use;{" "}
        <code>&lt;Icon name&gt;</code> bundles every path.
      </p>
    </article>
  );
}
