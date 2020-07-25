const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const stripeController = require("../controllers/stripeController");
const premiumController = require("../controllers/premiumController");
const freemiumController = require("../controllers/freemiumController");
const bodyParser = require("body-parser");

const router = express.Router();

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};
/////////////////////////////////////////////////////////////////////
// AUTH ROUTES: /api/auth
router.post(
  "/api/auth/signup",
  authController.validateSignup,
  catchErrors(authController.signup)
);
router.post("/api/auth/signin", authController.signin);
router.get("/api/auth/signout", authController.signout);

/////////////////////////////////////////////////////////////////////
//USER ROUTES: /api/users
//Any route with userId will call the controller
router.param("userId", userController.getUserById);

router
  .route("/api/users/:userId")
  //Get logged in user info (name, id, email, subscription details)
  .get(authController.checkAuth, userController.getAuthUser)
  //Update logged in user info (name, id, email, subscription details)
  .post(
    authController.checkAuth,
    userController.validateUpdateProfile,
    catchErrors(userController.updateAuthUser)
  )
  //When user wants to delete his account
  .delete(authController.checkAuth, catchErrors(userController.deleteUser));

router.post(
  "/api/users/:userId/password",
  authController.checkAuth,
  userController.validateUpdatePassword,
  catchErrors(userController.updateAuthUserPassword)
);

router
  .route("/api/users/:userId/billing")
  //Get logged in user's billing information
  .get(authController.checkAuth, userController.getUserBillingInfo);

router
  .route("/api/users/subscription/:userId")
  //Get logged in user's ACTIVE plan or subscription details
  .get(authController.checkAuth, userController.getUserPlan);

router
  .route("/api/users/subscription/:userId/get-any-subscription")
  //Get logged in user's ANY one plan or subscription details
  .get(authController.checkAuth, userController.getUserSubscription);

/////////////////////////////////////////////////////////////////////
//FREE ROUTES: /api/free/:userId
//Portfolio
router
  .route("/api/free/:userId/portfolio")
  //Get portfolio
  .get(authController.checkAuth, freemiumController.getPortfolio)
  //Add portfolio
  .post(authController.checkAuth, freemiumController.addPortfolio);
//Delete portfolio
router.delete(
  "/api/free/:userId/portfolio/:ticker",
  authController.checkAuth,
  catchErrors(freemiumController.deletePortfolio)
);

//Watchlist
router
  .route("/api/free/:userId/watchlist")
  //Get watchlist
  .get(authController.checkAuth, freemiumController.getWatchlist)
  //Add watchlist
  .post(authController.checkAuth, freemiumController.addWatchlist);
// //Delete watchlist
// router.delete(
//   "/api/free/:userId/watchlist/:ticker",
//   authController.checkAuth,
//   catchErrors(freemiumController.deletePortfolio)
// );

/////////////////////////////////////////////////////////////////////
//PREMIUM ROUTES: /api/premium
//WarrenAiTopCompanies
router.get(
  "/api/premium/warrenaitopco/:userId",
  authController.checkAuth,
  premiumController.getWarrenAiTopCompanies
);

/////////////////////////////////////////////////////////////////////
//STRIPE ROUTES: /api/stripe
router.post(
  "/api/stripe/:userId/create-subscription",
  authController.checkAuth,
  stripeController.createSubscription
);

router.post("/api/stripe/:userId/retry-invoice", stripeController.retryInvoice);

router.post(
  "/api/stripe/:userId/update-subscription",
  authController.checkAuth,
  stripeController.updateSubscription
);

router.post(
  "/api/stripe/:userId/change-subscription",
  authController.checkAuth,
  stripeController.changeSubscription
);

router.post(
  "/api/stripe/:userId/cancel-subscription",
  authController.checkAuth,
  stripeController.cancelSubscription
);

router.post(
  "/api/stripe/:userId/update-payment-method",
  authController.checkAuth,
  stripeController.updatePaymentMethod
);

//STRIPE WEBHOOK handler for asynchronous events.
router.post(
  "/api/stripe/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.stripeWebhookHandler
);

router.get("/api/test", authController.checkAuth, userController.getUsersTest);

module.exports = router;
