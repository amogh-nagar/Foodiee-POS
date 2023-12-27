import React from "react";
import StoreIcon from "../assets/bx_bxs-store-alt.svg";
import { NavLink } from "react-router-dom";
import { routesList } from "../utils/routes";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { FaRegUser } from "react-icons/fa";
const Header = () => {
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.auth.permissions);
  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <>
      <div className="flex-col justify-between items-center bg-primary-600 w-[96px] px-4 py-6 h-screen">
        <div className="rounded-lg bg-secondary-25 mb-4">
          <img src={StoreIcon} alt="logo" className="w-16 h-16" />
        </div>
        <div className="h-[93%] flex flex-col justify-between items-center">
        <div className="h-[77%] no-scrollbar hide-scrollbar overflow-y-auto">
          <ul className="hide-scrollbar overflow-y-auto">
            {routesList.map((item, index) => {
              return !item.onlyRoute ? (
                !item.permissions.length ||
                item.permissions.every(
                  (permission) => permissions?.indexOf(permission) !== -1
                ) ? (
                  <li key={index} className="mb-5">
                    {item.exact ? (
                      <NavLink
                        exact
                        to={item.path}
                        activeClassName="active-class"
                      >
                        <div className="outer-div w-16 h-16 flex justify-center items-center rounded-lg transition-all">
                          {item.icon}
                        </div>
                      </NavLink>
                    ) : (
                      <NavLink to={item.path} activeClassName="active-class">
                        <div className="outer-div w-16 h-16 flex justify-center items-center rounded-lg transition-all">
                          {item.icon}
                        </div>
                      </NavLink>
                    )}
                  </li>
                ) : null
              ) : null;
            })}
          </ul>
        </div>

        <div>
          <NavLink exact to="/profile" activeClassName="active-class">
            <div className="w-16 mb-3 h-16 flex text-secondary-300 justify-center items-center rounded-lg transition-all hover:bg-secondary-300 hover:text-white">
              <FaRegUser className="w-10 h-10" />
            </div>
          </NavLink>
          <button className="" onClick={logoutHandler}>
            <div className="w-16 h-16 flex text-secondary-300 justify-center items-center rounded-lg transition-all hover:bg-secondary-300 hover:text-white">
              <CiLogout className="w-10 h-10" />
            </div>
          </button>
        </div>
        </div>
      </div>
    </>
  );
};

export default Header;
