////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const User = require("../models/user");

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