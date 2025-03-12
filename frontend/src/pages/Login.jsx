import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { loginUser } from "../redux/userSlice";
import { useTranslation } from "react-i18next";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { helix } from "ldrs"; // Add this import
import { toast } from "react-toastify";
import Backdrop from "../components/Backdrop";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get both status and userInfo from Redux state
  const { status, userInfo, token } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  // Register the loading animation
  helix.register();

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo && token) {
      navigate("/");
    }
  }, [userInfo, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      if (result.data && result.data.token) {
        navigate("/");
      } else {
        toast.error(t("loginFailed"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(t("loginFailed"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Backdrop isOpen={isLoading} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen flex items-center justify-center"
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
              {t("login")}
            </h2>
            <p
              className="text-sm mt-2"
              style={{ color: colors.secondary.default }}
            >
              {t("login_subtitle")}
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <PersonOutlinedIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: colors.primary.default }}
                />
                <input
                  type="text"
                  name="emailOrPhone"
                  value={formData.emailOrPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emailOrPhone: e.target.value })
                  }
                  className="w-full p-3 pl-12 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background.default,
                    borderColor: colors.primary.default,
                  }}
                  placeholder={t("email_placeholder")}
                  required
                />
              </div>
            </div>

            <div>
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
                  placeholder={t("password_placeholder")}
                  required
                />
              </div>
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
              {status === "loading" ? t("loading") : t("login")}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="text-sm hover:underline"
              style={{ color: colors.accent.default }}
            >
              {t("dont_have_account")} {t("signup")}
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
