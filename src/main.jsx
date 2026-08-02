import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";

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

// ⚡ 2. تهيئة Google Analytics الآمنة بدون إثقال الـ Main Thread
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
  let timerId = null;
  const userEvents = ["touchstart", "scroll", "click", "mousemove"];

  const cleanupEvents = () => {
    userEvents.forEach((evt) => window.removeEventListener(evt, triggerGA));
    if (timerId) clearTimeout(timerId);
  };

  const initGA = () => {
    if (window.gaInitialized) return;
    window.gaInitialized = true;
    cleanupEvents();

    // 🚀 جلب آمن ومباشر لدالة initialize من الحزمة الديناميكية
    import("react-ga4")
      .then((gaModule) => {
        const ReactGA = gaModule.default || gaModule;
        if (ReactGA && typeof ReactGA.initialize === "function") {
          ReactGA.initialize(GA_MEASUREMENT_ID);
        }
      })
      .catch((err) => console.error("GA Load Error:", err));
  };

  const triggerGA = () => {
    initGA();
  };

  // تسجيل مستمعي الأحداث التفاعلية
  userEvents.forEach((evt) =>
    window.addEventListener(evt, triggerGA, { passive: true, once: true }),
  );

  // Fallback مؤجل بعد 4.5 ثوانٍ
  window.addEventListener("load", () => {
    timerId = setTimeout(initGA, 4500);
  });
}

// ⚡ 3. تسجيل Service Worker بعد اكتمال رندر الصفحة بـ 3 ثوانٍ
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW Registered!", reg);
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  window.location.reload();
                }
              };
            }
          };
        })
        .catch((err) => console.log("SW Registration Error!", err));
    }, 3000);
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
