const dbHelper = require("../lib/dbHelper");
const dummyData = require("../data/premium");

// Provisioning service
// - get active subscription. If yes, provision service
// - if none active, get from canceled subscriptions table
// 	- if yes canceled, check current period end
// 		- if period end is due, delete entry in canceled subscriptions table. do not provision service
// 		- if period end is not yet due, provision service.
// 	- if none canceled, do not provision service
exports.userHasPremiumAccess = async (userId) => {
  //Check if user has subscription with status "active"
  const userWithActiveSub = await dbHelper.getSubscriptionByUserId(userId);
  if (userWithActiveSub) {
    return true;
  } else {
    //Check in canceled_subscriptions table for valid subscription
    const {
      userWithCanceledSub,
    } = await dbHelper.getSubscriptionByUserIdFromCanceledSubscriptionsTable(
      userId
    );

    if (userWithCanceledSub) {
      //Check if the period end is not yet due
      const nowInTicks = Date.now() * 1000;
      if (userWithCanceledSub.subscription.current_period_end >= nowInTicks) {
        return true;
      } else {
        //Delete entry in canceled table
        return false;
      }
    } else {
      return false;
    }
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
      //Handle canceled subscription that has not reached the current period end
      res.json(null);
    }
  });
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
