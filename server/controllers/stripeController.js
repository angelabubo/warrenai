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

    //Create entry subscriptions table
    await dbHelper.addSubscription(subscription);

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

    console.log("RETRY INVOICE ROUTE");
    console.log(invoice);

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
  const { priceId, data } = req.body;

  //Update subscription for current customer
  try {
    await dbHelper.updateSubscription({ priceId, data });

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
    //Get subscription id of user
    await dbHelper.getSubscriptionByUserId(userId).then(async (user) => {
      if (user && user.subscription.id) {
        // Delete the subscription
        const deletedSubscription = await stripe.subscriptions.del(
          user.subscription.id
        );

        console.log(deletedSubscription);

        //Update database

        res.send(deletedSubscription);
      } else {
        throw new Error("No user found in database");
      }
    });
  } catch (error) {
    console.error("[SERVER] cancelSubscription");
    console.error(error);

    return res.status("402").json({
      error: {
        message:
          "There was an error cancelling your subscription. Please contact WarrenAi.",
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
  console.log(data);

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample

  switch (event.type) {
    case "invoice.payment_succeeded":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      console.log("WEBHOOOOOOOOOOOOOKKKK invoice.payment_succeeded");
      console.log(data);
      //Update subscription for current customer
      try {
        dbHelper.updateSubscription({ data });
      } catch (error) {
        console.error(error);
      }
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      // an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break;
    case "invoice.finalized":
      // If you want to manually send out invoices to your customers
      // or store them locally to reference to avoid hitting Stripe rate limits.
      break;
    case "customer.subscription.deleted":
      console.log("WEBHOOOOOOOOOOOOOKKKK customer.subscription.deleted");
      console.log(data);
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break;
    case "customer.subscription.trial_will_end":
      if (event.request != null) {
        // handle a subscription cancelled by your request
        // from above.
      } else {
        // handle subscription cancelled automatically based
        // upon your subscription settings.
      }
      break;
    default:
    // Unexpected event type
  }
  res.sendStatus(200);
};
