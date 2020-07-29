////////////////////////////////////////////////////////////////////////////////
// Methods to interact with the backend via apis
// Implement: Put inside Components
////////////////////////////////////////////////////////////////////////////////

/**
 * Bring isomorphic-fetch from node_modules
 * isomorphic-fetch will create a http-client to send user information
 * to the backend
 * Refer: https://www.npmjs.com/package/isomorphic-fetch
 */
import fetch from 'isomorphic-fetch';

/** Bring api from config file */
import { API } from "../config";

import { handleResponse } from "./auth";


/**
 * Method to make a request to the server for creating a new category
 * @param { String } category - a new category name that the user inputted
 * @param { String } token - a user token that stored in the client's cookie
 */
export const create = (category, token) => {
  /**
   * Setup method to call api create a new category
   * @arg { String } URL - API to connect to the server side to fetch data
   * @arg { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/category`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "POST",

    /**
     * Configure Headers
     * Notify to the server only accept with application/json data
     * and the client only receive Content-Type: application/json data
     * and the token to authenticate (verify) the admin user
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },

    /**
     * Configure Body
     * Need convert json object into a string before sending to a web server
     */
    body: JSON.stringify(category)
  })
  /**
   * Take response from the client,
   * and give/bring it to the component Category by the method create
   * to handle the response
   */
  .then(response => {
    handleResponse(response);

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
 * Method to make a request to the server for query all categories
 */
export const getCategories = () => {
  /**
   * Setup method to call api query all categories
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/categories`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "GET"
  })
  /**
   * Take response from the client,
   * and give/bring it to the component Category by the method create
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
 * Method to make a request for query all categories
 */
export const singleCategory = (slug) => {
  /**
   * Setup method to call api query a certain category
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/category/${slug}`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "GET"
  })
  /**
   * Take response from the client,
   * and give/bring it to the component Category by the method create
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
 * Method to make a request for deleting a new category
 * @param { Object } category - category passed to sent to the server side
 * @param { Object } token - valid token passed to authenticate from the client
 */
export const removeCategory = (slug, token) => {
  /**
   * Setup method to call api delete a category
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * Refer: Fetch() method
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * NOTE: Imagine process like run by Postman
   */
  return fetch(`${API}/category/${slug}`, {
    /**
     * Config Method
     * Method for sending data from the client to the server
     */
    method: "DELETE",

    /**
     * Configure Headers
     * Notify to the server only accept with application/json data
     * and the client only receive Content-Type: application/json data
     * and the token to authenticate (verify) the admin user
     */
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  /**
   * Take response from the client,
   * and give/bring it to the component Category by the method create
   * to handle the response
   */
  .then(response => {
    handleResponse(response);
    
    /** Get the json response */
    return response.json();
  })
  /**
   * Catch any error coming from the backend when fetching
   * such as validation, connection
   */
  .catch(err => console.log(err));
};