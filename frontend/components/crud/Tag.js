////////////////////////////////////////////////////////////////////////////////
// ! -------------------------CATEGORY COMPONENT--------------------------------
// ? Function to create functional component
// ? Handle input data (validator, state, authenticate) before sending a request
// ? Handle output data (message, data, render) after receiving a response
// ? Invoke actions works with api to fetch (request, response) data
////////////////////////////////////////////////////////////////////////////////

/**
 * Bring/Import Hook api from React
 * Refer: https://reactjs.org/docs/hooks-reference.html
 */
import { useState, useEffect } from "react";

/** Bring middleware from next */
import Link from "next/link";
import Router from "next/router";

/** Bring methods from actions */
import { isAuth, getCookie } from "../../actions/auth";
import { create, getTags, removeTag } from "../../actions/tag";

/**
 * Function to create the Tag component (functional component)
 * @return New Tag Form
 */
const Tag = () => {
  /**
   * Create states of values object
   * @param { Object} values - manage the value of properties got from the tag input in the form
   * @func { Func } setValues - Grab values as the user types and set to new state
   */
  const [values, setValues] = useState({
    name: "",
    error: false,  /** Hide error message element */
    success: false,  /** Hide success message element */
    tags: [],  /** Add/Remove a tag from tags list */
    removed: false,  /** Hide delete message element */
    reload: false,  /** Not reload tag component */
  });

  /**
   * Destructing values object to easily access in the component
   * Refer: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
   */
  const { name, error, success, tags, removed, reload } = values;

  /** Grab token to authenticate when creating or deleting a new resource */
  const token = getCookie("token");

  /**
   * Make an effect when the component mounted (deleted/added)
   * @param { Func } func - Callback function
   * @param { Array } reload - Callback only run when reload state has a change
   */
  useEffect(() => {
    /** Invoke method load tags*/
    loadTags();
  }, [reload]);

  /** Method load all tags from the backend*/
  const loadTags = () => {
    /** Invoke method make a request query all tags */
    getTags().then((data) => {
      /**
       * TODO: Cover errors related to server (5xx), request (4xx)
       * Error: JWT expired error, can't fetch data
       * Refer: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
       */
      if (!data) return setValues({
        ...values,  /** Update changes below to values object */
        error: "Failed to fetch data"  /** Populate/Show data error */,
        success: false,  /** Hide success message element */
      });

      /** Update values object when creating tag failed */
      if (data.error) {
        return setValues({
          ...values,  /** Update changes below to values object */
          error: data.error,  /** Populate data error */
          success: false,  /** Hide success message element */
        });
      };

      /** Update values object when request create successfully */
      setValues({
        ...values,  /** Update changes below to values object */
        tags: data /** Update tags list from the response */
      });
    });
  };

  /**
   * Method loop through tags list to render tag elements
   */
  const showTags = () => {
    return tags.map((tag, index) => {
      /**
       * Render tag elements
       */
      return (
        <button
          /** Invoke method to populate delete confirmation dialog */
          onDoubleClick={() => deleteConfirm(tag.slug)}
          title="Double click to delete"
          /** Pass key (unique) to index for looping tag */
          key={index}
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
        >
          {tag.name}
        </button>
      );
    });
  };

  /**
   * Method populate a delete confirmation dialog
   * @param { String } slug - tag slug name
   */
  const deleteConfirm = (slug) => {
    /** Content need to confirm */
    let answer = window.confirm(
      "Are you sure you want to delete this tag?"
    );

    /** Accept delete the target tag */
    if (answer) {
      /** Invoke method to delete the target tag */
      deleteTag(slug);
    }
  };

  /**
   * Method delete a tag from tags list
   * @param { String } slug - tag slug name
   */
  const deleteTag = (slug) => {
    removeTag(slug, token).then((data) => {
      /** Update values object when creating tag failed */
      if (data.error) {
        return setValues({
          ...values,  /** Update changes below to values object */
          error: data.error,  /** Populate data error */
          success: false,  /** Hide success message element */
        });
      };

      /** Update values object when request delete success */
      setValues({
        ...values,  /** Update changes below to values object */
        error: false,  /** Hide error message element */
        success: false,  /** Hide success message element */
        name: "",  /** Empty name filed */
        removed: !removed,  /** Show removed message element */
        reload: !reload  /** Reload tag component */
      });
    });
  };

  /**
   * Method to make a request create a new tag on the form
   * @param { Event } e - Any event in the page
   */
  const clickSubmit = (e) => {
    /** Prevent the page reload when submitting  */
    e.preventDefault();

    /**
     * Invoke method make a request create a new resource
     * @param { Object } name - name grabbed on the form
     * @param { String } token - token grabbed from the cookie
     */
    create({ name }, token).then((data) => {
      /**
       * TODO: Cover errors related to server (5xx), request (4xx)
       * Error: JWT expired error, can't fetch data
       * Refer: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
       */
      if (!data) return setValues({
        ...values,  /** Update changes below to values object */
        error: "Failed to fetch"  /** Populate data error */,
        success: false,  /** Hide success message element */
      });

      /** Change values object when creating failed */
      if (data.error) {
        return setValues({
          ...values,  /** Update changes below to values object */
          error: data.error,  /** Populate data error */
          success: false,  /** Hide success message element */
        });
      };

      /** Update values object when creating success */
      setValues({
        ...values,  /** Update changes below to values object */
        error: false,  /** Hide error message element */
        success: true,  /** Show success message element */
        name: "",  /** Empty name filed */
        reload: !reload  /** Reload tag component */
      });
    });
  };

  /**
   * Method to trigger any change in input form field
   * @param { Event } e - Any event in the page
   * NOTE: function of returning another function
   */
  const handleChange = (e) => {
    /**
     * Update values object by using the spread operator
     */
    setValues({
      ...values,  /** Update changes below to values object */
      name: e.target.value,  /** Grab name value, then populate name state */
      error: false,  /** Hide error message element */
      success: false,  /** Hide success message element */
      removed: false,  /** Hide removed message element */
    });
  };

  /** Method to render/show element when creating tag success */
  const showSuccess = () => {
    if (success) {
      return <p className="text-success">Tag is created</p>;
    }
  };

  /** Method to render/show element when creating tag failed */
  const showError = () => {
    if (error) {
      return <p className="text-danger">Tag already exist</p>;
    }
  };

  /** Method to render/show element when deleting tag success */
  const showRemoved = () => {
    if (removed) {
      return <p className="text-danger">Tag is removed</p>;
    }
  };

  /** Method hide messages when move mouse into the tag form */
  const mouseMoveHandler = (e) => {
    setValues({
      ...values,  /** Update changes below to values object */
      error: false,  /** Hide error message element */
      success: false,  /** Hide success message element */
      removed: false,  /** Hide removed message element */
    });
  };

  /**
   * Function to create the signin form
   * @func { Func } clickSubmit - trigger onSubmit action
   * @func { Func } handleChange - trigger onChange action
   */
  const newTagForm = () => {
    /**
     * To show/render new tag form
     * Use parenthesis ({}) can put everything inside a single form
     * onChange={handleChange} trigger anything change inside form
     * if form changed, handleChange() invoke setValues() to update new state
     * value={name} trigger anything change value status from the setValues()
     * onSubmit={clickSubmit} make a request to the backend
     */
    return (
      <form onSubmit={clickSubmit}>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange}
            value={name}
            required
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </div>
      </form>
    );
  };

  /**
   * To sort the order of rendering elements inside React.Fragment
   * A common pattern in React is for a component to return multiple elements.
   * Refer: https://reactjs.org/docs/fragments.html
   */
  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newTagForm()}
        {showTags()}
      </div>
    </React.Fragment>
  );
};

/**
 * To public the component as an object/module type
 */
export default Tag;
