const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

function initialize(passport, getUserByEmail, getUserById) {
  //function to authenticate a user or make sure email and password is correct
  const authenticateUser = async (email, password, done) => {
    await getUserByEmail(email).then((user) => {
      if (user == null) {
        //server error, found user?, message
        return done(null, false, { message: "User does not exist." });
      }

      if (bcrypt.compareSync(password, user.password)) {
        const authenticatedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        return done(null, authenticatedUser);
      } else {
        return done(null, false, { message: "Password incorrect." });
      }
    });
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;
