import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clean,
  selectFeedbackMessage,
  selectFeedbackSuccess,
} from "../redux/slices/feedbackSlice";

const FeedbackMessage = () => {
  const dispatch = useDispatch();
  const feedbackMessage = useSelector(selectFeedbackMessage);
  const feedbackSuccess = useSelector(selectFeedbackSuccess);

  useEffect(() => {
    if (feedbackMessage !== "" && feedbackSuccess !== null) {
      setTimeout(() => {
        dispatch(clean());
      }, 4000);
    }
  }, [dispatch, feedbackMessage, feedbackSuccess]);

  if (feedbackMessage !== "" && feedbackSuccess !== null) {
    return (
      <div className={`flex justify-center absolute bottom-0 pb-8 w-full px-2`}>
        <div
          className={`rounded-md font-semibold text-white text-xl shadow-xl px-8 py-3 ${
            feedbackSuccess === true ? "bg-green-700" : "bg-red-700"
          }`}
        >
          {feedbackMessage}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default FeedbackMessage;
