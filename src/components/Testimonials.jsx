// src/components/Testimonials.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();

  // آراء العملاء (مترجمة ومخصصة لتطابق الطابع المحلي)
  const reviews = [
    {
      id: 1,
      name: t("testimonial_1_name", "سارة المجالي"),
      location: t("testimonial_1_loc", "عمّان"),
      rating: 5,
      comment: t(
        "testimonial_1_comment",
        "جربت مجموعة العناية بالبشرة بصراحة النتيجة كانت روعة من أول أسبوع! الفرق واضح بالنعومة والنضارة، والمنتجات طبيعية وما تسببت بتهيج بشرتي.",
      ),
      product: t("testimonial_1_prod", "مجموعة النضارة الطبيعية"),
    },
    {
      id: 2,
      name: t("testimonial_2_name", "رانيا الخالد"),
      location: t("testimonial_2_loc", "الزرقاء"),
      rating: 5,
      comment: t(
        "testimonial_2_comment",
        "توصيل سريع جداً وصلني الطلب خلال أقل من 24 ساعة، والتغليف راقي ومرتب. السيروم ممتاز وريحته بتجنن.",
      ),
      product: t("testimonial_2_prod", "سيروم العناية الطبيعي"),
    },
    {
      id: 3,
      name: t("testimonial_3_name", "مجد عبدالله"),
      location: t("testimonial_3_loc", "إربد"),
      rating: 5,
      comment: t(
        "testimonial_3_comment",
        "أفضل متجر للمنتجات الطبيعية بالأردن! تعامل سريع على الواتساب ودفع عند الاستلام بكل سهولة. أكيد مش آخر التعامل.",
      ),
      product: t("testimonial_3_prod", "مقشر البشرة الطبيعي"),
    },
  ];

  return (
    <section className="py-16 bg-muted/20 border-t border-border/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* عنوان القسم */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-primary uppercase bg-primary/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            {t("testimonials_badge", "تجارب حقيقية")}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            {t("testimonials_title", "ماذا يقول عملاؤنا عن جوليا؟")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            {t(
              "testimonials_subtitle",
              "ثقة آلاف العملاء هي سر نجاحنا، إليك بعض انطباعاتهم بعد استخدام المنتجات",
            )}
          </p>
        </div>

        {/* شبكة البطاقات (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-background border border-border/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* تقييم النجوم */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* نص التعليق */}
                <p className="text-foreground/90 text-sm sm:text-base leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* تفاصيل العميل والمنتج */}
              <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    {rev.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {t("verified_buyer", "مشتري مؤكد")} ✓
                    </span>
                  </span>
                </div>

                <div className="text-end">
                  <span className="inline-block text-[11px] bg-muted px-2.5 py-1 rounded-md text-muted-foreground font-medium">
                    {rev.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
