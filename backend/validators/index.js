////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Middleware to check validator in express framework
 */
const { validationResult } = require("express-validator");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Middleware to run validation for validator sets
 */
exports.runValidation = (req, res, next) => {
  /** Grab errors form validation result */
  const errors = validationResult(req);

  /** Return only first error if has */
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array()[0].msg });
  }

  /** Invoke the next middleware when has no error */
  next();
};
