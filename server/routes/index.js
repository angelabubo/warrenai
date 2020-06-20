const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const stripeController = require("../controllers/stripeController");
const bodyParser = require("body-parser");

const router = express.Router();

/* Error handler for async / await functions */
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

// AUTH ROUTES: /api/auth
router.post(
  "/api/auth/signup",
  authController.validateSignup,
  catchErrors(authController.signup)
);
router.post("/api/auth/signin", authController.signin);
router.get("/api/auth/signout", authController.signout);

//USER ROUTES: /api/users
//Any route with userId will call the controller
router.param("userId", userController.getUserById);

router
  .route("/api/users/:userId")
  //Get logged in user info
  .get(userController.getAuthUser)
  //When user wants to delete his account
  .delete(authController.checkAuth, catchErrors(userController.deleteUser));

router.get("/api/users/profile/:userId", userController.getUserProfile);

//STRIPE ROUTES: /api/stripe
router.post(
  "/api/stripe/:userId/create-subscription",
  stripeController.createSubscription
);

router.post("/api/stripe/:userId/retry-invoice", stripeController.retryInvoice);
router.post(
  "/api/stripe/:userId/update-subscription",
  stripeController.updateSubscription
);

//STRIPE WEBHOOK handler for asynchronous events.
router.post(
  "/api/stripe/stripe-webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.stripeWebhookHandler
);

router.get("/api/test", userController.getUsersTest);

module.exports = router;
