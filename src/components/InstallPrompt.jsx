import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // استيراد i18n للترجمة

const InstallPrompt = () => {
  const { t, i18n } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);

  // معرفة اتجاه اللغة بناءً على اللغة الحالية
  const isRtl = i18n.language?.startsWith("ar");

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

    // 🍎 3. فحص هل الجهاز هو أيفون / أيباد (iOS)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);

    if (isIos) {
      setIsIosDevice(true);
      setIsVisible(true);
    }

    // 🤖 4. التعامل مع أحداث أندرويد وكروم
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
    if (isIosDevice) {
      // إظهار تعليمات التثبيت للأيفون حسب اللغة المختارة
      alert(t("pwa.iosInstructions"));
      return;
    }

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
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed bottom-20 sm:bottom-4 left-3 right-3 sm:right-auto sm:max-w-md z-40 bg-gray-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-gray-800/80 flex items-center justify-between gap-3 transition-all duration-300"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20">
          <span className="text-xl">📲</span>
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-gray-100 truncate">
            {t("pwa.title")}
          </h4>
          <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
            {isIosDevice ? t("pwa.iosSub") : t("pwa.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
        >
          {isIosDevice ? t("pwa.howToInstall") : t("pwa.install")}
        </button>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white p-1 text-xs cursor-pointer rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label={t("pwa.close")}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
