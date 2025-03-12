import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { registerUser } from "../redux/userSlice";
import { useTranslation } from "react-i18next";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import Backdrop from "../components/Backdrop";

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    idImage: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await dispatch(registerUser(formDataToSend)).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, idImage: e.target.files[0] });
  };

  return (
    <>
      <Backdrop isOpen={isLoading} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen flex items-center justify-center py-12"
        style={{ backgroundColor: colors.background.default }}
      >
        <div
          className="max-w-md w-full p-6 rounded-lg shadow-lg"
          style={{ backgroundColor: colors.primary.light }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <h2
              className="text-3xl font-bold"
              style={{ color: colors.primary.default }}
            >
              {t("signup")}
            </h2>
            <p
              className="text-sm mt-2"
              style={{ color: colors.secondary.default }}
            >
              {t("signup_subtitle")}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <PersonOutlinedIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.primary.default }}
                />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background.default,
                    borderColor: colors.primary.default,
                  }}
                  placeholder={t("first_name")}
                  required
                />
              </div>
              <div className="relative">
                <PersonOutlinedIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.primary.default }}
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background.default,
                    borderColor: colors.primary.default,
                  }}
                  placeholder={t("last_name")}
                  required
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="relative">
              <EmailOutlinedIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.primary.default }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background.default,
                  borderColor: colors.primary.default,
                }}
                placeholder={t("email")}
                required
              />
            </div>

            <div className="relative">
              <PhoneOutlinedIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.primary.default }}
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background.default,
                  borderColor: colors.primary.default,
                }}
                placeholder={t("phone")}
                required
              />
            </div>

            {/* ID Number */}
            <div className="relative">
              <BadgeOutlinedIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.primary.default }}
              />
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={(e) =>
                  setFormData({ ...formData, idNumber: e.target.value })
                }
                className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background.default,
                  borderColor: colors.primary.default,
                }}
                placeholder={t("idNumber")}
                required
              />
            </div>

            {/* Password Fields */}
            <div className="relative">
              <LockOutlinedIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.primary.default }}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background.default,
                  borderColor: colors.primary.default,
                }}
                placeholder={t("password")}
                required
              />
            </div>

            <div className="relative">
              <LockOutlinedIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: colors.primary.default }}
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background.default,
                  borderColor: colors.primary.default,
                }}
                placeholder={t("confirm_password")}
                required
              />
            </div>

            {/* ID Image Upload */}
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.background.default,
                  borderColor: colors.primary.default,
                }}
                accept="image/*"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full p-3 rounded-lg font-semibold"
              style={{
                backgroundColor: colors.accent.default,
                color: colors.background.default,
              }}
              disabled={status === "loading"}
            >
              {status === "loading" ? t("creatingUser") : t("signup")}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm hover:underline"
              style={{ color: colors.accent.default }}
            >
              {t("already_have_account")} {t("login")}
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Signup;
