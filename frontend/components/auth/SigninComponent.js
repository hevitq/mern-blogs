/**
 * Bring Hooks API from React
 * Refer: 
 * https://reactjs.org/docs/hooks-reference.html
 * https://vi.reactjs.org/docs/hooks-overview.html
 */
import { useState, useEffect } from "react";

/**
 * Bring methods (actions) from ./actions/auth
 */
import { signin, authenticate, isAuth } from "../../actions/auth";

/** Bring Router from next */
import Router from "next/router";

import Link from "next/link";

import LoginGoogle from "./LoginWithGoogle";

/**
 * Function to create a component (functional component)
 * @return Signin Form
 */
const SigninComponent = () => {
  /**
   * Create states of values object
   * @param { Object} values - manage the value of properties got from the user input in the form
   * @func { Func } setValues - Grab values as the user types and set to new state
   */
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  /** Object Destructing */
  const { email, password, error, loading, message, showForm } = values;

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
   * Function to trigger submit action in form
   * @param { Event } e - Any event in the page
   */
  const handleSubmit = (e) => {
    /** Prevent the page reload when submitting  */
    e.preventDefault();

    /**
     * Set the state values before submitting
     * @arg { Boolean } loading - show/hide loading status
     * - true: when start submitting, showed status waiting response from the server.
     * - false: when get the response, hided status when receiving
     * @arg { Boolean } error - false (when start submitting)
     *                             - data.error 
     */
    setValues({ ...values, loading: true, error: false });

    /** User information to authenticate the user */
    const user = { email, password };

    /** 
     * Function to send user information to the server side,
     * and then get data response json from the server side
     * @param { Object } user - user information passed to request to the server
     * @param { Any } data - data taken from response of the server
     */
    signin(user).then((data) => {
      /**
       * Handle check data no exist (undefined) as can't connect to the server
       * Handle when data has error
       */
      if (data && data.error) {
        setValues({ ...values, error: data.error, loading: false });
      }
      /** Handle when data exist and, has no error */
      else {
        /**
         * To save authenticated user information taken from the server in the
         * browser (by cookie, local storage), and then redirect to the Home
         * @arg { Any } data - data response
         * @arg { Func } () - callback function
         */
        authenticate(data, () => {
          /** To navigate to Homepage (Index) after signin successfully */
          if(isAuth() && isAuth().role === 1){
            Router.push("/admin");
          }
          Router.push("/user");
        });
      }
    });
    /** To submit taken information to the backend to authenticate the user */
  };

  /**
   * Function to trigger any change in input form field
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

  /** Function to show alert such as error, information, message */
  const showLoading = () =>
    (loading ? <div className="alert alert-info">Loading...</div> : "");
  const showError = () =>
    (error ? <div className="alert alert-danger">{error}</div> : "");
  const showMessage = () =>
    (message ? <div className="alert alert-info">{message}</div> : "");

  /**
   * Function to create the signin form
   * @func { Func } handleSubmit - trigger onSubmit action
   * @func { Func } handleChange - trigger onChange action
   */
  const signinForm = () => {
    /** To show/render signin form */
    return (
      <form onSubmit={handleSubmit}>
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
          <button className="btn btn-primary">Sign in</button>
        </div>
      </form>
    );
  };

  /** To return multiple elements to render/show to the layout */
  return (
    /**
     * To render elements inside React.Fragment
     * A common pattern in React is for a component to return multiple elements.
     * Refer: https://reactjs.org/docs/fragments.html
     */
    <React.Fragment>
      {/* To show alert elements */}
      {showLoading()}
      {showError()}
      {showMessage()}
      {/* NOTE: implemented but not use now */}
      {/* <LoginGoogle /> */}

      {/* To hide the signin form when existing user data response */}
      {showForm && signinForm()}

      <br/>
      <Link href="/auth/password/forgot">
        <a className="btn btn-outline-danger btn-sm">Forgot password</a>
      </Link>
    </React.Fragment>
  );
};

/**
 * To public the component as an object/module type
 */
export default SigninComponent;
