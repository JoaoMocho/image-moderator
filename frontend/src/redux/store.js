import { configureStore } from "@reduxjs/toolkit";
import evaluationsSlice from "./slices/evaluationsSlice";
import feedbackSlice from "./slices/feedbackSlice";
import reportsReducer from "./slices/reportsSlice";

export const store = configureStore({
  reducer: {
    reports: reportsReducer,
    evaluations: evaluationsSlice,
    feedback: feedbackSlice,
  },
});
