import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAthleteById,
  fetchAthletes,
  updateAthlete,
} from "../redux/athleteSlice";
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
import { motion } from "framer-motion";
import Backdrop from "../components/Backdrop";

const AthleteProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [imagePreview, setImagePreview] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [profileImage, setProfileImage] = useState(null);
  const { athletes, status } = useSelector((state) => state.athletes);
  const athlete = athletes.find((a) => a._id === id);
  const isLoading = status === "loading";

  useEffect(() => {
    const loadAthlete = async () => {
      try {
        const result = await dispatch(fetchAthleteById(id)).unwrap();
        if (!result) {
          navigate("/athletes");
        }
      } catch (error) {
        console.error("Error loading athlete:", error);

        navigate("/athletes");
      }
    };

    loadAthlete();
  }, [dispatch, id, navigate, t]);

  useEffect(() => {
    if (athlete?.image) {
      setProfileImage(`${API_URL}/${athlete.image}`);
    }
  }, [athlete]);

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

  const handleImageUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      console.error(t("invalidImageType"));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key === "dateOfBirth") {
          formData.append(key, new Date(values[key]).toISOString());
        } else if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const result = await dispatch(
        updateAthlete({
          id,
          formData,
        })
      ).unwrap();

      if (result) {
        await dispatch(fetchAthletes());

        navigate("/athletes");
      }
    } catch (error) {
      console.error("Error updating athlete:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!athlete && status === "failed") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{t("athleteNotFound")}</Typography>
      </Box>
    );
  }

  const imageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  const paperStyles = {
    p: 3,
    backgroundColor: colors.black[500],
    border: `1px solid ${colors.grey[500]}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <Backdrop isOpen={isLoading} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box m="20px">
          <Typography
            variant="h4"
            color={colors.yellow[500]}
            marginBottom="20px"
          >
            {t("editAthlete")}
          </Typography>

          <Grid
            container
            spacing={3}
            sx={{ display: "flex", alignItems: "stretch" }}
          >
            <Grid
              item
              xs={12}
              md={4}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  backgroundColor: colors.black[500],
                  border: `1px solid ${colors.grey[500]}`,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={2}
                  sx={{ flex: 1 }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={`${athlete?.firstName} ${athlete?.lastName}`}
                      style={imageStyles}
                    />
                  ) : athlete?.image ? (
                    <img
                      src={`${API_URL}/${athlete?.image}`}
                      alt={`${athlete?.firstName} ${athlete?.lastName}`}
                      style={imageStyles}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error("Error loading image");
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        ...imageStyles,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.grey[800],
                      }}
                    >
                      <Typography color={colors.grey[500]}>
                        {t("noImageAvailable")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid
              item
              xs={12}
              md={8}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <Paper elevation={3} sx={{ ...paperStyles, flex: 1 }}>
                <Formik
                  initialValues={{
                    firstName: athlete?.firstName || "",
                    lastName: athlete?.lastName || "",
                    idNumber: athlete?.idNumber || "",
                    dateOfBirth: athlete?.dateOfBirth
                      ? new Date(athlete.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0],
                    event: athlete?.event || "",
                    description: athlete?.description || "",
                    image: null,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}
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
                      <Box display="grid" gap="30px">
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
                              error={touched.firstName && errors.firstName}
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
                              error={touched.lastName && errors.lastName}
                              helperText={touched.lastName && errors.lastName}
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
                              error={touched.idNumber && errors.idNumber}
                              helperText={touched.idNumber && errors.idNumber}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
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
                              helperText={
                                touched.dateOfBirth && errors.dateOfBirth
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
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
                            />
                          </Grid>
                          <Grid item xs={12}>
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
                              helperText={
                                touched.description && errors.description
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <input
                              accept="image/*"
                              type="file"
                              onChange={(e) =>
                                handleImageUpload(e, setFieldValue)
                              }
                              style={{ display: "none" }}
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              style={{ width: "100%" }}
                            >
                              <Button
                                variant="contained"
                                component="span"
                                fullWidth
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
                          </Grid>
                        </Grid>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="flex-end"
                        mt={3}
                        gap={1}
                      >
                        <Button
                          onClick={() => navigate("/athletes")}
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
                  )}
                </Formik>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </>
  );
};

export default AthleteProfile;
