////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware to fetch API between client and server */
import fetch from "isomorphic-fetch";

/** Middleware to config connection to API between client and server */
import { API } from "../config";

import { handleResponse } from "./auth";

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Method to make a request to get the public profile
 * @param { String } username - username in User schema
 * @return { Object } the response body
 */
export const userPublicProfile = (username) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return fetch(`${API}/user/${username}`, {
    /** Config method verbal to send data to the server */
    method: "GET",

    /** Config headers ways to send data to and receive data from server */
    headers: {
      Accept: "application/json",
    },
  })
  /** Send response data to the client */
  .then(response => {
     return response.json();
  })
  /** Send error message to the client */
  .catch(err => console.log(err));
};

/**
 * Method to make a request to update profile
 * @param { String } token - token from the cookie
 * @return { Object } the response body
 */
export const getProfile = (token) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return fetch(`${API}/user/profile`, {
    /** Config method verbal to send data to the server */
    method: "GET",

    /** Config headers ways to send data to and receive data from server */
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
  })
  /** Send response data to the client */
  .then(response => {
     return response.json();
  })
  /** Send error message to the client */
  .catch(err => console.log(err));
};

/**
 * Method to make a request to update profile
 * @param { String } token - token from the cookie
 * @return { Object } the response body
 */
export const update = (token, user) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return fetch(`${API}/user/update`, {
    /** Config method verbal to send data to the server */
    method: "PUT",

    /** Config headers ways to send data to and receive data from server */
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    },
    body: user
  })
  /** Send response data to the client */
  .then(response => {
    handleResponse(response);
    return response.json();
  })
  /** Send error message to the client */
  .catch(err => console.log(err));
};

