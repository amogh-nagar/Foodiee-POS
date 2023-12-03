import React from "react";
import Header from "./components/Header";
import { Route, Switch } from "react-router-dom";
import { routesList } from "./utils/routes";
import { useSelector } from "react-redux";

const App = () => {
  const permissions = useSelector((state) => state.auth.permissions);
  return (
    <div className="flex">
      <Header />
      <div className="bg-primary-50 w-full h-screen text-text hide-scrollbar">
        <Switch>
          {routesList.map((route, index) => {
            if (
              !route.permissions.length ||
              route.permissions.every(
                (permission) => permissions?.indexOf(permission) !== -1
              )
            )
              return route.exact ? (
                <Route key={index} path={route.path} exact>
                  {route.component}
                </Route>
              ) : (
                <Route key={index} path={route.path}>
                  {route.component}
                </Route>
              );
          })}
        </Switch>
      </div>
    </div>
  );
};

export default App;
