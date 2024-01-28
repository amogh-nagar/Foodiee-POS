import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
const useFireBaseInitialise = (isAuthenticated) => {
  const [fireBaseToken, setFireBaseToken] = useState("");
  useEffect(() => {
    var retrievePushNotificationToken = async () => {
      const firebaseConfig = {
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
      };
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification User Permission Granted.");
        const currentToken = await getToken(messaging, {
          vapidKey: `BOvvImWc10nqBX8dmO_MYy9WbxKzpVxisyifzU5QzGqsk_7dOWFqDV8wiO3Ch4r4Un39hbNUBMosvSZdsY9DZJU`,
        });
        if (currentToken) {
          console.log("Client Token: ", currentToken);
          setFireBaseToken(currentToken);
        } else {
          console.log("Failed to generate the registration token.");
        }
      } else {
        console.log("User Permission Denied.");
      }
    };
    if (isAuthenticated) retrievePushNotificationToken();
  }, [initializeApp, getMessaging, isAuthenticated]);
  return {
    fireBaseToken,
  };
};

export default useFireBaseInitialise;
