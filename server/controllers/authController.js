const { check, validationResult } = require("express-validator");
const dbHelper = require("../lib/dbHelper");
const passport = require("passport");

//middleware function to validate signup fields
exports.validateSignup = [
  [
    //Name should not be null and between 4-50 characters
    check("name", "Enter a name.").notEmpty(),
    check("name", "Name must be between 3 and 50 characters.").isLength({
      min: 3,
      max: 50,
    }),
    //Email should be valid, normalize and not null
    check("email", "Enter a valid email.").isEmail().normalizeEmail(),
    //Password should not be null and between 8 to 20 characters
    check("password", "Enter a password.").notEmpty(),
    check("password", "Password must be between 8 and 20 characters.").isLength(
      {
        min: 1, //TODO
        max: 20,
      }
    ),
  ],
  (req, res, next) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return res.status(400).send(firstError);
    }

    next();
  },
];

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  //Persist user in our database
  await dbHelper.registerUser(name, email, password, (err, user) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.json(name);
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err.message);
    }

    if (!user) {
      //No user authenticated
      return res.status(400).json(info.message);
    }

    //If there is a user in the database
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json(err.message);
      }
      //Return User Information
      const loggedInUser = {
        id: user.id,
        name: user.fname,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
      };
      res.json(loggedInUser);
    });
  })(req, res, next);
};

exports.signout = (req, res) => {
  //Clear the session cookie
  res.clearCookie("warren-ai.sid");

  //Destroy the session
  req.logout();
  res.json({ message: "You are now signed out" });

  // Upon logout, we can destroy the session and unset req.session.
  // req.session.destroy((err) => {
  //   // We can also clear out the cookie here. But even if we don't, the
  //   // session is already destroyed at this point, so either way, the
  //   // user won't be able to authenticate with that same cookie again.
  //   res.clearCookie("warren-ai.sid");
  // });
};

//Middleware function that checks whether a user is currently signed in
exports.checkAuth = (req, res, next) => {
  //Passport puts isAuthenticated object in the request by default
  if (req.isAuthenticated()) {
    //Currently logged in, proceed with next step in the request
    return next();
  }

  //User is not authenticated, redirect to signin page
  res.redirect("/signin");
};
