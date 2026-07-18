// src/components/Hero.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-background text-foreground relative overflow-hidden transition-colors duration-300 pt-28 pb-16 lg:pt-32 lg:pb-24">
      {/* تأثير إضاءة خلفي (Glow Effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[30%] -right-[10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 px-4 sm:px-6 lg:px-8 items-center gap-12 lg:gap-8">
        {/* قسم النصوص والمحتوى */}
        <div className="text-center lg:text-start flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-foreground">
            {t("hero_title")}{" "}
            <span className="inline-block animate-bounce-slow">🚀</span>
          </h1>

          <p className="mt-6 text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed font-normal">
            {t("hero_description")}
          </p>

          {/* أزرار اتخاذ القرار (Call to Actions) المحدثة */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start mt-8 gap-4 w-full sm:w-auto">
            {/* زر تسوق الآن (الأساسي) */}
            <Link to="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-250 cursor-pointer"
              >
                {t("hero_get_started_btn")}
              </Button>
            </Link>

            {/* 📝 زر مشاهدة المدونة (الثانوي المضاف) */}
            <Link to="/blog" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-medium border-border/80 hover:bg-muted hover:text-foreground transition-all duration-250 cursor-pointer"
              >
                {t("hero_view_blog_btn")}
              </Button>
            </Link>
          </div>
        </div>

        {/* قسم الصورة */}
        <div className="w-full flex justify-center items-center px-2 sm:px-6 lg:px-0">
          <div className="relative w-full max-w-[500px] lg:max-w-none group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

            <img
              src="/hero-cover.webp"
              alt="hero image"
              className="relative rounded-2xl shadow-2xl object-cover max-h-[350px] sm:max-h-[450px] w-full border border-border/60 transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
