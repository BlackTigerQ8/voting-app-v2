import React, { useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import InboxIcon from "@mui/icons-material/Inbox";
import GroupIcon from "@mui/icons-material/Group";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const currentUser = useSelector((state) => state.user.userInfo.user);

  const links = currentUser
    ? [
        {
          title: t("dashboard"),
          icon: <DashboardIcon />,
          path: "/",
        },
        {
          title: t("kanban"),
          icon: <ViewKanbanIcon />,
          path: "/kanban",
          badge: {
            text: "Pro",
            variant: "gray", // custom badge style
          },
        },
        {
          title: t("inbox"),
          icon: <InboxIcon />,
          path: "/inbox",
          badge: {
            text: "3",
            variant: "blue", // custom badge style
          },
        },
        {
          title: t("users"),
          icon: <GroupIcon />,
          path: "/users",
        },
        {
          title: t("products"),
          icon: <ShoppingCartIcon />,
          path: "/products",
        },
        {
          title: t("login"),
          icon: <LoginIcon />,
          path: "/signin",
        },
        {
          title: t("signup"),
          icon: <PersonAddIcon />,
          path: "/signup",
        },
      ]
    : [
        {
          title: "Dashboard",
          icon: <DashboardIcon />,
          path: "/",
        },
        {
          title: "Login",
          icon: <LoginIcon />,
          path: "/login",
        },
        {
          title: "Sign Up",
          icon: <PersonAddIcon />,
          path: "/signup",
        },
      ];

  const containerVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "afterChildren",
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const linkVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: -20,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const renderBadge = (badge) => {
    if (!badge) return null;

    const badgeStyles = {
      gray: `inline-flex items-center justify-center px-2 ms-3 text-sm font-medium bg-opacity-20 rounded-full`,
      blue: `inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium rounded-full`,
    };

    const badgeColors = {
      gray: {
        bg: colors.primary.light,
        text: colors.primary.default,
      },
      blue: {
        bg: colors.accent.default,
        text: colors.background.default,
      },
    };

    return (
      <motion.span
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className={badgeStyles[badge.variant]}
        style={{
          backgroundColor: badgeColors[badge.variant].bg,
          color: badgeColors[badge.variant].text,
        }}
      >
        {badge.text}
      </motion.span>
    );
  };

  return (
    <>
      <motion.div
        className="fixed top-3 left-3 z-50 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Hamburger
          color={`${
            isOpen
              ? theme.palette.mode === "light"
                ? colors.background.default
                : colors.primary.default
              : theme.palette.mode === "light"
              ? colors.primary.default
              : colors.background.default
          }`}
          toggled={isOpen}
          toggle={setIsOpen}
        />
      </motion.div>

      <motion.aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
        style={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? colors.primary.light
              : colors.primary.default,
        }}
        variants={containerVariants}
      >
        <div className="h-full px-3 py-14 overflow-y-auto">
          <AnimatePresence>
            <h2 className="text-2xl mb-10 font-bold text-center">
              {currentUser ? t(currentUser.role) : "Guest"}
            </h2>
            <motion.ul
              className="space-y-2 font-medium pt-14 sm:pt-0"
              initial="closed"
              animate="open"
              exit="closed"
            >
              {links.map((link, index) => {
                const isActive = location.pathname === link.path;

                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={link.path} variants={linkVariants}>
                      <motion.div
                        className={`flex items-center p-2 rounded-lg group relative ${
                          isActive ? "bg-opacity-20 bg-white" : ""
                        }`}
                        whileHover={{ scale: 1.02, x: 5 }}
                        style={{
                          color: isActive
                            ? colors.accent.default
                            : theme.palette.mode === "dark"
                            ? colors.primary.default
                            : colors.background.default,
                        }}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute left-0 w-1 h-full rounded-r"
                            layoutId="activeIndicator"
                            style={{ backgroundColor: colors.accent.default }}
                          />
                        )}
                        <div className="flex items-center min-w-[24px]">
                          <span
                            className="w-5 h-5 transition duration-75"
                            style={{
                              color: isActive
                                ? colors.accent.default
                                : theme.palette.mode === "dark"
                                ? colors.primary.default
                                : colors.background.default,
                            }}
                          >
                            {link.icon}
                          </span>
                        </div>

                        <span
                          className="flex-1 ms-3 whitespace-nowrap font-semibold"
                          style={{
                            color: isActive
                              ? colors.accent.default
                              : theme.palette.mode === "dark"
                              ? colors.primary.default
                              : colors.background.default,
                          }}
                        >
                          {link.title}
                        </span>
                        {link.badge && renderBadge(link.badge)}
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
