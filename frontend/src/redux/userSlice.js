import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";
import api, { setAuthToken } from "./axiosConfig";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  userInfo: null,
  status: "",
  token: null,
  userRole: "",
};

const dispatchToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    style:
      type === "error"
        ? {
            backgroundColor: "#FFF1F0",
            color: "#FF4D4F",
            borderLeft: "4px solid #FF4D4F",
          }
        : undefined,
  });
};

// Thunk action for initiating registration with OTP
export const initiateRegistration = createAsyncThunk(
  "user/initiateRegistration",
  async (userFormData) => {
    try {
      const response = await axios.post(
        `${API_URL}/users/initiate-registration`,
        userFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for OTP verification and registration
export const verifyOTPAndRegister = createAsyncThunk(
  "user/verifyOTPAndRegister",
  async ({ tempUserId, otp }) => {
    try {
      const response = await axios.post(`${API_URL}/users/verify-otp`, {
        tempUserId,
        otp,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for cleanup temporary user
export const cleanupTempUser = createAsyncThunk(
  "user/cleanupTempUser",
  async (tempUserId) => {
    try {
      await axios.delete(`${API_URL}/users/temp/${tempUserId}`);
    } catch (error) {
      console.error("Cleanup failed:", error);
    }
  }
);

// Thunk action for user registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userFormData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      // Check the response structure from your screenshot
      if (!response.data?.token) {
        return rejectWithValue("No token received");
      }

      // Return the data in the structure we need
      return {
        token: response.data.token,
        user: response.data.data,
      };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action for id image upload
export const idImage = createAsyncThunk("user/idImage", async (imageFile) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", imageFile);
  try {
    const response = await axios.post(`${API_URL}/users/id-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
});

export const submitContactForm = createAsyncThunk(
  "user/submitContactForm",
  async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/users/contact`, formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
      state.userRole = action.payload?.role || "";
      state.token = action.payload.token;
      setAuthToken(action.payload.token);
    },
    logoutUser(state) {
      state.userInfo = null;
      state.userRole = "";
      state.token = null;
      state.status = "";
      setAuthToken(null);
      dispatchToast(i18next.t("loggedOut"), "success");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        // Clear any previous data
        state.userInfo = null;
        state.token = null;
        state.userRole = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update based on the actual response structure
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
        state.userRole = action.payload.user?.role || "";
        dispatchToast(i18next.t("loginUserFulfilled"), "success");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        // Clear any partial data
        state.userInfo = null;
        state.token = null;
        state.userRole = "";
        dispatchToast(i18next.t(state.error), "error");
      })

      ///////////////////
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("registerUserFulfilled"), "success");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      })
      ///////////////////
      .addCase(initiateRegistration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(initiateRegistration.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("otpSent"), "success");
      })
      .addCase(initiateRegistration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      })

      // Verify OTP and Register cases
      .addCase(verifyOTPAndRegister.pending, (state) => {
        state.status = "loading";
      })
      .addCase(verifyOTPAndRegister.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("registrationSuccess"), "success");
      })
      .addCase(verifyOTPAndRegister.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      })

      //////////////////
      .addCase(idImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userIdImage = action.payload.file;
        dispatchToast(i18next.t("idImageFulfilled"), "success");
      })
      .addCase(idImage.rejected, (state) => {
        state.status = "failed";
        dispatchToast(i18next.t("idImageRejected"), "error");
      })
      .addCase(submitContactForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("messageSent"), "success");
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("messageError"), "error");
      });
  },
});

export const { logoutUser, setUser } = userSlice.actions;
export default userSlice.reducer;
