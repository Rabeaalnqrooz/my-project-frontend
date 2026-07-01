// src/pages/Profile.jsx

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "@/store/authStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Profile() {
  const { t } = useTranslation();

  const profileSchema = z.object({
    firstName: z.string().min(2, t("validation.first_name_short")),
    lastName: z.string().min(2, t("validation.last_name_short")),
    address: z.string().optional(),
    city: z.string().optional(),
    phoneNo: z.string().optional(),
    zipCode: z.string().optional(),
  });

  const passwordSchema = z
    .object({
      currentPassword: z
        .string()
        .min(1, t("validation.current_password_required")),
      newPassword: z.string().min(8, t("validation.new_password_short")),
      confirmPassword: z
        .string()
        .min(8, t("validation.confirm_password_required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwords_dont_match"),
      path: ["confirmPassword"],
    });

  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isLoading = useAuthStore((state) => state.isLoading);
  const fileInputRef = useRef(null);
  const updatePasswordAction = useAuthStore((state) => state.updatePassword);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "profile",
  );
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic);

  const handelbutton = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("toast.images_only_error"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("toast.image_size_error"));
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("phoneNo", data.phoneNo || "");
      formData.append("city", data.city || "");
      formData.append("address", data.address || "");
      formData.append("zipCode", data.zipCode || "");
      if (imageFile) {
        formData.append("profilePic", imageFile);
      }
      await updateProfile(formData);
      setImageFile(null);
      reset(data);
      toast.success(t("toast.profile_updated_success"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: zodResolver(profileSchema) });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isDirty: isPasswordDirty },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data) => {
    try {
      const res = await updatePasswordAction({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      toast.success(res?.message || t("toast.password_updated_success"));
      resetPassword();
      navigate("/profile");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        t("toast.process_failed_error");
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        city: user.city || "",
        address: user.address || "",
        zipCode: user.zipCode || "",
      });
    }
  }, [user, reset]);

  const isButtonDisabled = (!isDirty && !imageFile) || isLoading;

  return (
    // 👈 التأكد من سحب ألوان الخلفية والنصوص ديناميكياً لتتوافق مع الـ Dark Mode
    <div className="max-w-lg mx-auto pt-24 px-4 mb-3 relative text-foreground">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-8 sm:mt-4"
      >
        <TabsList className="w-full justify-start bg-muted border border-border">
          <TabsTrigger
            value="profile"
            className="cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            {t("profile_tab")}
          </TabsTrigger>
          <TabsTrigger
            value="ResetPassword"
            className="cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground"
          >
            {t("reset_password_tab")}
          </TabsTrigger>
        </TabsList>

        {/* ─── تبويب الملف الشخصي ─────────────────── */}
        <TabsContent value="profile">
          {/* تم تهيئة الـ Card ليعمل ديناميكياً مع الخلفية والحدود الداكنة */}
          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-start text-foreground">
                {t("edit_profile_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4 text-start"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={preview || "/default-avatar.png"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border border-border"
                  />
                  <button
                    onClick={handelbutton}
                    className="hover:underline cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400"
                    type="button"
                  >
                    {t("edit_picture_btn")}
                  </button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* تم تعديل الـ Inputs والـ Labels لتتوافق مع درجات الـ Dark Mode */}
                  <div className="space-y-2">
                    <Label className="text-foreground">{t("first_name")}</Label>
                    <Input
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">{t("last_name")}</Label>
                    <Input
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground">
                      {t("phone_number")}
                    </Label>
                    <Input
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...register("phoneNo")}
                    />
                    {errors.phoneNo && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {errors.phoneNo.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground">{t("city_label")}</Label>
                    <Input
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground">
                      {t("address_label")}
                    </Label>
                    <Input
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground">{t("zip_code")}</Label>
                    <Input
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...register("zipCode")}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  disabled={isButtonDisabled}
                  type="submit"
                  className="w-full cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-none transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      {t("saving_changes")}
                    </span>
                  ) : (
                    t("save_changes_btn")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── تبويب تغيير كلمة المرور ─────────────────── */}
        <TabsContent value="ResetPassword">
          <Card className="bg-card border-border text-card-foreground">
            <CardHeader>
              <CardTitle className="text-start text-foreground">
                {t("reset_password_tab")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4 text-start"
                onSubmit={handleSubmitPassword(onPasswordSubmit)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      className="text-foreground"
                      htmlFor="currentPassword"
                    >
                      {t("current_password")}
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...registerPassword("currentPassword")}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground" htmlFor="newPassword">
                      {t("new_password_label")}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...registerPassword("newPassword")}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label
                      className="text-foreground"
                      htmlFor="confirmPassword"
                    >
                      {t("confirm_password_label")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="bg-transparent border-border text-foreground focus-visible:ring-primary"
                      {...registerPassword("confirmPassword")}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 dark:text-red-400 text-sm font-medium">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  disabled={isLoading || !isPasswordDirty}
                  type="submit"
                  className="w-full mt-2 cursor-pointer h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl border-none transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      {t("updating")}
                    </span>
                  ) : (
                    t("update_password_btn")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;
