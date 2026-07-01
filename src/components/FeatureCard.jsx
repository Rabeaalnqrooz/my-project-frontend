// src/components/FeatureCard.jsx

import React from "react";

function FeatureCard({ icon, title, description }) {
  return (
    // 👈 استخدام border-border للتوافق مع شاد سي ان، وإضافة خلفية bg-card
    <div className="border border-border bg-card text-card-foreground rounded-2xl p-6 hover:shadow-md dark:hover:shadow-neutral-950/50 transition-all duration-300">
      {/* قسم الأيقونة */}
      <div className="text-4xl">{icon}</div>

      {/* عنوان الكارد بدعم الـ text-foreground */}
      <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>

      {/* وصف الكارد باستخدام text-muted-foreground ليناسب الألوان الداكنة */}
      <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;
