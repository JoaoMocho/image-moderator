import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ANSWER_REPORT, REPORTS, ANSWERED_REPORTS } from "../../app/apiRoutes";

const initialState = {
  reports: [],
  status: "idle",
  error: null,
};

export const getReportsAsync = createAsyncThunk(
  "reports/getReports",
  async () => {
    const response = await axios.get(REPORTS);
    return response.data;
  }
);

export const answerReportAsync = createAsyncThunk(
  "reports/answerReport",
  async (data) => {
    const response = await axios.put(ANSWER_REPORT(data.reportId), {
      approved: data.approved,
    });
    return response.data;
  }
);

export const getAnsweredReportsAsync = createAsyncThunk(
  "reports/getAnsweredReports",
  async () => {
    const response = await axios.get(ANSWERED_REPORTS);
    return response.data;
  }
);

export const createNewReportAsync = createAsyncThunk(
  "reports/createNewReport",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(REPORTS, formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    cleanStatus: (state) => {
      state.status = initialState.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReportsAsync.pending, (state) => {
        state.status = "loadingReports";
      })
      .addCase(getReportsAsync.fulfilled, (state, action) => {
        state.status = "succededGettingReports";
        state.reports = action.payload.reports;
      })
      .addCase(getReportsAsync.rejected, (state, action) => {
        state.status = "failedGettingReports";
        state.error = action.error.message;
      })
      .addCase(answerReportAsync.pending, (state, action) => {
        state.status =
          action.meta.arg?.approved === true
            ? "approvingReport" + action.meta.arg?.reportId
            : "rejectingReport" + action.meta.arg?.reportId;
      })
      .addCase(answerReportAsync.fulfilled, (state, action) => {
        state.status = "succededAnsweringReport";
        state.reports = state.reports.filter((obj) => {
          return obj.id !== action.payload.report_id;
        });
      })
      .addCase(getAnsweredReportsAsync.pending, (state) => {
        state.status = "loadingAnsweredReports";
      })
      .addCase(getAnsweredReportsAsync.fulfilled, (state, action) => {
        state.status = "succededGettingAnsweredReports";
        state.reports = action.payload.reports;
      })
      .addCase(getAnsweredReportsAsync.rejected, (state, action) => {
        state.status = "failedGettingAnsweredReports";
        state.error = action.error.message;
      })
      .addCase(createNewReportAsync.pending, (state) => {
        state.status = "creatingNewReport";
      })
      .addCase(createNewReportAsync.fulfilled, (state, action) => {
        state.status = "succededCreatingNewReport";
      })
      .addCase(createNewReportAsync.rejected, (state, action) => {
        state.status = "failedCreatingNewReport";
        state.error = action.error.message;
      });
  },
});

export const { cleanStatus } = reportsSlice.actions;

export const selectReports = (state) => state.reports.reports;
export const selectReportsStatus = (state) => state.reports.status;
export const selectReportsError = (state) => state.reports.error;

export default reportsSlice.reducer;
