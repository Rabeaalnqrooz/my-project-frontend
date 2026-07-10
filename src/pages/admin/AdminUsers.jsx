// src/pages/admin/AdminUsers.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Users,
  ShieldCheck,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";

// ============================================================
// 👥 ADMIN USERS PAGE
// ============================================================

function AdminUsers() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  // 🎨 قواميس الأدوار المترجمة ديناميكياً - تم ضبط الألوان لتدعم الـ Dark Mode باستخدام درجات متوافقة
  const roleConfig = {
    admin: {
      label: t("role_admin"),
      color:
        "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900",
    },
    user: {
      label: t("role_user"),
      color:
        "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900",
    },
    disabled: {
      label: t("role_disabled"),
      color:
        "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900",
    },
  };

  // ─── جلب المستخدمين ───────────────────────────────────────
  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await api.get("user/users", {
        params: { page, limit: 10 },
      });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // ─── تعطيل مستخدم ─────────────────────────────────────────
  const handleDisable = async (id, name) => {
    if (!window.confirm(t("confirm_disable", { name }))) return;
    setUpdatingId(id);
    try {
      await api.put(`user/users/${id}/disable`);
      toast.success(t("toast_disabled_success"));
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── تفعيل مستخدم ─────────────────────────────────────────
  const handleEnable = async (id) => {
    setUpdatingId(id);
    try {
      await api.put(`user/users/${id}/enable`);
      toast.success(t("toast_enabled_success"));
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── تغيير الدور ──────────────────────────────────────────
  const handleRoleChange = async (id, role) => {
    setUpdatingId(id);
    try {
      await api.put(`user/users/${id}/role`, { role });
      toast.success(t("toast_role_changed_success"));
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── حذف مستخدم ───────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(t("confirm_delete", { name }))) return;
    setUpdatingId(id);
    try {
      await api.delete(`user/users/${id}`);
      toast.success(t("toast_deleted_success"));
      fetchUsers(currentPage);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    // التنسيق ممتد بالكامل ومنطلق من الطرف مثل صفحة الطلبيات تماماً
    <div className="w-full p-6 space-y-6 bg-background text-foreground transition-colors duration-300 animate-in fade-in duration-300">
      {/* ─── Header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          {t("admin_users_title") || "Manage Users"}
        </h1>
        <div className="text-sm font-medium text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40 font-mono">
          {t("total_users")}:{" "}
          <span className="text-primary font-bold ml-1">{total}</span>
        </div>
      </div>

      {/* ─── حالة التحميل ─────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-muted/40 rounded-xl animate-pulse border border-border/60"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-start py-16 border border-dashed border-border rounded-xl bg-muted/10 px-6">
          <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
            {t("no_users_found")}
          </p>
        </div>
      ) : (
        /* ─── جدول المستخدمين المحاذي للطرف ─────────────────── */
        <Card className="bg-card/30 border-border/60 text-card-foreground shadow-sm rounded-xl overflow-hidden backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 border-b border-border/60">
                  <tr>
                    <th className="text-start p-4 font-bold text-muted-foreground/90">
                      {t("table_user")}
                    </th>
                    <th className="text-start p-4 font-bold text-muted-foreground/90">
                      {t("table_email")}
                    </th>
                    <th className="text-start p-4 font-bold text-muted-foreground/90">
                      {t("table_role")}
                    </th>
                    <th className="text-start p-4 font-bold text-muted-foreground/90">
                      {t("table_status")}
                    </th>
                    <th className="text-end p-4 font-bold text-muted-foreground/90">
                      {t("table_actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {users.map((user) => {
                    const role = roleConfig[user.role] || {
                      label: user.role,
                      color:
                        "bg-muted text-muted-foreground border border-border/40",
                    };
                    const isCurrentUser = user._id === currentUser?._id;
                    const isThisUserUpdating = updatingId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* المستخدم والمعلومات الشخصية */}
                        <td className="p-4 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary/5 shrink-0 border border-border/60 shadow-inner flex items-center justify-center">
                              {user.profilePic ? (
                                <img
                                  src={user.profilePic}
                                  alt={user.firstName}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              ) : (
                                <div className="font-bold text-primary text-sm uppercase">
                                  {user.firstName?.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                                {user.firstName} {user.lastName}
                                {isCurrentUser && (
                                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md font-semibold">
                                    {t("current_user_badge")}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground/80 font-mono">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* البريد الإلكتروني */}
                        <td className="p-4 text-start text-muted-foreground font-medium select-all">
                          {user.email}
                        </td>

                        {/* الدور الوظيفي */}
                        <td className="p-4 text-start">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${role.color}`}
                          >
                            {user.role === "admin" ? (
                              <ShieldCheck className="h-3 w-3 shrink-0" />
                            ) : (
                              <User className="h-3 w-3 shrink-0" />
                            )}
                            {role.label}
                          </span>
                        </td>

                        {/* حالة تفعيل الحساب */}
                        <td className="p-4 text-start">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              user.isVerified
                                ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                            }`}
                          >
                            {user.isVerified ? (
                              <CheckCircle2 className="h-3 w-3 shrink-0" />
                            ) : (
                              <AlertCircle className="h-3 w-3 shrink-0" />
                            )}
                            {user.isVerified
                              ? t("status_verified")
                              : t("status_unverified")}
                          </span>
                        </td>

                        {/* لوحة التحكم والإجراءات الإدارية */}
                        <td className="p-4 text-end">
                          {isCurrentUser ? (
                            <div className="text-xs font-medium text-muted-foreground/50 italic select-none pl-4">
                              {t("no_actions_self") || "لا توجد إجراءات"}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                              {/* تعديل رتبة الحساب */}
                              {user.role !== "admin" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs font-semibold border-purple-500/20 text-purple-600 bg-purple-500/5 hover:bg-purple-500/10 dark:text-purple-400 cursor-pointer rounded-lg"
                                  onClick={() =>
                                    handleRoleChange(user._id, "admin")
                                  }
                                  disabled={isThisUserUpdating}
                                >
                                  {isThisUserUpdating ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {t("btn_make_admin")}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs font-semibold border-border/60 hover:bg-muted text-foreground cursor-pointer rounded-lg"
                                  onClick={() =>
                                    handleRoleChange(user._id, "user")
                                  }
                                  disabled={isThisUserUpdating}
                                >
                                  {isThisUserUpdating ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <User className="h-3.5 w-3.5 mr-1" />
                                  )}
                                  {t("btn_make_user")}
                                </Button>
                              )}

                              {/* حظر / فك حظر الحساب */}
                              {user.role !== "disabled" ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs font-semibold border-yellow-500/20 text-yellow-600 bg-yellow-500/5 hover:bg-yellow-500/10 dark:text-yellow-400 cursor-pointer rounded-lg"
                                  onClick={() =>
                                    handleDisable(
                                      user._id,
                                      `${user.firstName} ${user.lastName}`,
                                    )
                                  }
                                  disabled={isThisUserUpdating}
                                >
                                  <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                                  {t("btn_disable")}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs font-semibold border-green-500/20 text-green-600 bg-green-500/5 hover:bg-green-500/10 dark:text-green-400 cursor-pointer rounded-lg"
                                  onClick={() => handleEnable(user._id)}
                                  disabled={isThisUserUpdating}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                  {t("btn_enable")}
                                </Button>
                              )}

                              {/* الحذف النهائي */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 cursor-pointer rounded-lg flex items-center justify-center shadow-sm"
                                onClick={() =>
                                  handleDelete(
                                    user._id,
                                    `${user.firstName} ${user.lastName}`,
                                  )
                                }
                                disabled={isThisUserUpdating}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>{" "}
          {/* تم تصحيح الإغلاق هنا بنجاح */}
        </Card>
      )}

      {/* ─── الترقيم وتصفح الصفحات ───────────────────────────────────── */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border-border/60 text-foreground hover:bg-muted font-medium text-xs"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            {t("pagination_prev")}
          </Button>
          {[...Array(pages)].map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              className={`h-9 w-9 rounded-lg font-mono text-xs ${
                currentPage === i + 1
                  ? "shadow-sm font-bold"
                  : "border-border/60 text-foreground hover:bg-muted"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-lg border-border/60 text-foreground hover:bg-muted font-medium text-xs"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === pages}
          >
            {t("pagination_next")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
