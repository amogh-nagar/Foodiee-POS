const admin = require("firebase-admin");
const serviceAccount = require("./assets/foodiee-6f2ec-525bd2891a85.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("Firebase Initiated..");

module.exports = {
  getFirebaseAdmin: () => {
    return admin;
  },
  sendPushNotification: function (token, payload) {
    const message = {
      notification: {
        title: "Your Notification Title",
        body: "Your Notification Body",
      },
      token: token,
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  },
};
