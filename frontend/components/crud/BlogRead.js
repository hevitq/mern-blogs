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
import { Router } from "next/router";

/** Middleware allows authenticate the user */
import { getCookie, isAuth } from "../../actions/auth";

/** Middleware allows send data to create a new blog */
import { list, removeBlog } from "../../actions/blog";

import moment from "moment";

////////////////////////////////////////////////////////////////////////////////
// ! --------------------- APPLY MIDDLEWARE/COMPONENT ------------------------ !
////////////////////////////////////////////////////////////////////////////////

const BlogRead = ({username}) => {
  const [blogs, setBlogs] = useState([]);

  const [message, setMessage] = useState("");
  
  const token = getCookie("token");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = () => {
    list(username).then(data => {
      if(data.error) {
        console.log(data.error)
      } else {
        setBlogs(data);
      }
    });
  };

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then(data => {
      if(!data || data.error) {
        console.log(data && data.error);
      } else {
        setMessage(data && data.message);
        loadBlogs()
      };
    });
  };

  const deleteConfirm = (slug) => {
    let answer = window.confirm("Are you sure you want to delete your blog?")
    if(answer) {
      deleteBlog(slug)
    };
  };

  const showUpdateButton = (blog) => {
    if(isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">Update</a>
        </Link>  
      );
    } else if(isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">Update</a>
        </Link>  
      );
    };
  };

  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return (
        <div key={index} className="pb-5">
          <h3>{blog.title}</h3>
          <p className="mark">
            Written by {blog.postedBy.name} | Published on{" "}
            {moment(blog.updatedAt).fromNow()}
          </p>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteConfirm(blog.slug)}
          >
            Delete
          </button>
          {showUpdateButton(blog)}
        </div>
      );
    })
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-12">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </React.Fragment>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ! --------------------------- PUBLIC COMPONENT ---------------------------- !
////////////////////////////////////////////////////////////////////////////////

export default BlogRead;
