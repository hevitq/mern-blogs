////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Middleware to fetch API between client and server */
import fetch from "isomorphic-fetch";

/** Middleware to config connection to API between client and server */
import { API } from "../config";

import queryString from "query-string";

import { isAuth, handleResponse } from "./auth";

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
  /** Variable to dynamic API */
  let createBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    createBlogEndpoint = `${API}/blog`;
  } else if (isAuth() && isAuth().role === 0) {
    createBlogEndpoint = `${API}/user/blog`;
  }

  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return (
    fetch(`${createBlogEndpoint}`, {
      /** Config method verbal to send data to the server */
      method: "POST",

      /** Config headers ways to send data to and receive data from server */
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      /** Config body content to send data to and receive data from server */
      body: blog,
    })
      /** Send response data to the client */
      .then((response) => {
        handleResponse(response);
        return response.json();
      })
      /** Send error message to the client */
      .catch((err) => console.log(err))
  );
};

/**
 * Method to make a request to create a new blog
 * @param { Object } blog - all content of blog (fields, files...)
 * @param { String } token - the token to authenticate
 * @return { Object } the response body
 */
export const listBlogsWithCategoriesAndTags = (skip, limit) => {
  const data = {
    limit,
    skip,
  };

  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   */
  return (
    fetch(`${API}/blogs-categories-tags`, {
      /** Config method verbal to send data to the server */
      method: "POST",

      /** Config headers ways to send data to and receive data from server */
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      /** Send response data to the client */
      .then((response) => {
        return response.json();
      })
      /** Send error message to the client */
      .catch((err) => console.log(err))
  );
};

export const singleBlog = (slug) => {
  return fetch(`${API}/blog/${slug}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const listRelated = (blog) => {
  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   */
  return (
    fetch(`${API}/blogs/related`, {
      /** Config method verbal to send data to the server */
      method: "POST",

      /** Config headers ways to send data to and receive data from server */
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blog),
    })
      /** Send response data to the client */
      .then((response) => {
        return response.json();
      })
      /** Send error message to the client */
      .catch((err) => console.log(err))
  );
};

export const list = (username) => {
  /** Variable to dynamic API */
  let listBlogsEndpoint;

  if (username) {
    listBlogsEndpoint = `${API}/${username}/blogs`;
  } else {
    listBlogsEndpoint = `${API}/blogs`;
  }

  return fetch(`${API}/blogs`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const removeBlog = (slug, token) => {
  /** Variable to dynamic API */
  let deleteBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    deleteBlogEndpoint = `${API}/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    deleteBlogEndpoint = `${API}/user/blog/${slug}`;
  }

  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return (
    fetch(`${deleteBlogEndpoint}`, {
      /** Config method verbal to send data to the server */
      method: "DELETE",

      /** Config headers ways to send data to and receive data from server */
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      /** Send response data to the client */
      .then((response) => {
        handleResponse(response);
        return response.json();
      })
      /** Send error message to the client */
      .catch((err) => console.log(err))
  );
};

export const updateBlog = (blog, token, slug) => {
  /** Variable to dynamic API */
  let updateBlogEndpoint;

  if (isAuth() && isAuth().role === 1) {
    updateBlogEndpoint = `${API}/blog/${slug}`;
  } else if (isAuth() && isAuth().role === 0) {
    updateBlogEndpoint = `${API}/user/blog/${slug}`;
  }

  /**
   * One get user information will return fetch
   * @argument { String } URL - API to connect to the server side to fetch data
   * @argument { Object } Object - Configuration when fetching
   * NOTE: Because using form data, not works with json data.
   */
  return (
    fetch(`${updateBlogEndpoint}`, {
      /** Config method verbal to send data to the server */
      method: "PUT",

      /** Config headers ways to send data to and receive data from server */
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },

      /** Config body content to send data to and receive data from server */
      body: blog,
    })
      /** Send response data to the client */
      .then((response) => {
        handleResponse(response);
        return response.json();
      })
      /** Send error message to the client */
      .catch((err) => console.log(err))
  );
};

export const listSearch = (params) => {
  console.log("search params", params);
  let query = queryString.stringify(params);
  console.log("query params", query);
  return fetch(`${API}/blogs/search?${query}`, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
