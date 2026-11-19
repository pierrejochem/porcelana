import { Badge, Breadcrumb } from "@porcelana/ui";
import type { DocEntry } from "../docs/registry";
import { CodeBlock } from "./CodeBlock";
import { PropsTable } from "./PropsTable";

export function DocPage({ doc, base }: { doc: DocEntry; base: string }) {
  const Example = doc.example;
  const imports = doc.props.filter((p) => /^[A-Z]/.test(p)).join(", ");
  return (
    <article className="docs-article">
      <Breadcrumb aria-label="Docs location" items={[{ label: "Porcelana", href: base }, { label: doc.group }, { label: doc.name }]} />
      <header className="docs-head">
        <h1>{doc.name}</h1>
        <p className="docs-lead">{doc.summary}</p>
        <div className="docs-meta">
          <Badge tone="primary">{doc.group}</Badge>
          {doc.radix ? (
            <a href={doc.radix} className="docs-link" rel="noopener">
              Radix primitive ↗
            </a>
          ) : null}
        </div>
      </header>

      <section aria-labelledby="example">
        <h2 id="example">Example</h2>
        <div className="docs-stage">
          <Example />
        </div>
        <CodeBlock code={doc.code} label="Example.tsx" />
      </section>

      <section aria-labelledby="import">
        <h2 id="import">Import</h2>
        <CodeBlock code={`import { ${imports} } from "@porcelana/ui";\nimport "@porcelana/ui/styles.css"; // once, at your app root`} label="Import" />
      </section>

      <section aria-labelledby="props">
        <h2 id="props">Props</h2>
        <p className="docs-muted">Generated from the TypeScript types. Standard HTML attributes are passed through and not listed.</p>
        {doc.props.map((name) => (
          <PropsTable key={name} component={name} />
        ))}
      </section>

      <section aria-labelledby="a11y">
        <h2 id="a11y">Accessibility</h2>
        <ul className="docs-list">
          {doc.a11y.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {doc.mobile.length ? (
        <section aria-labelledby="mobile">
          <h2 id="mobile">Mobile</h2>
          <ul className="docs-list">
            {doc.mobile.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
