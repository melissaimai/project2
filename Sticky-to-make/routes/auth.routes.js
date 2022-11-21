const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// GET /auth/signup FORM
router.get("/auth/signup", (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup CREATE USER
router.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;
  // Check that username, email, and password are provided
  if (username === "" || password === "") {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }
  if (password.length < 6) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
    return;
  }
  const userFromDB = await User.findOne({ username });

  if (userFromDB !== null) {
    res.render("auth/signup", {
      errorMessage: "This Username already exists!",
    });
    return;
  } else {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userCreated = await User.create({
      username,
      password: hashedPassword,
    });

    res.redirect("/login");
  }
});

//LOGIN GET /auth/LOGIN FORM
router.get("/login", (req, res) => res.render("auth/login"));

//LOGIN POST /auth/LOGIN GET EXISTING USER FROM DB
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide your username and password.",
    });
    return;
  }

  User.findOne({ username }).then((userFromDB) => {
    if (!userFromDB) {
      res.render("auth/login", { errorMessage: " Oops!!Wrong credentials" });
    }
    if (bcrypt.compareSync(password, userFromDB.password)) {
      req.session.User = userFromDB;
      res.redirect("/dashboard");
    } else
      res.render("auth/login", { errorMessage: " Oops!!Wrong credentials" });
  });
});

// GET /auth/logout
router.get("/auth/logout", (req, res, next) => {
  // Logout user
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
