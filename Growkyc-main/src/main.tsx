import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { ErrorBoundary } from "./app/components/ui/error-boundary";
import { AuthProvider } from "./context/AuthContext";
import { PermissionsProvider } from "./lib/rbac/PermissionsContext";
// @ts-ignore: CSS module import without type declarations
import "./styles/index.css";

// Catch unhandled promise rejections globally so silent failures surface as logs
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (import.meta.env.DEV) {
      console.error("[Unhandled Promise Rejection]", event.reason);
    }
    event.preventDefault();
  });
}

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
        <AuthProvider>
          <PermissionsProvider>
            <App />
          </PermissionsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);