import Head from "next/head";

import Link from "next/link";

import {withRouter} from "next/router";

import Layout from "../../components/Layout";

import { useState } from "react";

import { listBlogsWithCategoriesAndTags } from "../../actions/blog";

import Card from "../../components/blog/Card";

import { API, DOMAIN, APP_NAME, FB_APP_ID } from "../../config";

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogSkip, router }) => {
  const head = () => {
    return (
      <Head>
        <title>Just Developer Blogs | {APP_NAME}</title>
        <meta
          name="description"
          content="Programming blogs and tutorials on react node next vue php and web development"
        />
        <link ref="canonical" href={`${DOMAIN}${router.pathname}`} />
        <meta
          property="og:title"
          content={`Latest web development tutorials | ${APP_NAME}`}
        />
        <meta
          property="og:description"
          content="Programming blogs and tutorials on react node next vue php and web development"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
        <meta property="og:site_name" content={`${APP_NAME}`} />

        <meta property="og:image" content={`${DOMAIN}/static/images/vnpace.jpg` }/>
        <meta
          property="og:image:secure_url"
          content={`${DOMAIN}/static/images/vnpace.jpg`}
        />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="fb:app_id" content={`${FB_APP_ID}`} />
      </Head>
    );
  };

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
      if(data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      };
    });
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load more
        </button>
      )
    );
  };

  /**
   * Method to render/show all posts
   * @return blogs DOM
   */
  const showAllBlogs = () => {
    /** Return a callback function */
    return blogs.map((blog, index) => {
      /** Return article DOM */
      return (
        <article key={index}>
          <Card blog={blog} />
          <hr/>
        </article>
      );
    });
  };

  /**
   * Method to render/show all categories
   * @return categories DOM
   */
  const showAllCategories = () => {
    /** Return a callback function */
    return categories.map((category, index) => {
      /** Return category DOM */
      return (
        <Link href={`/categories/${category.slug}`} key={index}>
          <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
        </Link>
      );
    });
  };

  /**
   * Method to render/show all tags
   * @return tags DOM
   */
  const showAllTags = () => {
    /** Return a tag function */
    return tags.map((tag, index) => {
      /** Return article DOM */
      return (
        <Link href={`/tags/${tag.slug}`} key={index}>
          <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
        </Link>
      );
    });
  };

  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog}/>
        </article>
      );
    });
  };

  /** Define DOM will be render */
  return (
    <React.Fragment>
      {/* Render head */}
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <div className="col-md-12 pt-3"></div>
            <header>
              <h1 className="display-4 font-weight-bold text-center">
                Just Developer Blogs
              </h1>
              <section>
                {/* Render all categories and tags */}
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

/**
 * A static method request to get initial props to the server render a page
 * @return data
 * NOTE: getInitialProps can be used only on pages, not in components
 */
Blogs.getInitialProps = () => {
  let skip = 0;
  let limit = 2;

  /** Invoke method to create a new blog */
  return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
    if(data.error) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogSkip: skip,
      };
    };
  });
};

export default withRouter(Blogs);