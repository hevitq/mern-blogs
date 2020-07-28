'use strict';

/**
 * Grab error unique field already exists
 */
const uniqueMessage = error => {
    let output;
    try {
        let fieldName = error.message.substring(error.message.lastIndexOf('.$') + 2, error.message.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
};

/**
 * Grab and customize the MongoDb error message
 * @param { Object } error - error object occur when create new resource
 */
exports.errorHandler = error => {
  /** Error message from error object */  
  let message = '';

  if(!error) return message;

  /** Check error code exist */
  if (error.code) {
      /** Condition run code block */
      switch (error.code) {
          case 11000:
          case 11001:
              message = uniqueMessage(error);
              break;
          default:
              message = 'Something went wrong';
      }
  } else {
      for (let errorName in error.errs) {
        /** Grab the first error message */
          if (error.errs[errorName].message) message = error.errs[errorName].message;
      }
  }

  return message;
};