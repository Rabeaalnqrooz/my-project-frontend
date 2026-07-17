// frontend/src/pages/PrivacyPolicy.jsx

import { useTranslation } from "react-i18next";

function PrivacyPolicy() {
  const { t } = useTranslation();

  const sections = [1, 2, 3, 4, 5];

  return (
    <div className="max-w-3xl mx-auto pt-24 px-4 mb-12 relative text-foreground mt-12 animate-in fade-in duration-300">
      <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-6 sm:p-8 rounded-2xl shadow-xl overflow-hidden text-start">
        {/* رأس الصفحة */}
        <h1 className="mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("ShippingPolicy_title")}
        </h1>

        {/* أقسام سياسة الخصوصية */}
        <div className="space-y-6 sm:space-y-8">
          {sections.map((num) => (
            <div
              key={num}
              className="group space-y-2 animate-in fade-in duration-200"
            >
              <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shrink-0" />
                {t(`ShippingPolicy_s${num}_title`)}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed pl-3 sm:pl-4 border-l border-border/40 rtl:border-l-0 rtl:border-r rtl:pr-3 sm:rtl:pr-4">
                {t(`ShippingPolicy_s${num}_body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
