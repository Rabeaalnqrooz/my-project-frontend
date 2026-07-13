// frontend/src/pages/Contact.jsx

import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

function Contact() {
  const { t } = useTranslation();

  const items = [
    {
      icon: Mail,
      label: t("contact_email_label"),
      value: "julianqrooz@gmail.com",
      href: "mailto:julianqrooz@gmail.com",
    },
    {
      icon: Phone,
      label: t("contact_phone_label"),
      value: "+962 796150027",
      href: "tel:+962796150027",
    },
    {
      icon: MapPin,
      label: t("contact_address_label"),
      value: t("contact_address_value"),
      href: null,
    },
    {
      icon: Clock,
      label: t("contact_hours_label"),
      value: t("contact_hours_value"),
      href: null,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto pt-24 px-4 mb-12 relative text-foreground mt-12 animate-in fade-in duration-300">
      {/* رأس الصفحة مع محاذاة مرنة تدعم اللغتين */}
      <div className="text-start space-y-2 mb-8 border-b border-border/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("contact_title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground/90 max-w-xl leading-relaxed">
          {t("contact_intro")}
        </p>
      </div>

      {/* شبكة كروت قنوات الاتصال */}
      <div className="grid gap-4 sm:grid-cols-2 text-start">
        {items.map(({ icon: Icon, label, value, href }) => (
          <Card
            key={label}
            className="flex items-start gap-3.5 p-4 bg-card/75 backdrop-blur-sm border-border/60 rounded-xl transition-all duration-200 hover:shadow-md hover:border-border/100 group"
          >
            {/* حاوية الأيقونة مع تأثير حركي خفيف عند التمرير على الكارت */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner transition-transform group-hover:scale-105">
              <Icon className="h-4 w-4" />
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground/80">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="block text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors hover:underline underline-offset-4 break-words"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm sm:text-base font-bold text-foreground break-words">
                  {value}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Contact;
