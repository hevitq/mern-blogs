////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware allows to work with MongoDB */
const mongoose = require("mongoose");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------INSTANCE OF CATEGORY------------------------------
// ? Take requests process data from the subscribing Controller.
// ? Notify changes to the subscribing Controller.
////////////////////////////////////////////////////////////////////////////////

/**
 * Create mongo schema for category model
 * @argument { Object } object - Category
 * @argument { Boolean } timestamp - Update time
 */
const categorySchema = new mongoose.Schema(
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
module.exports = mongoose.model("Category", categorySchema);