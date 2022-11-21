import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEvaluations,
  getEvaluationByIdAsync,
} from "../redux/slices/evaluationsSlice";
import LoadingIndicator from "./LoadingIndicator";

const EvaluationDetails = ({ report }) => {
  const dispatch = useDispatch();
  const evaluations = useSelector(selectEvaluations);

  const [showDetails, setShowDetails] = useState(false);

  if (report.evaluated === false) {
    return (
      <div
        onClick={() => setShowDetails(!showDetails)}
        className={
          "flex flex-col border-b self-stretch bg-orange-200 cursor-pointer rounded-lg mt-4 p-3"
        }
      >
        <div
          className={
            "flex items-center justify-between text-gray-100 font-bold text-xl"
          }
        >
          <div>Not evaluated</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        if (showDetails === false && !evaluations[report.id]) {
          dispatch(getEvaluationByIdAsync(report.id));
        }
        setShowDetails(!showDetails);
      }}
      className="flex flex-col border-b self-stretch bg-orange-600 cursor-pointer rounded-lg mt-4 p-3"
    >
      <div
        className={`${
          showDetails ? "border-b border-orange-700" : ""
        } flex items-center justify-between text-white font-bold text-2xl`}
      >
        <div>Evaluation Details</div>
        {!showDetails ? (
          <FiChevronDown className="text-2xl" />
        ) : (
          <FiChevronUp className="text-2xl" />
        )}
      </div>
      <div
        className={`${
          !showDetails ? "h-0" : "h-96"
        } overflow-hidden transition-height duration-500 ease-in-out text-white text-lg font-bold`}
      >
        {evaluations[report.id] ? (
          <>
            <div className="mt-3">Nudity:</div>
            <div className="ml-4">
              - Raw: {evaluations[report.id].nudity_raw}
            </div>
            <div className="ml-4">
              - Partial: {evaluations[report.id].nudity_partial}
            </div>
            <div className="mt-3">Weapons: {evaluations[report.id].weapon}</div>
            <div className="mt-3">
              Alcohol: {evaluations[report.id].alcohol}
            </div>
            <div className="mt-3">Drugs: {evaluations[report.id].drugs}</div>
            <div className="mt-3">
              Offensive: {evaluations[report.id].offensive}
            </div>
            <div className="mt-3">Gore: {evaluations[report.id].gore}</div>

            <div className="mt-3 font-normal text-orange-300">
              Classified by SightEngine <br />
              {new Date(evaluations[report.id].created_at).toDateString()}
            </div>
          </>
        ) : (
          <div className="flex justify-center mt-4">
            <LoadingIndicator />
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationDetails;
