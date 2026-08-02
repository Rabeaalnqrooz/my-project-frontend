import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Hero() {
  const { t } = useTranslation();

  return (
    <section className="bg-background text-foreground relative overflow-hidden transition-colors duration-300 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20">
      {/* ⚡ تأثير إضاءة خلفي محين عبر الـ GPU لتجنب التجميد */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10 transform-gpu">
        <div className="absolute -top-[30%] -right-[10%] w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] rounded-full bg-primary/10 blur-[90px] sm:blur-[120px] will-change-transform" />
        <div className="absolute bottom-[10%] -left-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-primary/5 blur-[80px] sm:blur-[100px] will-change-transform" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 px-4 sm:px-6 lg:px-8 items-center gap-10 sm:gap-12 lg:gap-8">
        {/* قسم النصوص والمحتوى */}
        <div className="text-center lg:text-start flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.2] sm:leading-[1.15] tracking-tight text-foreground">
            {t("hero_title")}{" "}
            {/* ⚡ تحريك محسن عبر GPU لمنع Non-Composited Animations warning */}
            <span className="inline-block transition-transform transform-gpu hover:translate-y-[-4px]">
              🚀
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-muted-foreground text-sm sm:text-lg md:text-xl leading-relaxed font-normal">
            {t("hero_description")}
          </p>

          {/* أزرار اتخاذ القرار (Call to Actions) */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start mt-6 sm:mt-8 gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-250 cursor-pointer text-sm sm:text-base"
              >
                {t("hero_get_started_btn")}
              </Button>
            </Link>

            <Link to="/blog" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-medium border-border/80 hover:bg-muted hover:text-foreground transition-all duration-250 cursor-pointer text-sm sm:text-base"
              >
                {t("hero_view_blog_btn")}
              </Button>
            </Link>
            <Link to="/bundles" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 rounded-xl font-medium border-border/80 hover:bg-muted hover:text-foreground transition-all duration-250 cursor-pointer text-sm sm:text-base"
              >
                {t("hero_view_Packages_btn")}
              </Button>
            </Link>
          </div>

          {/* 🌟 شريط الثقة السريع المترجم */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border/40 w-full flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-2.5 sm:gap-y-2 sm:gap-x-6 text-xs sm:text-sm text-muted-foreground font-medium">
            <span className="flex items-center justify-center lg:justify-start gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span>{" "}
              {t("hero_trust_natural", "مكونات طبيعية 100%")}
            </span>
            <span className="flex items-center justify-center lg:justify-start gap-1.5">
              <span className="text-primary font-bold">✓</span>{" "}
              {t("hero_trust_cod", "الدفع عند الاستلام")}
            </span>
            <span className="flex items-center justify-center lg:justify-start gap-1.5">
              <span className="text-amber-500 font-bold">✓</span>{" "}
              {t("hero_trust_delivery", "توصيل خلال 24-48 ساعة")}
            </span>
          </div>
        </div>

        {/* ⚡ قسم الصورة (معالجة LCP المثالية) */}
        <div className="w-full flex justify-center items-center px-0 sm:px-6 lg:px-0">
          <div className="relative w-full max-w-[450px] sm:max-w-[500px] lg:max-w-none group transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <img
              src="/hero-cover.webp"
              srcSet="/hero-cover-mobile.webp 480w, /hero-cover.webp 800w"
              sizes="(max-width: 640px) 480px, (max-width: 1024px) 500px, 800px"
              alt="Julia Store Hero Cover"
              width="800"
              height="450"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="relative rounded-2xl shadow-2xl object-cover max-h-[280px] sm:max-h-[400px] lg:max-h-[450px] w-full border border-border/60 transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
