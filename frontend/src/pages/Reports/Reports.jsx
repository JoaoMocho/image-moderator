import React, { memo } from "react";
import ScreenTitle from "../../components/ScreenTitle";
import ReportsList from "./partials/ReportsList";

const Reports = () => {
  return (
    <div className={"p-6 flex flex-col items-center"}>
      <ScreenTitle title={"Reports"} />
      <ReportsList />
    </div>
  );
};

export default memo(Reports);
