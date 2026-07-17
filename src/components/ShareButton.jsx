// frontend/src/components/ShareButton.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Share2, Copy, Check, Send } from "lucide-react";

function ShareButton() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isRTL = i18n.language.startsWith("ar");

  // بيانات المشاركة
  const shareData = {
    title: isRTL ? "متجر جوليا" : "Julia Store",
    text: isRTL
      ? "تسوّق الآن من متجر جوليا! أقوى العروض والخصومات في الأردن."
      : "Shop now at Julia Store! The best offers and discounts in Jordan.",
    url: window.location.origin, // يأخذ رابط الموقع الحالي تلقائياً
  };

  // دالة المشاركة الأساسية (تفتح نافذة المشاركة الرسمية للموبايل)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("تمت المشاركة بنجاح!");
      } catch (err) {
        console.log("تم إلغاء المشاركة أو حدث خطأ:", err);
      }
    } else {
      // إذا كان المتصفح لا يدعم الشير التلقائي (مثل بعض متصفحات الكمبيوتر)، نفتح القائمة البديلة
      setIsOpen(!isOpen);
    }
  };

  // نسخ الرابط يدوياً
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // مشاركة مباشرة عبر الواتساب (محبوبة جداً في الأردن)
  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(`${shareData.text} \n${shareData.url}`);
    window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50`}>
      {/* القائمة البديلة عند عدم دعم الموبايل شير أو عند الضغط بالكمبيوتر */}
      {isOpen && (
        <div className="absolute bottom-16 bg-card border border-border shadow-2xl rounded-2xl p-4 w-64 flex flex-col gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <p className="text-xs font-bold text-muted-foreground mb-1 text-center">
            {isRTL ? "شارك الموقع مع أصدقائك" : "Share with your friends"}
          </p>

          {/* خيار الواتساب */}
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-between w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <span>{isRTL ? "شارك عبر واتساب" : "Share via WhatsApp"}</span>
            <Send className="h-4 w-4" />
          </button>

          {/* خيار نسخ الرابط */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-between w-full px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl text-sm font-medium transition-colors border border-border"
          >
            <span>
              {copied
                ? isRTL
                  ? "تم النسخ!"
                  : "Copied!"
                : isRTL
                  ? "نسخ رابط المتجر"
                  : "Copy Link"}
            </span>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      {/* الزر العائم الرئيسي */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none"
        title={isRTL ? "شارك مع صديق" : "Share with a friend"}
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ShareButton;
