const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
module.exports = () => {
  const token = fs.readFileSync(path.join("config", "token.txt"), {
    encoding: "utf8",
    flag: "r",
  });
  if (!token) {
    console.log("Authentication failed");
    return;
  }
  const decodedtoken = jwt.verify(token, process.env.JWT_SECRET)
  console.info(decodedtoken);
  const error = new HttpError(
    "Authentication failed or try logging in again",
    401
  );
  console.log(error);
};
