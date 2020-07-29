////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const Blog = require("../models/blog");
const Category = require("../models/category");
const Tag = require("../models/tag");
const User = require("../models/user");

/** Middleware to handle database error from helpers */
const { errorHandler } = require("../helpers/dbErrorHandler");

/** Middleware to help process data from helpers */
const { smartTrim } = require("../helpers/blog");

/** Middleware to parse form data, especially parse images  */
const formidable = require("formidable");

/** Middleware to slugify data */
const slugify = require("slugify");

/** Middleware to strips HTML tags from strings, used in blog editor */
const stripHtml = require("string-strip-html");

/** Library easy to work with arrays, numbers, objects, strings */
const _ = require("lodash");

/** Middleware allows access to the file system on your computer */
const fs = require("fs");

/** Middleware allows make a request to create a new blog resource */
exports.create = (req, res) => {
  /** Grab all the form data */
  let form = new formidable.IncomingForm();

  /** Keep file extensions (jpg, png...) */
  form.keepExtensions = true;

  /**
   * Parse form data to grab all the data javascript object
   * @arg { Object } req - request from the client side
   * @arg { Func } func - callback hold on data parse request out
   */
  form.parse(req, (err, fields, files) => {
    /** Send error message if parse files (image...) failed */
    if(err) {
      return res.status(400).json({
        error: "Image could not upload"
      });
    };

    /**
     * Destructuring (Extract) to grab all the fields from the form
     * to create a new blog
     */
    const { title, body, categories, tags } = fields;

    ////////////////////////////////////////////////////////////////////////////
    // ! CUSTOMIZE BLOG VALIDATORS
    // ? - Can't use express-validator to validate for not json data
    ////////////////////////////////////////////////////////////////////////////
    /** Send the error message if has no title */
    if(!title || !title.length) {
      return res.status(400).json({
        error: "Title is required"
      });
    };

    /** Send the error message if body length less than 200 */
    if(!body || body.length < 200) {
      return res.status(400).json({
        error: "Content is too short"
      });
    };

    /** Send the error message if number of categories is zero */
    if(!categories || categories.length === 0) {
      return res.status(400).json({
        error: "At least one category is required"
      });
    };

    /** Send the error message if number of tags is zero */
    if(!tags || tags.length === 0) {
      return res.status(400).json({
        error: "At least one tag is required"
      });
    };

    /** Create an instance of new Blog model */
    let blog = new Blog();

    ////////////////////////////////////////////////////////////////////////////
    // ! BLOG FIELDS
    // ? Text properties to create a new blog (entry) from the blog editor
    ////////////////////////////////////////////////////////////////////////////
    /** Create blog title */
    blog.title = title;

    /** Create blog body */
    blog.body = body;

    /** Generate blog excerpt */
    blog.excerpt = smartTrim(body, 320, " ", "...");

    /** Create blog slug title use to query in the database */
    blog.slug = slugify(title).toLowerCase();

    /**
     * Create blog meta title append the website's name
     * NOTE: Using template string (``) and pipe (|)
     */
    blog.mtitle = `${title} | ${process.env.APP_NAME}`;

    /** Generate blog description by passing 160 first chars from the body*/
    blog.mdesc = stripHtml(body.substring(0, 160));

    /** Create blog posted by the user created blog */
    blog.postedBy = req.user._id;

    ////////////////////////////////////////////////////////////////////////////
    // ! BLOG FILES
    // ? Files properties to create a new blog (entry) from the editor
    ////////////////////////////////////////////////////////////////////////////
    /** Make sure sending the photo not images or not anything */
    if(files && files.photo) {
      /** Limit photo size less than 1MB (1000000 bytes) */
      if(files.photo.size >= 10000000) {
        return res.status(400).json({
          error: "Image should be less then 1mb in size"
        });
      };

      /** Grab files photo data from file system */
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    };

    /** Create a array of categories from blog editor after remove comma */
    let arrayOfCategories = categories && categories.split(",");

    /** Create a array of tags from the blog editor after remove comma */
    let arrayOfTags = tags && tags.split(",");

    /** Request Model save blog information in the database */
    blog.save((err, result) => {
      /** Send error message if save failed */
      if(err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      };

      /**
       * Request Model save/update array of categories
       * @arg { Any } _id - blog id (ObjectId)
       * @arg { Object } object - include the categories by MongoDB push method
       * @arg { Object } object - include flag to notify new data
       * NOTE: can pre-test form-data by postman when have no form 
       */
      Blog.findByIdAndUpdate(
        result._id,
        { $push: { categories: arrayOfCategories } },
        { new: true }
      ).exec((err, result) => {
        /** Send error message if save failed */
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          /**
           * Request Model save/update array of tags
           * @arg { Any } _id - blog id (ObjectId)
           * @arg { Object } object - include the tags by MongoDB push method
           * @arg { Object } object - include flag to notify new data
           * NOTE: can pre-test form-data by postman when have no form 
           */
            Blog.findByIdAndUpdate(
              result._id,
              { $push: { tags: arrayOfTags } },
              { new: true }
            ).exec((err, result) => {
              /** Send error message if save failed */
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              } else {
                /** Send response data include categories and tags */
                res.json(result);
              }
            });
        }
      });
    });
  });
};

/**
 * Middleware allows make a request to get all blog resource
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 * @return blogs data
 */
exports.list = (req, res) => {
  /**
   * Request Model query all data with condition
   */
  Blog.find({})
  /**
   * Grab all fields "_id, name, slug" save to the "categories" property
   * NOTE: categories: [{type: ObjectId, ref: "Category", required: true}]
   */
  .populate("categories", "_id name slug")
  /**
   * Grab all fields "_id, name, slug" save to the "tags" property
   * NOTE: tags: [{type: ObjectId, ref: "Tag", required: true}]
   */
  .populate("tags", "_id name slug")
  /**
   * Grab all fields "_id, name, username" save to the "postedBy" property
   * NOTE: postedBy: {type: ObjectId, ref: "User"}
   */
  .populate("postedBy", "_id name username")
  .select("_id title slug excerpt categories tags postedBy createdAt updateAt")
  .exec((err, data) => {
    if(err) {
      return res.json({
        error: errorHandler(err)
      });
    };
    /** Send response data include blogs */
    res.json(data);
  });
};

/**
 * Middleware allows make a request to get blogs, categories and tags resource
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 * @return all blogs categories tags
 */
exports.listAllBlogsCategoriesTags = (req, res) => {
  /** Posts will be limited when sending on request */
  const DEFAULT_POSTS_LIMITED = 10;

  /** Posts will be skipped when sending on request */
  const DEFAULT_POSTS_SKIPPED = 0;

  /**
   * Grab the limit blog posts to send on request from the client side
   * NOTE: When user click on "Load more" button
   * - another additional request will be sent.
   * - 10 posts before will be skipped.
   * - the 10 posts rest will be sent.
   * => This is the reason used POST method to have access to request body.
   */
  let limit = req.body.limit ? parseInt(req.body.limit) : DEFAULT_POSTS_LIMITED;

  /** Grab the skip blog posts to send on request from the client side */
  let skip = req.body.skip ? parseInt(req.body.skip) : DEFAULT_POSTS_SKIPPED;

  /**
   * Initialize `blogs` variable
   * to populate the response blogs data from the server
   */
  let blogs;

  /**
   * Initialize `categories` variable
   * to populate the response categories data from the server
   */
  let categories;

  /**
   * Initialize `tags` variable
   * to populate the response tags data from the server
   */
  let tags;

  /**
   * Request Blog model query all the blogs
   * @param {} * - All the blogs
   * NOTE: Controller <<===>> Model
   * Blog Controller will request to Blog Model find some data as below.
   * Model will use mongoose query methods to get data from collections from
   * MongoDB, and then update result to the Schema.
   */
  Blog.find({})
  /**
   * Grab all fields "_id, name, slug" save to the "categories" property
   * NOTE: categories: [{type: ObjectId, ref: "Category", required: true}]
   */
  .populate("categories", "_id name slug")

  /**
   * Grab all fields "_id, name, slug" save to the "tags" property
   * NOTE: tags: [{type: ObjectId, ref: "Tag", required: true}]
   */
  .populate("tags", "_id name slug")

  /**
   * Grab all fields "_id, name, username profile" save to the "postedBy" property
   * NOTE: postedBy: {type: ObjectId, ref: "User"}
   */
  .populate("postedBy", "_id name username profile")

  /** Make sure the latest posts are sent based on the created at date */
  .sort({createdAt: -1})
  .skip(skip)
  .limit(limit)
  .select("_id title slug excerpt categories tags postedBy createdAt updatedAt")
  .exec((err, data) => {
    if(err) {
      return res.json({
        error: errorHandler(err)
      });
    };
    
    /** Populate blogs data to blogs array */
    blogs = data;

    /**
     * Request Category model query all the categories
     * @param {} * - All the categories
     */
    Category.find({}).exec((err, category) => {
      if(err) {
        return res.json({
          error: errorHandler(err)
        });
      };

      /** Populate category data to categories array */
      categories = category;

      /**
       * Request Tag model query all the tags
       * @param {} * - All the tags
       */
      Tag.find({}).exec((err, tag) => {
        if(err) {
          return res.json({
            error: errorHandler(err)
          });
        };

        /** Populate tag data to tags array */
        tags = tag;

        /** Return all blogs categories tags */
        res.json({blogs, categories, tags, size: blogs.length });
      });
    });
  });
};

/**
 * Middleware allows make a request to get one blog resource
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.read = (req, res) => {
  /**
   * Create slug name used to query blog
   * Format by default: text-after-slugify
   */
  const slug = req.params.slug.toLowerCase();

  /**
   * Request Blog model query one blog
   * @param { String } slug * - blog slug name
   */
  Blog.findOne({slug})
  /**
   * Grab all fields "_id, name, slug" save to the "categories" property
   * NOTE: categories: [{type: ObjectId, ref: "Category", required: true}]
   */
  .populate("categories", "_id name slug")

  /**
   * Grab all fields "_id, name, slug" save to the "tags" property
   * NOTE: tags: [{type: ObjectId, ref: "Tag", required: true}]
   */
  .populate("tags", "_id name slug")

  /**
   * Grab all fields "_id, name, username" save to the "postedBy" property
   * NOTE: postedBy: {type: ObjectId, ref: "User"}
   */
  .populate("postedBy", "_id name username")
  .select("_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt")
  .exec((err, data) => {
    if(err) {
      return res.json({
        error: errorHandler(err)
      });
    };

    /** Send response data include blog */
    res.json(data);
  });

};

/**
 * Middleware allows make a request to delete one blog resource
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.remove = (req, res) => {
  /**
   * Create slug name used to query blog
   * Format by default: text-after-slugify
   */
  const slug = req.params.slug.toLowerCase();

  /**
   * Request Blog model delete one blog
   * @param { String } slug * - blog slug name
   */
  Blog.findOneAndRemove({slug}).exec((err, data) => {
    if(err) {
      return res.json({
        error: errorHandler(err)
      });
    };
  
    /** Send success message to the client */
    res.json({
      message: "Blog deleted successfully."
    });
  });
};

/**
 * Middleware allows make a request to update one blog resource
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.update = (req, res) => {
  /**
   * Create slug name used to query category
   * Format by default: text-after-slugify
   */
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({slug}).exec((err, oldBlog) => {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Grab all the form data */
    let form = new formidable.IncomingForm();

    /** Keep file extensions (jpg, png...) */
    form.keepExtensions = true;

    /**
     * Parse form data to grab all the data javascript object
     * @arg { Object } req - request from the client side
     * @arg { Func } func - callback hold on data parse request out
     */
    form.parse(req, (err, fields, files) => {
      /** Send error message if parse files (image...) failed */
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }

      /** 
       * Grab old slug name to keep slug, even if you change blog title
       * NOTE: Slug name indexed by Google hen publish the blog
       */
      let slugBeforeMerge = oldBlog && oldBlog.slug;

      /**
       * Grab the blog data after merging data changed
       * @arg { Object } oldBlog - blog data before updating
       * @arg { Fields } fields - fields taken from the client side
       */
      oldBlog = _.merge(oldBlog, fields);

      /** Make sure keep old slug name  */
      oldBlog.slug = slugBeforeMerge;

      /**
       * Destructuring (Extract) to grab all the fields from the form
       * to create a new blog
       */
      const { body, desc, categories, tags } = fields;

      //////////////////////////////////////////////////////////////////////////
      // ! CUSTOMIZE BLOG VALIDATORS
      // ? - Can't use express-validator to validate for not json data
      //////////////////////////////////////////////////////////////////////////
      /** Update excerpt and description when body changed */
      if (body) {
        /** Grab 320 characters from the body */
        oldBlog.excerpt = smartTrim(body, 320, " ", " ...");

        /** Grab 160 char from the body and trip html tags  */
        oldBlog.desc = stripHtml(body.substring(0, 160));
      };

      /** Update categories when categories changed */
      if (categories) {
        /** Grab categories and split to generate an array */
        oldBlog.categories = categories.split(',');
      };

      /** Update tags when tags changed */
      if (tags) {
        /** Grab tags and split to generate an array */
        oldBlog.tags = tags.split(',');
      };

      //////////////////////////////////////////////////////////////////////////
      // ! BLOG FILES
      // ? Files properties to create a new blog (entry) from the editor
      //////////////////////////////////////////////////////////////////////////
      /** Make sure sending the photo not images or not anything */
      if (files && files.photo) {
        /** Limit photo size less than 1MB (1000000 bytes) */
        if (files.photo.size >= 10000000) {
          return res.status(400).json({
            error: "Image should be less then 1mb in size",
          });
        };

        /** Grab files photo data from file system */
        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      };

      /** Request Model save blog information in the database */
      oldBlog.save((err, result) => {
        /** Send error message if save failed */
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        };

        /** Get rid of photo from the response data */
        result.photo = undefined;

        /** Send blog data to the client */
        res.json(result);
      });
    });
  });
};

/**
 * Middleware allows make a request to get photo
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 * @return { Object } blog photo data
 */
exports.photo = (req, res) => {
  /**
   * Create slug name used to query blog
   * Format by default: text-after-slugify
   */
  const slug = req.params.slug.toLowerCase();

  /** Request Blog model query photo from a blog post */
  Blog.findOne({slug})
  .select("photo")
  .exec((err, blog) => {
    /** Response error if fetch data from MongoDB failed */
    if(err || !blog) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    /** Set content type (png, jpg...) for photo */
    res.set("Content-Type", blog.photo.contentType);

    /** Send photo data to the client */
    return res.send(blog.photo.data);
  });
};

exports.listRelated = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 3;

  const { _id, categories } = req.body.blog;

  Blog.find({_id: { $ne: _id }, categories: { $in: categories }})
  .limit(limit)
  .populate("postedBy", "_id name username profile")
  .select("title slug excerpt postedBy createdAt updatedAt")
  .exec((err, blogs) => {
    if(err) {
      return res.status(400).json({
        error: "Blogs not found"
      });
    }
    res.json(blogs);
  })
};

exports.listSearch = (req, res) => {
  const { search } = req.query;
  console.log(req.query);
  
  if (search) {
    Blog.find({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ],
    }, (err, blogs) => {
      if(err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      };
      res.json(blogs);
    }).select("-photo -body");
  };
};

exports.listByUser = (req, res) => {
  User.findOne({ username: req.params.username}).exec((err, user) => {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    };

    let userId = user._id;
    Blog.find({postedBy: userId})
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select("_id title slug excerpt postedBy createdAt updatedAt")
    .exec((err, data) => {
      if(err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }

      res.json(data);
    });
  });
};