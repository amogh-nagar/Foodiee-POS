import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../utils/firebase.utils";
const useFireBaseInitialise = (isAuthenticated) => {
  const [fireBaseToken, setFireBaseToken] = useState("");
  useEffect(() => {
    var retrievePushNotificationToken = async () => {
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
  }, [getMessaging, isAuthenticated]);
  return {
    fireBaseToken,
  };
};

export default useFireBaseInitialise;
