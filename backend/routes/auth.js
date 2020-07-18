////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware web framework to invoke a serial of middleware. */
const express = require("express");

/** Middleware to handle router in express framework */
const router = express.Router();

/** Validator set use to check fields when signing up, signing in */
const {
  userSignUpValidator,
  userSignInValidator,
} = require("../validators/auth");

/** Middleware to run validation for validator sets */
const { runValidation } = require("../validators");

/** Middleware to authenticate requests to protect the route */
const { requireSignIn } = require("../controllers/auth");

/** Middleware to handle request and response related to the blog */
const { signup, signin, signout } = require("../controllers/auth");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Router will receive CRUD request from the client side
 * @arg { Array } userSignUpValidator - validator set when signing up
 * @arg { Array } userSignInValidator - validator set when signing in
 * @arg { Func } runValidation - run validation for validator sets
 */
router.post("/signup", userSignUpValidator, runValidation, signup);
router.post("/signin", userSignInValidator, runValidation, signin);
router.get("/signout", signout);
router.get("/secret", requireSignIn, (req, res) => {
  res.json({
    user: req.user,
    message: "Router for testing authentication"
  });
});

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Pack router module as a pubic object to use anywhere
 */
module.exports = router;