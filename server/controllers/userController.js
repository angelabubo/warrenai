const dbHelper = require("../lib/dbHelper");
exports.getUsers = () => {};

//Store the user in req.profile
exports.getUserById = async (req, res, next, id) => {
  await dbHelper.getUserById(id).then((user) => {
    req.profile = user;
    if (req.profile && req.user && req.profile.id === req.user.id) {
      //User retrieved from database matches the user being requested
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

exports.getAuthUser = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }
  //Get user info including subscription details
  const { userId } = req.params;
  await dbHelper.getSubscriptionByUserId(userId).then((user) => {
    res.json(user);
  });
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
