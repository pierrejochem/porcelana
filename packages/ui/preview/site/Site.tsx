import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Switch,
  ThemeProvider,
  Toaster,
  ToggleGroup,
  ToggleGroupItem,
  type SurfaceName
} from "@porcelana/ui";
import { MenuIcon } from "@porcelana/icons";
import { docs, findDoc, groups } from "../docs/registry";
import { Gallery } from "../Gallery";
import { DocPage } from "./DocPage";
import { GettingStarted, Icons, Theming } from "./Guides";

export const SITE_URL = "https://pierrejochem.github.io/porcelana/";

export interface PageMeta {
  path: string; // "" for the gallery, "components/button/" etc.
  title: string;
  description: string;
  section?: string;
}

const guides = [
  { slug: "getting-started", name: "Getting started", description: "Install @porcelana/ui, add the stylesheet and a ThemeProvider, and start using accessible Radix-based React components." },
  { slug: "theming", name: "Theming", description: "Every Porcelana color, shadow, radius and spacing value is a CSS variable. Full light and night token reference." },
  { slug: "icons", name: "Icons", description: "Browse and copy the 51 tree-shakable, accessible stroke icons in @porcelana/icons." }
];

/** Every page the site renders, used for routing, prerendering and the sitemap. */
export const pages: PageMeta[] = [
  {
    path: "",
    title: "Porcelana: accessible, mobile-ready React components on Radix UI",
    description:
      "Open-source React component library on Radix UI: 35+ accessible, touch-friendly TypeScript components with light and night themes, data table and 51 icons."
  },
  ...guides.map((g) => ({ path: `guides/${g.slug}/`, title: `${g.name} · Porcelana`, description: g.description, section: "Guides" })),
  ...docs.map((d) => ({
    path: `components/${d.slug}/`,
    title: `${d.name}: accessible React component · Porcelana`,
    description: `${d.summary} Built on Radix UI, typed, mobile-ready. Props, examples and accessibility notes.`.slice(0, 300),
    section: "Components"
  }))
];

function Nav({ path, base, onNavigate }: { path: string; base: string; onNavigate?: () => void }) {
  const link = (href: string, label: string) => (
    <li key={href}>
      <a href={`${base}${href}`} className="docs-nav-link" aria-current={path === href ? "page" : undefined} onClick={onNavigate}>
        {label}
      </a>
    </li>
  );
  return (
    <nav aria-label="Documentation" className="docs-nav">
      <ul>{link("", "Gallery")}</ul>
      <h2 className="docs-nav-title">Guides</h2>
      <ul>{guides.map((g) => link(`guides/${g.slug}/`, g.name))}</ul>
      {groups.map((group) => (
        <div key={group}>
          <h2 className="docs-nav-title">{group}</h2>
          <ul>{docs.filter((d) => d.group === group).map((d) => link(`components/${d.slug}/`, d.name))}</ul>
        </div>
      ))}
    </nav>
  );
}

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

function SurfaceSwitch({ surface, onChange, className }: { surface: SurfaceName; onChange: (s: SurfaceName) => void; className?: string }) {
  return (
    <ToggleGroup
      type="single"
      aria-label="Surface"
      value={surface}
      onValueChange={(v) => v && onChange(v as SurfaceName)}
      className={className}
    >
      <ToggleGroupItem value="porcelain">Porcelain</ToggleGroupItem>
      <ToggleGroupItem value="white">White</ToggleGroupItem>
    </ToggleGroup>
  );
}

export function Site({ path, base }: { path: string; base: string }) {
  const [night, setNight] = useState(false);
  const [surface, setSurface] = useState<SurfaceName>("porcelain");
  const [menuOpen, setMenuOpen] = useState(false);
  // Read stored choices after hydration so server and client markup match.
  useEffect(() => {
    setNight(readStored("pl-theme") === "night");
    setSurface(readStored("pl-surface") === "white" ? "white" : "porcelain");
  }, []);
  const toggleTheme = (v: boolean) => {
    setNight(v);
    store("pl-theme", v ? "night" : "light");
  };
  const changeSurface = (v: SurfaceName) => {
    setSurface(v);
    store("pl-surface", v);
  };

  let content: ReactNode;
  if (path === "") content = <Gallery base={base} />;
  else if (path === "guides/getting-started/") content = <GettingStarted base={base} />;
  else if (path === "guides/theming/") content = <Theming />;
  else if (path === "guides/icons/") content = <Icons />;
  else {
    const doc = findDoc(path.replace(/^components\//, "").replace(/\/$/, ""));
    content = doc ? <DocPage doc={doc} base={base} /> : <p>Page not found.</p>;
  }

  return (
    <ThemeProvider theme={night ? "night" : "light"} surface={surface} className="docs-shell">
      <a href="#content" className="docs-skip">
        Skip to content
      </a>
      <header className="docs-topbar">
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <IconButton aria-label="Open navigation" variant="ghost" className="docs-menu-btn">
              <MenuIcon size={22} />
            </IconButton>
          </DialogTrigger>
          <DialogContent className="docs-menu-sheet" aria-describedby={undefined}>
            <DialogTitle>Porcelana</DialogTitle>
            <SurfaceSwitch surface={surface} onChange={changeSurface} className="pl-toggle-group--block" />
            <Nav path={path} base={base} onNavigate={() => setMenuOpen(false)} />
          </DialogContent>
        </Dialog>
        <a href={base} className="docs-brand">
          <img src={`${base}favicon.svg`} alt="" width={32} height={32} />
          <span>Porcelana</span>
        </a>
        <div className="docs-topbar-end">
          <a className="docs-link docs-hide-sm" href={`${base}guides/getting-started/`}>
            Docs
          </a>
          <a className="docs-link docs-hide-sm" href="https://github.com/pierrejochem/porcelana" rel="noopener">
            GitHub
          </a>
          <a className="docs-link docs-hide-sm" href="https://www.npmjs.com/package/@porcelana/ui" rel="noopener">
            npm
          </a>
          <SurfaceSwitch surface={surface} onChange={changeSurface} className="docs-hide-sm" />
          <Switch aria-label="Night theme" checked={night} onCheckedChange={toggleTheme} />
        </div>
      </header>
      <div className="docs-body">
        <aside className="docs-sidebar">
          <Nav path={path} base={base} />
        </aside>
        <main id="content" className="docs-main" tabIndex={-1}>
          {content}
          <footer className="docs-footer">
            MIT © Pierre Jochem · <a href="https://github.com/pierrejochem/porcelana">Source on GitHub</a>
          </footer>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
