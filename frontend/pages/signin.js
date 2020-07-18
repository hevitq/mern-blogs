/** Bring Layout from ../components folder */
import Layout from '../components/Layout';

/** Bring SigninComponent from ../components/auth */
import SigninComponent from '../components/auth/SigninComponent';

const Signin = () => {
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Signin with</h2>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};

export default Signin;