/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- scrollable code and tables must be keyboard-focusable to scroll (WCAG 2.1.1) */
import { Badge } from "@porcelana/ui";
import propsData from "../generated/props.json";

interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

const data = propsData as Record<string, { description: string; props: PropDoc[] }>;

export function PropsTable({ component }: { component: string }) {
  const entry = data[component];
  if (!entry) return null;
  const id = `props-${component.toLowerCase()}`;
  return (
    <section className="docs-props" aria-labelledby={id}>
      <h3 id={id}>
        <code>{component}</code>
      </h3>
      {entry.description ? <p className="docs-muted">{entry.description}</p> : null}
      {entry.props.length === 0 ? (
        <p className="docs-muted">No props beyond the underlying element's.</p>
      ) : (
        <div className="docs-table-wrap" role="region" aria-label={`${component} props`} tabIndex={0}>
          <table className="docs-table">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {entry.props.map((p) => (
                <tr key={p.name}>
                  <th scope="row" data-label="Prop">
                    <code>{p.name}</code>
                    {p.required ? (
                      <Badge tone="primary" className="docs-required">
                        required
                      </Badge>
                    ) : null}
                  </th>
                  <td data-label="Type">
                    <code className="docs-type">{p.type}</code>
                  </td>
                  <td data-label="Default">{p.defaultValue ? <code>{p.defaultValue}</code> : <span className="docs-muted">–</span>}</td>
                  <td data-label="Description">{p.description || <span className="docs-muted">–</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
