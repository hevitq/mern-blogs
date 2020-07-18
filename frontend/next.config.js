/** Bring middleware from node_modules */
const withCSS = require("@zeit/next-css");

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
module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "SEOBLOG",
    API_DEVELOPMENT: "//localhost:8000/api",
    API_PRODUCTION: "//seoblog.com",
    PRODUCTION: false
  }
});