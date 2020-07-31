/**
 * Bring isomorphic-fetch from node_modules
 * isomorphic-fetch will create a http-client to send user information
 * to the backend
 * Refer: https://www.npmjs.com/package/isomorphic-fetch
 */
import fetch from 'isomorphic-fetch';

/**
 * Bring js-cookie from the node_modules
 * ks-cookie is a lightweight JavaScript API for handling cookies
 * Refer: https://www.npmjs.com/package/js-cookie
 */
import cookie from "js-cookie";

/** Bring api from config file */
import { API } from "../config";

import Router from "next/router";

export const handleResponse = (response) => {
  if(response.status === 401) {
    signout(() => {
      Router.push({
        pathname: "/signin",
        query: {
          message: "Your session is expired. Please signin"
        },
      });
    });
  } else {
    return;
  };
};

/**
 * Method to make a request for activating an account
 * @param { Object } user - user information passed to sent to the server side
 */
export const preSignup = (user) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/pre-signup`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "POST",

    /**
     * Configure Headers
     * Notify to the server only accept with application/json data
     * and the client only receive Content-Type: application/json data
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    /**
     * Configure Body
     * Converting the user object json to a json string
     * and sending it to the server from the user information on the input form
     */
    body: JSON.stringify(user)
  })
  /**
   * Take response from the client,
   * and give/bring it to the component SignupComponent by the method signup
   * to handle the response
   */
  .then(response => {
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};

/**
 * Method to make a request for creating a new user
 * @param { Object } user - user information passed to sent to the server side
 */
export const signup = (user) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/signup`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "POST",

    /**
     * Configure Headers
     * Notify to the server only accept with application/json data
     * and the client only receive Content-Type: application/json data
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    /**
     * Configure Body
     * Converting the user object json to a json string
     * and sending it to the server from the user information on the input form
     */
    body: JSON.stringify(user)
  })
  /**
   * Take response from the client,
   * and give/bring it to the component SignupComponent by the method signup
   * to handle the response
   */
  .then(response => {
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};

/**
 * Method to make a request for authenticating the user
 * @param { Object } user - user information passed to sent to the server side
 */
export const signin = (user) => {
  /**
   * Once get user information will return fetch
   * @arg { String } URL - API to connect to the server side to fetch data
   * @arg { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/signin`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "POST",

    /**
     * Configure Headers
     * Notify to the server only accept with Content-Type: application/json
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    /**
     * Configure Body
     * Converting the user object json to a json string
     * and sending it to the server from the user information on the input form
     */
    body: JSON.stringify(user)
  })
  /**
   * Take response from the server side,
   * and give/bring it to the component SignupComponent by the method signup
   * to handle the response
   */
  .then(response => {
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};

/** Method to remove token from the cookie, and user from the local storage */
export const signout = (next) => {
  /**
   * To remove token from the cookie
   * @arg { String } "token" - cookie name
   */
  removeCookie("token");

  /**
   * To remove user information from the local storage
   * @arg { String } "user" - local storage name
   */
  removeLocalStorage("user");

  /**
   * Execute the callback function to invokes the next middleware in the app
   */
  next();

  /**
   * Send request signout to the backend server
   * @arg { String } URL - API to connect to the server side to fetch data
   * @arg { Object } Object - Configuration when fetching
   */
  return fetch(`${API}/signout`, {
    method: "GET"
  })
  /**
   * Take response from the server side
   */
  .then(response => {
    console.log("Signout success.")
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as connection
   */
  .catch(err => console.log(err));
};

/**
 * Method set cookie to the browser (the client side application)
 * @param { String } key - cookie name
 * @param { String } value - cookie value
 */
export const setCookie = (key, value) => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /**
     * Save item to cookie
     * @param { String } key - cookie name
     * @param { String } value - cookie value
     * @param { Object } object - some configuration such as expires
     */
    cookie.set(key, value, {
      expires: 1  /** Expires in 1 day */
    })
  }
};

/**
 * Method remove cookie from the browser (the client side application)
 * @param { String } key - cookie name
 */
export const removeCookie = (key) => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /**
     * Remove item from cookie
     * @param { String } key - cookie name
     * @param { Object } object - some configuration such as expires
     */
    cookie.remove(key, {
      expires: 1  /** Expires in 1 day */
    })
  }
};

/**
 * Method get cookie from the browser to validate authenticate the user
 * @param { String } key - cookie name
 */
export const getCookie = (key) => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /** Get item in cookie name */
    return cookie.get(key);
  };
};

/**
 * Method get local storage from the browser
 * @param { String } key - local storage name
 */
export const getLocalStorage = (key) => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /** Get item in local storage name */
    return localStorage.get(key);
  };
};

/**
 * Method set item to the local storage
 * @param { String } key - local storage name
 * @param { String } value - local storage value
 */
export const setLocalStorage = (key, value) => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /**
     * Set item to local storage
     * @param { String } key - local storage name
     * @param { String } json - JSON data
     * NOTE: Need convert to json string before saving to local storage
     */
    localStorage.setItem(key, JSON.stringify(value));
  };
};

/**
 * Method remove item from the local storage
 * @param { String } key - local storage name
 * @param { String } value - local storage value
 */
export const removeLocalStorage = (key) => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /**
     * Remove item from local storage
     * @param { String } key - local storage name
     */
    localStorage.removeItem(key);
  };
};

/**
 * Method authenticate user by pass data to cookie and local storage
 * @param { Any } data - whatever got from the response
 * @param { Function } next - callback function
 * NOTE: authenticate()
 * - will be bring to SigninComponent to authenticate 
 */
export const authenticate = (data, next) => {
  /**
   * Save token data sent from the backend to the cookie of the browser
   * @argument { String } "token" - cookie name
   * @argument { String } data.token - token inside response data
   * NOTE: token
   * - is a sensitive information, should save in the cookie
   */
  setCookie("token", data.token);

  /**
   * Save user data sent from the backend to the local storage of the browser
   * @argument { String } "user" - local storage name
   * @argument { String } data.user - token inside response data
   * NOTE: user
   * - is not a sensitive information, can save in the local storage to use
   * - anywhere in the application, ex in navigation, any other component
   */
  setLocalStorage("user", data.user);

  /**
   * Execute the callback function to invokes the next middleware in the app
   * NOTE: next() function
   * - could be named anything, but by convention it is always named “next”.
   * - to avoid confusion, always use this convention.
   */
  next()
};

/**
 * Method to define is authenticated or not
 * to determine show/hide signup, signin, signout button.
 * to determine redirect to the home page
 * @return { Boolean } isAuth flag
 */
export const isAuth = () => {
  /**
   * Check process is browser
   * Make sure, we're running in the client side
   */
  if(process.browser) {
    /** Token stored in the cookie on the browser */
    const cookieChecked = getCookie("token");
    /**
     * Check token exist inside the cookie
     * NOTE: token exist
     * - means we have the user
     */
    if(cookieChecked) {
      /** Check user exist inside the local storage */
      if(localStorage.getItem("user")) {
        /**
         * Take the user saved in the local storage
         * NOTE: JSON.parse() method
         * - Parse json string to be use as javascript json object
         */
        return JSON.parse(localStorage.getItem("user"));
      };

      return false;
    }
  };
};

/**
 * Method to check admin role used as a middleware
 * @param { Number } role - user role that defined inside User Schema.
 * TODO: Current don't implement
 */
export const isAdmin = (role) => {
  if(role && !Number(role) === 0) {
    return "ADMIN_ROLE";
  }
  return "USER_ROLE";
};

/**
 * Method to update user information
 * @param { Object } user - user information
 * @param { Callback } next
 * @return callback
 */
export const updateUser = (user, next) => {
  /** Check client side */
  if(process.browser) {
    /** Check item in localstorage */
    if(localStorage.getItem("user")) {
      /** Grab the user from the localstorage */
      let auth = JSON.parse(localStorage.getItem("user"));

      /** Populate the user from the response to update to localstorage*/
      auth = user;

      /** Update localstorage */
      localStorage.setItem("user", JSON.stringify(auth));

      /** Invoke next middleware */
      next();
    }
  };
};

/**
 * Method to make a request for forgetting password
 * @param { Property } email - email passed to sent to the server side
 */
export const forgotPassword = (email) => {
  /**
   * Once get user information will return fetch
   * @arg { String } URL - API to connect to the server side to fetch data
   * @arg { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/forgot-password`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "PUT",

    /**
     * Configure Headers
     * Notify to the server only accept with Content-Type: application/json
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    /**
     * Configure Body
     * Converting the user object json to a json string
     * and sending it to the server from the user information on the input form
     */
    body: JSON.stringify(email)
  })
  /**
   * Take response from the server side,
   * and give/bring it to the component SignupComponent by the method signup
   * to handle the response
   */
  .then(response => {
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};

/**
 * Method to make a request for resetting password
 * @param { Object } resetInfo - info passed to sent to the server side
 */
export const resetPassword = (resetInfo) => {
  /**
   * Once get user information will return fetch
   * @arg { String } URL - API to connect to the server side to fetch data
   * @arg { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/reset-password`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "PUT",

    /**
     * Configure Headers
     * Notify to the server only accept with Content-Type: application/json
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    /**
     * Configure Body
     * Converting the user object json to a json string
     * and sending it to the server from the user information on the input form
     * NOTE: if use ({restInfo}) instead of (restInfo) will error Invalid value
     */
    body: JSON.stringify(resetInfo)
  })
  /**
   * Take response from the server side,
   * and give/bring it to the component SignupComponent by the method signup
   * to handle the response
   */
  .then(response => {
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};

/**
 * Method to make a request for login with Google
 * @param { Object } resetInfo - info passed to sent to the server side
 */
export const loginWithGoogle = (user) => {
  /**
   * Once get user information will return fetch
   * @arg { String } URL - API to connect to the server side to fetch data
   * @arg { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/google-login`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "POST",

    /**
     * Configure Headers
     * Notify to the server only accept with Content-Type: application/json
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },

    /**
     * Configure Body
     * Converting the user object json to a json string
     * and sending it to the server from the user information on the input form
     * NOTE: if use ({restInfo}) instead of (restInfo) will error Invalid value
     */
    body: JSON.stringify(user)
  })
  /**
   * Take response from the server side,
   * and give/bring it to the component SignupComponent by the method signup
   * to handle the response
   */
  .then(response => {
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};