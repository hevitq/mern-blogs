////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware web framework to invoke a serial of middleware. */
const express = require("express");

/** Middleware to handle router in express framework */
const router = express.Router();

/** Middleware to authenticate requests to protect the route */
const {
  requireSignIn,
  authMiddleware
} = require("../controllers/auth");


/** Middleware to handle request and response related to the user */
const { read, publicProfile, update, photo } = require("../controllers/user");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Router will receive CRUD request from the client side
 * @arg { Method } requireSignIn - authenticate the user signin
 * @arg { Method } authMiddleware - query the regular user
 */
router.get("/user/profile", requireSignIn, authMiddleware, read);

/**
 * Router will receive CRUD request from the client side
 * Invoke and subscribing the public profile
 */
router.get("/user/:username", publicProfile);

/**
 * Router will receive CRUD request from the client side
 * @arg { Method } requireSignIn - authenticate the user signin
 * @arg { Method } authMiddleware - query the regular user
 */
router.put("/user/update", requireSignIn, authMiddleware, update);

/**
 * Router will receive CRUD request from the client side
 * Invoke and subscribing the public profile
 */
router.get("/user/photo/:username", photo);

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Pack router module as a pubic object to use anywhere
 */
module.exports = router;
