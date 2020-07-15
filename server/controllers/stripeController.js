const dbHelper = require("../lib/dbHelper");
const stripeHelper = require("../lib/stripeHelper");

exports.createSubscription = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Create subscription called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated, get the stripe customer id of the user which was created when user signed up
  const customerId = await dbHelper.getStripeCustomerId(req.params.userId);
  const { paymentMethodId, priceId } = req.body;

  //Create subscription for current customer
  try {
    const subscription = await stripeHelper.createSubscription(
      customerId,
      paymentMethodId,
      priceId
    );

    //Create entry in subscriptions table
    await dbHelper.addSubscription(subscription);

    //Create the latest invoice associcated with the subscription
    await dbHelper.addInvoice(subscription.latest_invoice);

    //Send response
    return res.send(subscription);
  } catch (error) {
    console.error("[SERVER] createSubscription");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error processing your payment request. Please contact WarrenAi.",
      },
    });
  }
};

exports.retryInvoice = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Retry Invoice called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated, get the stripe customer id of the user which was created when user signed up
  const customerId = await dbHelper.getStripeCustomerId(req.params.userId);
  const { paymentMethodId, invoiceId } = req.body;

  //Retry new payment method on the previous invoice
  try {
    const invoice = await stripeHelper.retryInvoice(
      customerId,
      paymentMethodId,
      invoiceId
    );

    //Send response
    return res.send(invoice);
  } catch (error) {
    console.error("[SERVER] retryInvoice");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error processing your payment request. Please contact WarrenAi.",
      },
    });
  }
};

exports.updateSubscription = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Update subscription called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated
  const { subscription } = req.body;

  //Update subscription for current customer
  try {
    await dbHelper.updateSubscription(subscription);

    //Send response
    res.sendStatus(200);
  } catch (error) {
    console.error("[SERVER] updateSubscription");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error updating your subscription. Please contact WarrenAi.",
      },
    });
  }
};

exports.changeSubscription = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Change subscription called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated
  const { userId } = req.params;
  const { priceId } = req.body;
  try {
    //Get active subscription id of user with active subscription
    const userWithSubscription = await dbHelper
      .getActiveSubscriptionByUserId(userId)
      .then(async (user) => {
        if (user) {
          return user;
        } else {
          throw new Error("No user with active subscription found in database");
        }
      });

    //Request stripe to change subscription
    const newSubscription = await stripeHelper.changeSubscriptionPlan(
      userWithSubscription.subscription.id,
      priceId
    );

    //Update subscriptions table to reflect changes
    await dbHelper.updateSubscription(newSubscription);

    //When changing subscription plans from yearly to monthly, there is a possibility
    //that stripe will not send out a webhook for the invoice created. Manually
    //retrieve the invoice from stripe if new invoice is not yet in the database
    if (newSubscription.latest_invoice) {
      const invoice = await stripeHelper.retrieveInvoice(
        newSubscription.latest_invoice
      );
      if (invoice) {
        dbHelper.updateInvoice(invoice);
      }
    }

    //Send success result to client
    res.sendStatus(200);
  } catch (error) {
    console.error("[SERVER] changeSubscription controller");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error changing your subscription. Please contact WarrenAi.",
      },
    });
  }
};

exports.cancelSubscription = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Cancel subscription called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated
  const { userId } = req.params;
  try {
    //Get active subscription id of user with active subscription
    const userWithSubscription = await dbHelper
      .getActiveSubscriptionByUserId(userId)
      .then(async (user) => {
        if (user) {
          return user;
        } else {
          throw new Error("No user with active subscription found in database");
        }
      });

    //Request stripe to cancel subscription
    const canceledSubscription = await stripeHelper.cancelSubscription(
      userWithSubscription.subscription.id
    );

    //Update subscriptions table to reflect new status
    await dbHelper.updateSubscription(canceledSubscription);

    //Send success result to client
    res.sendStatus(200);
  } catch (error) {
    console.error("[SERVER] cancelSubscription controller");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error cancelling your subscription. Please contact WarrenAi.",
      },
    });
  }
};

exports.updatePaymentMethod = async (req, res) => {
  //Check if user who sent the request is authenticated first(signed in)
  if (!req.isAuthUser) {
    console.log("Update subscription called but NOT AUTHENTICATED");

    res
      .status(403)
      .json({ message: "You are not authenticated. Please signin or signup." });

    return res.redirect("/signin");
  }

  //User is authenticated
  const { paymentMethodId } = req.body;
  const { userId } = req.params;

  try {
    //Get user's stripe customer id and old paymentMethodId
    const user = await dbHelper.getUserByIdVerbose(userId);

    await stripeHelper.updatePaymentMethod(
      user.stripeCustomerId,
      user.default_paymentmethod_id,
      paymentMethodId
    );

    //Send response
    res.sendStatus(200);
  } catch (error) {
    console.error("[SERVER] updatePaymentMethod");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error updating your payment method. Please contact WarrenAi.",
      },
    });
  }
};

exports.stripeWebhookHandler = async (req, res) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;

  //TODO Enable when we go live
  // try {
  //   event = stripeHelper.constructWebhookEvent(req);
  // } catch (err) {
  //   console.log(err);
  //   console.log(`⚠️  Webhook signature verification failed.`);
  //   console.log(`⚠️  Check the env file and enter the correct webhook secret.`);
  //   return res.sendStatus(400);
  // }

  //Test START
  event = req.body;
  //Test END
  console.log("WEBHOOOOOOOOOOOOOKKKK Event Object");
  console.log(event.type);

  // Extract the object from the event.
  const data = event.data.object;

  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample

  switch (event.type) {
    case "customer.updated":
      //Used to update customer or user's data in the database table users
      //such as default payment method details
      try {
        dbHelper.updateCustomer(data);
      } catch (error) {
        console.log("====STRIPE WEBHOOK : customer.updated");
        console.error(error);
      }
      break;
    case "customer.subscription.updated":
      try {
        dbHelper.updateSubscription(data);
      } catch (error) {
        console.log("====STRIPE WEBHOOK : customer.subscription.updated");
        console.error(error);
      }
      break;
    case "customer.subscription.deleted":
      try {
        //Subscription was set to canceled state. Delete it from the database.
        dbHelper.deleteTableRowById("subscriptions", data.id);
      } catch (error) {
        console.log("====STRIPE WEBHOOK : customer.subscription.deleted");
        console.error(error);
      }
      break;
    case "invoice.payment_succeeded":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      try {
        dbHelper.updateInvoice(data);
      } catch (error) {
        console.log("====STRIPE WEBHOOK : invoice.payment_succeeded");
        console.error(error);
      }
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      // an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      try {
        dbHelper.updateInvoice(data);
      } catch (error) {
        console.log("====STRIPE WEBHOOK : invoice.payment_failed");
        console.error(error);
      }
      break;
    default:
    // Unexpected event type
  }
  res.sendStatus(200);
};
