////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Models will take request(action) from this controller to process data */
const User = require("../models/user");

const Blog = require("../models/blog");

/** Middleware to generate/create a unique string (username) */
const shortId = require("shortid");

/** Middleware to generate a json web token (jwt) */
const jwt = require("jsonwebtoken");

/** Middleware to check valid token */
const expressJwt = require("express-jwt");

const { errorHandler } = require("../helpers/dbErrorHandler");

const _ = require("lodash");

const { OAuth2Client } = require("google-auth-library");

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

////////////////////////////////////////////////////////////////////////////////
// !-------------------------APPLY AND PUBLIC MODULE----------------------------
// ? Accept a user's input.
// ? Request Model to process data to complete the request from the client
// ? Detect changes in the Model by subscribing that Model.
// ? Request View to draw.
////////////////////////////////////////////////////////////////////////////////

exports.preSignup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
        <p>Please use the following link to activate your account</p>
        <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://vnpace.dev</p>
      `,
    };

    sgMail
      .send(emailData)
      .then((sent) => {
        return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to activate your account. Link expires in 10 minutes.`,
        });
      })
      .catch((error) => {
        console.log(error.response.body);
      });
  });
};

// /**
//  * Middleware to handle when the user signup
//  * @param { Any } req - request from the client side application
//  * @param { Any } res - response from the server side
//  */
// exports.signup = (req, res) => {
//   /**
//    * Request Model query one user
//    * @param { MongooseFilterQuery } email - email from the request body
//    * @return { Object } - the response body
//    */
//   User.findOne({ email: req.body.email }).exec((err, user) => {
//     /** Send a error message if user exist */
//     if (user) {
//       return res.status(400).json({
//         error: "Email is taken",
//       });
//     }

//     /** Destructuring request body to grab user information */
//     const { name, email, password } = req.body;

//     /** Generate a unique username */
//     let username = shortId.generate();

//     /** Create a profile URL */
//     let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//     /**
//      * Create a short instance of a new user to save into the schema
//      * @arg { String } name - name from request body
//      * @arg { String } email - email from request body
//      * @arg { String } password - password from request body
//      * @arg { String } profile - created profile URL
//      * @arg { String } username  - generated username
//      */
//     let newUser = new User({ name, email, password, profile, username });

//     /**
//      * Request Model save the new user
//      * @return { Object } - the response body
//      */
//     newUser.save((err, success) => {
//       /** Send error message if save failed */
//       if (err || !success) {
//         return res.status(400).json({
//           error: err,
//         });
//       }

//       /** Send success message if no error */
//       res.json({
//         message: "Signup success! Please signin.",
//       });
//     });
//   });
// };

exports.signup = (req, res) => {
  const token = req.body.token;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Signup again",
        });
      }

      /** Destructuring jwt token */
      const { name, email, password } = jwt.decode(token);

      /** Generate a unique username */
      let username = shortId.generate();

      /** Create a profile URL */
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

      const user = new User({ name, email, password, profile, username });

      user.save((err, user) => {
        if (err) {
          return res.status(401).json({
            error: errorHandler(err),
          });
        }

        return res.json({
          message: "Signup success! Please signin.",
        });
      });
    });
  } else {
    return res.json({
      message: "Something went wrong. Try again.",
    });
  }
};

/**
 * Middleware to handle when the user signin
 */
exports.signin = (req, res) => {
  /** Destructuring request body to grab user information */
  const { email, password } = req.body;

  /**
   * Request Model query one user
   * @param { Object } email - email from the request body
   * @param { Func } func - callback to invoke the next middleware
   * @param { Object } err - error message object response from the MongoDB
   * @param { Object } user - user data from the user collection
   * @return { Object } - the response to application body
   */
  User.findOne({ email }).exec((err, user) => {
    /** Send the error message if query email failed */
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup.",
      });
    }

    /**
     * Send the error message if authentication user failed
     */
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match.",
      });
    }

    /**
     * Generate a token if authentication user success
     * @param { Any } _id - payload, the user's id stored in database.
     * @param { String } JWT_SECRET - secret, key stored in .env file.
     * @param { String } expiresIn - the token's expired date.
     */
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    /**
     * Request the application (browser) to store the token into the cookie
     * @param { String } token - the generated token.
     * @param { Object } optionals - the token's expired date.
     * NOTE: HTTP/1.1 200 Ok Set-Cookie: token={token}
     */
    res.cookie("token", token, { expiresIn: "1d" });

    /**
     * Destructuring user schema to grab user information
     * NOTE: Destructuring Object
     * const _id = user._id;
     * const role = user.role;
     */
    const { _id, username, name, email, role } = user;

    /**
     * Send(give) the token and the limited user information to the client
     * NOTE: Limit response information
     * - user => By default response all user formation from user's collection.
     * - user: { _id, username, name, email, role }
     */
    return res.json({
      token,
      user: { _id, username, name, email, role },
    });
  });
};

/**
 * Middleware to handle when the user signout
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 */
exports.signout = (req, res) => {
  /**
   * Request the application (browser) to remove the token from the cookie
   * @param { NULL } null - no param
   * NOTE: HTTP/1.1 200 Ok Set-Cookie: token=
   */
  res.clearCookie("token");

  /** Send a message to notify that the signout success */
  res.json({
    message: "Signout success",
  });
};

/**
 * Middleware to check valid token for protecting routes during logged in
 * @return { Boolean } - True: valid token, False: invalid token
 */
exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
});

/**
 * Middleware to query the regular user
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 * @param { Func } next - callback to invoke the next middleware
 */
exports.authMiddleware = (req, res, next) => {
  /** Grad regular user id from the request body */
  const authUserId = req.user._id;

  /**
   * Request Model query the user
   * @param { Any } _id - user id taken from the client side
   * @param { Func } func - callback to invoke the next middleware
   * @param { Object } err - error message object response from the MongoDB
   * @param { Object } user - user data from the user collection in MongoDB
   */
  User.findById({ _id: authUserId }).exec((err, user) => {
    /** Send the error message if query _id failed */
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    /** Add the user taken into a request object called profile */
    req.profile = user;

    /** Invoke next middleware */
    next();
  });
};

/**
 * Middleware to query the admin user
 * @param { Any } req - request from the client side application
 * @param { Any } res - response from the server side
 * @param { Func } next - callback to invoke the next middleware
 * @return { Any } user profile that hold the entire user information
 */
exports.adminMiddleware = (req, res, next) => {
  /** Grab admin user id from the request */
  const adminUserId = req.user._id;

  /** Constant to identify admin user */
  const ROLE_ADMIN = 1;

  /**
   * Request Model query the admin user
   * @param { Any } _id - admin id taken from the client side
   * @param { Func } func - callback to invoke the next middleware
   * @param { Object } err - error message object response from the MongoDB
   * @param { Object } user - user data from the user collection in MongoDB
   */
  User.findById({ _id: adminUserId }).exec((err, user) => {
    /** Send the error message if query _id failed */
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    /** Send the error message if user role is not admin user */
    if (user.role !== ROLE_ADMIN) {
      return res.status(400).json({
        error: "Access denied!",
      });
    }

    /**
     * Add the user taken into a request object called profile
     * TODO: Should limit user information will be response
     */
    req.profile = user;

    /** Invoke next middleware */
    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();

    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }

    next();
  });
};

// forgotPassword, resetPassword
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset link`,
      html: `
        <p>Please use the following link to reset your password</p>
        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://vnpace.dev</p>
      `,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err || !success) {
        return res.json({
          error: errorHandler(err),
        });
      } else {
        sgMail
          .send(emailData)
          .then((sent) => {
            return res.json({
              message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes.`,
            });
          })
          .catch((error) => {
            console.log(error.response.body);
          });
      }
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Try again",
        });
      }

      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            error: "Something went wrong. Try later.",
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
        };
        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err || !result) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          res.json({
            message: "Great! Now you can login with your new password",
          });
        });
      });
    });
  }
};

/**
 * NOTE Need enable third-party cookies
 * Setting > Privacy and security > Cookies and other site data > Allow all cookies
 */
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googleLogin = (req, res) => {
  const idToken = req.body.tokenId;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email, jti } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });
            res.cookie("token", token, { expiresIn: "1d" });
            const { _id, email, name, role, username } = user;
            return res.json({
              token,
              user: { _id, email, name, role, username },
            });
          } else {
            let username = shortId.generate();
            let profile = `${process.env.CLIENT_URL}/profile/${username}`;
            let password = jti;
            user = new User({ name, email, profile, username, password });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: errorHandler(err),
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
              );
              res.cookie("token", token, { expiresIn: "1d" });
              const { _id, email, name, role, username } = data;
              return res.json({
                token,
                user: { _id, email, name, role, username },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again.",
        });
      }
    });
};
