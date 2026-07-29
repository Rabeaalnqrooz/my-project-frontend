import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
import ReactGA from "react-ga4";

// 🛡️ 1. حارس الكاش: يلتقط أخطاء التحميل في متصفح الواتساب ويُنعش الصفحة
window.addEventListener("error", (event) => {
  const isChunkError =
    /Loading chunk/i.test(event.message) ||
    /Failed to fetch dynamically imported module/i.test(event.message) ||
    /Importing a module script failed/i.test(event.message);

  if (isChunkError) {
    window.location.reload();
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const isChunkError =
    event.reason &&
    (/Loading chunk/i.test(event.reason.message) ||
      /Failed to fetch dynamically imported module/i.test(
        event.reason.message,
      ) ||
      /Importing a module script failed/i.test(event.reason.message));

  if (isChunkError) {
    window.location.reload();
  }
});

// 2. تهيئة Google Analytics
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
  window.addEventListener("load", () => {
    setTimeout(() => {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    }, 2500);
  });
}

// ⚡ 3. تسجيل Service Worker مع تحديث تلقائي وفوري للكاش (إلغاء احتجاز الشاشة البيضاء)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("SW Registered!", reg);
        // التحقق من وجود نسخة جديدة وتحديثها فوراً
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // إعادة تحميل الصفحة لتفعيل التحديث الجديد ومسح الشاشة البيضاء
                window.location.reload();
              }
            };
          }
        };
      })
      .catch((err) => console.log("SW Registration Error!", err));
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
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
