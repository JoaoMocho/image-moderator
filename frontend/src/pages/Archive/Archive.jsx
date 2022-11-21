import React from "react";
import ScreenTitle from "../../components/ScreenTitle";
import ArchiveReportsList from "./partials/ArchiveReportsList";

const Archive = () => {
  return (
    <div className={"p-6 flex flex-col items-center"}>
      <ScreenTitle title={"Archive"} />
      <ArchiveReportsList />
    </div>
  );
};

export default Archive;
