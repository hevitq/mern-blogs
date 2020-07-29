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
 * Method to render/show a Small Card
 * @param { Object } blog - blog data
 * @return a small card item dom
 */
const SmallCard = ({ blog }) => {
  /** Render a small card item to DOM */
  return (
    /** Define small card item */
    <div className="card">
      {/* Define small card image with a link */}
      <section>
        <Link href={`/blogs/${blog.slug}`}>
          <a>
            <img
              className="img img-fluid"
              style={{ maxHeight: "250px", width: "100%" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </Link>
      </section>

      {/* Define small card title with a link and an excerpt */}
      <div className="card-body">
        <section>
          <Link href={`/blogs/${blog.slug}`}>
            <a>
              <h5 className="card-title">{blog.title}</h5>
            </a>
          </Link>
          <div className="card-text">
            {renderHTML(blog.excerpt)}
          </div>
        </section>
      </div>

      {/* Define information published */}
      <div className="card-body">
        Posted {moment(blog.updatedAt).fromNow()} by{" "}
        <Link href={`/profile/${blog.postedBy.username}`}>
          <a>{blog.postedBy.username}</a>
        </Link>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
// ! -------------------------- PUBLIC COMPONENT ----------------------------- !
////////////////////////////////////////////////////////////////////////////////

export default SmallCard;
