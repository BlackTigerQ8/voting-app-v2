import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tokens } from "../../theme";
import { registerUser } from "../redux/userSlice";
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
} from "@mui/material";
import {
  checkPhoneExists,
  checkEmailExists,
  checkIdNumberExists,
} from "../redux/usersSlice";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

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
    idImage: yup.mixed().required(t("idImageRequired")),
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
        const result = await dispatch(registerUser(formDataToSend)).unwrap();
        if (result) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Registration failed:", error);
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
              backgroundColor: colors.primary.light,
              mt: 8,
              mb: 8,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ color: colors.primary.default, mb: 3 }}
            >
              {t("signup")}
            </Typography>

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label={t("first_name")}
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label={t("last_name")}
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
                </Grid>
              </Grid>

              {/* Email Field */}
              <TextField
                fullWidth
                margin="normal"
                id="email"
                name="email"
                label={t("email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon
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

              {/* Phone Field */}
              <TextField
                fullWidth
                margin="normal"
                id="phone"
                name="phone"
                label={t("phone")}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon
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

              {/* ID Number Field */}
              <TextField
                fullWidth
                margin="normal"
                id="idNumber"
                name="idNumber"
                label={t("idNumber")}
                value={formik.values.idNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.idNumber && Boolean(formik.errors.idNumber)
                }
                helperText={formik.touched.idNumber && formik.errors.idNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeOutlinedIcon
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

              {/* Password Fields */}
              <TextField
                fullWidth
                margin="normal"
                id="password"
                name="password"
                type="password"
                label={t("password")}
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

              <TextField
                fullWidth
                margin="normal"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label={t("confirm_password")}
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

              {/* File Upload */}
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 2,
                  borderColor: colors.primary.default,
                  color: colors.primary.default,
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
              {formik.values.idImage && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {formik.values.idImage.name}
                </Typography>
              )}

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
                {isLoading ? t("creatingUser") : t("signup")}
              </Button>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  to="/login"
                  style={{
                    color: colors.accent.default,
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
    </>
  );
};

export default Signup;
