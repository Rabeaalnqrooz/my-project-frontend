import React, { useState, useEffect } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 🛡️ 1. التحقق مما إذا كان التطبيق مفتوحاً بالفعل كـ PWA مثبت
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 🛡️ 2. عدم إظهاره إذا أغلقه المستخدم سابقاً
    const isDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      sessionStorage.setItem("pwa_prompt_dismissed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    /* 🎯 تحسين الموقع: max-w-md لتقييد العرض على الشاشات الكبيرة + sm:left-4 وضبط z-index */
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-40 bg-gray-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-gray-800/80 flex items-center justify-between gap-3 dir-rtl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
          <span className="text-xl">📲</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs md:text-sm text-gray-100 truncate">
            تطبيق متجر جوليا
          </h4>
          <p className="text-[11px] text-gray-400 truncate">
            تصفح أسرع وتجربة أفضل
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          تثبيت
        </button>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white p-1 text-xs cursor-pointer rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
