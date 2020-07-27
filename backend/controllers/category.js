////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const Category = require("../models/category");

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
 * Middleware to make a request create a new resource
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.create = (req, res) => {
  /** Destructuring request body to grab user information */
  const { name } = req.body;

  /**
   * Create slug name used to query category
   * Format by default: text-after-slugify
   */
  let slug = slugify(name).toLowerCase();

  /**
   * Create a instance of new category to save into the schema
   * @arg { String } name - name from request body
   * @arg { String } slug - created slug name
   */
  let category = new Category({ name, slug });

  /**
   * Request Model save the new category
   * @return { Object } - the response body
   */
  category.save((err, data) => {
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
 * Middleware to query all categories
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.list = (req, res) => {
  /**
   * Request Model query all categories
   * @param { Object } null - no specify any property
   * @param { Object } err - error message object response from the MongoDB
   * @param { Object } data - category data from the category collection
   */
  Category.find({}).exec((err, data) => {
    /** Send the error message if query category failed */
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
 * Middleware to query a certain category
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
   * Request Model query one category
   * @return { Object } - the response body
   */
  Category.findOne({ slug }).exec((err, category) => {
    /** Send error message if query failed */
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Send success message if no error */
    // res.json(category);
    Blog.find({categories: category})
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
      res.json({category: category, blogs: data})
    });
  });
};

/**
 * Middleware to delete one category
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
   * Request Model query and delete one category
   * @return { Object } - the response body
   */
  Category.findOneAndRemove({ slug }).exec((err, data) => {
    /** Send error message if delete failed */
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Send success message if no error */
    res.json({
      message: "Category deleted successfully."
    });
  });
};
