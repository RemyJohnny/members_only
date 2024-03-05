const User = require("../models/user");
const Secret = require("../models/secret");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
require("dotenv").config();

//passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "incorrect password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

exports.logIn_get = asyncHandler(async (req, res, next) => {
  const errors = req.session.messages;
  res.render("log_in", { title: "log-in", errors: errors });
});

exports.logIn_post = [
  body("username", "Username field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    if (!validationResult(req).isEmpty()) {
      res.render("log_in", { errors: validationResult(req).array() });
    }
    crypto.pbkdf2(
      req.body.password,
      process.env.SALT,
      100000,
      64,
      "sha512",
      async (err, derivedKey) => {
        if (err) throw err;
        req.body.password = derivedKey.toString("hex");
        next();
      }
    );
  }),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in",
    failureMessage: true,
  }),
];

exports.signUp_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up", { title: "sign-Up" });
});

exports.signUp_post = [
  body("first_name", "first name field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last Name field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username field must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password")
    .trim()
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/)
    .withMessage(
      "Password contains at least one letter, at least one digit, and is at least 5 characters long"
    ),
  body("confirm_password", "password does not match")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
    });

    const exist = await User.findOne({ username: req.body.username }).exec();
    if (exist)
      errors.push({
        type: "field",
        location: "form",
        path: "username",
        value: req.body.username,
        msg: "username has already been taken",
      });

    if (!errors.length === 0 || exist) {
      res.render("sign_up", { user: user, errors: errors });
    } else {
      crypto.pbkdf2(
        req.body.password,
        process.env.SALT,
        100000,
        64,
        "sha512",
        async (err, derivedKey) => {
          if (err) throw err;
          user.password = derivedKey.toString("hex");
          await user.save();
          res.redirect("/user/log-in");
          // Prints derivedKey
          // console.log({ hashed: derivedKey.toString("hex") });
        }
      );
    }
  }),
];

exports.log_out = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.joinClub_get = (req, res, next) => {
  if (!req.user) {
    res.redirect("/user/log-in");
  }
  res.render("join_club_form", { title: "join club" });
};

exports.joinClub_post = [
  body("club_code").trim().escape(),
  asyncHandler(async (req, res, next) => {
    const secret = await Secret.findOne({ name: "club code" }).exec();
    crypto.pbkdf2(
      req.body.club_code,
      process.env.SALT,
      100000,
      64,
      "sha512",
      async (err, derivedKey) => {
        if (err) throw err;
        if (derivedKey.toString("hex") === secret.code) {
          await User.findByIdAndUpdate(req.user.id, { is_member: true });
          res.redirect("/");
        } else
          res.render("join_club_form", {
            title: "join club",
            errors: [{ msg: "Incorrect Code" }],
          });
      }
    );
  }),
];
