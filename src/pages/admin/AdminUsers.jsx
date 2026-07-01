// src/pages/admin/AdminUsers.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import api from "@/api/axios";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    // 👈 تحويل الخلفية العامة لـ bg-background والنصوص لـ text-foreground
    <div className="min-h-screen bg-background text-foreground mt-20 transition-colors duration-300">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        {/* ─── Header ───────────────────────────────────────── */}
        <h2 className="text-lg font-semibold text-foreground ms-4">
          {t("total_users")}:
          <span className="text-blue-600 dark:text-blue-400 ms-1">{total}</span>
        </h2>

        {/* ─── حالة التحميل ─────────────────────────────────── */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-muted rounded-lg animate-pulse border border-border"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👥</p>
            <p className="text-muted-foreground ms-4">{t("no_users_found")}</p>
          </div>
        ) : (
          // ─── جدول المستخدمين متوافق بالكامل مع الثيم ──────────────────────────────
          <Card className="bg-card border-border text-card-foreground shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        {t("table_user")}
                      </th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        {t("table_email")}
                      </th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        {t("table_role")}
                      </th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        {t("table_status")}
                      </th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">
                        {t("table_actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map((user) => {
                      const role = roleConfig[user.role] || {
                        label: user.role,
                        color:
                          "bg-muted text-muted-foreground border border-border",
                      };
                      const isCurrentUser = user._id === currentUser?._id;

                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          {/* المستخدم */}
                          <td className="p-4 text-center">
                            <div className="flex items-center gap-3 justify-center">
                              {/* Avatar */}
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 dark:bg-blue-950 shrink-0 border border-border">
                                {user.profilePic ? (
                                  <img
                                    src={user.profilePic}
                                    alt={user.firstName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                                    {user.firstName?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="text-start">
                                <p className="font-medium text-foreground">
                                  {user.firstName} {user.lastName}
                                  {isCurrentUser && (
                                    <span className="text-xs text-blue-600 dark:text-blue-400 ms-1 font-semibold">
                                      ({t("current_user_badge")})
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    user.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* البريد */}
                          <td className="p-4 text-muted-foreground text-center dir-ltr">
                            {user.email}
                          </td>

                          {/* الدور */}
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${role.color}`}
                            >
                              {role.label}
                            </span>
                          </td>

                          {/* الحالة */}
                          <td className="p-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                                user.isVerified
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-900"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900"
                              }`}
                            >
                              {user.isVerified
                                ? `✅ ${t("status_verified")}`
                                : `⏳ ${t("status_unverified")}`}
                            </span>
                          </td>

                          {/* الإجراءات */}
                          <td className="p-4 text-center">
                            {isCurrentUser ? (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            ) : (
                              <div className="flex items-center gap-2 flex-wrap justify-center">
                                {/* تغيير الدور إلى أدمن */}
                                {user.role !== "admin" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-900 dark:hover:bg-purple-950/50 cursor-pointer"
                                    onClick={() =>
                                      handleRoleChange(user._id, "admin")
                                    }
                                    disabled={updatingId === user._id}
                                  >
                                    👑 {t("btn_make_admin")}
                                  </Button>
                                )}

                                {/* تغيير الدور إلى مستخدم عادي */}
                                {user.role === "admin" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-border hover:bg-muted text-foreground cursor-pointer"
                                    onClick={() =>
                                      handleRoleChange(user._id, "user")
                                    }
                                    disabled={updatingId === user._id}
                                  >
                                    👤 {t("btn_make_user")}
                                  </Button>
                                )}

                                {/* تعطيل / تفعيل */}
                                {user.role !== "disabled" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-900 dark:hover:bg-yellow-950/50 cursor-pointer"
                                    onClick={() =>
                                      handleDisable(
                                        user._id,
                                        `${user.firstName} ${user.lastName}`,
                                      )
                                    }
                                    disabled={updatingId === user._id}
                                  >
                                    🚫 {t("btn_disable")}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-900 dark:hover:bg-green-950/50 cursor-pointer"
                                    onClick={() => handleEnable(user._id)}
                                    disabled={updatingId === user._id}
                                  >
                                    ✅ {t("btn_enable")}
                                  </Button>
                                )}

                                {/* حذف */}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-500 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-950/50 cursor-pointer"
                                  onClick={() =>
                                    handleDelete(
                                      user._id,
                                      `${user.firstName} ${user.lastName}`,
                                    )
                                  }
                                  disabled={updatingId === user._id}
                                >
                                  🗑️
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
            </CardContent>
          </Card>
        )}

        {/* ─── Pagination متوافق مع الثيم الداكن ───────────────────────────────────── */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
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
                className={
                  currentPage === i + 1
                    ? ""
                    : "border-border text-foreground hover:bg-muted"
                }
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === pages}
            >
              {t("pagination_next")}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminUsers;
