////////////////////////////////////////////////////////////////////////////////
// ! ----------------------- ABOUT CARD COMPONENT ---------------------------- !
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// ! --------------------- LOAD MIDDLEWARE/COMPONENT ------------------------- !
////////////////////////////////////////////////////////////////////////////////

/** Component allows enable client side transitions between routes */
import Link from "next/link";

/** Middleware allows render HTML as React element */
import renderHTML from "react-render-html";

/** Date library for parsing, validating, manipulating, and formatting dates. */
import moment from "moment";

/** Middleware allows control runtime environment */
import { API } from "../../config";

/**
 * Method to render/show a Card
 * @param { Object } blog - blog data
 * @return a card item dom
 */
const Card = ({ blog }) => {

  /**
   * Method to render/show categories list
   * @param { Object } blog - blog data
   * @return categories list dom
   */
  const showBlogCategories = blog =>
    /**
     * Creates a new categories array with a link
     * @param { Object } category - Category data
     * @param { Index } number - Index of category
     */
    blog.categories.map((category, index) => (
      <Link key={index} href={`/categories/${category.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{category.name}</a>
      </Link>
    ));

  /**
   * Method to render/show tags list
   * @param { Object } blog - blog data
   * @return tags list dom
   */
  const showBlogTags = blog => {
    /**
     * Creates a new tags array with a link
     * @param { Object } tag - Tag data
     * @param { Index } number - Index of tag
     */
    return blog.tags.map((tag, index) => (
      <Link key={index} href={`/tags/${tag.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));
  };

  /** Render a card item to DOM */
  return (
    /** Define card item */
    <div className="lead pb-4">
      {/* Define card title */}
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
          </a>
        </Link>
      </header>

      {/* Define information published */}
      <section>
        <p className="mark ml-1 pt-2 pb-2">
          Written by{" "}
          <Link href={`/profile/${blog.postedBy.username}`}>
            <a>{blog.postedBy.username}</a>
          </Link>{" "}
          | Published {moment(blog.updatedAt).fromNow()}
        </p>
      </section>

      {/* Define categories and tags list */}
      <section>
        {showBlogCategories(blog)}
        {showBlogTags(blog)}
        <br />
        <br />
      </section>

      {/* Define card content */}
      <div className="row">
        {/* Define card image */}
        <div className="col-md-4">
          <section>
            <img
              className="img img-fluid"
              style={{ maxHeight: "auto", with: "100%" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </section>
        </div>

        {/* Define card excerpt with a button */}
        <div className="col-md-8">
          <section>
            <div className="pb-3">{renderHTML(blog.excerpt)}</div>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="btn btn-primary pt-2">Read more</a>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ! -------------------------- PUBLIC COMPONENT ----------------------------- !
////////////////////////////////////////////////////////////////////////////////

export default Card;
