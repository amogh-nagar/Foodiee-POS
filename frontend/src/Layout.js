import Header from "./components/Header";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import App from "./App";

function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="w-full h-full">
        <Switch>
          {!isAuthenticated && (
            <Route path="/auth" exact>
              <Auth />
            </Route>
          )}
          {isAuthenticated && (
            <Route path="/">
              <App />
            </Route>
          )}
          <Route path="*">
            <Redirect to={isAuthenticated ? "/" : '/auth'} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Layout;
