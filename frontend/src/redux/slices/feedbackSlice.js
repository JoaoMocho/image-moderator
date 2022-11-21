import { createSlice } from "@reduxjs/toolkit";
import {
  getReportsAsync,
  answerReportAsync,
  getAnsweredReportsAsync,
  createNewReportAsync,
} from "./reportsSlice";
import { getEvaluationByIdAsync } from "./evaluationsSlice";

const initialState = {
  success: null,
  message: "",
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clean: (state) => {
      state.success = initialState.success;
      state.message = initialState.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReportsAsync.rejected, (state, action) => {
        state.success = false;
        state.message = "Could not get the reports list.";
      })
      .addCase(getEvaluationByIdAsync.rejected, (state) => {
        state.success = false;
        state.message = "Could not get the details of the report's evaluation.";
      })
      .addCase(answerReportAsync.fulfilled, (state, action) => {
        state.success = true;
        state.message =
          action.payload.callback_notified === true
            ? "Your answer was saved and the callback url was notified. The report was archived."
            : "Your answer was saved but the callback url could not be notified. The report was archived.";
      })
      .addCase(answerReportAsync.rejected, (state) => {
        state.success = true;
        state.message = "Could not save your answer.";
      })
      .addCase(getAnsweredReportsAsync.rejected, (state) => {
        state.success = false;
        state.message = "Could not get the archived reports.";
      })
      .addCase(createNewReportAsync.fulfilled, (state) => {
        state.success = true;
        state.message = "Your new report was created.";
      })
      .addCase(createNewReportAsync.rejected, (state, action) => {
        const errorMessage = action.payload.message;

        state.success = false;
        state.message =
          "Could not create the new report. " +
          errorMessage.charAt(0).toUpperCase() +
          errorMessage.slice(1);
      });
  },
});

export const { clean } = feedbackSlice.actions;

export const selectFeedbackMessage = (state) => state.feedback.message;
export const selectFeedbackSuccess = (state) => state.feedback.success;

export default feedbackSlice.reducer;
