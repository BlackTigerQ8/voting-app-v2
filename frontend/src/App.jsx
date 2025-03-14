import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useMode, ColorModeContext } from "../theme";
import { AnimatePresence, motion } from "framer-motion";

import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { logoutUser, setUser } from "./redux/userSlice";
import { helix } from "ldrs";

// Components
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Athletes from "./pages/Athletes";
import AthleteForm from "./pages/AthleteForm";
import AthleteProfile from "./pages/AthleteProfile";
import UserProfile from "./pages/UserProfile";

function App() {
  // States
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  // Selectors
  const { userInfo, token } = useSelector((state) => state.user);
  const isAuthenticated = Boolean(token && userInfo);
  const userRole = userInfo?.role;

  helix.register();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Effects
  useEffect(() => {
    const lng = navigate.language;
    i18n.changeLanguage(lng);
  }, []);

  useEffect(() => {
    // Function to handle user activity
    const updateLastActivity = () => {
      const currentTime = new Date().getTime();
      sessionStorage.setItem("lastActivity", currentTime.toString());
    };

    // Function to check if user should be logged out
    const checkActivity = () => {
      const lastActivity = sessionStorage.getItem("lastActivity");
      if (lastActivity) {
        const currentTime = new Date().getTime();
        const inactiveTime = currentTime - parseInt(lastActivity);

        // If inactive for more than 24 hours (in milliseconds)
        if (inactiveTime > 24 * 60 * 60 * 1000) {
          dispatch(logoutUser());
          navigate("/login");
        }
      }
    };

    // Add event listeners for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, updateLastActivity);
    });

    // Check activity every minute
    const intervalId = setInterval(checkActivity, 60000);

    // Set initial activity timestamp
    updateLastActivity();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateLastActivity);
      });
      clearInterval(intervalId);
    };
  }, [dispatch, navigate]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <motion.div
          className="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isAuthenticated && <Sidebar isSidebar={isSidebar} />}
          <motion.main
            className={`content w-full ${isAuthenticated ? "sm:ml-64" : ""}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {isAuthenticated && <Topbar setIsSidebar={setIsSidebar} />}
            <div className="p-4">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Login />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Signup />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      isAuthenticated ? (
                        userRole === "Voter" ? (
                          <Navigate to={`/profile/${userInfo._id}`} replace />
                        ) : (
                          <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Home />
                          </motion.div>
                        )
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      isAuthenticated && userRole !== "Voter" ? (
                        <motion.div
                          key="users"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Users />
                        </motion.div>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/athletes"
                    element={
                      isAuthenticated && userRole !== "Voter" ? (
                        <motion.div
                          key="athletes"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Athletes />
                        </motion.div>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/athlete-form"
                    element={
                      isAuthenticated && userRole !== "Voter" ? (
                        <motion.div
                          key="athlete-form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AthleteForm />
                        </motion.div>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/athlete-profile/:id"
                    element={
                      isAuthenticated && userRole !== "Voter" ? (
                        <motion.div
                          key="athlete-profile"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <AthleteProfile />
                        </motion.div>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route
                    path="/profile/:id"
                    element={
                      isAuthenticated ? (
                        <motion.div
                          key="user-profile"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <UserProfile />
                        </motion.div>
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                </Routes>
              </AnimatePresence>
            </div>
          </motion.main>
        </motion.div>
        <ToastContainer />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
