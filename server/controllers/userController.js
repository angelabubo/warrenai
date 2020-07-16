const dbHelper = require("../lib/dbHelper");
const productHelper = require("../data/products");

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

  //Get user info
  const { userId } = req.params;
  await dbHelper.getUserById(userId).then((user) => {
    if (req.user && user.id === req.user.id) {
      //User retrieved from database matches the user being requested
      res.json(user);
    } else {
      res.status(403).json({
        message: "You have no access to the requested resource.",
      });
      return res.redirect("/signin");
    }
  });
};

exports.updateAuthUser = async (req, res) => {
  //TODO apply express-validator for updating user names
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Get user info
  const { userId } = req.params;
  const { fName, lName } = req.body;

  await dbHelper
    .updateTableRowById("users", userId, { fname: fName, lname: lName })
    .then((result) => {
      if (result) {
        res.sendStatus(200);
      } else {
        return res
          .status(400)
          .send(
            "There was an error processing your request. Please contact WarreAi."
          );
      }
    });
};

exports.getUserPlan = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Get user subscription info from database
  const { userId } = req.params;
  const hasPremiumAccess = await dbHelper.userHasPremiumAccess(userId);
  if (hasPremiumAccess) {
    //Get the subscription from database
    await dbHelper.getActiveSubscriptionByUserId(userId).then((user) => {
      if (user) {
        //User has active subscription
        const data = productHelper.getProductById(
          user.subscription.product_price_id
        );

        if (user.subscription.cancel_at_period_end === 1) {
          //User recently canceled the subscription
          const periodEnd = new Date(user.subscription.cancel_at * 1000);
          data[
            "cancelMessage"
          ] = `You canceled this subscription. You have access to WarrenAi Premium until ${periodEnd.toDateString()}.`;
          //Disable cancel button
          data.cancelSubBtn = false;
        }

        res.json(data);
      } else {
        //User has no subscription
        const data = productHelper.getProductById(productHelper.PROD_ID_FREE);
        res.json(data);
      }
    });
  } else {
    const data = productHelper.getProductById(productHelper.PROD_ID_FREE);
    console.log(data);

    res.json(data);
  }
};

exports.getUserBillingInfo = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Get user subscription info from database
  const { userId } = req.params;
  const user = await dbHelper.getUserByIdVerbose(userId);
  const activeSubscription = await dbHelper.getActiveSubscriptionByUserId(
    userId
  );

  if (user && activeSubscription) {
    const data = {
      cardBrand: user.default_paymentmethod_card_brand,
      cardLast4: user.default_paymentmethod_card_last4,
      cancel_at_period_end:
        activeSubscription.subscription.cancel_at_period_end,
      cancel_at: activeSubscription.subscription.cancel_at,
      current_period_end: activeSubscription.subscription.current_period_end,
    };
    res.json(data);
  } else {
    //Return null billing information
    res.json(null);
  }
};

exports.getUserSubscription = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Get user subscription info from database
  const { userId } = req.params;
  await dbHelper
    .getSubscriptionByUserId(userId)
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      console.log("exports.getUserSubscription error");
      console.log(error);

      return res.status(404).json({ message: error.message });
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
