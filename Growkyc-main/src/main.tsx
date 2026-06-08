import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { ErrorBoundary } from "./app/components/ui/error-boundary";
// @ts-ignore: CSS module import without type declarations
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

if (typeof window !== "undefined") {
  void import("./lib/config/startupProductionReadiness.ts").then(
    ({ runStartupProductionReadinessValidation }) => {
      runStartupProductionReadinessValidation();
    }
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);