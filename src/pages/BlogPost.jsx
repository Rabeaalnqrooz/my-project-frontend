import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { blogPosts } from "../data/blogData";

function BlogPost() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  // البحث عن المقال المطلوب بواسطة الـ ID
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold mb-2">
          {isRTL ? "المقال غير موجود" : "Post Not Found"}
        </h2>
        <Link to="/blog" className="text-primary hover:underline">
          {isRTL ? "العودة للمدونة" : "Back to blog"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 mt-16">
      {/* الحاوية مقسمة لـ 12 خانة بدءاً من شاشات md (الوسط والكبيرة) وفي الموبايل تأخذ العرض الكامل بشكل طبيعي */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* العمود الخاص بالمقال: يأخذ 8 خانات من أصل 12 في الشاشات الوسط والكبيرة ليترك مساحة مريحة للبنر الجانبي */}
        <article className="md:col-span-8 lg:col-span-9 w-full">
          {/* رابط العودة */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            {isRTL ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span>{isRTL ? "العودة إلى المدونة" : "Back to Blog"}</span>
          </Link>

          {/* عنوان المقال ومعلوماته */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
            {isRTL ? post.titleAr : post.titleEn}
          </h1>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-8 border-b border-border pb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />{" "}
              {isRTL ? post.readTimeAr : post.readTimeEn}
            </span>
          </div>

          {/* صورة المقال الرئيسية */}
          <img
            src={post.image}
            alt={isRTL ? post.titleAr : post.titleEn}
            className="w-full h-64 sm:h-96 object-cover rounded-2xl mb-8 shadow-sm"
          />

          {/* محتوى المقال */}
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base blog-content"
            dangerouslySetInnerHTML={{
              __html: isRTL ? post.contentAr : post.contentEn,
            }}
          />
        </article>

        {/* 💻 البنر الإعلاني: يختفي تماماً في الشاشات الصغيرة (hidden) ويظهر بدءاً من الشاشات الوسط والكبيرة (md:block) */}
        {/* البنر يظهر بالطول بشكل احترافي ويثبت في مكانه بسلاسة عند نزول القارئ لأسفل المقال */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 text-center">
          <div className="text-[10px] text-muted-foreground tracking-wider uppercase mb-2">
            {isRTL ? "- إعلان ممول -" : "- Sponsored -"}
          </div>
          <div className="inline-block bg-card p-2 rounded-2xl border border-border/60 shadow-sm">
            <a
              href="https://s.click.aliexpress.com/e/_c3J6SjU?bz=120*600"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src="https://ae-pic-a1.aliexpress-media.com/kf/S83e86e19b20f4e718d244f1c7a288fbdn.png"
                alt="AliExpress Ad"
                width="120"
                height="600"
                className="rounded-xl mx-auto"
              />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BlogPost;
