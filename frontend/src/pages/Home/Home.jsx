import React from "react";
import { IoImagesOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className={
        "h-screen flex flex-col justify-center items-center bg-gradient-to-l from-orange-600 to-orange-400 px-10"
      }
    >
      <div className={"grid grid-cols-1 gap-4 lg:grid-cols-2 lg:self-end"}>
        <div className={"flex justify-center items-center lg:justify-end"}>
          <IoImagesOutline className={"text-9xl text-white lg:text-[16rem]"} />
        </div>
        <div className={"flex flex-col justify-center"}>
          <h1 className={"text-xl font-bold text-white lg:text-8xl"}>
            Image Moderation Service
          </h1>
          <div className={"grid grid-cols-1 lg:grid-cols-3 mt-8 gap-3"}>
            <Link
              to={"/reports/"}
              className={
                "bg-white hover:bg-orange-50 text-orange-800 font-bold text-xl text-center px-4 py-3 rounded-full shadow-md"
              }
            >
              See Reports
            </Link>
            <Link
              to={"/archive/"}
              className={
                "bg-white hover:bg-orange-50 text-orange-800 font-bold text-xl text-center px-4 py-3 rounded-full shadow-md"
              }
            >
              See Archive
            </Link>
            <Link
              to={"/new/"}
              className={
                "bg-white hover:bg-orange-50 text-orange-800 font-bold text-xl text-center px-4 py-3 rounded-full shadow-md"
              }
            >
              New Report
            </Link>
          </div>
        </div>
      </div>
      <div
        className={"flex flex-col items-center absolute bottom-2 text-white"}
      >
        by João Mocho Ferreira
      </div>
    </div>
  );
};

export default Home;
