// Load all variables from .env file to "process.env" when not in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const next = require("next");
const express = require("express");

const session = require("express-session");
const mySqlSessionStore = require("express-mysql-session");
const logger = require("morgan");
const passport = require("passport");
const helmet = require("helmet");
const routes = require("./routes");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler(); //A Next handler for get requests to the server

//Create custom server on top of the Next Server using Node + Express
nextApp.prepare().then(() => {
  //Create Express Server
  const expressApp = express();

  //Sql Database Connection
  const dbConnection = require("./lib/dbConnection");

  if (!dev) {
    //Helmet helps secure our app by setting various HTTP headers
    expressApp.use(helmet());
  }

  //use - express function to let express server specify middlewares to use
  //middlewares are intermediary steps that need to be done, like parsing incoming data to the server to JSON
  expressApp.use(express.json()); //tells express to use json to parse data, much like bodyparser

  //give all Next.js's requests to Next.js server
  expressApp.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  expressApp.get("/static/*", (req, res) => {
    handle(req, res);
  });

  //Session Store setup
  const MySQLStore = mySqlSessionStore(session);
  const sessionStoreOptions = {
    clearExpired: true, //Automatically check and clear expired sessions
    checkExpirationInterval: 1000 * 60 * 30, //How frequently expired sessions will be cleared. (milliseconds) - 30 mins
    expiration: 24 * 60 * 60 * 1000, //How long to store valid sessions. (milliseconds) - 24 hours
  };
  const sessionStore = new MySQLStore(sessionStoreOptions, dbConnection);

  //Session Configuration setup
  const sessionConfig = {
    name: "warren-ai.sid",
    secret: process.env.SESSION_SECRET, // secret used for using signed cookies w/ the session
    resave: false, //forces the session to be saved back to the store
    saveUninitialized: false, // don't save unmodified sessions
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //Cookie will expire after 24 hours
      sameSite: true,
      httpOnly: true,
    },
  };

  if (!dev) {
    sessionConfig.cookie.secure = true; // serve secure cookies in production environment
    expressApp.set("trust proxy", 1); // trust first proxy
  }

  // Apply our session configuration to express-session
  expressApp.use(session(sessionConfig));

  //Passport Related
  const initializePassport = require("./lib/passport-config.js");
  const { getUserByEmail, getUserById } = require("./lib/dbHelper.js");
  initializePassport(passport, getUserByEmail, getUserById);

  expressApp.use(passport.initialize());
  expressApp.use(passport.session());

  expressApp.use((req, res, next) => {
    //Custom middleware to put our user data (from passport) on the req.user so we can access it as such anywhere in our next server app
    res.locals.user = req.user || null;
    next();
  });

  /* morgan for request logging from client
  - we use skip to ignore static files from _next folder */
  expressApp.use(
    logger("dev", {
      skip: (req) => {
        return req.url.includes("_next") || req.url.includes("/styles/");
      },
    })
  );

  // apply middleware to use routes from the "routes" folder first (API calls)
  expressApp.use("/", routes);

  // Error handling from async / await functions
  expressApp.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  /* default route
     - allows Next to handle all other routes
     - includes the numerous `/_next/...` routes which must be exposedfor the next app to work correctly
     - includes 404'ing on unknown routes */
  expressApp.get("*", (req, res) => {
    handle(req, res);
  });

  expressApp.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
  });
});
