import React from "react";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoImagesOutline } from "react-icons/io5";
import { Outlet, Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div
        className={
          "h-[78px] md:h-[88px] px-6 py-6 flex justify-between items-center bg-gradient-to-r from-orange-600 to-orange-400 shadow-lg z-10"
        }
      >
        <div className={"flex items-center"}>
          <Link to={"/"}>
            <IoImagesOutline
              className={" mr-6 text-2xl text-white md:text-4xl"}
            />
          </Link>
          <h1 className={"text-xl font-bold text-white md:text-4xl"}>
            Image Moderation Service
          </h1>
        </div>
        <div className={"hidden lg:block"}>
          <NavLink
            className={({ isActive }) =>
              `mr-6 text-lg font-bold ${
                isActive ? "text-orange-300" : "text-white"
              }`
            }
            to={"/reports/"}
          >
            Reports
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `mr-6 text-lg font-bold ${
                isActive ? "text-orange-300" : "text-white"
              }`
            }
            to={"/archive/"}
          >
            Archive
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `text-lg font-bold ${isActive ? "text-orange-300" : "text-white"}`
            }
            to={"/new/"}
          >
            New Report
          </NavLink>
        </div>
        <AiOutlineMenu
          className={"text-3xl text-white lg:hidden cursor-pointer"}
          onClick={() => {
            setShowMenu(!showMenu);
          }}
        />
      </div>
      <div
        className={`absolute top-[78px] md:top-[88px] w-full ${
          showMenu ? "h-40 overflow-hidden" : "h-0 overflow-hidden"
        } flex flex-col justify-around items-center bg-gradient-to-r
      from-orange-600 to-orange-400 shadow-lg lg:h-0 transition-height duration-500 ease-in-out z-10`}
      >
        <NavLink
          className={({ isActive }) =>
            `text-lg font-bold ${isActive ? "text-orange-300" : "text-white"}`
          }
          to={"/reports/"}
          onClick={() => setShowMenu(false)}
        >
          Reports
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `text-lg font-bold ${isActive ? "text-orange-300" : "text-white"}`
          }
          to={"/archive/"}
          onClick={() => setShowMenu(false)}
        >
          Archive
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `text-lg font-bold ${isActive ? "text-orange-300" : "text-white"}`
          }
          to={"/new/"}
          onClick={() => setShowMenu(false)}
        >
          New Report
        </NavLink>
      </div>
      <div
        className={
          "h-[calc(100vh-78px)] md:h-[calc(100vh-88px)] overflow-y-auto bg-gradient-to-r from-orange-300 to-orange-200"
        }
      >
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;
