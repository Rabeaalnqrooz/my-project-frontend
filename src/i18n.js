import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// --------------------------------------------------------
// 1. نصوص الترجمة (Resources)
// --------------------------------------------------------
const resources = {
  // 🇺🇸 اللغة الإنجليزية
  en: {
    translation: {
      // عناصر عامة والملاحة (Navbar & General)
      logo: "MyStore",
      home: "Home",
      about: "About",
      profile: "My Profile",
      admin: "Admin Dashboard",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      default_user_name: "User",

      // صفحة المظهر الرئيسي (Hero Section)
      hero_title: "Build Modern Websites Faster",
      hero_description:
        "Create beautiful and responsive websites using React, Tailwind CSS, and shadcn/ui.",
      hero_get_started_btn: "Get Started",
      hero_learn_more_btn: "Learn More",

      // شاشات الحساب والتبويبات (Profile Pages & Tabs)
      profile_tab: "Profile",
      reset_password_tab: "Reset Password",
      editProfile: "Edit Profile",
      edit_profile_title: "Edit Profile",
      edit_picture_btn: "Edit picture",
      saveChanges: "Save Changes",
      save_changes_btn: "Save Changes",
      saving: "Saving Changes...",
      saving_changes: "Saving Changes...",

      // حقول الاستمارات والبيانات (Form Fields)
      firstName: "First Name",
      first_name: "First Name",
      lastName: "Last Name",
      last_name: "Last Name",
      email: "Email",
      phone: "Phone Number",
      phone_number: "Phone Number",
      city: "City",
      city_label: "City",
      address: "Address",
      address_label: "Address",
      zip: "Zip Code",
      zip_code: "Zip Code",
      password: "Password",
      current_password: "Current Password",
      new_password_label: "New Password",
      confirm_password_label: "Confirm New Password",

      // شاشة تسجيل الدخول وإنشاء الحساب (Auth Screens)
      login_title: "Login to your account",
      login_description: "Enter your email below to login to your account",
      login_btn: "Login",
      logging_in: "Logging in...",
      no_account: "Don't have an account?",
      have_account: "Already have an account?",
      signup_title: "Create your account",
      signup_description: "Enter given details below to create your account",
      signup_btn: "Sign Up",
      signing_up: "Signing up...",
      login_link: "Login",
      login_link_back: "Login",

      // استعادة كلمة المرور والتحقق (Password Recovery & OTP)
      forgot_password: "Forgot password?",
      forgot_password_title: "Forgot password?",
      forgot_password_desc:
        "Enter your email and we'll send you a verification OTP code",
      send_otp_btn: "Send Verification Code",
      remember_password: "Remembered your password?",
      verify_otp_title: "Enter Verification Code",
      verify_otp_desc: "An OTP verification code has been sent to",
      otp_label: "OTP Code",
      verify_btn: "Verify Code",
      verifying: "Verifying...",
      no_otp_received: "Didn't receive the code?",
      resend_btn: "Resend Code",
      change_email_link: "Change Email Address",
      resetPassword: "Reset Password",
      reset_password_title: "New Password",
      reset_password_desc: "Create a new password for",
      save_password_btn: "Save Password 🔐",
      updating: "Updating...",
      update_password_btn: "Update Password",

      // شاشات وفحوصات روابط البريد (Email Verification Link Queries)
      checking_title: "Checking...",
      please_wait_desc: "Please wait while we verify your email address",
      verify_email_success_title: "Verified successfully!",
      verify_email_success_desc: "Your email has been successfully verified.",
      verify_email_failed_title: "Verification failed",
      verify_email_failed_desc: "We couldn't verify your email link.",
      return_to_login: "Return to login",

      // لوحة التحكم الخاصة بالإدارة (Admin Panel)
      total_users: "Total Users",
      no_users_found: "No users found",
      table_user: "User",
      table_email: "Email",
      table_role: "Role",
      table_status: "Status",
      table_actions: "Actions",
      current_user_badge: "You",
      role_admin: "Admin",
      role_user: "Customer",
      role_disabled: "Disabled",
      status_verified: "Verified",
      status_unverified: "Unverified",
      btn_make_admin: "Admin",
      btn_make_user: "User",
      btn_disable: "Disable",
      btn_enable: "Enable",
      pagination_prev: "Previous",
      pagination_next: "Next",
      confirm_disable:
        'Are you sure you want to disable the account of "{{name}}"?',
      confirm_delete:
        'Are you sure you want to permanently delete the account of "{{name}}"?',
      // Footer Section
      footer_description: "Build modern websites using React and Tailwind CSS.",
      footer_company: "Company",
      footer_about: "About Us",
      footer_support: "Support",
      footer_contact: "Contact",
      footer_privacy: "Privacy Policy",
      footer_follow_us: "Follow Us",
      footer_rights: "All rights reserved.",

      // رسائل الخطأ والتحقق من الحقول (Validation Object)
      validation: {
        first_name_short: "First name is too short",
        last_name_short: "Last name is too short",
        current_password_required: "Current password is required",
        new_password_short: "New password must be at least 8 characters",
        confirm_password_required: "Confirm password is required",
        passwords_dont_match: "The two new passwords do not match",
      },

      // إشعارات التنبيه (Toasts & Errors)
      email_required_error: "Please enter your email address first",
      invalid_link_error: "Verification link is invalid",
      session_expired_error: "Session expired",
      signup_success:
        "Account created successfully! Please Check your email. 🎉",
      signup_failed: "Registration failed",
      otp_sent_success: "OTP code sent to your email successfully 📧",
      otp_verified_success: "Verified successfully ✅",
      otp_resent_success: "Code resent successfully 📧",
      reset_password_success: "Password reset successfully 🎉",
      toast_logout_success: "Logged out successfully",
      toast_logout_error: "Failed to log out",
      toast_disabled_success: "Account has been disabled successfully",
      toast_enabled_success: "Account has been activated successfully",
      toast_role_changed_success: "Role has been updated successfully",
      toast_deleted_success: "Account has been deleted successfully",

      toast: {
        images_only_error: "Only image uploads are allowed",
        image_size_error: "Image size must be less than 2MB",
        profile_updated_success: "Profile updated successfully",
        password_updated_success: "Password changed successfully 🎉",
        process_failed_error: "Operation failed",
      },
    },
  },

  // 🇸🇦 اللغة العربية
  ar: {
    translation: {
      // عناصر عامة والملاحة (Navbar & General)
      logo: "متجري",
      home: "الرئيسية",
      about: "عنا",
      profile: "الملف الشخصي",
      admin: "لوحة الإدارة",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      logout: "تسجيل الخروج",
      default_user_name: "مستخدم",

      // صفحة المظهر الرئيسي (Hero Section)
      hero_title: "ابنِ مواقع ويب حديثة بشكل أسرع",
      hero_description:
        "أنشئ مواقع إلكترونية جذابة ومتجاوبة بالكامل باستخدام React و Tailwind CSS و shadcn/ui.",
      hero_get_started_btn: "ابدأ الآن",
      hero_learn_more_btn: "اقرأ المزيد",

      // شاشات الحساب والتبويبات (Profile Pages & Tabs)
      profile_tab: "الملف الشخصي",
      reset_password_tab: "تغيير كلمة المرور",
      editProfile: "تعديل الحساب",
      edit_profile_title: "تعديل البيانات الشخصية",
      edit_picture_btn: "تعديل الصورة الشخصية",
      saveChanges: "حفظ التغييرات",
      save_changes_btn: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      saving_changes: "جاري حفظ التعديلات...",

      // حقول الاستمارات والبيانات (Form Fields)
      firstName: "الاسم الأول",
      first_name: "الاسم الأول",
      lastName: "الاسم الأخير",
      last_name: "اسم العائلة",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      phone_number: "رقم الهاتف",
      city: "المدينة",
      city_label: "المدينة",
      address: "العنوان",
      address_label: "العنوان",
      zip: "الرمز البريدي",
      zip_code: "الرمز البريدي (Zip Code)",
      password: "كلمة المرور",
      current_password: "كلمة المرور الحالية",
      new_password_label: "كلمة المرور الجديدة",
      confirm_password_label: "تأكيد كلمة المرور",

      // شاشة تسجيل الدخول وإنشاء الحساب (Auth Screens)
      login_title: "الدخول إلى حسابك",
      login_description: "أدخل بريدك الإلكتروني أدناه للدخول إلى حسابك",
      login_btn: "الدخول",
      logging_in: "جاري تسجيل الدخول...",
      no_account: "ليس لديك حساب؟",
      have_account: "لديك حساب بالفعل؟",
      signup_title: "إنشاء حساب جديد",
      signup_description: "أدخل البيانات المطلوبة أدناه لإنشاء حسابك",
      signup_btn: "إنشاء الحساب",
      signing_up: "جاري إنشاء الحساب...",
      login_link: "الدخول",
      login_link_back: "الدخول",

      // استعادة كلمة المرور والتحقق (Password Recovery & OTP)
      forgot_password: "نسيت كلمة المرور؟",
      forgot_password_title: "نسيت كلمة المرور؟",
      forgot_password_desc: "أدخل بريدك الإلكتروني وسنرسل لك كود التحقق OTP",
      send_otp_btn: "إرسال كود التحقق",
      remember_password: "تذكرت كلمة المرور؟",
      verify_otp_title: "أدخل كود التحقق",
      verify_otp_desc: "تم إرسال كود OTP للتحقق إلى",
      otp_label: "كود OTP",
      verify_btn: "تحقق من الكود",
      verifying: "جاري التحقق...",
      no_otp_received: "ما وصلك الكود؟",
      resend_btn: "إعادة الإرسال",
      change_email_link: "تغيير البريد الإلكتروني",
      resetPassword: "تغيير كلمة المرور",
      reset_password_title: "كلمة مرور جديدة",
      reset_password_desc: "إنشاء كلمة مرور جديدة لـ",
      save_password_btn: "حفظ كلمة المرور 🔐",
      updating: "جاري التحديث...",
      update_password_btn: "تحديث كلمة المرور",

      // شاشات وفحوصات روابط البريد (Email Verification Link Queries)
      checking_title: "جاري التحقق...",
      please_wait_desc: "يرجى الانتظار بينما نتحقق من بريدك الإلكتروني",
      verify_email_success_title: "تم التحقق بنجاح!",
      verify_email_success_desc: "تم تفعيل وتأكيد بريدك الإلكتروني بنجاح.",
      verify_email_failed_title: "فشل التحقق",
      verify_email_failed_desc:
        "لم نتمكن من التحقق من رابط تفعيل البريد الإلكتروني.",
      return_to_login: "العودة لتسجيل الدخول",

      // لوحة التحكم الخاصة بالإدارة (Admin Panel)
      total_users: "إجمالي المستخدمين",
      no_users_found: "لا يوجد مستخدمون",
      table_user: "المستخدم",
      table_email: "البريد",
      table_role: "الدور",
      table_status: "الحالة",
      table_actions: "إجراءات",
      current_user_badge: "أنت",
      role_admin: "مدير",
      role_user: "عميل",
      role_disabled: "معطل",
      status_verified: "محقق",
      status_unverified: "غير محقق",
      btn_make_admin: "أدمن",
      btn_make_user: "مستخدم",
      btn_disable: "تعطيل",
      btn_enable: "تفعيل",
      pagination_prev: "السابق",
      pagination_next: "التالي",
      confirm_disable: 'هل أنت متأكد من تعطيل حساب "{{name}}"؟',
      confirm_delete: 'هل أنت متأكد من حذف حساب "{{name}}" نهائياً؟',
      // Footer Section
      footer_description:
        "ابنِ مواقع إلكترونية حديثة باستخدام React و Tailwind CSS.",
      footer_company: "الشركة",
      footer_about: "من نحن",
      footer_support: "الدعم الفني",
      footer_contact: "اتصل بنا",
      footer_privacy: "سياسة الخصوصية",
      footer_follow_us: "تابعنا على",
      footer_rights: "جميع الحقوق محفوظة.",

      // رسائل الخطأ والتحقق من الحقول (Validation Object)
      validation: {
        first_name_short: "الاسم الأول قصير جداً",
        last_name_short: "اسم العائلة قصير جداً",
        current_password_required: "كلمة المرور الحالية مطلوبة",
        new_password_short: "كلمة المرور الجديدة يجب ألا تقل عن 8 أحرف",
        confirm_password_required: "تأكيد كلمة المرور مطلوب",
        passwords_dont_match: "كلمتا المرور الجديدتان غير متطابقتان",
      },

      // إشعارات التنبيه (Toasts & Errors)
      email_required_error: "يرجى إدخال بريدك الإلكتروني أولاً",
      invalid_link_error: "رابط التحقق هذا غير صالح",
      session_expired_error: "انتهت صلاحية الجلسة",
      signup_success:
        "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني. 🎉",
      signup_failed: "فشل إنشاء الحساب",
      otp_sent_success: "تم إرسال كود OTP لبريدك الإلكتروني بنجاح 📧",
      otp_verified_success: "تم التحقق بنجاح ✅",
      otp_resent_success: "تم إعادة إرسال الكود 📧",
      reset_password_success: "تم إعادة تعيين كلمة المرور بنجاح 🎉",
      toast_logout_success: "تم تسجيل الخروج بنجاح",
      toast_logout_error: "فشل تسجيل الخروج",
      toast_disabled_success: "تم تعطيل الحساب بنجاح",
      toast_enabled_success: "تم تفعيل الحساب بنجاح",
      toast_role_changed_success: "تم تغيير الدور بنجاح",
      toast_deleted_success: "تم حذف الحساب بنجاح",

      toast: {
        images_only_error: "يسمح فقط برفع الملفات الصورية",
        image_size_error: "حجم الصورة يجب أن يكون أقل من 2 ميجابايت",
        profile_updated_success: "تم تحديث الملف الشخصي بنجاح",
        password_updated_success: "تم تغيير كلمة المرور بنجاح 🎉",
        process_failed_error: "فشلت العملية",
      },
    },
  },
};

// --------------------------------------------------------
// 2. تهيئة مكتبة i18next
// --------------------------------------------------------
i18n
  .use(LanguageDetector) // يكتشف ويحفظ لغة المستخدم المفضلة في المتصفح
  .use(initReactI18next) // يربط الإعدادات لتعمل مع مكونات React
  .init({
    resources,
    fallbackLng: "en", // اللغة الاحتياطية في حال عدم توفر لغة المستخدم
    interpolation: {
      escapeValue: false, // تمنع الحماية المزدوجة لأن React يقوم بـ XSS المدمج تلقائياً
    },
  });

// --------------------------------------------------------
// 3. إدارة اتجاهات الصفحة ديناميكياً (RTL / LTR)
// --------------------------------------------------------
i18n.on("languageChanged", (lng) => {
  // تفعيل واجهة RTL عند اختيار اللغة العربية، و LTR لباقي اللغات
  document.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
