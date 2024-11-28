import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <App />
    </StyledEngineProvider>
  </StrictMode>,
);
