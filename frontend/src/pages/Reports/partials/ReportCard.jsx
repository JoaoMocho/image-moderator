import React, { useState, memo } from "react";
import { BASE_URL } from "../../../app/apiRoutes";
import { FaUserAlt } from "react-icons/fa";
import { CgCheckO } from "react-icons/cg";
import { MdOutlineDangerous } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { MdOutlineHideImage } from "react-icons/md";
import { FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  answerReportAsync,
  selectReportsStatus,
} from "../../../redux/slices/reportsSlice";
import EvaluationDetails from "../../../components/EvaluationDetails";
import LoadingIndicator from "../../../components/LoadingIndicator";

const ReportCard = ({ report }) => {
  const dispatch = useDispatch();
  const reportsStatus = useSelector(selectReportsStatus);

  const [showImage, setShowImage] = useState(false);

  const moderateReport = (approved) => {
    dispatch(answerReportAsync({ reportId: report.id, approved }));
  };

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
          {(report.evaluated === true && report.evaluation_score < 0.25) ||
          showImage ? (
            <img
              alt={"Report"}
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
          {report.evaluated === true && report.evaluation_score !== null && (
            <div
              className={`absolute top-1 right-1 flex items-center py-2 px-2 rounded-full text-white ${
                report.evaluation_score < 0.25
                  ? "bg-green-500"
                  : report.evaluation_score < 0.4
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {report.evaluation_score < 0.25 ? (
                <>
                  <CgCheckO className={"text-xl mr-1"} /> Non sensitive
                </>
              ) : report.evaluation_score < 0.4 ? (
                <>
                  <FiAlertTriangle className={"text-xl mr-1"} /> Sensitive
                </>
              ) : (
                <>
                  <MdOutlineDangerous className={"text-xl mr-1"} /> Highly
                  sensitive
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

  const renderButtons = () => {
    if (report.evaluated === true) {
      return (
        <div className={"flex mt-4 text-white font-bold text-xl"}>
          <button
            onClick={() => {
              moderateReport(true);
            }}
            className={
              "flex flex-1 justify-center items-center bg-green-500 hover:bg-green-700  py-4 px-8 border border-green-700 rounded"
            }
          >
            {reportsStatus !== "approvingReport" + report.id ? (
              <FiCheck />
            ) : (
              <LoadingIndicator />
            )}
          </button>
          <button
            onClick={() => {
              moderateReport(false);
            }}
            className={
              "flex flex-1 justify-center items-center bg-red-500 hover:bg-red-700 py-4 px-8 border border-red-700 rounded ml-8"
            }
          >
            {reportsStatus !== "rejectingReport" + report.id ? (
              <FiX />
            ) : (
              <LoadingIndicator />
            )}
          </button>
        </div>
      );
    }
  };

  return (
    <div
      className={
        "flex flex-col items-center px-4 py-4 bg-white rounded-lg shadow-lg h-fit"
      }
    >
      {renderImage()}
      <EvaluationDetails report={report} />
      {renderButtons()}
      <div className={"mt-2"}>
        Created at {new Date(report.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default memo(ReportCard);
