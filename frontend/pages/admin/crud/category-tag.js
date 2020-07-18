////////////////////////////////////////////////////////////////////////////////
// !------------------------------LOAD COMPONENT--------------------------------
////////////////////////////////////////////////////////////////////////////////

/** Component to create a new Link element */
import Link from "next/link";

/** Component to create a new Layout element */
import Layout from '../../../components/Layout';

/** Component to create a new Admin element */
import Admin from "../../../components/auth/Admin";

/** Component to create a new Category element */
import Category from "../../../components/crud/Category";

/** Component to create a new Tag element */
import Tag from "../../../components/crud/Tag";

////////////////////////////////////////////////////////////////////////////////
// !------------------------------APPLY COMPONENT-------------------------------
////////////////////////////////////////////////////////////////////////////////

const CategoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pd-5">
              <h2>Manage Categories and Tags</h2>
            </div>
            <div className="col-md-6">
              <Category />
            </div>
            <div className="col-md-6">
              <Tag />
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

export default CategoryTag;