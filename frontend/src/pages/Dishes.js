import React from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { Switch, NavLink, Route, useRouteMatch } from "react-router-dom";
import Dishes from "../components/Dishes/Dishes";
import Categories from "../components/categories/Categories";
import Taxes from "../components/Tax/Taxes";
import { alterFilters } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllBrandsQuery } from "../services/brand";

const DishesPage = () => {
  let { url } = useRouteMatch();
  const auth = useSelector((state) => state.auth);
  let selectedBrand = useSelector((state) => state.ui.filters.selectedBrand);
  const dispatch = useDispatch();
  selectedBrand = selectedBrand ?? {};
  const handleSelectChange = (option) => {
    dispatch(
      alterFilters({
        type: "SET_FILTER",
        name: "selectedBrand",
        value: option,
        resetFields: ["selectedSuperCategory", "selectedCategory"],
      })
    );
  };
  return (
    <div className="h-full w-full">
      <PageNameWithDate
        name="Dishes"
        isMultiSelect={true}
        defaultValue={
          selectedBrand && selectedBrand.value ? selectedBrand.value : ""
        }
        handleSelectChange={handleSelectChange}
        useGetOptionsQuery={useGetAllBrandsQuery}
        skip={!auth.isSuperAdmin && !auth.tenantIds && !auth.brandIds}
        inputQuery={auth.brandsQuery}
        field={"brands"}
        customField={["tenantId"]}
      />
      <div className="w-full h-full mb-4 px-4 mt-4">
        <ul className="flex h-10 w-full py-2 px-5 bg-primary-700 rounded-2xl">
          <li className="w-[67px] h-9 mr-4">
            <NavLink
              exact
              to={`${url}`}
              className="text-gray-300"
              activeClassName="active-dish-btn"
            >
              Dishes
            </NavLink>
          </li>
          <li className="w-[95px] h-9 mr-4">
            <NavLink
              to={`${url}/categories`}
              className="text-gray-300"
              activeClassName="active-dish-btn"
            >
              Categories
            </NavLink>
          </li>
        </ul>
        <Switch>
          <Route path={url} exact>
            <Dishes />
          </Route>
          <Route path={`${url}/categories`}>
            <Categories />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default DishesPage;
