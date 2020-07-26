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

/**
 * Middleware allows to access the `router` object
 * NOTE: Router => works, { Router } => don't works
 * https://stackoverflow.com/questions/54968574/next-js-router-push-is-not-a-function-error
 */
import Router from "next/router";
import { withRouter } from "next/router";

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
import { singleBlog, updateBlog } from "../../actions/blog";

/**
 * Component allows create a rich text editor only client side rendering
 * @arg { Func } func - callback which return a component
 * @arg { Object } object - disable server side rendering
 */
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

/** Implement by CDN for performance  */
// import "../../node_modules/react-quill/dist/quill.snow.css";

import { QuillModules, QuillFormats } from "../../helpers/quill";

import { API } from "../../config";

////////////////////////////////////////////////////////////////////////////////
// ! --------------------- APPLY MIDDLEWARE/COMPONENT ------------------------ !
////////////////////////////////////////////////////////////////////////////////

const BlogUpdate = ({ router }) => {
  const [body, setBody] = useState("");

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
   * @param { Object} values - value of properties got from the blog
   * @func { Func } setValues - Grab values as the user types and set to new state
   */
  const [values, setValues] = useState({
    title: "",
    error: "" /** Alert error message */,
    success: "" /** Alert success message */,
    formData: "" /** Show/Populate form data when router change */,
    title: "" /** Show/Populate title data */,
    body: "",
  });

  const { error, success, formData, title } = values;
  const token = getCookie("token");

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let categoryList = [];
    blogCategories.map((category, index) => {
      categoryList.push(category._id);
    });
    setCheckedCategories(categoryList);
  };

  const setTagsArray = (blogTags) => {
    let tagList = [];
    blogTags.map((tag, index) => {
      tagList.push(tag._id);
    });
    setCheckedTags(tagList);
  };

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

  const findOutCategory = (category) => {
    const result = checkedCategories.indexOf(category);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTag = (tag) => {
    const result = checkedTags.indexOf(tag);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
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
              checked={findOutCategory(category._id)}
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
              checked={findOutTag(tag._id)}
              type="checkbox"
              className="mr-2"
            />
            <label className="form-check-label">{tag.name}</label>
          </li>
        );
      })
    );
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

  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
  };

  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: "",
          success: `Blog titled ${data.title} is successfully updated`,
        });
        if (isAuth() && isAuth().role === 1) {
          // Router.replace(`/admin/crud/${router.query.slug}`);
          Router.replace(`/admin`);
        } else if (isAuth() && isAuth().role === 0) {
          // Router.replace(`/user/crud/${router.query.slug}`);
          Router.replace(`/user`);
        }
      };
    });
  };

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
   * Method to update form for new blog
   * @return a from
   */
  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
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
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>

        <div>
          <button type="Submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pd-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            {showSuccess()}
            {showError()}
          </div>

          {body && (
            <img
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: "100%" }}
            />
          )}
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
// ! --------------------------- PUBLIC COMPONENT ---------------------------- !
////////////////////////////////////////////////////////////////////////////////

export default withRouter(BlogUpdate);
