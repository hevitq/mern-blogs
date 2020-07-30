/**
 * Bring/Import Hook api from React
 * Hooks are a new addition in React 16.8.
 * They let you use state and other React features without writing a class.
 * Hooks don’t work inside classes.
 */
import { useState } from "react";

/** Bring middleware from next */
import Link from "next/link";
import Router from "next/router";

/** Bring middleware from node_modules */
import NProgress from "nprogress";

/** Bring the app name from config file */
import { APP_NAME } from "../config";

/** Bring methods from ../actions/auth */
import { signout, isAuth } from "../actions/auth";

/** Bring common component from reactstrap */
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

import Search from "./blog/Search";

/**
 * Bring CSS from node_modules
 * NOTE: Should use CDN instead if import way for performance.
 */
// import "../node_modules/nprogress/nprogress.css";

/**
 * Implement a progress bar on top
 * @param { String } url - url in the address bar
 * @return Callback function
 */
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

/**
 * Functional component, is a “stateless components”
 * props: () in the current time.
 */
const Header = () => {
  /**
   * Declare a new state variable
   * isOpen - @variable start with 'false'.
   * isOpen state will be toggled when click on NavbarToggler
   * setIsOpen - @method to trigger action on NavbarToggler
   */
  const [isOpen, setIsOpen] = useState(false);

  /** Method to toggle isOpen status */
  const toggle = () => setIsOpen(!isOpen);

  /** Use Hooks here */
  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink style={{ cursor: "pointer" }} className="font-weight-bold">
            {APP_NAME}
          </NavLink>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <React.Fragment>
              <NavItem>
                <Link href="/blogs">
                  <NavLink style={{ cursor: "pointer" }}>Blogs</NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/contact">
                  <NavLink style={{ cursor: "pointer" }}>Contact</NavLink>
                </Link>
              </NavItem>
            </React.Fragment>

            {/* Show signin, signup only if user not authenticated */}
            {!isAuth() && (
              <React.Fragment>
                <NavItem>
                  <Link href="/signup">
                    <NavLink style={{ cursor: "pointer" }}>Signup</NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signin">
                    <NavLink style={{ cursor: "pointer" }}>Signin</NavLink>
                  </Link>
                </NavItem>
              </React.Fragment>
            )}

            {/* Show dashboard Link of the authenticated user */}
            {isAuth() && isAuth().role === 0 && (
              <NavItem>
                {/* Navigate to /user (user dashboard) as click on Link */}
                <Link href="/user/">
                  <NavLink>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}

            {/* Show dashboard Link of the authenticated admin user */}
            {isAuth() && isAuth().role === 1 && (
              <NavItem>
                {/* Navigate to /admin (admin dashboard) as click on Link */}
                <Link href="/admin/">
                <NavLink>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                </Link>
              </NavItem>
            )}

            {/* Show signout only if user authenticated */}
            {isAuth() && (
              <NavItem>
                {/* Redirect to /signin as click on signout */}
                <NavLink
                  style={{ cursor: "pointer" }}
                  onClick={() => signout(() => Router.replace("/signin"))}
                >
                  Signout
                </NavLink>
              </NavItem>
            )}

            {/* Show create a blog */}
            <NavItem>
              <Link href="/user/crud/blog">
                <NavLink
                  className="btn btn-primary text-white"
                  style={{ cursor: "pointer" }}
                >
                  Write a blog
                </NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      <Search />
    </React.Fragment>
  );
};

export default Header;
