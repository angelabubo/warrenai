const dbHelper = require("../lib/dbHelper");
const dummyData = require("../data/premium");

exports.userHasPremiumAccess = async (userId) => {
  //Check if user has subscription with status "active"
  const userWithActiveSub = await dbHelper.getActiveSubscriptionByUserId(
    userId
  );
  if (userWithActiveSub) {
    return true;
  } else {
    //ANGEL TODO
  }
};

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
  await dbHelper.getActiveSubscriptionByUserId(userId).then((user) => {
    if (
      user &&
      user.subscription.product_price_id &&
      user.subscription.status === "active"
    ) {
      //User has active subscription, return list of warren ai top companies
      //TODO - using dummy data for now
      res.json(dummyData.topCompanies);
    } else {
      //Handle canceled subscription that has not reached the current period end
      res.json(null);
    }
  });
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
