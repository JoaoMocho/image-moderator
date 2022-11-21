import React, { useState, memo } from "react";
import { BASE_URL } from "../../../app/apiRoutes";
import { FaUserAlt } from "react-icons/fa";
import { CgCheckO } from "react-icons/cg";
import { MdOutlineDangerous } from "react-icons/md";
import { MdOutlineHideImage } from "react-icons/md";
import { FiX } from "react-icons/fi";
import EvaluationDetails from "../../../components/EvaluationDetails";

const ReportCard = ({ report }) => {
  const [showImage, setShowImage] = useState(false);

  const renderImage = () => {
    return (
      <div
        className={"flex flex-col items-center bg-orange-100 p-2 rounded-lg"}
      >
        <div
          className={
            "relative flex items-center justify-center w-72 h-72 lg:w-96 lg:h-96 shadow-md"
          }
        >
          {(report.answered === true && report.approved === true) ||
          showImage ? (
            <img
              alt={"Archived report"}
              src={BASE_URL + "/" + report.image_url}
              className={"max-h-full w-full object-contain"}
            />
          ) : (
            <div className={"flex flex-col items-center justify-center"}>
              <MdOutlineHideImage className={"text-5xl text-white"} />
              <button
                onClick={() => setShowImage(true)}
                className={
                  "mt-2 bg-orange-400 shadow-md p-2 rounded-lg text-lg text-white"
                }
              >
                See image
              </button>
            </div>
          )}
          {report.answered === true && report.approved !== null && (
            <div
              className={`absolute top-1 right-1 flex items-center py-2 px-2 rounded-full text-white ${
                report.approved === true ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {report.approved === true ? (
                <>
                  <CgCheckO className={"text-xl mr-1"} />
                  Approved
                </>
              ) : (
                <>
                  <MdOutlineDangerous className={"text-xl mr-1"} />
                  Rejected
                </>
              )}
            </div>
          )}
          {showImage === true && (
            <button
              onClick={() => setShowImage(false)}
              className={
                "absolute top-1 left-1 flex items-center py-2 px-2 rounded-full font-bold text-xl text-orange-600 bg-white shadow-lg"
              }
            >
              <FiX />
            </button>
          )}
        </div>
        <div className={"flex items-center text-orange-800 font-bold mt-2"}>
          <FaUserAlt />
          <span className={"ml-2"}>{report.user_id}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col items-center px-4 py-4 bg-white rounded-lg shadow-lg border-4 ${
        report.approved === true ? "border-green-500" : "border-red-500"
      } h-fit`}
    >
      {renderImage()}
      <EvaluationDetails report={report} />
      <div className={"mt-2"}>
        Created at {new Date(report.created_at).toLocaleString()}
      </div>
      <div className={"mt-2"}>
        Answered at {new Date(report.answered_at).toLocaleString()}
      </div>
    </div>
  );
};

export default memo(ReportCard);
