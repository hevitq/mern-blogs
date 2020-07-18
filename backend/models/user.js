////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////
/** Middleware allows to work with MongoDB */
const mongoose = require("mongoose");

/** Middleware allows to encrypt data by a certain algorithm */
const crypto = require("crypto");

////////////////////////////////////////////////////////////////////////////////
// !--------------------------INSTANCE OF USER----------------------------------
// ? Take requests process data from the subscribing Controller.
// ? Notify changes to the subscribing Controller.
////////////////////////////////////////////////////////////////////////////////

/**
 * Create instance mongo schema for user model
 * @arg { Object } object - User profile
 * @arg { Boolean } timestamp - Update time
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    profile: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamp: true }
);

/**
 * Encapsulation to make sure "sensitive" data is hidden from users
 * Refer: https://mongoosejs.com/docs/api/virtualtype.html
 */
userSchema
  /**
   * Create the virtual field
   * @arg { VirtualType } password - virtual type name
   */
  .virtual("password")

  /**
   * Defines a setter
   * @param { String } password - plain password
   */
  .set(function (password) {
    /** Create a temporary _password to store plain password */
    this._password = password;

    /** Create salt to store the generated salt */
    this.salt = this.makeSalt();

    /** Create hashed_password to store the encrypted password */
    this.hashed_password = this.encryptPassword(password);
  })
  /**
   * Defines a getter
   * @return { String } _password: temporary password
   */
  .get(function () {
    return this._password;
  });

/**
 * Object defined methods on this schema during the user sign in process
 * @method { Method} authenticate - authenticate the user information
 * @method { Method} encryptPassword - encrypt the user password
 * @method { Method} makeSalt - generate a salt encrypt
 */
userSchema.methods = {
  /**
   * Method to authenticate the user signed in
   * @param { String } plainText - password taken from the client
   * @return { Boolean } - True: authenticated, False: not authenticated
   */
  authenticate: function (plainText) {
    /** Compare encrypted password with hashed password stored in database */
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Method to encrypt the plain password
   * @param { String } password - plain password taken from the client
   * @return { String } - hashed password
   */
  encryptPassword: function (password) {
    /** Return empty string if not getting any password from client */
    if (!password) return "";

    // Try to hash the plain password
    try {
      /**
       * Performs the calculation of an authentication code
       * @arg { String } sha1 - hashing algorithm
       * @arg { String } salt - secret access key generated for signing
       * @arg { String } password - plain password
       * @arg { String } hex - character encoding
       * @returns {String} request signature for header
       * Refer:
       * https://nodejs.org/api/crypto.html#crypto_crypto_createhmac_algorithm_key_options
       * https://nodejs.org/en/knowledge/
       */
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");

    } catch (err) {
      // If there is an error, just reach an empty string
      return "";
    }
  },

  /**
   * Performs the calculation of a secret salt code
   * @return { String } a secret salt code
   * NOTE: + "" is a technique to convert a number to a string.
   */
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};

////////////////////////////////////////////////////////////////////////////////
// !------------------------------PUBLIC MODULE---------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Notify changes to the subscribing Controller. */
module.exports = mongoose.model("User", userSchema);
