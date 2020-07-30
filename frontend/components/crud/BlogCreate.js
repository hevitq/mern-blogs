////////////////////////////////////////////////////////////////////////////////
// ! ----------------------- ABOUT BLOG COMPONENT ---------------------------- !
// ? Only run in the client side after apply the functionality next/dynamic.
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// ! --------------------- LOAD MIDDLEWARE/COMPONENT ------------------------- !
////////////////////////////////////////////////////////////////////////////////

/** Component allows enable client side transitions between routes */
import Link from "next/link";

/** Hooks API allows use state and other features without writing a class */
import { useState, useEffect } from "react";

/** Middleware allows to access the `router` object */
import { Router, withRouter } from "next/router";

/**
 * Middleware allows import and work with JavaScript modules dynamically
 * NOTE: next/dynamic
 * - help make sure SSR (server side rendering) is false when using React Quill
 * - as Rich Text Editor. Because React Quill runs only in the client side, but
 * - nextjs runs in both client side and server side.
 */
import dynamic from "next/dynamic";

/** Middleware allows authenticate the user */
import { getCookie, isAuth } from "../../actions/auth";

/** Middleware allows get all categories to create a new blog */
import { getCategories } from "../../actions/category";

/** Middleware allows get all tags to create a new blog */
import { getTags } from "../../actions/tag";

/** Middleware allows send data to create a new blog */
import { createBlog } from "../../actions/blog";

/**
 * Component allows create a rich text editor only client side rendering
 * @arg { Func } func - callback which return a component
 * @arg { Object } object - disable server side rendering
 */
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

/** Implement by CDN for performance  */
// import "../../node_modules/react-quill/dist/quill.snow.css";

import { QuillModules, QuillFormats } from "../../helpers/quill";

////////////////////////////////////////////////////////////////////////////////
// ! --------------------- APPLY MIDDLEWARE/COMPONENT ------------------------ !
////////////////////////////////////////////////////////////////////////////////

/** Method to create a new blog */
const CreateBlog = ({ router }) => {
  /**
   * Method to grab blog data from the local storage
   * @return { String } blog value stored in local storage
   */
  const blogFormLocalStorage = () => {
    /**
     * Check if the script not run in a web-page inside a web-browser
     * NOTE: Scripts (Ex: Javascript)
     * can run in web-pages, in server side (nodejs), in background web-worker
     */
    if (typeof window === "undefined") {
      return false;
    }

    /** Grab log value from local storage if exist */
    if (localStorage.getItem("blog")) {
      /** Convert to json object for working in the client side */
      return JSON.parse(localStorage.getItem("blog"));
    }

    /** Return nothing if nothing match */
    return false;
  };

  /** Create states of categories */
  const [categories, setCategories] = useState([]);

  /** Create states of tags */
  const [tags, setTags] = useState([]);

  /** Create states of checked categories */
  const [checkedCategories, setCheckedCategories] = useState([]);

  /** Create states of checked tags */
  const [checkedTags, setCheckedTags] = useState([]);

  /**
   * Create states of body object
   * @param { Object} body - by default grab value stored in the local storage
   * @func { Func } setBody - Grab values in the body to set new state
   */
  const [body, setBody] = useState(blogFormLocalStorage());

  /**
   * Create states of body object
   * @param { Object} values - value of properties got from the blog
   * @func { Func } setValues - Grab values as the user types and set to new state
   */
  const [values, setValues] = useState({
    error: "" /** Alert error message */,
    sizeError: "" /** Alert when content is too big */,
    success: "" /** Alert success message */,
    formData: "" /** Show/Populate form data when router change */,
    title: "" /** Show/Populate title data */,
    hidePublishButton: false /** Enable/Disable button Publish */,
  });

  /** Destructuring to grab all values for changing data in the form */
  const {
    error,
    sizeError,
    success,
    formData,
    title,
    hidePublishButton,
  } = values;

  /** Grab token from the cookie */
  const token = getCookie("token");

  /**
   * Load states anytime the router change
   * @param { Func } func - Callback
   * @param { Array } router - Callback only run when router state has a change
   */
  useEffect(() => {
    /**
     * Create a instance of new form data anytime the router change
     * NOTE: Router change: reload, forward, backward ... page.
     */
    setValues({ ...values, formData: new FormData() });

    initCategories();

    initTags();
  }, [router]);

  const initCategories = () => {
    /** Make api request to get categories */
    getCategories().then((data) => {
      /** Show error if exist */
      if (data.error) {
        setValues({ ...values, error: data.error });
      }

      /** Invoke method set state for categories */
      setCategories(data);
    });
  };

  const initTags = () => {
    /** Make api request to get tags */
    getTags().then((data) => {
      /** Show error if exist */
      if (data.error) {
        setValues({ ...values, error: data.error });
      }

      /** Invoke method set state for tags */
      setTags(data);
    });
  };

  /**
   * Method to call api send data to create a new blog
   * @arg { Event } e - event
   */
  const publishBlog = (e) => {
    /** Prevent reload page when working with api */
    e.preventDefault();

    createBlog(formData, token).then((data) => {

      if (!data || data.error) {
        setValues({ ...values, error: data && data.error });
      } else {
        setValues({
          ...values,
          title: "",
          error: "",
          success: `${ data && data.title} is created`,
        });
        setBody("");
        setCategories([]);
        setTags([]);
      }
    });
  };

  /**
   * Handle any change in the form title
   * @param { Any } name - field name in the schema
   * @return { Func } callback
   * NOTE: function of returning a function
   */
  const handleChange = (name) => (e) => {
    /** Grab file name for the photo, and value for otherwise */
    const value = name === "photo" ? e.target.files[0] : e.target.value;

    /**
     * Populate the form data when component loaded in the through useEffect
     * @arg { Any } name - element's name
     * @arg { Any } value - file's/field's value
     */
    formData.set(name, value);

    /** Update the state */
    setValues({ ...values, [name]: value, formData, error: "" });
  };

  /**
   * Handle any change in the form body (React Quill)
   * @arg { Event } e - entire event occur in the body
   */
  const handleBody = (e) => {
    /** Grab values in body as the user make a event and set to new state */
    setBody(e);

    /**
     * Populate the form data when component loaded in the through useEffect
     * @arg { Any } "body" - name
     * @arg { Any } e - entire event in the body
     */
    formData.set("body", e);

    /** Populate body to local storage to keep data when page refreshed */
    if (typeof window !== "undefined") {
      /** Save in a json string format to later works with the server side */
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  /**
   * Method to check/un-check categories checkbox
   * @param { Object } category - category (objectId)
   * NOTE: function return a function
   */
  const handleCategoryToggle = (category) => () => {
    /** Clear any error out */
    setValues({ ...values, error: "" });

    /**
     * Grab the first category index number or -1
     * NOTE: indexOf
     * - Find category out => return first category index
     * - Otherwise => return -1 (not found)
     */
    const clickedCategory = checkedCategories.indexOf(category);

    /** Spread to new state */
    const newCategoriesList = [...checkedCategories];

    /** Push category to new categories list if not find category out */
    if (clickedCategory === -1) {
      newCategoriesList.push(category);
    } else {
      /** Take one category item out */
      newCategoriesList.splice(clickedCategory, 1);
    }

    console.log(newCategoriesList);

    /** Set checked categories to new categories list */
    setCheckedCategories(newCategoriesList);

    /** Update the form data to send to the backend */
    formData.set("categories", newCategoriesList);
  };

  /**
   * Method to check/un-check tags checkbox
   * @param { Object } tag - tag (objectId)
   * NOTE: function return a function
   */
  const handleTagToggle = (tag) => () => {
    /** Clear any error out */
    setValues({ ...values, error: "" });

    /**
     * Grab the first tag index number or -1
     * NOTE: indexOf
     * - Find tag out => return first tag index
     * - Otherwise => return -1 (not found)
     */
    const clickedTag = checkedTags.indexOf(tag);

    /** Spread to new state */
    const newTagsList = [...checkedTags];

    /** Push tag to new tags list if not find tag out */
    if (clickedTag === -1) {
      newTagsList.push(tag);
    } else {
      /** Take one category item out */
      newTagsList.splice(clickedTag, 1);
    }

    console.log(newTagsList);

    /** Set checked tags to new tags list */
    setCheckedTags(newTagsList);

    /** Update the form data to send to the backend */
    formData.set("tags", newTagsList);
  };

  /** Method to render categories elements */
  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => {
        return (
          <li key={index} className="list-unstyled">
            <input
              onChange={handleCategoryToggle(category._id)}
              type="checkbox"
              className="mr-2"
            />
            <label className="form-check-label">{category.name}</label>
          </li>
        );
      })
    );
  };

  /** Method to render tags elements*/
  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => {
        return (
          <li key={index} className="list-unstyled">
            <input
              onChange={handleTagToggle(tag._id)}
              type="checkbox"
              className="mr-2"
            />
            <label className="form-check-label">{tag.name}</label>
          </li>
        );
      })
    );
  };

  /** Show error message */
  const showError = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
    );
  };

  /** Show success message */
  const showSuccess = () => {
    return (
      <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
    );
  };

  /**
   * Method to create form for new blog
   * @return a from
   */
  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange("title")}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            value={(body === false) ? "" : body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="Submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pd-5">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <div className="pt-3">
            {showError()}
            {showSuccess()}
          </div>
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
              <hr />
              <small className="text-muted">Max size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ! ---------------------------- PUBLIC MODULE ------------------------------ !
////////////////////////////////////////////////////////////////////////////////

export default withRouter(CreateBlog);
