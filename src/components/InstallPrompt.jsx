import React, { useState, useEffect } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // منع ظهور البنر الافتراضي المتصفح
      e.preventDefault();
      // حفظ حدث التثبيت لاستدعائه لاحقاً عند النقر
      setDeferredPrompt(e);
      // إظهار البنر المخصص
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // إخفاء البنر فور نجاح التثبيت
    window.addEventListener("appinstalled", () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // إظهار نافذة التثبيت الرسمية للنظام
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-gray-900 text-white p-4 rounded-2xl shadow-2xl z-50 border border-gray-800 transition-all duration-300 dir-rtl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-rose-600 text-white p-2.5 rounded-xl font-bold text-lg flex items-center justify-center">
            📱
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-100">
              تطبيق متجر جوليا
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              ثبّت التطبيق لسرعة التصفح وتجربة أسهل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap shadow-md cursor-pointer"
          >
            تثبيت
          </button>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white p-1 text-sm font-bold transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
