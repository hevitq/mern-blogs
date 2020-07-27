////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const User = require("../models/user");

/** Models will take request(action) from this controller to process data */
const Blog = require("../models/blog");

/** Middleware to handle database error from helpers */
const { errorHandler } = require("../helpers/dbErrorHandler");


////////////////////////////////////////////////////////////////////////////////
// !-------------------------APPLY AND PUBLIC MODULE----------------------------
// ? Accept a user's input.
// ? Request Model to process data to complete the request from the client
// ? Detect changes in the Model by subscribing that Model.
// ? Request View to draw to a layout
// ? Send layout taken from View to the server
////////////////////////////////////////////////////////////////////////////////

/**
 * Middle to query all users
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.read = (req, res) => {
  /** Hide sensitive such as hash_password, salt from the response */
  req.profile.hashed_password = req.profile.salt = req.profile.role = undefined;

  /** Send the user profile to the response body */
  return res.json(req.profile);
};

/**
 * Middleware allows to query user public profile
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.publicProfile = (req, res) => {
  /** Grab username taken passed from Router in the client's request */
  let username = req.params.username;

  /** Variables to populate data from the response */
  let user;
  let blogs;

  /** Request User model query a user */
  User.findOne({username}).exec((err, userFromDB) => {
    /** Response error when occur an error or use not found */
    if(err || !userFromDB) {
      return res.status(400).json({
        error: "User not found"
      });
    };

    /** Populate user data to variable use */
    user = userFromDB;

    /** Grab user id from the user object populated */
    let userId = user._id;

    /**
     * Request Blog model find all blogs based on the user id grabbed
     * 
     */
    Blog.find({postedBy: userId})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    /** Limit to 10 latest posted blogs if the user have created more than 10 */
    .limit(10)
    /** Specify some fields wanna to select */
    .select("_id title slug excerpt categories tags postedBy createdAt updatedAt")
    /** Run query command and receive result from the callback function */
    .exec((err, data) => {
      /** Response error when occur an error related to the mongodb */
      if(err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      };

      /** Move photo, and sensitive information from the json response data */
      user.photo = undefined
      user.hashed_password = undefined;
      user.salt = undefined;

      /** Send the json response to the response body */
      res.json({
        user, blogs: data
      });
    });
  });
};