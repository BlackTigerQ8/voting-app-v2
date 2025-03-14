import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/usersSlice";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { users = [], status } = useSelector((state) => state.users);
  const token = useSelector((state) => state.user.token);

  const [openModal, setOpenModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token]);

  const columns = [
    {
      field: "sequenceNumber",
      headerName: "#",
      width: 70,
      renderCell: (params) => {
        if (!params.row) return "";
        const index = users.findIndex((user) => user._id === params.row._id);
        return index + 1;
      },
      sortable: false,
    },
    {
      field: "name",
      headerName: t("name"),
      flex: 1,
      renderCell: (params) => {
        if (!params.row) return "";
        return `${params.row.firstName || ""} ${
          params.row.lastName || ""
        }`.trim();
      },
    },
    {
      field: "email",
      headerName: t("email"),
      flex: 1,
      renderCell: (params) => params.row?.email || "",
    },
    {
      field: "phone",
      headerName: t("phone"),
      flex: 1,
      renderCell: (params) => params.row?.phone || "",
    },
    {
      field: "actions",
      headerName: t("actions"),
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(params.row)}
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
            variant="contained"
            size="small"
            onClick={() => handleDelete(params.row._id)}
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
      ),
    },
  ];

  const handleEdit = (user) => {
    navigate(`/profile/${user._id}`);
  };

  const handleDelete = (userId) => {
    setUserToDelete(userId);
    setOpenModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await dispatch(deleteUser(userToDelete));
      setOpenModal(false);
      setUserToDelete(null);
    }
  };

  // Loading state
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box m="20px">
        <Box
          mt="40px"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: `1px solid ${colors.grey[500]}`,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.grey[500]}`,
              color: colors.grey[100],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.black[500],
              color: colors.yellow[500],
              borderBottom: `1px solid ${colors.grey[500]}`,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.black[500],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: colors.black[500],
              color: colors.grey[100],
              borderTop: `1px solid ${colors.grey[500]}`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: colors.grey[100],
            },
          }}
        >
          <DataGrid
            rows={users || []}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{
          style: {
            backgroundColor: colors.black[500],
            border: `1px solid ${colors.grey[500]}`,
          },
        }}
      >
        <DialogTitle>
          <Typography color={colors.yellow[500]}>{t("deleteUser")}</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color={colors.grey[100]}>
            {t("deleteUserConfirmation")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenModal(false)}
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
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: colors.yellow[500],
              color: colors.black[500],
              "&:hover": {
                backgroundColor: colors.yellow[600],
              },
            }}
          >
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Users;
