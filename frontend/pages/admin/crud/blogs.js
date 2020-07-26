////////////////////////////////////////////////////////////////////////////////
// !------------------------------LOAD COMPONENT--------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Component to create a new Link element */
import Link from "next/link";

/** Component to create a new Layout element */
import Layout from '../../../components/Layout';

/** Component to create a new Admin element */
import Admin from "../../../components/auth/Admin";

/** Component to create a new Admin element */
import BlogRead from "../../../components/crud/BlogRead.js";

////////////////////////////////////////////////////////////////////////////////
// !------------------------------APPLY COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pd-5">
              <h2>Manage blogs</h2>
            </div>
            <div className="col-md-12">
              <BlogRead />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// !-----------------------------PUBLIC COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

export default Blog;