import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "./pages/Auth";
import App from "./App";
import { useEffect } from "react";
import useRefreshToken from "./hooks/useRefreshToken";
import Loader from "./UI/Loaders/Loader";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function Layout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const refreshToken = useRefreshToken();
  useEffect(() => {
    try {
      refreshToken.reAttemptLogin();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   var retrievePushNotificationToken = async () => {
  //     const firebaseConfig = {
  //       apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  //       authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  //       projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  //       storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  //       messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  //       appId: process.env.REACT_APP_FIREBASE_APP_ID,
  //       measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  //     };
  //     const app = initializeApp(firebaseConfig);
  //     const messaging = getMessaging(app);
  //     const permission = await Notification.requestPermission();
  //     if (permission === "granted") {
  //       console.log("Notification User Permission Granted.");
  //       const currentToken = await getToken(messaging, {
  //         vapidKey: `BOvvImWc10nqBX8dmO_MYy9WbxKzpVxisyifzU5QzGqsk_7dOWFqDV8wiO3Ch4r4Un39hbNUBMosvSZdsY9DZJU`,
  //       });
  //       if (currentToken) {
  //         console.log("Client Token: ", currentToken);
  //       } else {
  //         console.log("Failed to generate the registration token.");
  //       }
  //     } else {
  //       console.log("User Permission Denied.");
  //     }
  //   };
  //   if (isAuthenticated) retrievePushNotificationToken();
  // }, [initializeApp, getMessaging, isAuthenticated]);
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
        <ToastContainer
          pauseOnFocusLoss={false}
          toastStyle={{ backgroundColor: "#1e2130" }}
        />
      </div>
    </div>
  );
}

export default Layout;
