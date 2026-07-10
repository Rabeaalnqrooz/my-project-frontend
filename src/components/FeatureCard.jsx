// src/components/FeatureCard.jsx

import React from "react";

function FeatureCard({ icon, title, description }) {
  return (
    <div className="border border-border/60 bg-card/50 backdrop-blur-sm text-card-foreground rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-border group animate-in fade-in duration-300">
      {/* قسم الأيقونة - حاوية مرنة ناعمة تزيد من جمالية التصميم */}
      <div className="text-3xl transition-transform duration-300 group-hover:scale-110 inline-block">
        {icon}
      </div>

      {/* عنوان الكارد بدعم الـ text-foreground */}
      <h3 className="mt-4 text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* وصف الكارد باستخدام text-muted-foreground ليناسب الألوان الداكنة والفاتحة */}
      <p className="mt-2 text-muted-foreground/90 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
