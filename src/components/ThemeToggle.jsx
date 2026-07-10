// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
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
      className="relative p-2.5 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm text-foreground hover:bg-muted hover:text-primary transition-all duration-300 shadow-sm cursor-pointer flex items-center justify-center group overflow-hidden"
      title={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"}
    >
      {/* أيقونة الشمس (تظهر وتدور بسلاسة عند تفعيل الدارك مود) */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-amber-500
      ${theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0 absolute"}
    `}
      />

      {/* أيقونة القمر (تظهر وتتحرك بسلاسة عند تفعيل اللايت مود) */}
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 text-indigo-500 group-hover:rotate-12
      ${theme === "dark" ? "-rotate-90 scale-0 absolute" : "rotate-0 scale-100"}
    `}
      />

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}

export default ThemeToggle;
