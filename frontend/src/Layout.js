import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Auth from "./pages/Auth";
import App from "./App";
import { useEffect } from "react";
import { useReloginMutation } from "./services/auth";
import { login, logout } from "./store/authSlice";
import Loader from "./UI/Loaders/Loader";
function Layout() {
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [reloginApi, { isError, isLoading, data, isSuccess }] =
    useReloginMutation();
  useEffect(() => {
    async function reAttempLogin() {
      const trustedDevice =
        localStorage.getItem("trustedDevice") === "true" ? true : false;
      const token = localStorage.getItem("token");
      if (trustedDevice && token) {
        try {
          const response = await reloginApi().unwrap();
          dispatch(
            login({
              user: response.user,
              permissions: response?.permissions,
              role: response?.role,
            })
          );
        } catch (err) {
          dispatch(logout());
          history.push("/auth");
        }
      }
    }
    reAttempLogin();
  }, [dispatch, reloginApi, history]);
  useEffect(() => {
    if (isSuccess && isAuthenticated) {
      history.push("/");
    } else if (isError) {
      history.push("/auth");
    }
  }, [isSuccess, isError, isAuthenticated, history]);
  if (isLoading) {
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
