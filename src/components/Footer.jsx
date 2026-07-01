// src/components/Footer.jsx

import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    // 👈 تم استبدال bg-gray-900 بـ bg-muted/40 واللون الثابت بـ text-foreground ليتماشى مع الثيمين
    <footer className="bg-muted/40 border-t border-border text-foreground py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* إضافة text-start لضمان محاذاة النصوص حسب اتجاه اللغة تلقائياً */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-start">
          {/* Logo + Description */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">MyWebsite</h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              {t("footer_description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {t("footer_company")}
            </h3>{" "}
            <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  {t("footer_about")}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {t("footer_support")}
            </h3>{" "}
            <ul className="mt-4 space-y-3 text-muted-foreground text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  {t("footer_contact")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  {t("footer_privacy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              {t("footer_follow_us")}
            </h3>{" "}
            <div className="mt-4 flex gap-4 text-2xl">
              <a
                href="#"
                className="hover:scale-110 transition duration-200"
                title="Website"
              >
                🌐
              </a>
              <a
                href="#"
                className="hover:scale-110 transition duration-200"
                title="Facebook"
              >
                📘
              </a>
              <a
                href="#"
                className="hover:scale-110 transition duration-200"
                title="Instagram"
              >
                📸
              </a>
            </div>
          </div>
        </div>

        {/* Bottom (حقوق النشر) */}
        {/* قمنا بتغيير البوردر ليكون border-border المتغير ديناميكياً */}
        <div className="border-t border-border mt-12 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} MyWebsite. {t("footer_rights")}{" "}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
