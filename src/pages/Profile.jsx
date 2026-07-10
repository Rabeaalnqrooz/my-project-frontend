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
      // reset(data);
      toast.success(t("toast.profile_updated_success"));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          t("toast.process_failed_error"),
      );
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
    <div className="max-w-lg mx-auto pt-24 px-4 mb-6 relative text-foreground mt-12 animate-in fade-in duration-300">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-8 sm:mt-4 space-y-6"
      >
        {/* قائمة التبويبات - بتصميم متناسق ومريح للعين بالوضعين */}
        <TabsList className="w-full justify-start bg-muted/60 p-1 border border-border/60 rounded-xl">
          <TabsTrigger
            value="profile"
            className="cursor-pointer rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-4 py-2"
          >
            {t("profile_tab")}
          </TabsTrigger>
          <TabsTrigger
            value="ResetPassword"
            className="cursor-pointer rounded-lg text-sm font-semibold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-4 py-2"
          >
            {t("reset_password_tab")}
          </TabsTrigger>
        </TabsList>

        {/* ─── تبويب الملف الشخصي ─────────────────── */}
        <TabsContent value="profile" className="outline-none">
          <Card className="bg-card/70 backdrop-blur-sm border-border/60 text-card-foreground shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-start text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                {t("edit_profile_title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5 text-start"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* قسم الصورة الشخصية المطور تفاعلياً */}
                <div className="flex flex-col items-center gap-3 group">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-sm bg-muted flex items-center justify-center">
                    <img
                      src={preview || "/default-avatar.png"}
                      alt="avatar"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <button
                    onClick={handelbutton}
                    className="cursor-pointer text-xs sm:text-sm font-bold text-primary hover:underline transition-colors flex items-center gap-1"
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
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

                {/* شبكة المدخلات لبيانات المستخدم */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                      {t("first_name")}
                    </Label>
                    <Input
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...register("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                      {t("last_name")}
                    </Label>
                    <Input
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...register("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                      {t("phone_number")}
                    </Label>
                    <Input
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...register("phoneNo")}
                    />
                    {errors.phoneNo && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {errors.phoneNo.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                      {t("city_label")}
                    </Label>
                    <Input
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                      {t("address_label")}
                    </Label>
                    <Input
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...register("address")}
                    />
                    {errors.address && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs sm:text-sm font-semibold text-foreground/90">
                      {t("zip_code")}
                    </Label>
                    <Input
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...register("zipCode")}
                    />
                    {errors.zipCode && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  disabled={isButtonDisabled}
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer flex items-center justify-center shadow-sm hover:bg-primary/95 transition-all duration-200 mt-2"
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
        <TabsContent value="ResetPassword" className="outline-none">
          <Card className="bg-card/70 backdrop-blur-sm border-border/60 text-card-foreground shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-start text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                {t("reset_password_tab")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-5 text-start"
                onSubmit={handleSubmitPassword(onPasswordSubmit)}
              >
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      className="text-xs sm:text-sm font-semibold text-foreground/90"
                      htmlFor="currentPassword"
                    >
                      {t("current_password")}
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...registerPassword("currentPassword")}
                    />
                    {passwordErrors.currentPassword && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      className="text-xs sm:text-sm font-semibold text-foreground/90"
                      htmlFor="newPassword"
                    >
                      {t("new_password_label")}
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...registerPassword("newPassword")}
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      className="text-xs sm:text-sm font-semibold text-foreground/90"
                      htmlFor="confirmPassword"
                    >
                      {t("confirm_password_label")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="h-10 rounded-xl bg-transparent border-border text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 shadow-sm"
                      {...registerPassword("confirmPassword")}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-destructive text-xs font-semibold pt-0.5 animate-in fade-in">
                        {passwordErrors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  disabled={isLoading || !isPasswordDirty}
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl cursor-pointer flex items-center justify-center shadow-sm hover:bg-primary/95 transition-all duration-200 mt-2"
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
