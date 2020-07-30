////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware web framework to invoke a serial of middleware. */
const express = require("express");

/** Middleware to handle router in express framework */
const router = express.Router();

/** Middleware to validate requests data to protect the model (database) */
const { contactFormValidator } = require("../validators/form");
const { runValidation } = require("../validators");

/** Middleware to handle request and response related to the category */
const { contactForm, contactBlogAuthorForm } = require("../controllers/form");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Router will receive CRUD request from the client side
 * @arg { Module } contactFormValidator - make sure contact validator
 * @arg { Method } runValidation - run validation
 */
router.post("/contact", contactFormValidator, runValidation, contactForm);
router.post("/contact-blog-author", contactFormValidator, runValidation, contactBlogAuthorForm);

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Pack router module as a pubic object to use anywhere
 */
module.exports = router;
