import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
import ReactGA from "react-ga4"; // 1️⃣ استيراد المكتبة
// 2️⃣ جلب المعرّف من ملف الـ .env وتهيئته فوراً
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}
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
