////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const User = require("../models/user");

/** Models will take request(action) from this controller to process data */
const Blog = require("../models/blog");

/** Library easy to work with arrays, numbers, objects, strings */
const _ = require("lodash");

/** Middleware to parse form data, especially parse images  */
const formidable = require("formidable");

/** Middleware allows access to the file system on your computer */
const fs = require("fs");

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

      /** Populate blogs data to variable blogs */
      blogs = data;

      /** Move photo, and sensitive information from the json response data */
      user.photo = undefined
      user.hashed_password = undefined;
      user.salt = undefined;

      /** Send the json response to the response body */
      res.json({
        user, blogs
      });
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, (err, fields, files) => {
    if(err || !files || !fields) {
      return res.status(400).json({
        error: "Photo could not be uploaded"
      });
    };
    
    /** Grab user profile from the request */
    let user = req. profile;

    /** Extend user object */
    user = _.extend(user, fields);

    if(fields.password && fields.password.length < 6) {
      return res.status(400).json({
        error: "Password should be min 6 characters long"
      });
    };

    if(files.photo) {
      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb"
        });
      };

      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    };

    /** Save the user */
    user.save((err, result) => {
      if(err || !result) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      };

      user.hashed_password = undefined;
      user.salt = undefined;
      user.photo = undefined;
      res.json(user);
    });
  });
};

exports.photo = (req, res) => {
  const username = req.params.username;

  User.findOne({username}).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    if(user.photo && user.photo.data) {
      res.set("Content-Type", user.photo.contentType);
      return res.send(user.photo.data);
    };
  });
};