import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";
// ❌ تم إزالة import ReactGA المباشر لمنع انتفاخ الـ Bundle وتجميد الـ Main Thread

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

// ⚡ 2. تهيئة Google Analytics باستخدام Dynamic Import لتوفير الـ Main Thread 100%
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID && typeof window !== "undefined") {
  const initGA = () => {
    if (window.gaInitialized) return;
    window.gaInitialized = true;

    // 🚀 استدعاء ديناميكي للمكتبة بدون إثقال الصفحة عند الإقلاع
    import("react-ga4").then((ReactGA) => {
      ReactGA.default.initialize(GA_MEASUREMENT_ID);
    });
  };

  // تحميل GA عند أول تفاعل من المستخدم أو بعد 4.5 ثوانٍ تلقائياً
  const userEvents = ["touchstart", "scroll", "click", "mousemove"];
  const triggerGA = () => {
    initGA();
    userEvents.forEach((evt) => window.removeEventListener(evt, triggerGA));
  };

  userEvents.forEach((evt) =>
    window.addEventListener(evt, triggerGA, { passive: true, once: true }),
  );

  window.addEventListener("load", () => {
    setTimeout(initGA, 4500);
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
