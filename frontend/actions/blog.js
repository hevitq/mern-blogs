////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware to fetch API between client and server */
import fetch from "isomorphic-fetch";

/** Middleware to config connection to API between client and server */
import { API } from "../config";

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Method to make a request to create a new blog
 * @param { Object } blog - all content of blog (fields, files...)
 * @param { String } token - the token to authenticate
 * @return { Object } the response body
 */
export const createBlog = (blog, token) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return fetch(`${API}/blog`, {
    /** Config method verbal to send data to the server */
    method: "POST",

    /** Config headers ways to send data to and receive data from server */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    /** Config body content to send data to and receive data from server */
    body: blog
  })
  /** Send response data to the client */
  .then(response => {
    return response.json();
  })
  /** Send error message to the client */
  .catch(err => console.log(err));
};