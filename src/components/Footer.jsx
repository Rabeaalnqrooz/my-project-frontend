// src/components/Footer.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-muted/30 border-t border-border/60 text-foreground py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* شبكة القوائم (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-start">
          {/* 1. شعار المتجر والوصف */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {t("logo")}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t("footer_description")}
            </p>
          </div>

          {/* 2. روابط الشركة */}
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground/90">
              {t("footer_company")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-muted-foreground text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary hover:ps-1 transition-all duration-200 block"
                >
                  {t("footer_about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. الدعم والمساعدة */}
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground/90">
              {t("footer_support")}
            </h3>
            <ul className="mt-4 space-y-2.5 text-muted-foreground text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary hover:ps-1 transition-all duration-200 block"
                >
                  {t("footer_contact")}
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary hover:ps-1 transition-all duration-200 block"
                >
                  {t("footer_privacy")}
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="hover:text-primary hover:ps-1 transition-all duration-200 block"
                >
                  {t("ShippingPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. شبكات التواصل الاجتماعي */}
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground/90">
              {t("footer_follow_us")}
            </h3>
            <div className="mt-4 flex items-center gap-3">
              {/* 1. أيقونة الموقع (Web) */}
              <a
                href="https://julia4-store.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-105 transition-all duration-200 shadow-sm"
                title="Website"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>

              {/* 2. أيقونة فيسبوك (Facebook) */}
              <a
                href="https://www.facebook.com/profile.php?id=61565193101989"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-105 transition-all duration-200 shadow-sm"
                title="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* 3. أيقونة إنستغرام (Instagram) */}
              <a
                href="https://www.instagram.com/julianqrooz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/50 hover:scale-105 transition-all duration-200 shadow-sm"
                title="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* الجزء السفلي (حقوق النشر) */}
        <div className="border-t border-border/50 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
          <div>
            © {new Date().getFullYear()} {t("logo")}. {t("footer_rights")}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
