importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDnl0oP0NIm6RPxK94gL0RKwCyQx8JSvlw",
  authDomain: "foodiee-6f2ec.firebaseapp.com",
  projectId: "foodiee-6f2ec",
  storageBucket: "foodiee-6f2ec.appspot.com",
  messagingSenderId: "179827419262",
  appId: "1:179827419262:web:c2a3fdcafea2b0712b502f",
  measurementId: "G-7TNNR2PPW3",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
