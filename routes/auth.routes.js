const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const saltRounds = 10;

const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middelware");

const capitalize = require("../scripts/functions/capitalize");

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res, next) => {
  const { userName, email, password, tagline } = req.body;

  // Check if email or password or name are provided as empty string
  if (email === "" || password === "" || userName === "") {
    console.log(req.body);
    res.status(400).json({ message: "Provide email, password, username" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    console.log(req.body.email);
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    console.log(req.body.password);
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check if a user with the same email already exists
  User.findOne({ email }).then((foundUser) => {
    if (foundUser) {
      res.status(400).json({ message: "Email already exists on our system." });
      return;
    }
  });

  User.findOne({ userName })
    .then((foundUser) => {
      if (foundUser) {
        res
          .status(400)
          .json({ message: "UserName already exists on our system." });
        return;
      }

      // If email and username is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create the new user in the database

      return User.create({
        userName,
        email,
        password: hashedPassword,
        tagline,
      });
    })
    .then((createdUser) => {
      console.log(createdUser);
      const { _id, userName, way, profilePicture, email, tagline } =
        createdUser;

      // Create a new object that doesn't expose the password
      const user = { _id, userName, way, profilePicture, email, tagline };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Invalid credentials." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, userName, email, profilePicture, way, tagline } =
          foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, userName, email, profilePicture, way, tagline };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res
          .status(401)
          .json({ message: "Sign in details are incorrect, please try again" });
      }
    })
    .catch((err) =>
      res.status(500).json({ message: "Internal Server Error", error: err })
    );
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", isAuthenticated, (req, res, next) => {
  // <== CREATE NEW ROUTE

  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data
  // previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;
