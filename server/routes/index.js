const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const stripeController = require("../controllers/stripeController");
const premiumController = require("../controllers/premiumController");
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
  //When user wants to delete his account
  .delete(authController.checkAuth, catchErrors(userController.deleteUser));

router
  .route("/api/users/:userId/billing")
  //Get logged in user's billing information
  .get(authController.checkAuth, userController.getUserBillingInfo);
//When user wants to update billing information
//.post(authController.checkAuth, catchErrors());

router
  .route("/api/users/subscription/:userId")
  //Get logged in user's ACTIVE plan or subscription details
  .get(authController.checkAuth, userController.getUserPlan);

router
  .route("/api/users/subscription/:userId/get-any-subscription")
  //Get logged in user's ANY one plan or subscription details
  .get(authController.checkAuth, userController.getUserSubscription);

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
  "/api/stripe/:userId/cancel-subscription",
  authController.checkAuth,
  stripeController.cancelSubscription
);

//STRIPE WEBHOOK handler for asynchronous events.
router.post(
  "/api/stripe/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.stripeWebhookHandler
);

router.get("/api/test", authController.checkAuth, userController.getUsersTest);

module.exports = router;
