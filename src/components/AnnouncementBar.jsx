import React, { useState } from "react";
import { Check, Copy, Tag } from "lucide-react"; // تأكد من تثبيت lucide-react للحصول على الأيقونات، أو استبدلها بأيقونات SVG عادية

const AnnouncementBar = () => {
  const [copied, setCopied] = useState(false);
  const couponCode = "JULIA"; // 👈 ضع كود خصم نون الخاص بك هنا

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      // إرجاع الزر لحالته الطبيعية بعد ثانيتين
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-900 px-4 py-2 text-center text-xs md:text-sm font-medium shadow-sm flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 transition-all duration-300">
      {/* نص العرض */}
      <div className="flex items-center gap-1.5 justify-center">
        <Tag className="h-4 w-4 animate-pulse text-amber-950" />
        <span>
          خصم إضافي حتى 10% على جميع منتجات <strong>نون</strong> الأردن! استخدم
          الكود عند الدفع:
        </span>
      </div>

      {/* زر نسخ الكود الذكي */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-yellow-400 rounded-full hover:bg-neutral-800 active:scale-95 transition-all text-xs font-bold border border-transparent shadow-sm focus:outline-none"
      >
        <span>{couponCode}</span>
        {copied ? (
          <span className="flex items-center gap-1 text-emerald-400">
            <Check className="h-3 w-3" />
            تم النسخ!
          </span>
        ) : (
          <Copy className="h-3 w-3 text-neutral-400 hover:text-yellow-400" />
        )}
      </button>
    </div>
  );
};

export default AnnouncementBar;
