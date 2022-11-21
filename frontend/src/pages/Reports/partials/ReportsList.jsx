import React, { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReportCard from "./ReportCard";
import {
  selectReports,
  getReportsAsync,
  selectReportsStatus,
} from "../../../redux/slices/reportsSlice";
import LoadingIndicator from "../../../components/LoadingIndicator";

const ReportsList = () => {
  const dispatch = useDispatch();
  const reports = useSelector(selectReports);
  const reportsStatus = useSelector(selectReportsStatus);

  useEffect(() => {
    dispatch(getReportsAsync());
  }, [dispatch]);

  if (reportsStatus === "loadingReports") {
    return (
      <div className={"text-3xl font-semibold text-orange-600 mt-4"}>
        <LoadingIndicator />
      </div>
    );
  }
  if (reportsStatus === "failedGettingReports") {
    return (
      <div className={"text-xl font-semibold text-orange-600 mt-4"}>
        Could not get reports.
      </div>
    );
  }
  if (reports.length === 0) {
    return (
      <div className={"text-xl font-semibold text-orange-600 mt-4"}>
        There are no new reports to moderate.
      </div>
    );
  }

  return (
    <div className={"grid grid-cols-1 gap-8 lg:grid-cols-2"}>
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};

export default memo(ReportsList);
