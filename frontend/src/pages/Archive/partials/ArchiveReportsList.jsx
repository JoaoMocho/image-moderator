import React, { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import ArchiveReportCard from "./ArchiveReportCard";
import {
  selectReports,
  getAnsweredReportsAsync,
  selectReportsStatus,
} from "../../../redux/slices/reportsSlice";
import LoadingIndicator from "../../../components/LoadingIndicator";

const ReportsList = () => {
  const dispatch = useDispatch();
  const reports = useSelector(selectReports);
  const reportsStatus = useSelector(selectReportsStatus);

  useEffect(() => {
    dispatch(getAnsweredReportsAsync());
  }, [dispatch]);

  if (reportsStatus === "loadingAnsweredReports") {
    return (
      <div className={"text-3xl font-semibold text-orange-600 mt-4"}>
        <LoadingIndicator />
      </div>
    );
  }
  if (reportsStatus === "failedGettingAnsweredReports") {
    return (
      <div className={"text-xl font-semibold text-orange-600 mt-4"}>
        Could not get archived reports.
      </div>
    );
  }
  if (reports.length === 0) {
    return (
      <div className={"text-xl font-semibold text-orange-600 mt-4"}>
        There are no reports in the archive.
      </div>
    );
  }

  return (
    <div className={"grid grid-cols-1 gap-8 lg:grid-cols-2"}>
      {reports.map((report) => (
        <ArchiveReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};

export default memo(ReportsList);
