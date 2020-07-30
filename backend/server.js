////////////////////////////////////////////////////////////////////////////////
// !--------------------------LOAD MIDDLEWARE-----------------------------------
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// LOAD MODULE FROM NODEJS AS MIDDLEWARE
// ? Middleware functions are functions that access to (req, res, next) in the
// ? application’s request-response cycle.
// ? res: the response object
// ? req: the request object
// ? next: the next middleware function in the
////////////////////////////////////////////////////////////////////////////////

/** Middleware web framework to invoke a serial of middleware. */
const express = require("express");

/** Middleware to control HTTP request logger */
const morgan = require("morgan");

/** Middleware to parse incoming request bodies */
const bodyParser = require("body-parser");

/** Middleware to parse incoming request cookie header */
const cookieParser = require("cookie-parser");

/** Middleware to allow(enable) CORS */
const cors = require("cors");

/** Object Data Modeling (ODM) library for MongoDB and Node.js */
const mongoose = require("mongoose");

/** Middleware to loads environment variables into process.env */
require("dotenv").config();

////////////////////////////////////////////////////////////////////////////////
// LOAD MIDDLEWARE FROM ROUTES
// ? Server will monitor any request to these routes
////////////////////////////////////////////////////////////////////////////////
/** Endpoints related to the blog */
const blogRoutes = require("./routes/blog");

/** Endpoints related to the authentication */
const authRoutes = require("./routes/auth");

/** Endpoints related to the user */
const userRoutes = require("./routes/user");

/** Endpoints related to the category */
const categoryRoutes = require("./routes/category");

/** Endpoints related to the tag */
const tagRoutes = require("./routes/tag");

/** Endpoints related to contact form */
const formRoutes = require("./routes/form");


////////////////////////////////////////////////////////////////////////////////
// !--------------------------CONNECT EXPRESS-----------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Invoke the express application
 */
const app = express();

////////////////////////////////////////////////////////////////////////////////
// !--------------------------CONNECT MONGODB--------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * Method connect to Mongo database
 * @param { String } DATABASE_CLOUD - MongoDB cloud
 * @param { String } DATABASE_LOCAL - MongDB local
 * @param { Object } Optional https://mongoosejs.com/docs/deprecations.html
 */
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

////////////////////////////////////////////////////////////////////////////////
// !--------------------------APPLY MIDDLEWARE--------------------------------
////////////////////////////////////////////////////////////////////////////////
/** Apply morgan middleware to show log in application */
app.use(morgan("dev"));

/** Apply body-parser to parser request body from the client */
app.use(bodyParser.json());

/** Apply cookie-parser to parser request cookie hear from the client */
app.use(cookieParser());

/**
 * Apply CORS-enabled for all origins (routes) only when development
 */
if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// /** NOTE: Apply cors for a certain router, for test cors*/
// const corsOptions = {
//   origin: 'http://localhost:8000',
// }

/**
 * Apply router to handle requests to the path in the server side
 * @param { String } path - the route path
 * @param { Router } router - Router handle for requests the route path
 * ? Server will monitor any request to these routes
 */
app.use("/api", /** cors(corsOptions), */ blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formRoutes);

////////////////////////////////////////////////////////////////////////////////
// !--------------------------MONITOR APPLICATION-------------------------------
////////////////////////////////////////////////////////////////////////////////

/**
 * PORT to run the nodejs server, default 8000 in locally
 */
const port = process.env.PORT || 8000;

/**
 * Method to monitor/listen requests coming to port in the nodejs server
 * @param { String } port - port receive request from the client side
 * @param { Func } func - callback function
 */
app.listen(port, (err) => {
  /** Grab any error related to connection */
  if (err) return console.log(err);

  /** Grab log to trace change in the console */ 
  console.log(`Server is running on port ${port}`);
});
