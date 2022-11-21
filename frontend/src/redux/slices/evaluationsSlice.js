import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { EVALUATION_BY_ID } from "../../app/apiRoutes";

const initialState = {
  evaluations: {},
  status: "idle",
  error: null,
};

export const getEvaluationByIdAsync = createAsyncThunk(
  "evaluations/getEvaluationById",
  async (id) => {
    const response = await axios.get(EVALUATION_BY_ID(id));
    return response.data;
  }
);

export const reportsSlice = createSlice({
  name: "evaluations",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getEvaluationByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEvaluationByIdAsync.fulfilled, (state, action) => {
        state.status = "succeded";
        state.evaluations[action.payload.evaluation.report_id] =
          action.payload.evaluation;
      })
      .addCase(getEvaluationByIdAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectEvaluations = (state) => state.evaluations.evaluations;
export const selectEvaluationsStatus = (state) => state.evaluations.status;
export const selectEvaluationsError = (state) => state.evaluations.error;

export default reportsSlice.reducer;
