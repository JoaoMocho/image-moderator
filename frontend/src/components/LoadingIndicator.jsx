import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingIndicator = ({ className = "" }) => {
  return <AiOutlineLoading3Quarters className={className + " animate-spin"} />;
};

export default LoadingIndicator;
