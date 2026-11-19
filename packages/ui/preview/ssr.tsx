// Server entry used at build time to prerender every page to static HTML.
import { renderToString } from "react-dom/server";
import { Site, pages, SITE_URL } from "./site/Site";

export { pages, SITE_URL };

export function render(path: string, base: string): string {
  return renderToString(<Site path={path} base={base} />);
}
