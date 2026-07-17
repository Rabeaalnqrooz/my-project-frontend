// frontend/src/pages/BlogList.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { blogPosts } from "../data/blogData";

function BlogList() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language.startsWith("ar");

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {isRTL ? "مدونة متجر جوليا التقيفية" : "Julia Store Blog"}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            {isRTL
              ? "مقالات ونصائح تهمك حول العناية بالبشرة، الصحة، وأقوى عروض التوفير في الأردن."
              : "Tips and guides about skincare, health, and the best saving offers in Jordan."}
          </p>
        </div>

        {/* شبكة المقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <img
                src={post.image}
                alt={isRTL ? post.titleAr : post.titleEn}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />{" "}
                    {isRTL ? post.readTimeAr : post.readTimeEn}
                  </span>
                </div>

                <h2 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                  <Link to={`/blog/${post.id}`}>
                    {isRTL ? post.titleAr : post.titleEn}
                  </Link>
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                  {isRTL ? post.excerptAr : post.excerptEn}
                </p>

                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-auto"
                >
                  <span>{isRTL ? "اقرأ المزيد" : "Read More"}</span>
                  {isRTL ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogList;
