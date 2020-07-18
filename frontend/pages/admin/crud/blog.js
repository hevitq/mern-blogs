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
import BlogCreate from "../../../components/crud/BlogCreate.js";

////////////////////////////////////////////////////////////////////////////////
// !------------------------------APPLY COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

const Blog = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pd-5">
              <h2>Create a new blog</h2>
            </div>
            <div className="col-md-12">
              <BlogCreate />
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