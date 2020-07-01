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
  await dbHelper.getSubscriptionByUserId(userId).then((user) => {
    if (
      user &&
      user.subscription.product_price_id &&
      user.subscription.status === "active"
    ) {
      //User has active subscription, return list of warren ai top companies
      //TODO - using dummy data for now
      res.json(dummyData.topCompanies);
    } else {
      res.json(null);
    }
  });
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
