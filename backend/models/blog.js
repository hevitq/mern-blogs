////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////
/** Middleware allows to work with MongoDB */
const mongoose = require("mongoose");

/**
 * Create an ObjectId type used for unique identifiers
 * Refer: https://mongoosejs.com/docs/api/schema.html
 */
const { ObjectId } = mongoose.Schema;

////////////////////////////////////////////////////////////////////////////////
// !--------------------------INSTANCE OF BLOG----------------------------------
// ? Take requests process data from the subscribing Controller.
// ? Notify changes to the subscribing Controller.
////////////////////////////////////////////////////////////////////////////////

/**
 * Create mongo schema for blog model
 * @argument { Object } object - blog information
 * @argument { Boolean } timestamp - Update time
 */
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: {},
      required: true,
      min: 200,
      max: 2000000
    },
    excerpt: {
      type: String,
      max: 1000
    },
    mtitle: {
      type: String
    },
    mdesc: {
      type: String
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [{type: ObjectId, ref: "Category", required: true}],
    tags: [{type: ObjectId, ref: "Tag", required: true}],
    postedBy: {
      type: ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

////////////////////////////////////////////////////////////////////////////////
// !------------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Notify changes to the subscribing Controller. */
module.exports = mongoose.model("Blog", blogSchema);
