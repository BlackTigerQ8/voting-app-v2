import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useTheme,
  IconButton,
  Menu as MuiMenu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import { useTranslation } from "react-i18next";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CheckIcon from "@mui/icons-material/Check";
import { logoutUser } from "../redux/userSlice";
import Modal from "./Modal";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Language menu state
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const currentUser = useSelector((state) => state.user.userInfo);

  const languages = [
    { code: "en", name: "English", flag: "en" },
    { code: "ar", name: "العربية", flag: "ar" },
    // Add more languages as needed
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

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    dispatch(logoutUser());
    localStorage.clear();
    navigate("/login");
    setLogoutModalOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  // const menuVariants = {
  //   hidden: { opacity: 0, y: -10 },
  //   visible: { opacity: 1, y: 0 },
  //   exit: { opacity: 0, y: -10 },
  // };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end p-2 relative"
      style={{
        backgroundColor: colors.black[500],
        borderBottom: `1px solid ${colors.grey[500]}`,
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        {/* Language Selector */}
        <div>
          <IconButton
            onClick={handleLanguageClick}
            className="flex items-center"
            sx={{
              color: colors.white[500],
              "&:hover": { backgroundColor: `${colors.grey[500]}20` },
            }}
          >
            <TranslateIcon />
            <KeyboardArrowDownIcon
              sx={{
                transform: languageAnchor ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>

          <MuiMenu
            anchorEl={languageAnchor}
            open={Boolean(languageAnchor)}
            onClose={handleLanguageClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: colors.black[500],
                border: `1px solid ${colors.grey[500]}`,
                "& .MuiMenuItem-root": {
                  color: colors.white[500],
                },
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
        </div>

        {/* Theme Toggle */}
        <IconButton
          onClick={colorMode.toggleColorMode}
          sx={{ color: colors.yellow[500] }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        {/* Notification Icon */}
        {/* <IconButton sx={{ color: colors.white[500] }}>
          <NotificationsOutlinedIcon />
        </IconButton> */}

        {/* Settings Icon */}
        <IconButton
          onClick={() => navigate("/settings")}
          sx={{ color: colors.white[500] }}
        >
          <SettingsOutlinedIcon />
        </IconButton>

        {/* Profile/Login Icons */}
        {currentUser ? (
          <>
            <IconButton
              onClick={() => navigate(`/profile/${currentUser.user._id}`)}
              sx={{ color: colors.white[500] }}
            >
              <PersonOutlinedIcon />
            </IconButton>
            <IconButton
              onClick={handleLogoutClick}
              sx={{ color: colors.white[500] }}
            >
              <LogoutIcon />
            </IconButton>
          </>
        ) : (
          <IconButton
            onClick={() => navigate("/login")}
            sx={{ color: colors.white[500] }}
          >
            <PersonOutlinedIcon />
          </IconButton>
        )}
      </motion.div>
      <Modal
        open={logoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title={t("logoutConfirmationTitle")}
        message={t("logoutConfirmationMessage")}
      />
    </motion.div>
  );
};

export default Topbar;
