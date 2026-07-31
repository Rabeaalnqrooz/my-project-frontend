// src/components/TrustBadges.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function TrustBadges() {
  const { t } = useTranslation();

  const badges = [
    {
      id: "natural",
      icon: (
        <svg
          className="w-6 h-6 text-emerald-600 dark:text-emerald-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      title: t("badge_natural_title", "مكونات طبيعية 100%"),
      desc: t("badge_natural_desc", "آمنة وخالية من المواد الكيميائية الضارة"),
    },
    {
      id: "delivery",
      icon: (
        <svg
          className="w-6 h-6 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: t("badge_delivery_title", "توصيل سريع (24-48 ساعة)"),
      desc: t(
        "badge_delivery_desc",
        "خدمة توصيل فورية لعمان والزرقاء وباقي المحافظات",
      ),
    },
    {
      id: "cod",
      icon: (
        <svg
          className="w-6 h-6 text-amber-600 dark:text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: t("badge_cod_title", "الدفع عند الاستلام"),
      desc: t("badge_cod_desc", "عاين طلبك وادفع نقداً لباب بيتك بكل راحة"),
    },
    {
      id: "guarantee",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: t("badge_guarantee_title", "ضمان جودة ورضا 100%"),
      desc: t("badge_guarantee_desc", "منتجات مفحوصة ومجربة بعناية فائقة"),
    },
  ];

  return (
    <div className="w-full bg-muted/40 border-y border-border/60 py-8 my-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((b) => (
            <div
              key={b.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-background/80 transition-colors duration-200"
            >
              <div className="p-2.5 rounded-lg bg-background border border-border/50 shadow-sm shrink-0">
                {b.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground leading-tight">
                  {b.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
