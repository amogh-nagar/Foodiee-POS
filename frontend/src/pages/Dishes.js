import React from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { Switch, NavLink, Route, useRouteMatch } from "react-router-dom";
import Dishes from "../components/Dishes";
import Categories from "../components/Categories";
import Taxes from "../components/Taxes";

const DishesPage = () => {
let { url } = useRouteMatch();
  return (
    <div className="h-full w-full">
      <PageNameWithDate name="Dishes" />
      <div className="w-full h-full mb-4 px-4 mt-4">
        <ul className="flex h-10 w-full py-2 px-5 bg-primary-700 rounded-2xl">
          <li className="w-[67px] h-9 mr-4">
            <NavLink exact to={`${url}`} className="text-gray-300" activeClassName="active-dish-btn">
              Dishes
            </NavLink>
          </li>
          <li className="w-[95px] h-9 mr-4">
            <NavLink to={`${url}/categories`} className="text-gray-300" activeClassName="active-dish-btn">
              Categories
            </NavLink>
          </li>
          <li className="w-[67px] h-9 mr-4">
            <NavLink to={`${url}/taxes`} className="text-gray-300" activeClassName="active-dish-btn">
              Taxes
            </NavLink>
          </li>
        </ul>
        <Switch>
            <Route path={url} exact>
                <Dishes/>
            </Route>
            <Route path={`${url}/categories`} >
                <Categories/>
            </Route>
            <Route path={`${url}/taxes`}>
                <Taxes/>
            </Route>
        </Switch>
      </div>
    </div>
  );
};

export default DishesPage;
