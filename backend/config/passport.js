require("dotenv").config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require("../models/user");
const HttpError = require("../models/http-error");
// const redis = require("redis");
// const client = redis.createClient();
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      User.findById(jwtPayload.id)
        .then(function (user) {
          if (user) {
            console.log(user)
            return done(null, user);
          } else {
            return done(new Error("No user found"), false);
          }
        })
        .catch(function (err) {
          return done(err);
        });
    }
  )
);
