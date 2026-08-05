import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // توجيه إرسال الإيميل مباشرة عبر المريض المفضل لدى المستخدم
    window.location.href = "mailto:julianqrooz@gmail.com";
  };

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4 mb-12 relative text-foreground mt-12 animate-in fade-in duration-300">
      {/* رأس الصفحة */}
      <div className="text-start space-y-2 mb-8 border-b border-border/60 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {t("contact_title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground/90 max-w-xl leading-relaxed">
          {t("contact_intro")}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 text-start">
        {/* كروت معلومات الاتصال */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            {t("contact_info_heading")}
          </h2>
          <div className="grid gap-3">
            {items.map(({ icon: Icon, label, value, href }) => (
              <Card
                key={label}
                className="flex items-start gap-3.5 p-4 bg-card/75 backdrop-blur-sm border-border/60 rounded-xl transition-all duration-200 hover:shadow-md hover:border-border/100 group"
              >
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

        {/* نموذج إرسال الرسائل */}
        <Card className="p-6 bg-card/75 backdrop-blur-sm border-border/60 rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            {t("contact_form_heading")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("contact_form_name")}
              </label>
              <Input
                required
                placeholder={t("contact_form_name_placeholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("contact_form_email")}
              </label>
              <Input type="email" required placeholder="name@example.com" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                {t("contact_form_message")}
              </label>
              <Textarea
                required
                rows={4}
                placeholder={t("contact_form_message_placeholder")}
              />
            </div>

            <Button type="submit" className="w-full gap-2">
              <Send className="h-4 w-4" />
              {t("contact_form_send")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Contact;
