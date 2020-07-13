const dbHelper = require("../lib/dbHelper");
const stripeHelper = require("../lib/stripeHelper");
const dummyData = require("../data/premium");

exports.userHasPremiumAccess = async (userId) => {
  //Check if user has subscription with status "active"
  const userWithActiveSub = await dbHelper.getActiveSubscriptionByUserId(
    userId
  );
  if (userWithActiveSub) {
    if (userWithActiveSub.subscription.cancel_at_period_end === 1) {
      //User recently canceled the subscription. Check if past due the period end
      const nowInTicks = Math.floor(Date.now() / 1000);
      if (userWithActiveSub.subscription.cancel_at >= nowInTicks) {
        //With active, recently canceled subscription that has not reached the period end yet
        return true;
      } else {
        //Unlikely case. But just in case, retrieve from stripe the latest status of subscription
        const subscription = await stripeHelper.retrieveSubscription(
          userWithActiveSub.subscription.id
        );

        if (subscription) {
          if (subscription.status === "canceled") {
            //Must have not received the webhook properly. Manually delete the entry in database
            await dbHelper.deleteTableRowById(
              "subscriptions",
              userWithActiveSub.subscription.id
            );
            return false;
          } else if (subscription.status === "active") {
            await dbHelper.updateSubscription(subscription);
            return true;
          } else {
            await dbHelper.updateSubscription(subscription);
            return false;
          }
        } else {
          //No record of the subscription in stripe.
          //Delete entry in database
          await dbHelper.deleteTableRowById(
            "subscriptions",
            userWithActiveSub.subscription.id
          );
          return false;
        }
      }
    } else {
      //With active subscription and NOT recently canceled
      return true;
    }
  } else {
    //No active subscription
    return false;
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
  const hasAccess = await exports.userHasPremiumAccess(userId);

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
