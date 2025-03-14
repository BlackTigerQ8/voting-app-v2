import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "../../theme";
import {
  registerUser,
  initiateRegistration,
  cleanupTempUser,
} from "../redux/userSlice";
import { useTranslation } from "react-i18next";
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
  Grid,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
} from "@mui/material";
import {
  checkPhoneExists,
  checkEmailExists,
  checkIdNumberExists,
} from "../redux/usersSlice";
import OTPVerification from "../components/OTPVerification";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import CheckIcon from "@mui/icons-material/Check";

const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    const formDataToSend = new FormData();

    // Append all form values to FormData
    Object.keys(values).forEach((key) => {
      formDataToSend.append(key, values[key]);
    });

    try {
      const result = await dispatch(
        initiateRegistration(formDataToSend)
      ).unwrap();
      if (result.status === "Success") {
        setTempUserId(result.tempUserId);
        setShowOTPDialog(true);
      }
    } catch (error) {
      console.error("Registration initiation failed:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(t("firstNameRequired")),
    lastName: yup.string().required(t("lastNameRequired")),
    phone: yup
      .string()
      .matches(/^\d{8}$/, t("phoneFormat"))
      .required(t("phoneRequired"))
      .test("unique", t("phoneAlreadyExists"), async function (value) {
        if (!value) return true;
        const result = await dispatch(checkPhoneExists(value));
        return !result.payload;
      }),
    email: yup
      .string()
      .email(t("invalidEmail"))
      .required(t("emailRequired"))
      .test("unique", t("emailAlreadyExists"), async function (value) {
        if (!value) return true;
        const result = await dispatch(checkEmailExists(value));
        return !result.payload;
      }),
    idNumber: yup
      .string()
      .matches(/^\d{12}$/, t("idNumberFormat"))
      .required(t("idNumberRequired"))
      .test("unique", t("idNumberAlreadyExists"), async function (value) {
        if (!value) return true;
        const result = await dispatch(checkIdNumberExists(value));
        return !result.payload;
      }),
    password: yup
      .string()
      .min(6, t("passwordMinLength"))
      .required(t("passwordRequired")),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], t("passwordsMustMatch"))
      .required(t("confirmPasswordRequired")),
    idImage: yup
      .mixed()
      .required(t("idImageRequired"))
      .test("fileSize", t("fileTooLarge"), (value) => {
        return value && value.size <= 2000000; // Example: max 2MB
      })
      .test("fileType", t("unsupportedFormat"), (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      idNumber: "",
      password: "",
      confirmPassword: "",
      idImage: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      const formDataToSend = new FormData();

      // Append all form values to FormData
      Object.keys(values).forEach((key) => {
        formDataToSend.append(key, values[key]);
      });

      try {
        // Change this from registerUser to initiateRegistration
        const result = await dispatch(
          initiateRegistration(formDataToSend)
        ).unwrap();
        if (result.status === "Success") {
          setTempUserId(result.tempUserId);
          setShowOTPDialog(true);
        }
      } catch (error) {
        console.error("Registration initiation failed:", error);
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Update file input handler to work with formik
  const handleFileChange = (event) => {
    formik.setFieldValue("idImage", event.currentTarget.files[0]);
  };

  useEffect(() => {
    return () => {
      if (tempUserId) {
        dispatch(cleanupTempUser(tempUserId));
      }
    };
  }, [tempUserId, dispatch]);

  // Update the OTP dialog close handler
  const handleOTPDialogClose = async () => {
    if (tempUserId) {
      try {
        await dispatch(cleanupTempUser(tempUserId)).unwrap();
      } catch (error) {
        console.error("Failed to cleanup temporary user:", error);
      }
    }
    setShowOTPDialog(false);
    setTempUserId(null);
  };

  return (
    <>
      <Backdrop isOpen={isLoading} />
      <Container component="main" maxWidth="sm">
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
              mb: 8,
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
                  color: colors.white[500],
                  "&:hover": { backgroundColor: `${colors.grey[500]}20` },
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
                    backgroundColor: colors.black[500],
                    border: `1px solid ${colors.grey[500]}`,
                  },
                }}
              >
                {languages.map((lang) => (
                  <MenuItem
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    sx={{
                      color: colors.white[500],
                      "&:hover": {
                        backgroundColor: `${colors.grey[500]}20`,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "30px", color: "inherit" }}>
                      {lang.flag}
                    </ListItemIcon>
                    <ListItemText primary={lang.name} />
                    {i18n.language === lang.code && (
                      <CheckIcon sx={{ ml: 1, color: colors.yellow[500] }} />
                    )}
                  </MenuItem>
                ))}
              </MuiMenu>
            </Box>

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    // label={t("first_name")}
                    placeholder={t("first_name")}
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon
                            sx={{ color: colors.yellow[500] }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.black[400],
                        color: colors.white[500],
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
                      "& .MuiFormHelperText-root": {
                        color: colors.yellow[500],
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    // label={t("last_name")}
                    placeholder={t("last_name")}
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlinedIcon
                            sx={{ color: colors.yellow[500] }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: colors.black[400],
                        color: colors.white[500],
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
                      "& .MuiFormHelperText-root": {
                        color: colors.yellow[500],
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Email Field */}
              <TextField
                fullWidth
                margin="normal"
                id="email"
                name="email"
                // label={t("email")}
                placeholder={t("email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: colors.yellow[500] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.black[400],
                    color: colors.white[500],
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
                  "& .MuiFormHelperText-root": {
                    color: colors.yellow[500],
                  },
                }}
              />

              {/* Phone Field */}
              <TextField
                fullWidth
                margin="normal"
                id="phone"
                name="phone"
                // label={t("phone")}
                placeholder={t("phone")}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ color: colors.yellow[500] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.black[400],
                    color: colors.white[500],
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
                  "& .MuiFormHelperText-root": {
                    color: colors.yellow[500],
                  },
                }}
              />

              {/* ID Number Field */}
              <TextField
                fullWidth
                margin="normal"
                id="idNumber"
                name="idNumber"
                // label={t("idNumber")}
                placeholder={t("idNumber")}
                value={formik.values.idNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.idNumber && Boolean(formik.errors.idNumber)
                }
                helperText={formik.touched.idNumber && formik.errors.idNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon sx={{ color: colors.yellow[500] }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.black[400],
                    color: colors.white[500],
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
                  "& .MuiFormHelperText-root": {
                    color: colors.yellow[500],
                  },
                }}
              />

              {/* Password Fields */}
              <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                type="password"
                // label={t("password")}
                placeholder={t("password")}
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
                    color: colors.white[500],
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
                  "& .MuiFormHelperText-root": {
                    color: colors.yellow[500],
                  },
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                // label={t("confirm_password")}
                placeholder={t("confirm_password")}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
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
                    color: colors.white[500],
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
                  "& .MuiFormHelperText-root": {
                    color: colors.yellow[500],
                  },
                }}
              />

              {/* File Upload */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 1,
                  borderColor: colors.yellow[500],
                  color: colors.yellow[500],
                }}
              >
                {t("upload_id_image")}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {formik.touched.idImage && formik.errors.idImage && (
                <Typography variant="body2" color="error" sx={{ ml: 2 }}>
                  {formik.errors.idImage}
                </Typography>
              )}

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
                  "&:disabled": {
                    backgroundColor: colors.grey[500],
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? t("creatingUser") : t("signup")}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  to="/login"
                  style={{
                    color: colors.yellow[500],
                    textDecoration: "none",
                  }}
                >
                  <Typography variant="body2">
                    {t("already_have_account")} {t("login")}
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>
      <OTPVerification
        open={showOTPDialog}
        tempUserId={tempUserId}
        onClose={handleOTPDialogClose}
      />
    </>
  );
};

export default Signup;
