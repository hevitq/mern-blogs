/**
 * Bring Hooks API from React
 * Refer: 
 * https://reactjs.org/docs/hooks-reference.html
 * https://vi.reactjs.org/docs/hooks-overview.html
 */
import { useEffect } from "react";

/** Bring Router from next */
import Router from "next/router";

/**
 * Bring methods (actions) from ./actions/auth
 */
import { isAuth } from "../../actions/auth";

/**
 * Function to create a component (functional component)
 * @param { * } children - components or content within a component
 * @return Private Component
 */
const Private = ({ children }) => {
  /**
   * Method to tracking any change state in the component will be update
   * @arg { Function } effect - effect callback function when receive deps
   * @arg { Array } deps - values that effect will subscribe. ex: [message]
   * NOTE: useEffect ~~ componentDidMount, componentDidUpdate and componentWillUnMount
   */
  useEffect(() => {
    /**
     * If user not logged in, any time change state always
     * redirect to the Signin page automatically
     * NOTE: if we can get the authenticated user from the local storage that means user already logged in.
     */
    if(!isAuth()) {
      Router.push(`/signin`);
    };
  }, []);

  /**
   * To render elements inside React.Fragment
   * A common pattern in React is for a component to return multiple elements.
   * Refer: https://reactjs.org/docs/fragments.html
   */
  return <React.Fragment>{children}</React.Fragment>
};

/**
 * To public the component as an object/module type
 */
export default Private;