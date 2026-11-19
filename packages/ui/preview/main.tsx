import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { Site } from "./site/Site";
import "../src/styles/porcelana.css";
import "./site/site.css";

// Each prerendered page tells the client which route it is and how to reach the site root.
const { page = "", base = "./" } = document.body.dataset;

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <Site path={page} base={base} />
  </StrictMode>
);
