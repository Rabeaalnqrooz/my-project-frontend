import React, { useState, useEffect } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

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
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
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
          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
        >
          تثبيت
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white p-1 text-xs"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
