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
export const API = publicRuntimeConfig.PRODUCTION
    ? publicRuntimeConfig.API_PRODUCTION
    : publicRuntimeConfig.API_DEVELOPMENT;

/** Grab the app name */
export const APP_NAME = publicRuntimeConfig.APP_NAME;

/**
 * Config access to the server
 */
export const DOMAIN = publicRuntimeConfig.PRODUCTION
? publicRuntimeConfig.DOMAIN_PRODUCTION
: publicRuntimeConfig.DOMAIN_DEVELOPMENT;

/** Config FB APP */
export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;

/** Config to connect with Google */
export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;