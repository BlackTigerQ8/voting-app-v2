import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAthletes, deleteAthlete } from "../redux/athleteSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../components/Modal";

const Athletes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { athletes, status } = useSelector((state) => state.athletes);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(fetchAthletes());
  }, [dispatch]);

  const handleEdit = (athleteId) => {
    navigate(`/athlete-profile/${athleteId}`);
  };

  const handleDelete = (athlete) => {
    setSelectedAthlete(athlete);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAthlete) {
      await dispatch(deleteAthlete(selectedAthlete._id));
      setOpenModal(false);
      setSelectedAthlete(null);
    }
  };

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <l-pulsar size="40" speed="1.75" color={colors.yellow[500]}></l-pulsar>
      </Box>
    );
  }

  const imageStyles = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px 8px 0 0",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  };

  const cardStyles = {
    backgroundColor: colors.black[500],
    border: `1px solid ${colors.grey[500]}`,
    display: "flex",
    flexDirection: "column",
    height: "400px",
  };

  const cardContentStyles = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h4"
            color={colors.yellow[500]}
            marginBottom="20px"
          >
            {t("athletes")}
          </Typography>
          <Button
            onClick={() => navigate("/athlete-form")}
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

        <Grid container spacing={3}>
          {athletes.map((athlete) => (
            <Grid item xs={12} sm={6} md={4} key={athlete._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={cardStyles}>
                  <CardMedia
                    component="img"
                    height="200"
                    crossOrigin="anonymous"
                    image={`${import.meta.env.VITE_API_URL}/${athlete.image}`}
                    alt={`${athlete.firstName} ${athlete.lastName}`}
                    style={imageStyles}
                  />
                  <CardContent sx={cardContentStyles}>
                    <Box>
                      <Typography variant="h5" color={colors.yellow[500]}>
                        {`${athlete.firstName} ${athlete.lastName}`}
                      </Typography>
                      <Typography variant="body1" color={colors.grey[100]}>
                        {athlete.event}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={colors.grey[300]}
                        sx={{
                          mt: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {athlete.description}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} mt={2}>
                      <Button
                        onClick={() => handleEdit(athlete._id)}
                        sx={{
                          backgroundColor: colors.yellow[500],
                          color: colors.black[500],
                          "&:hover": {
                            backgroundColor: colors.yellow[600],
                          },
                        }}
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        onClick={() => handleDelete(athlete)}
                        sx={{
                          backgroundColor: colors.grey[500],
                          color: colors.white[500],
                          "&:hover": {
                            backgroundColor: colors.grey[600],
                          },
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmDelete}
        title={t("deleteAthlete")}
        message={t("deleteAthleteConfirmation")}
      />
    </motion.div>
  );
};

export default Athletes;
