import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "../../theme";
import { loginUser } from "../redux/userSlice";
import { useTranslation } from "react-i18next";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { helix } from "ldrs"; // Add this import
import { toast } from "react-toastify";
import Backdrop from "../components/Backdrop";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  useTheme,
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";

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

  const validationSchema = yup.object({
    emailOrPhone: yup.string().required(t("emailOrPhoneRequired")),
    password: yup.string().required(t("passwordRequired")),
  });

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const result = await dispatch(loginUser(values)).unwrap();
        if (result.data && result.data.token) {
          navigate("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

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
      <Container component="main" maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: colors.primary.light,
              mt: 8,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ color: colors.primary.default, mb: 3 }}
            >
              {t("login")}
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                margin="normal"
                id="emailOrPhone"
                name="emailOrPhone"
                label={t("email_placeholder")}
                value={formik.values.emailOrPhone}
                onChange={formik.handleChange}
                error={
                  formik.touched.emailOrPhone &&
                  Boolean(formik.errors.emailOrPhone)
                }
                helperText={
                  formik.touched.emailOrPhone && formik.errors.emailOrPhone
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon
                        sx={{ color: colors.primary.default }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: colors.background.default,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: colors.primary.default,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                type="password"
                label={t("password_placeholder")}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: colors.primary.default }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: colors.background.default,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: colors.primary.default,
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: colors.accent.default,
                  "&:hover": {
                    backgroundColor: colors.accent.dark,
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? t("loading") : t("login")}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  to="/signup"
                  style={{
                    color: colors.accent.default,
                    textDecoration: "none",
                  }}
                >
                  <Typography variant="body2">
                    {t("dont_have_account")} {t("signup")}
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </>
  );
};

export default Login;
