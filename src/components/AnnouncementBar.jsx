// frontend/src/components/AnnouncementBar.jsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Volume2, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";

function AnnouncementBar() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState("");

  // البيانات الخاصة بالإعلانات والعروض (يمكنك تعديل الأكواد والروابط هنا بسهولة)
  const announcements = [
    {
      id: "noon",
      textAr: "خصم إضافي على منتجات نون الأردن! استخدم كود:",
      textEn: "Extra discount on Noon Jordan! Use code:",
      code: "JULIA",
      link: "https://s.noon.com/WNjhdJnqrko",
      bgColor: "bg-yellow-500",
      textColor: "text-black",
    },
    {
      id: "iherb",
      textAr: "وفّر على الفيتامينات ومنتجات العناية من iHerb الأردن بكود:",
      textEn: "Save on vitamins & skincare from iHerb Jordan! Code:",
      code: "KRL2470", // 👈 استبدل هذا بكود آي هيرب الخاص بك لاحقاً
      link: "https://www.iherb.com/?rcode=KRL2470", // 👈 يمكنك وضع رابط الأفلييت الذكي الخاص بك هنا
      bgColor: "bg-[#457c14] dark:bg-[#34610f]", // لون آي هيرب العشبي المميز
      textColor: "text-white",
    },
  ];

  // التغيير التلقائي للإعلانات كل 4 ثوانٍ
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  // دالة نسخ الكود بضغطة زر
  const handleCopy = (e, code) => {
    e.stopPropagation(); // منع الانتقال للرابط عند الضغط على زر النسخ
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000); // إخفاء علامة الصح بعد ثانيتين
  };

  const current = announcements[currentIndex];
  const isRTL = i18n.language.startsWith("ar");

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(
      (prev) => (prev - 1 + announcements.length) % announcements.length,
    );
  };

  return (
    <div
      onClick={() => window.open(current.link, "_blank")}
      className={`w-full ${current.bgColor} ${current.textColor} py-2.5 px-4 text-center cursor-pointer select-none transition-all duration-500 relative z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm font-medium">
        {/* زر التنقل الأيسر */}
        <button
          onClick={isRTL ? handleNext : handlePrev}
          className="p-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none shrink-0"
          aria-label="Previous Announcement"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* محتوى الإعلان الأوسط */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 transition-all duration-500 animate-in fade-in zoom-in-95 duration-300">
          <Volume2 className="h-4 w-4 animate-bounce hidden xs:block" />
          <span>{isRTL ? current.textAr : current.textEn}</span>

          {/* كبسولة كود الخصم الفعالة */}
          <div
            onClick={(e) => handleCopy(e, current.code)}
            className="inline-flex items-center gap-1.5 bg-black/15 hover:bg-black/25 dark:bg-white/15 dark:hover:bg-white/25 px-2.5 py-1 rounded-md font-mono font-bold tracking-wider transition-all duration-200 border border-current/10"
          >
            <span>{current.code}</span>
            {copiedCode === current.code ? (
              <Check className="h-3.5 w-3.5 text-green-400 dark:text-green-300 animate-scale" />
            ) : (
              <Copy className="h-3.5 w-3.5 opacity-80" />
            )}
          </div>
        </div>

        {/* زر التنقل الأيمن */}
        <button
          onClick={isRTL ? handlePrev : handleNext}
          className="p-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none shrink-0"
          aria-label="Next Announcement"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
