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
  IconButton,
} from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import {
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get both status and userInfo from Redux state
  const { status, userInfo, token } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const [languageAnchor, setLanguageAnchor] = useState(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    handleLanguageClose();
  };

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
              backgroundColor: colors.black[500],
              border: `1px solid ${colors.grey[500]}`,
              mt: 8,
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
                position: "relative",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                sx={{ color: colors.yellow[500] }}
              >
                {t("login")}
              </Typography>
              <IconButton
                onClick={handleLanguageClick}
                sx={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <TranslateIcon sx={{ color: colors.yellow[500] }} />
              </IconButton>
              <MuiMenu
                anchorEl={languageAnchor}
                open={Boolean(languageAnchor)}
                onClose={handleLanguageClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    backgroundColor: colors.yellow[100],
                  },
                }}
              >
                {languages.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    sx={{
                      color: colors.yellow[500],
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "30px", color: "inherit" }}>
                      {lang.flag}
                    </ListItemIcon>
                    <ListItemText primary={lang.name} />
                    {i18n.language === lang.code && (
                      <CheckIcon sx={{ ml: 1, color: colors.yellow[300] }} />
                    )}
                  </MenuItem>
                ))}
              </MuiMenu>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                margin="normal"
                id="emailOrPhone"
                name="emailOrPhone"
                // label={t("emailOrPhone_placeholder")}
                placeholder={t("emailOrPhone_placeholder")}
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
                      <PersonOutlinedIcon sx={{ color: colors.yellow[500] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.black[400],
                    "& fieldset": {
                      borderColor: colors.grey[500],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.yellow[500],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.yellow[500],
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.white[500],
                  },
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                type="password"
                // label={t("password_placeholder")}
                placeholder={t("password_placeholder")}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: colors.yellow[500] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.black[400],
                    "& fieldset": {
                      borderColor: colors.grey[500],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.yellow[500],
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.yellow[500],
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: colors.white[500],
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
                  backgroundColor: colors.yellow[500],
                  color: colors.black[500],
                  "&:hover": {
                    backgroundColor: colors.yellow[600],
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
                    color: colors.yellow[500],
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
