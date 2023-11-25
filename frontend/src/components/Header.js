import React from "react";
import StoreIcon from "../assets/bx_bxs-store-alt.svg";
import { NavLink } from "react-router-dom";
import { routesList } from "../utils/routes";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
const Header = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <>
      <div className="flex-col justify-between items-center bg-primary-600 w-[96px] px-4 py-6 h-screen">
        <div className="rounded-lg bg-secondary-25 mb-4">
          <img src={StoreIcon} alt="logo" className="w-16 h-16" />
        </div>
        <div className="h-[81%] no-scrollbar overflow-y-auto">
          <ul className="hide-scrollbar">
            {routesList.map((item, index) => {
              return (
                <li key={index} className="mb-5">
                  <NavLink exact to={item.path} activeClassName="active-class">
                    <div className="outer-div w-16 h-16 flex justify-center items-center rounded-lg transition-all">
                      {item.icon}
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <button className="" onClick={logoutHandler}>
            <div className="w-16 h-16 flex text-secondary-300 justify-center items-center rounded-lg transition-all hover:bg-secondary-300 hover:text-white">
              <CiLogout className="w-10 h-10" />
            </div>
          </button>
      </div>
    </>
  );
};

export default Header;
