// frontend/src/pages/BlogPost.jsx

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
      <article className="max-w-3xl mx-auto">
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

        {/* محتوى المقال (يتم حقنه كـ HTML لدعم التنسيقات والفقرات) */}
        <div
          className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base blog-content"
          dangerouslySetInnerHTML={{
            __html: isRTL ? post.contentAr : post.contentEn,
          }}
        />
      </article>
    </div>
  );
}

export default BlogPost;
