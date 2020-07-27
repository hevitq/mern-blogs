////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const Tag = require("../models/tag");

const Blog = require("../models/blog");

/** Middleware to slugify data */
const slugify = require("slugify");

/** Middleware to handle database error from helpers */
const { errorHandler } = require("../helpers/dbErrorHandler");

////////////////////////////////////////////////////////////////////////////////
// !-------------------------APPLY AND PUBLIC MODULE----------------------------
// ? Accept a user's input.
// ? Request Model to process data to complete the request from the client
// ? Detect changes in the Model by subscribing that Model.
// ? Request View to draw/render elements.
////////////////////////////////////////////////////////////////////////////////

/**
 * Middleware to make a request create a new tag
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.create = (req, res) => {
  /** Destructuring request body to grab user information */
  const { name } = req.body;

  /**
   * Create slug name used to query tag
   * Format by default: text-after-slugify
   */
  let slug = slugify(name).toLowerCase();

  /**
   * Create a instance of new tag to save into the schema
   * @arg { String } name - name from request body
   * @arg { String } slug - created slug name
   */
  let tag = new Tag({ name, slug });

  /**
   * Request Model save the new tag
   * @return { Object } - the response body
   */
  tag.save((err, data) => {
    /** Send error message if save failed */
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Send json response data if no error */
    res.json(data);
  });
};

/**
 * Middleware to query all tags
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.list = (req, res) => {
  /**
   * Request Model query all tags
   * @param { Object } null - no specify any property
   * @param { Object } err - error message object response from the MongoDB
   * @param { Object } data - category data from the category collection
   */
  Tag.find({}).exec((err, data) => {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Send json response data if no error */
    res.json(data);
  });
};

/**
 * Middleware to query a certain tag
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.read = (req, res) => {
  /**
   * Grab slug name the request from the client
   * NOTE: req.params
   * - Refer: https://expressjs.com/en/api.html
   */
  const slug = req.params.slug.toLowerCase();

  /**
   * Request Model query one tag
   * @return { Object } - the response body
   */
  Tag.findOne({ slug }).exec((err, tag) => {
    /** Send error message if query failed */
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Send success message if no error */
    // res.json(tag);
    Blog.find({tags: tag})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select("_id title slug excerpt categories postedBy tags createdAt updatedAt")
    .exec((err, data) => {
      if(err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      };
      res.json({tag: tag, blogs: data})
    });
  });
};

/**
 * Middleware to delete one tag
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.remove = (req, res) => {
  /**
   * Grab slug name the request from the client
   * NOTE: req.params
   * - Refer: https://expressjs.com/en/api.html
   */
  const slug = req.params.slug.toLowerCase();

  /**
   * Method to delete one record from the Tag collection
   * @param { Object } slug - slugify of tag name
   * @return { Func } callback function
   */
  Tag.findOneAndRemove({ slug }).exec((err, data) => {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    res.json({
      message: "Tag deleted successfully."
    });
  });
};
