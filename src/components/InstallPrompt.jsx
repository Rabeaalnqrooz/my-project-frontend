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

    // إذا كان يعمل كتطبيق مثبت، نلغي إظهار البنر نهائياً!
    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 🛡️ 2. التحقق مما إذا كان المستخدم قد أغلق البنر سابقاً في هذه الجلسة
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
    // حفظ رغبة المستخدم في عدم رؤية البنر طوال فترة فتح المتصفح الحالية
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 bg-gray-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-gray-800 flex items-center justify-between gap-3 dir-rtl">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="text-2xl shrink-0">📲</span>
        <div className="min-w-0">
          <h4 className="font-bold text-xs text-gray-100 truncate">
            تطبيق متجر جوليا
          </h4>
          <p className="text-[10px] text-gray-400 truncate">
            تصفح أسرع وتجربة أفضل
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          تثبيت
        </button>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white p-1 text-xs cursor-pointer"
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
