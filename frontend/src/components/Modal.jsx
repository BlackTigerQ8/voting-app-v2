import React from "react";
import { Modal as MuiModal, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { motion } from "framer-motion";

const Modal = ({ open, onClose, onConfirm, title, message }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: colors.black[500],
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          border: `1px solid ${colors.grey[500]}`,
        }}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{ color: colors.yellow[500], mb: 2 }}
        >
          {title}
        </Typography>
        <Typography
          id="modal-description"
          sx={{ color: colors.yellow[500], mb: 2 }}
        >
          {message}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            onClick={onClose}
            sx={{
              color: colors.grey[500],
              "&:hover": {
                backgroundColor: `${colors.grey[500]}20`,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            sx={{
              backgroundColor: colors.yellow[500],
              color: colors.black[500],
              "&:hover": {
                backgroundColor: colors.yellow[600],
              },
            }}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </MuiModal>
  );
};

export default Modal;
