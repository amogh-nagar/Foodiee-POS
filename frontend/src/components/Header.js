import React from "react";
import StoreIcon from "../assets/bx_bxs-store-alt.svg";
import { NavLink } from "react-router-dom";
import { routesList } from "../utils/routes";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { FaRegUser } from "react-icons/fa";
import { useHistory } from "react-router-dom";
const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const logoutHandler = () => {
    dispatch(logout());
  };
  const profileHandler = () => {
    history.push("/profile")
  }
  return (
    <>
      <div className="flex-col justify-between items-center bg-primary-600 w-[96px] px-4 py-6 h-screen">
        <div className="rounded-lg bg-secondary-25 mb-4">
          <img src={StoreIcon} alt="logo" className="w-16 h-16" />
        </div>
        <div className="h-[70%] no-scrollbar overflow-y-auto">
          <ul className="hide-scrollbar">
            {routesList.map((item, index) => {
              return (
                !item.onlyRoute ? (<li key={index} className="mb-5">
                  <NavLink exact to={item.path} activeClassName="active-class">
                    <div className="outer-div w-16 h-16 flex justify-center items-center rounded-lg transition-all">
                      {item.icon}
                    </div>
                  </NavLink>
                </li>) : null
              );
            })}
          </ul>
        </div>

        <div>
          <button className="mb-3" onClick={profileHandler}>
            <div className="w-16 h-16 flex text-secondary-300 justify-center items-center rounded-lg transition-all hover:bg-secondary-300 hover:text-white">
              <FaRegUser className="w-10 h-10" />
            </div>
          </button>
          <button className="" onClick={logoutHandler}>
            <div className="w-16 h-16 flex text-secondary-300 justify-center items-center rounded-lg transition-all hover:bg-secondary-300 hover:text-white">
              <CiLogout className="w-10 h-10" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
