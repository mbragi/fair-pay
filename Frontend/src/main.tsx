import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { ThirdwebProvider } from "../node_modules/thirdweb/dist/types/exports/react.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  </StrictMode>
);
