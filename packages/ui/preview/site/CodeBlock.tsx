/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- scrollable code and tables must be keyboard-focusable to scroll (WCAG 2.1.1) */
import { useState } from "react";
import { Button } from "@porcelana/ui";
import { CheckIcon, CopyIcon } from "@porcelana/icons";

export function CodeBlock({ code, label = "Code" }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable: leave the code selectable */
    }
  };
  return (
    <figure className="docs-code">
      <figcaption className="docs-code-bar">
        <span>{label}</span>
        <Button size="sm" variant="ghost" onClick={copy} startIcon={copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </figcaption>
      <pre tabIndex={0}>
        <code>{code.trim()}</code>
      </pre>
    </figure>
  );
}
