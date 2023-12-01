import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import App from "./App";
import { useEffect } from "react";
import useRefreshToken from "./hooks/useRefreshToken";
import Loader from "./UI/Loaders/Loader";
function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const refreshToken = useRefreshToken()
  useEffect(() => {
    try{
      refreshToken.reAttemptLogin();
    } catch(e){
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("isAuthenticated", isAuthenticated)
  if (refreshToken.reLogin?.isLoading) {
    return <Loader />;
  }
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
            <Redirect to={isAuthenticated ? "/" : "/auth"} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Layout;
