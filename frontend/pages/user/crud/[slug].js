////////////////////////////////////////////////////////////////////////////////
// !------------------------------LOAD COMPONENT--------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Component to create a new Link element */
import Link from "next/link";

/** Component to create a new Layout element */
import Layout from '../../../components/Layout';

/** Component to create a new Admin element */
import Private from "../../../components/auth/Private";

/** Component to create a new Admin element */
import BlogUpdate from "../../../components/crud/BlogUpdate.js";

////////////////////////////////////////////////////////////////////////////////
// !------------------------------APPLY COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

const Blog = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pd-5">
              <h2>Update blogs</h2>
            </div>
            <div className="col-md-12">
              <BlogUpdate />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

////////////////////////////////////////////////////////////////////////////////
// !-----------------------------PUBLIC COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

export default Blog;