/**
 * Bring Hooks API from React
 * Refer: 
 * https://reactjs.org/docs/hooks-reference.html
 * https://vi.reactjs.org/docs/hooks-overview.html
 */
import { useState, useEffect } from "react";

/** Bring methods from ./actions/auth */
import { signup, isAuth, preSignup } from "../../actions/auth";

/** Bring Router from next */
import Router from "next/router";

import Link from "next/link";

/**
 * Function to create a component (functional component)
 * @returns Signup Form
 */
const SignupComponent = () => {
  /**
   * Create states of values object
   * @param { Object} values - manage the value of properties got from the user input in the form
   * @method { Function } setValues - Grab values as the user types and set to new state
   */
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  /** Object Destructing */
  const { name, email, password, error, loading, message, showForm } = values;

  /**
   * Method to tracking any change state in the component will be update
   * @arg { Function } effect - effect callback function when receive deps
   * @arg { Array } deps - values that effect will subscribe. ex: [message]
   * NOTE: useEffect ~~ componentDidMount, componentDidUpdate and componentWillUnMount
   */
  useEffect(() => {
    /**
     * If user logged in, any time change state always
     * redirect to the Home page automatically
     * NOTE: if we can get the authenticated user from the local storage that means user already logged in.
     */
    isAuth() && Router.push("/");
  }, []);

  /**
   * Method to trigger submit action in form
   * @param { Event } e - Any event in the page
   */
  const handleSubmit = (e) => {
    /** Prevent the page reload when submitting  */
    e.preventDefault();

    /**
     * Set the state values before submitting
     * @argument { Boolean } loading - show/hide loading status
     * - true: when start submitting, showed status waiting response from the server.
     * - false: when get the response, hided status when receiving
     * @argument { Boolean } error - false (when start submitting)
     *                             - data.error 
     */
    // console.table({ name, email, password, error, loading, message, showForm });
    setValues({ ...values, loading: true, error: false });

    /** User information to create a new user */
    const user = { name, email, password };

    /** 
     * Method to send user information to the server side,
     * and then get data response json from the server side
     * @param { Object } user - user information passed
     */
    preSignup(user).then((data) => {
      /** Check data.error undefined as can't connect to the server */
      if (data && data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          error: "",
          password: "",
          loading: false,
          /**
           * Check data.error undefined as can't connect to the server.
           * Send message to the client to know
           */
          message: data && data.message || "There is a problem as connecting to the server. Please contact to the Admin",
          /** Disable the form from submitting and loading files*/
          showForm: false,
        });
      }
    });
    /** Submit taken information to the backend to create a new user */
  };

  /**
   * Method to trigger any change in input form field
   * @param { Event } e - Any event in the page
   * NOTE: function of returning another function
   */
  const handleChange = (name) => (e) => {
    /**
     * Keep the rest of the values by using the spread operator
     * Hide any error when typing
     * Grab values as the user types and update value in the state
     * Grab values from the state and set to input elements value
     */
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  /** Method to show alert such as error, information, message */
  const showLoading = () =>
    (loading ? <div className="alert alert-info">Loading...</div> : "");
  const showError = () =>
    (error ? <div className="alert alert-danger">{error}</div> : "");
  const showMessage = () =>
    (message ? <div className="alert alert-info">{message}</div> : "");

  /**
   * Create the signup form function
   * @method { Function } handleSubmit - trigger onSubmit action
   * @method { Function } handleChange - trigger onChange action
   */
  const signupForm = () => {
    /** Show/Render signup form */
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            onChange={handleChange("name")}
            value={name}
            type="text"
            className="form-control"
            placeholder="Name*"
          />
        </div>

        <div className="form-group">
          <input
            onChange={handleChange("email")}
            value={email}
            type="email"
            className="form-control"
            placeholder="Email*"
          />
        </div>

        <div className="form-group">
          <input
            onChange={handleChange("password")}
            value={password}
            type="password"
            className="form-control"
            placeholder="Password*"
          />
        </div>

        <div>
          <button className="btn btn-primary">Sign up</button>
        </div>
      </form>
    );
  };

  /** Return multiple elements to render/show to the layout */
  return (
    /** Invoke the function signup form */
    <React.Fragment>
      {/* Show alert elements */}
      {showLoading()}
      {showError()}
      {showMessage()}

      {/* Hide the signup form when existing user data response */}
      {showForm && signupForm()}
      <br/>
      <Link href="/auth/password/forgot">
        <a className="btn btn-outline-danger btn-sm">Forgot password</a>
      </Link>
    </React.Fragment>
  );
};

/**
 * Make a public the component
 */
export default SignupComponent;
