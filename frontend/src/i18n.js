import i18n, { changeLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: "ar",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // Login/Auth related
          login: "Login",
          signup: "Sign Up",
          loading: "Loading...",
          emailOrPhone: "Email or Phone",
          emailOrPhone_placeholder: "Enter email or phone",
          password: "Password",
          password_placeholder: "Enter password",
          loginFailed: "Login failed. Please check your credentials.",
          loggedOut: "You have been logged out successfully",
          dont_have_account: "Don't have an account?",
          already_have_account: "Already have an account?",

          // Registration related
          first_name: "First Name",
          last_name: "Last Name",
          email: "Email",
          phone: "Phone",
          idNumber: "ID Number",
          confirm_password: "Confirm Password",
          creatingUser: "Creating Account...",
          upload_id_image: "Upload ID Image",

          // Validation messages
          firstNameRequired: "First name is required",
          lastNameRequired: "Last name is required",
          emailRequired: "Email is required",
          phoneRequired: "Phone number is required",
          emailOrPhoneRequired: "Email or phone is required",
          passwordRequired: "Password is required",
          confirmPasswordRequired: "Please confirm your password",
          idNumberRequired: "ID number is required",
          idImageRequired: "ID image is required",
          invalidEmail: "Invalid email format",
          phoneFormat: "Phone must be 8 digits",
          idNumberFormat: "ID number must be 12 digits",
          passwordMinLength: "Password must be at least 6 characters",
          passwordsMustMatch: "Passwords must match",

          // Existence checks
          phoneAlreadyExists: "Phone number already exists",
          emailAlreadyExists: "Email already exists",
          idNumberAlreadyExists: "ID number already exists",

          // Success messages
          registerUserFulfilled: "Registration successful",
          loginUserFulfilled: "Login successful",
          otpSent: "Verification code sent to your email",
          registrationSuccess: "Registration completed successfully",

          // Navigation/Sidebar
          dashboard: "Dashboard",
          kanban: "Kanban",
          inbox: "Inbox",
          users: "Users",
          products: "Products",

          // User roles
          SuperAdmin: "Super Admin",
          admin: "Administrator",
          user: "User",
          guest: "Guest",
          Voter: "Voter",
          // Logout
          logoutConfirmationTitle: "Confirm Logout",
          logoutConfirmationMessage: "Are you sure you want to logout?",

          // Messages
          messageSent: "Message sent successfully",
          messageError: "Failed to send message",

          // User management
          deleteUserFulfilled: "User deleted successfully",
          deleteUserRejected: "Failed to delete user",
          updateUserFulfilled: "User updated successfully",
          updateUserRejected: "Failed to update user",

          // ID Image
          idImageFulfilled: "ID image uploaded successfully",
          idImageRejected: "Failed to upload ID image",
        },
      },
      ar: {
        translation: {
          // Login/Auth related
          login: "تسجيل الدخول",
          signup: "إنشاء حساب",
          loading: "جاري التحميل...",
          emailOrPhone: "البريد الإلكتروني أو الهاتف",
          emailOrPhone_placeholder: "أدخل البريد الإلكتروني أو الهاتف",
          password: "كلمة المرور",
          password_placeholder: "أدخل كلمة المرور",
          loginFailed: "فشل تسجيل الدخول. يرجى التحقق من بياناتك.",
          loggedOut: "تم تسجيل الخروج بنجاح",
          dont_have_account: "ليس لديك حساب؟",
          already_have_account: "لديك حساب بالفعل؟",

          // Registration related
          first_name: "الاسم الأول",
          last_name: "اسم العائلة",
          email: "البريد الإلكتروني",
          phone: "الهاتف",
          idNumber: "رقم الهوية",
          confirm_password: "تأكيد كلمة المرور",
          creatingUser: "جاري إنشاء الحساب...",
          upload_id_image: "تحميل صورة الهوية",

          // Validation messages
          firstNameRequired: "الاسم الأول مطلوب",
          lastNameRequired: "اسم العائلة مطلوب",
          emailRequired: "البريد الإلكتروني مطلوب",
          phoneRequired: "رقم الهاتف مطلوب",
          emailOrPhoneRequired: "البريد الإلكتروني أو رقم الهاتف مطلوب",
          passwordRequired: "كلمة المرور مطلوبة",
          confirmPasswordRequired: "يرجى تأكيد كلمة المرور",
          idNumberRequired: "رقم الهوية مطلوب",
          idImageRequired: "صورة الهوية مطلوبة",
          invalidEmail: "صيغة البريد الإلكتروني غير صحيحة",
          phoneFormat: "يجب أن يتكون رقم الهاتف من 8 أرقام",
          idNumberFormat: "يجب أن يتكون رقم الهوية من 12 رقم",
          passwordMinLength: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
          passwordsMustMatch: "كلمات المرور غير متطابقة",

          // Existence checks
          phoneAlreadyExists: "رقم الهاتف مستخدم بالفعل",
          emailAlreadyExists: "البريد الإلكتروني مستخدم بالفعل",
          idNumberAlreadyExists: "رقم الهوية مستخدم بالفعل",

          // Success messages
          registerUserFulfilled: "تم التسجيل بنجاح",
          loginUserFulfilled: "تم تسجيل الدخول بنجاح",
          otpSent: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
          registrationSuccess: "تم إكمال التسجيل بنجاح",

          // Navigation/Sidebar
          dashboard: "لوحة التحكم",
          kanban: "كانبان",
          inbox: "صندوق الوارد",
          users: "المستخدمون",
          products: "المنتجات",

          // User roles
          SuperAdmin: "مدير النظام",
          admin: "إداري",
          user: "مستخدم",
          guest: "زائر",
          Voter: "مصوت",

          // Logout
          logoutConfirmationTitle: "تأكيد تسجيل الخروج",
          logoutConfirmationMessage: "هل أنت متأكد من تسجيل الخروج؟",

          // Messages
          messageSent: "تم إرسال الرسالة بنجاح",
          messageError: "فشل في إرسال الرسالة",

          // User management
          deleteUserFulfilled: "تم حذف المستخدم بنجاح",
          deleteUserRejected: "فشل في حذف المستخدم",
          updateUserFulfilled: "تم تحديث المستخدم بنجاح",
          updateUserRejected: "فشل في تحديث المستخدم",

          // ID Image
          idImageFulfilled: "تم رفع صورة الهوية بنجاح",
          idImageRejected: "فشل في رفع صورة الهوية",
        },
      },
    },
  });

export default i18n;
