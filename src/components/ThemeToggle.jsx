// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";

function ThemeToggle() {
  // 1. قراءة الثيم المخزن سابقاً في المتصفح، أو اعتماد "light" كوضع افتراضي
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // الوصول إلى العنصر الرئيسي للموقع <html>
    const root = window.document.documentElement;

    // تطبيق كلاس .dark بناءً على حالة الـ state وحفظ الخيار في الـ localStorage
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]); // الكود سيعمل تلقائياً كلما ضغطنا على الزر وتغيرت قيمة theme

  // دالة التبديل بين الليل والنهار عند الضغط
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      // كلاسات متوافقة مع ألوان Shadcn المتغيرة تلقائياً ومظهر أنيق ودائري للزر
      className="p-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center"
      title={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"}
    >
      {/* عرض الأيقونة المناسبة حسب الثيم الحالي */}
      {theme === "dark" ? (
        <span role="img" aria-label="sun" className="text-xl">
          ☀️
        </span>
      ) : (
        <span role="img" aria-label="moon" className="text-xl">
          🌙
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
