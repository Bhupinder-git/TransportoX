import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./app/router";
import { AuthProvider } from "./auth/AuthContext";
import "./styles.css";
import "./user.css";
import "./workflow.css";
import "./currency.css";
import "./driver.css";
import "./dashboard-extra.css";
import "./role-layout.css";
import "./scoped-fleet.css";
import "./polish.css";
import "./driver-logout.css";
import "./notification-icon.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
