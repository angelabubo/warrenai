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
export const authInitialProps = (
  isProtectedRoute,
  customInitialProps = null
) => ({ req, res, query: { userId } }) => {
  //Logic to determine how to get the session
  //Is the app loading initially? Or getting request to server? Yes, get session info from server
  //If not, we are just changing routes or going somewhere else in the client side of our app, get session from client
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== "/") {
    return redirectUser(res, "/");
  }

  //User is authenticated can proceed with other initial props acquisition
  const customProps = customInitialProps ? customInitialProps(user) : {};
  return { auth, userId, ...customProps };
};

export const signupUser = async (user) => {
  try {
    const { data } = await axios.post("/api/auth/signup", user);
    return data;
  } catch (error) {
    clientlogger("err", error);
  }
};

export const signinUser = async (user) => {
  try {
    const { data } = await axios.post("/api/auth/signin", user);

    //Store information on the window
    if (typeof window !== "undefined") {
      window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
    }
  } catch (error) {
    clientlogger("err", error);
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }

  localStorage.clear();

  try {
    await axios.get("/api/auth/signout");
  } catch (error) {
    clientlogger("err", error);
  }

  Router.push("/");
};
