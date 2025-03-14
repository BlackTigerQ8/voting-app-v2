import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTranslation } from "react-i18next";
import {
  checkEmailExists,
  checkIdNumberExists,
  checkPhoneExists,
  fetchUsers,
  updateUser,
} from "../redux/usersSlice";
import Backdrop from "../components/Backdrop";
import api from "../redux/axiosConfig";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useSelector((state) => state.user);
  const { users, status } = useSelector((state) => state.users);
  const isLoading = status === "loading";
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        // Handle response
      } catch (error) {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          navigate("/login");
        }
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [id, token]);

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  const userInfo = users.find((user) => user._id === id);

  const getValidationSchema = (initialValues, currentValues) => {
    return Yup.object({
      firstName: Yup.string().when([], {
        is: () => currentValues.firstName !== initialValues.firstName,
        then: Yup.string().required(t("firstNameRequired")),
      }),
      lastName: Yup.string().when([], {
        is: () => currentValues.lastName !== initialValues.lastName,
        then: Yup.string().required(t("lastNameRequired")),
      }),
      email: Yup.string().when([], {
        is: () => currentValues.email !== initialValues.email,
        then: Yup.string()
          .email(t("invalidEmail"))
          .required(t("emailRequired"))
          .test("unique", t("emailAlreadyExists"), async function (value) {
            if (!value) return true;
            const result = await dispatch(checkEmailExists(value)).unwrap();
            return !result;
          }),
      }),
      phone: Yup.string().when([], {
        is: () => currentValues.phone !== initialValues.phone,
        then: Yup.string()
          .matches(/^\d{8}$/, t("phoneFormat"))
          .required(t("phoneRequired"))
          .test("unique", t("phoneAlreadyExists"), async function (value) {
            if (!value) return true;
            const result = await dispatch(checkPhoneExists(value)).unwrap();
            return !result;
          }),
      }),
      idNumber: Yup.string().when([], {
        is: () => currentValues.idNumber !== initialValues.idNumber,
        then: Yup.string()
          .matches(/^\d{12}$/, t("idNumberFormat"))
          .required(t("idNumberRequired"))
          .test("unique", t("idNumberAlreadyExists"), async function (value) {
            if (!value) return true;
            const result = await dispatch(checkIdNumberExists(value)).unwrap();
            return !result;
          }),
      }),
    });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await dispatch(
        updateUser({ userId: userInfo._id, formData: values })
      ).unwrap();
      if (result) {
        navigate("/users");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!userInfo) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{t("userNotFound")}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Backdrop isOpen={isLoading} />
      <Box m="20px">
        <Typography variant="h4" color={colors.yellow[500]} marginBottom="20px">
          {t("editProfile")}
        </Typography>
        {validationError && (
          <Typography color="error" marginBottom="20px">
            {t("validationError")}: {validationError}
          </Typography>
        )}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: colors.black[500],
            border: `1px solid ${colors.grey[500]}`,
          }}
        >
          <Formik
            initialValues={{
              firstName: userInfo.firstName || "",
              lastName: userInfo.lastName || "",
              email: userInfo.email || "",
              phone: userInfo.phone || "",
              idNumber: userInfo.idNumber || "",
            }}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => {
              const validationSchema = getValidationSchema(userInfo, values);

              return (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={t("first_name")}
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={t("last_name")}
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="email"
                        label={t("email")}
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={t("phone")}
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label={t("idNumber")}
                        name="idNumber"
                        value={values.idNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.idNumber && Boolean(errors.idNumber)}
                        helperText={touched.idNumber && errors.idNumber}
                      />
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="flex-end" mt={3} gap={1}>
                    <Button
                      onClick={() => navigate("/users")}
                      sx={{
                        color: colors.grey[100],
                        "&:hover": {
                          backgroundColor: `${colors.grey[500]}20`,
                        },
                      }}
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: colors.yellow[500],
                        color: colors.black[500],
                        "&:hover": {
                          backgroundColor: colors.yellow[600],
                        },
                      }}
                    >
                      {t("saveChanges")}
                    </Button>
                  </Box>
                </Form>
              );
            }}
          </Formik>
        </Paper>
      </Box>
    </>
  );
};

export default UserProfile;
