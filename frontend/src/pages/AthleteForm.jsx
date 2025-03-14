import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useDispatch } from "react-redux";
import { createAthlete } from "../redux/athleteSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AthleteForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [imagePreview, setImagePreview] = useState(null);

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t("firstNameRequired")),
    lastName: Yup.string().required(t("lastNameRequired")),
    idNumber: Yup.string()
      .matches(/^\d{12}$/, t("invalidIdNumber"))
      .required(t("idNumberRequired")),
    dateOfBirth: Yup.date().required(t("dateOfBirthRequired")),
    event: Yup.string().required(t("eventRequired")),
    description: Yup.string().required(t("descriptionRequired")),
  });

  const handleSubmit = async (values) => {
    try {
      // Create FormData object to handle file upload
      const formData = new FormData();

      // Add all user data to FormData
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image) {
        formData.append("image", values.image);
      }

      const result = await dispatch(createAthlete(formData)).unwrap();

      if (result) {
        navigate("/athletes");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const textFieldStyles = {
    "& .MuiFormLabel-root": {
      color: colors.yellow[500],
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: colors.yellow[500],
    },
    "& .MuiInputLabel-root": {
      color: colors.yellow[100],
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box m="20px">
        <Typography variant="h4" color={colors.yellow[500]} marginBottom="20px">
          {t("createAthlete")}
        </Typography>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            idNumber: "",
            dateOfBirth: "",
            event: "",
            description: "",
            image: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={t("first_name")}
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2", ...textFieldStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={t("last_name")}
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2", ...textFieldStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={t("idNumber")}
                  name="idNumber"
                  value={values.idNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.idNumber && errors.idNumber}
                  helperText={touched.idNumber && errors.idNumber}
                  sx={{ gridColumn: "span 2", ...textFieldStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="date"
                  label={t("dateOfBirth")}
                  name="dateOfBirth"
                  value={values.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.dateOfBirth && errors.dateOfBirth}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                  InputLabelProps={{ shrink: true }}
                  sx={{ gridColumn: "span 2", ...textFieldStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label={t("event")}
                  name="event"
                  value={values.event}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.event && errors.event}
                  helperText={touched.event && errors.event}
                  sx={{ gridColumn: "span 4", ...textFieldStyles }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  multiline
                  rows={4}
                  label={t("description")}
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && errors.description}
                  helperText={touched.description && errors.description}
                  sx={{ gridColumn: "span 4", ...textFieldStyles }}
                />
                <Box sx={{ gridColumn: "span 4" }}>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(e) => setFieldValue("image", e.target.files[0])}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        backgroundColor: colors.yellow[500],
                        color: colors.black[500],
                        "&:hover": {
                          backgroundColor: colors.yellow[600],
                        },
                      }}
                    >
                      {t("uploadImage")}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box mt={2}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              <Box display="flex" justifyContent="end" mt="20px">
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
                  {t("createAthlete")}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </motion.div>
  );
};

export default AthleteForm;
