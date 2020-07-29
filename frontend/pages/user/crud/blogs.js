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
import BlogRead from "../../../components/crud/BlogRead";

/**  */
import { isAuth } from "../../../actions/auth";

////////////////////////////////////////////////////////////////////////////////
// !------------------------------APPLY COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

const Blog = () => {
  const username = isAuth() && isAuth().username;

  return (
    <Layout>
      <Private>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pd-5">
              <h2>Manage blogs</h2>
            </div>
            <div className="col-md-12">
              <BlogRead username={username} />
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