////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware web framework to invoke a serial of middleware. */
const express = require("express");

/** Middleware to handle router in express framework */
const router = express.Router();

/** Middleware to validate requests data to protect the model (database) */
const { tagCreateValidator } = require("../validators/tag");
const { runValidation } = require("../validators");

/** Middleware to authenticate requests to protect the route */
const {
  requireSignIn,
  adminMiddleware
} = require("../controllers/auth");

/** Middleware to handle request and response related to the tag */
const { create, list, read, remove } = require("../controllers/tag");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Router will receive CRUD request from the client side
 * @arg { Method } tagCreateValidator - make sure tag validated
 * @arg { Method } requireSignIn - make sure the user authenticated
 * @arg { Method } adminMiddleware - make sure only amin can create a new tag
 */
router.post("/tag", tagCreateValidator, runValidation, requireSignIn, adminMiddleware, create);
router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignIn, adminMiddleware, remove);

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Pack router module as a pubic object to use anywhere
 */
module.exports = router;