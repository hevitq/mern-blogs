/** 
 * Bring getConfig method from next
 * to get environment variables from next.config.js
 */
import getConfig from "next/config";

/** Method to access the configuration variables */
const { publicRuntimeConfig } = getConfig();

/**
 * Control access via the api will be run base on the production flag
 * with the ternary operator.
 */
// export const API = publicRuntimeConfig.PRODUCTION ? "https://seoblog.com" : "http://localhost:8000";
export const API = publicRuntimeConfig.PRODUCTION
    ? publicRuntimeConfig.API_PRODUCTION
    : publicRuntimeConfig.API_DEVELOPMENT;

/** Grab the app name */
export const APP_NAME = publicRuntimeConfig.APP_NAME;