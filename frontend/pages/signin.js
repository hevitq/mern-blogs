/** Bring Layout from ../components folder */
import Layout from '../components/Layout';

import { withRouter } from "next/router";

/** Bring SigninComponent from ../components/auth */
import SigninComponent from '../components/auth/SigninComponent';

const Signin = ({router}) => {
  const showRedirectMessage = () => {
          if (router.query.message) {
            return (
              <div className="alert alert-danger">
                {router.query.message}
              </div>
            );
          } else {
            return;
          }
        };
  return (
    <Layout>
      <div className="container-fluid">
        <h2 className="text-center pt-4 pb-4">Sign in with</h2>

        <div className="row">
          <div className="col-md-6 offset-md-3">
            {showRedirectMessage()}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 offset-md-3">
            <SigninComponent />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Signin);