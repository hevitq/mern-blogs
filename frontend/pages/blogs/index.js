import Head from "next/head";

import Link from "next/link";

import Layout from "../../components/Layout";

import { useState } from "react";

import { listBlogsWithCategoriesAndTags } from "../../actions/blog";

import Card from "../../components/blog/Card";

const Blogs = ({ blogs, categories, tags, size }) => {
  const showAllBlogs = () => {
    return blogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog} />
          <hr/>
        </article>
      );
    });
  };

  return (
    <Layout>
      <main>
        <div className="container-fluid">
          <header>
            <div className="col-md-12 pt-3">
              <h1 className="display-4 font-weight-bold text-center">
                Programing blogs and tutorials
              </h1>
              <section>
                <p>show categories and tags</p>
              </section>
            </div>
          </header>
          <div className="container-f">
            <div className="row">
              <div className="col-md-12">{ showAllBlogs() }</div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

/**
 * A static method request to get initial props to the server render a page
 * @return data
 * NOTE: getInitialProps can be used only on pages, not in components
 */
Blogs.getInitialProps = () => {
  /** Invoke method to create a new blog */
  return listBlogsWithCategoriesAndTags().then(data => {
    if (!data) {
      return {
        blogs: "Error",
        categories: "Error",
        tags: "Error",
        size: "Error",
      };
    }
    if(data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        size: data.size,
      };
    };
  });
};

export default Blogs;