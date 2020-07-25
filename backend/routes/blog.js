////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
// ? Load Express to create a instance of new Router.
// ? Load middleware to protect Router (if has request change resource)
// ? Load middleware to receive resource from Controller
////////////////////////////////////////////////////////////////////////////////

/** Middleware web framework to invoke a serial of middleware. */
const express = require("express");

/** Middleware to handle router in express framework */
const router = express.Router();

/** Middleware allows protect the route */
const {
  requireSignIn,
  authMiddleware
} = require("../controllers/auth");

/** Subscriber allows receive blog resources from the Controller  */
const {
  create,
  list,
  listAllBlogsCategoriesTags,
  read,
  remove,
  update,
  photo,
  listRelated,
} = require("../controllers/blog");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------IMPLEMENT ROUTER----------------------------------
// ? Take requests access resource from the subscribing Server.
// ? Invoke middleware to protect router from the Controller.
// ? Create a subscriber to receive resource from the Controller.
// ? Notify found resource to the subscribing Server.
////////////////////////////////////////////////////////////////////////////////

/**
 * Router will receive CRUD request from the client side
 * @param { Object } requireSignIn - make sure the user authenticated
 * @param { Func } authMiddleware - query the regular user as user profile
 */
router.post("/blog", requireSignIn, authMiddleware, create);
router.get("/blogs", list);
/** NOTE: Use POST method, instead of GET method to have access to request body */
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignIn, authMiddleware, remove);
router.put("/blog/:slug", requireSignIn, authMiddleware, update);
router.get("/blog/photo/:slug", photo);
router.post("/blogs/related", listRelated);

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Pack router module as a pubic object to use anywhere
 */
module.exports = router;