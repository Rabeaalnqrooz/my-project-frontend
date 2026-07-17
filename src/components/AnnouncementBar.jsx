// frontend/src/components/AnnouncementBar.jsx

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Volume2, Copy, Check } from "lucide-react";

function AnnouncementBar() {
  const { i18n } = useTranslation();
  const [copied, setCopied] = useState(false);

  // بيانات إعلان iHerb الخاص بك
  const config = {
    code: "KRL2470",
    link: "https://www.iherb.com/?rcode=KRL2470",
    textAr: "وفّر على الفيتامينات ومنتجات العناية من iHerb الأردن بكود:",
    textEn: "Save on vitamins & skincare from iHerb Jordan! Code:",
  };

  const handleCopy = (e) => {
    e.stopPropagation(); // يمنع فتح الرابط عند النقر على زر النسخ فقط
    navigator.clipboard.writeText(config.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // إعادة شكل الأيقونة بعد ثانيتين
  };

  const isRTL = i18n.language.startsWith("ar");

  return (
    <div
      onClick={() => window.open(config.link, "_blank")}
      className="w-full bg-[#457c14] dark:bg-[#34610f] text-white py-2.5 px-4 text-center cursor-pointer select-none transition-all duration-300 relative z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
        <Volume2 className="h-4 w-4 animate-bounce hidden xs:block" />

        {/* تغيير النص حسب لغة الموقع الحالية */}
        <span>{isRTL ? config.textAr : config.textEn}</span>

        {/* كبسولة كود الخصم الفعالة */}
        <div
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 bg-black/15 hover:bg-black/25 dark:bg-white/15 dark:hover:bg-white/25 px-2.5 py-1 rounded-md font-mono font-bold tracking-wider transition-all duration-200 border border-current/10"
        >
          <span>{config.code}</span>
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-300 animate-scale" />
          ) : (
            <Copy className="h-3.5 w-3.5 opacity-80" />
          )}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBar;
