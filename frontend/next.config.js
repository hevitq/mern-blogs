/** Bring middleware from node_modules */
// const withCSS = require("@zeit/next-css");

/**
 * Export some environment variables
 * @APP_NAME - the app name
 * @API_DEVELOPMENT - the api will run in the development environment
 *                  - can switch to API_PRODUCTION when live time.
 * PRODUCTION - Flag to know locally or production
 *            - false: when developing locally
 *            - true: when deploying to production
 * Should remove http:, https: in API to automatically grab it
 */
// module.exports = withCSS({
//   publicRuntimeConfig: {
//     APP_NAME: "vnPace",
//     API_DEVELOPMENT: "http://localhost:8000/api",
//     API_PRODUCTION: "https://vnpace.dev/api",
//     PRODUCTION: false,
//     DOMAIN_DEVELOPMENT: "http://localhost:3000",
//     DOMAIN_PRODUCTION: "https://vnpace.dev",
//     FB_APP_ID: "745690912856073",
//   }
// });

module.exports = {
  experimental: {
    css: true
  },
  publicRuntimeConfig: {
    APP_NAME: "VNPACE",
    API_DEVELOPMENT: "http://localhost:8000/api",
    API_PRODUCTION: "https://vnpace.dev/api",
    PRODUCTION: false,
    DOMAIN_DEVELOPMENT: "http://localhost:3000",
    DOMAIN_PRODUCTION: "https://vnpace.dev",
    FB_APP_ID: "745690912856073",
    GOOGLE_CLIENT_ID: "1025735520817-oo066d4p4sr1jv7hs57oj8116rc7u2ho.apps.googleusercontent.com",
  }
};