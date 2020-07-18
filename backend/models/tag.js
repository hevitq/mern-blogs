////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////
/** Middleware allows to work with MongoDB */
const mongoose = require("mongoose");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------INSTANCE OF TAG-----------------------------------
// ? Take requests process data from the subscribing Controller.
// ? Notify changes to the subscribing Controller.
////////////////////////////////////////////////////////////////////////////////

/**
 * Create mongo schema for Tag model
 * @argument { Object } object - tag
 * @argument { Boolean } timestamp - Update time
 */
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    }
  },
  { timestamp: true }
);

////////////////////////////////////////////////////////////////////////////////
// !------------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Notify changes to the subscribing Controller. */
module.exports = mongoose.model("Tag", tagSchema);