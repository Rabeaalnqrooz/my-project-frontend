import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* أضفنا theme="system" أو "dark"/"light" ليتوافق التنبيه مع ألوان الدارك مود بلمح البصر */}
      <Toaster
        position="top-center"
        richColors
        duration={2000}
        theme="system"
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
);
