import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import App from "./App";
import useRefreshToken from "./hooks/useRefreshToken";
import Loader from "./UI/Loaders/Loader";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useFireBaseInitialise from "./hooks/useFireBaseInitialise";
function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const refreshToken = useRefreshToken();
  useFireBaseInitialise(isAuthenticated);
  if (refreshToken?.isLoading) {
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
        <ToastContainer
          pauseOnFocusLoss={false}
          toastStyle={{ backgroundColor: "#1e2130" }}
        />
      </div>
    </div>
  );
}

export default Layout;
