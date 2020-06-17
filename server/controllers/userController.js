const dbHelper = require("../lib/dbHelper");
exports.getUsers = () => {};

exports.getAuthUser = (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    console.log("NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  res.json(req.user);
};

//Store the user in req.profile
exports.getUserById = async (req, res, next, id) => {
  await dbHelper.getUserById(id).then((user) => {
    req.profile = user;
    if (req.profile && req.user && req.profile.id === req.user.id) {
      //User is authenticated
      req.isAuthUser = true;
      return next();
    }

    next();
  });
};

exports.getUserProfile = (req, res) => {
  if (!req.profile) {
    return res.status(404).json({ message: "No user found." });
  }

  res.json(req.profile);
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    return res
      .status(400)
      .json({ message: "You are not authorized to perform this action." });
  }

  const deletedUser = await dbHelper.deleteUser(userId);
  res.json(deletedUser);
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
