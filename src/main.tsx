import "./sentry"; // STORY-189-03: must run before React mounts so global handlers register early.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
