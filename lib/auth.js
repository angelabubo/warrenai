import axios from "axios";
import Router from "next/router";
import { clientlogger } from "./clientlogger";
const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = (user) => {
  //Store the user information from server to the client window object
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getSessionFromServer = (req) => {
  if (req.user) {
    return { user: req.user };
  }
  return {};
};

export const getSessionFromClient = () => {
  //Session info client side is stored in the window object __USER__ property
  if (typeof window !== "undefined") {
    //We are in the browser
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }

  //Somehow we are in the server side
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

//Higher order function
export const authInitialProps = (isProtectedRoute) => ({
  req,
  res,
  query: { userId, tab, ticker },
}) => {
  //Logic to determine how to get the session
  //Is the app loading initially? Or getting request to server? Yes, get session info from server
  //If not, we are just changing routes or going somewhere else in the client side of our app, get session from client
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== "/signin") {
    return redirectUser(res, "/signin");
  }

  //User is authenticated can proceed
  return { auth, userId, tab, ticker };
};

export const checkNotAuth = ({ req, res, query: { userId, tab } }) => {
  //Logic to determine how to get the session
  //Is the app loading initially? Or getting request to server? Yes, get session info from server
  //If not, we are just changing routes or going somewhere else in the client side of our app, get session from client
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const user = auth.user;
  const isAnonymous = user && user.id ? false : true;

  if (isAnonymous) {
    //User is not yet signed in, proceed to signin or signup page
    return { user };
  } else {
    //User is already authenticated, do not display signin or signup page
    //Redirect to dashboard
    return redirectUser(res, "/dashboard");
  }
};

export const signupUser = async (user) => {
  const { data } = await axios.post("/api/auth/signup", user);
  return data;
};

export const signinUser = async (user) => {
  const { data } = await axios.post("/api/auth/signin", user);

  //Store information on the window
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }

  localStorage.clear();

  await axios.get("/api/auth/signout");

  Router.push("/");
};
