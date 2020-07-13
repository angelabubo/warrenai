const dbHelper = require("../lib/dbHelper");
const dummyData = require("../data/premium");

exports.getWarrenAiTopCompanies = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Check whether user has active subscription first
  const { userId } = req.params;
  const hasAccess = await dbHelper.userHasPremiumAccess(userId);

  if (hasAccess) {
    //ANGEL TODO - using dummy data for now
    res.json(dummyData.topCompanies);
  } else {
    res.json(null);
  }
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
