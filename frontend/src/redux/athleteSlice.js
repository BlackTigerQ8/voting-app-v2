import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./axiosConfig";
import { toast } from "react-toastify";
import i18next from "i18next";

const initialState = {
  athletes: [],
  status: "idle",
  error: null,
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

const ensureToken = (getState) => {
  const token = getState().user?.token;
  if (!token) {
    throw new Error("Authentication required");
  }
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Fetch all athletes
export const fetchAthletes = createAsyncThunk(
  "athletes/fetchAll",
  async (_, { getState }) => {
    ensureToken(getState);
    const response = await api.get("/athletes");
    return response.data.data.athletes;
  }
);

// Fetch single athlete
export const fetchAthleteById = createAsyncThunk(
  "athletes/fetchOne",
  async (id) => {
    const response = await api.get(`/athletes/${id}`);
    return response.data.data.athlete;
  }
);

// Create athlete
export const createAthlete = createAsyncThunk(
  "athletes/create",
  async (formData, { getState }) => {
    ensureToken(getState);
    const response = await api.post("/athletes", formData);
    return response.data.data.athlete;
  }
);

// Update athlete
export const updateAthlete = createAsyncThunk(
  "athletes/updateAthlete",
  async ({ id, formData }, { getState }) => {
    try {
      ensureToken(getState);
      const response = await api.put(`/athletes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.athlete;
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      throw error;
    }
  }
);

// Delete athlete
export const deleteAthlete = createAsyncThunk(
  "athletes/delete",
  async (id, { getState }) => {
    ensureToken(getState);
    await api.delete(`/athletes/${id}`);
    return id;
  }
);

const athleteSlice = createSlice({
  name: "athletes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAthletes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAthletes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.athletes = action.payload;
      })
      .addCase(fetchAthletes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("athleteFetchFailed"), "error");
      })
      // Fetch one
      .addCase(fetchAthleteById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAthleteById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update or add the athlete to the athletes array
        const index = state.athletes.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.athletes[index] = action.payload;
        } else {
          state.athletes.push(action.payload);
        }
      })
      .addCase(fetchAthleteById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("athleteFetchFailed"), "error");
      })
      // Create
      .addCase(createAthlete.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAthlete.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.athletes.push(action.payload);
        dispatchToast(i18next.t("athleteCreated"), "success");
      })
      .addCase(createAthlete.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("athleteCreateFailed"), "error");
      })
      // Update
      .addCase(updateAthlete.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateAthlete.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.athletes.findIndex(
          (a) => a._id === action.payload._id
        );
        if (index !== -1) {
          state.athletes[index] = action.payload;
        }
        dispatchToast(i18next.t("athleteUpdated"), "success");
      })
      .addCase(updateAthlete.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("athleteUpdateFailed"), "error");
      })
      // Delete
      .addCase(deleteAthlete.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAthlete.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.athletes = state.athletes.filter((a) => a._id !== action.payload);
        dispatchToast(i18next.t("athleteDeleted"), "success");
      })
      .addCase(deleteAthlete.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("athleteDeleteFailed"), "error");
      });
  },
});

export default athleteSlice.reducer;
