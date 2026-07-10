// frontend/src/pages/About.jsx

import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto pt-24 px-4 mb-12 relative text-foreground mt-12 animate-in fade-in duration-300">
      <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-6 sm:p-8 rounded-2xl shadow-xl text-start space-y-6">
        {/* رأس الصفحة الرئيسي */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground border-b border-border/60 pb-4">
          {t("about_title")}
        </h1>

        {/* حاوية الفقرات النصية بتصميم مريح للقراءة */}
        <div className="space-y-5 text-sm sm:text-base text-muted-foreground/90 leading-relaxed font-normal">
          <p className="animate-in fade-in duration-200 delay-75">
            {t("about_p1")}
          </p>
          <p className="animate-in fade-in duration-200 delay-100">
            {t("about_p2")}
          </p>
          <p className="animate-in fade-in duration-200 delay-150">
            {t("about_p3")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
