// src/components/Hero.jsx

import React from "react";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();

  return (
    // 👈 تم تحويل الخلفية لـ bg-background والنصوص لـ text-foreground لتدعم الوضع الداكن تلقائياً
    <section className="bg-background text-foreground relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 px-4 py-20 items-center gap-12">
        {/* المحاذاة الذكية text-start ممتازة هنا وتتحول تلقائياً */}
        <div className="text-start">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
            {/* النص مترجم بالكامل والـ Emoji يفضل وضعه بملف i18n لمنع قفز الاتجاهات */}
            {t("hero_title")} 🚀
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            {t("hero_description")}
          </p>

          <div className="flex mt-8 gap-4">
            {/* الزر الأساسي - استخدام لون أساسي يبرز في كلا الوضعين */}
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90 cursor-pointer text-sm font-medium transition shadow-sm">
              {t("hero_get_started_btn")}
            </button>
            {/* الزر الثانوي - استخدام حدود وخلفية متوافقة مع الـ Dark Mode */}
            <button className="border border-border bg-card text-card-foreground px-6 py-3 rounded-xl hover:bg-muted cursor-pointer text-sm font-medium transition shadow-sm">
              {t("hero_learn_more_btn")}
            </button>
          </div>
        </div>

        {/* قسم الصورة - إضافة حدود خفيفة لتبرز الصورة بشكل أفضل في الخلفيات الداكنة */}
        <div className="w-full flex justify-center">
          <img
            src="/pexels-zandatsu-13831539.jpg"
            alt="hero image"
            className="rounded-2xl shadow-xl object-cover max-h-[450px] w-full border border-border/50"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
