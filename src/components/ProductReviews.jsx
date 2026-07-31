import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Star, Send, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useProductStore from "@/store/productStore";
import useAuthStore from "@/store/authStore";

export default function ProductReviews({ product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { addReview, deleteReview } = useProductStore();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const reviews = product?.reviews || [];
  const averageRating = product?.rating
    ? Number(product.rating).toFixed(1)
    : "0.0";
  const numReviews = product?.numReviews || 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      const confirmLogin = window.confirm(
        t(
          "review_login_required_confirm",
          "الرجاء تسجيل الدخول أولاً لتتمكن من إضافة تقييمك للمنتج. هل تريد الذهاب لصفحة تسجيل الدخول الآن؟",
        ),
      );
      if (confirmLogin) {
        navigate("/login", { state: { from: location.pathname } });
      }
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      await addReview(product._id, { rating, comment: comment.trim() });
      setComment("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      t("confirm_delete_review", "هل أنت متأكد من رغبتك في حذف هذا التقييم؟"),
    );
    if (confirmDelete) {
      try {
        await deleteReview(product._id, reviewId);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div
      id="reviews-section"
      className="mt-12 sm:mt-16 border-t border-border/50 pt-8 sm:pt-10"
    >
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-6">
        {t("reviews_and_ratings_title", "التقييمات وآراء العملاء")}
      </h2>

      {/* ملخص التقييم العام */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/20 border border-border/60 rounded-2xl p-5 sm:p-6 mb-8 items-center">
        <div className="text-center md:border-e md:border-border/60 pb-4 md:pb-0 border-b md:border-b-0 border-border/40">
          <span className="text-4xl sm:text-5xl font-black text-foreground">
            {averageRating}
          </span>
          <div className="flex justify-center items-center gap-1 my-2 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i < Math.round(averageRating)
                    ? "fill-current text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t("based_on_reviews", { count: numReviews })}
          </span>
        </div>

        {/* نموذج إضافة تقييم */}
        <div className="md:col-span-2">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3">
            {t("add_review_title", "أضف تقييمك للمنتج")}
          </h3>

          {errorMsg && (
            <p className="text-xs text-destructive mb-2">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-3">
            <div className="flex items-center flex-wrap gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                >
                  <Star
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-muted-foreground ms-2 font-medium">
                {rating} {t("out_of_5", "من 5")}
              </span>
            </div>

            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t(
                "review_placeholder",
                "اكتب رأيك وتجربتك مع المنتج هنا...",
              )}
              className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
              required
            />

            <Button
              type="submit"
              disabled={isSubmitting || submitted}
              className="h-10 px-5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t("review_submitted", "تم إضافة تقييمك بنجاح!")}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t("submit_review_btn", "إرسال التقييم")}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* قائمة التقييمات */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            {t("no_reviews_yet", "لا توجد تقييمات لهذا المنتج بعد.")}
          </p>
        ) : (
          reviews.map((rev) => {
            const isOwnerOrAdmin =
              user && (user.role === "admin" || user._id === rev.user);

            return (
              <div
                key={rev._id || rev.createdAt}
                className="p-4 sm:p-5 border border-border/60 rounded-xl bg-card shadow-xs transition-all duration-200 relative group"
              >
                <div className="flex items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      {rev.userName ||
                        (user?.firstName
                          ? `${user.firstName} ${user.lastName || ""}`
                          : null) ||
                        t("anonymous_customer", "عميل جوليا")}
                    </span>
                    <span className="text-[10px] sm:text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full">
                      ✓ {t("verified_purchase", "شراء مؤكد")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className="text-[11px] sm:text-xs text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>

                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        title={t("delete_review", "حذف التقييم")}
                        className="text-muted-foreground hover:text-destructive transition-colors duration-200 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
