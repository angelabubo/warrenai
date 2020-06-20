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

    console.log(subscription);

    //Create entry subscriptions table if successful
    await dbHelper.addSubscription(subscription);

    //Send response
    return res.send(subscription);
  } catch (error) {
    return res.status("402").send({ error: { message: error.message } });
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

    //Create entry subscriptions table if successful
    if (invoice.status === "active") {
      await dbHelper.addSubscription(subscription);
    }

    //Update users table

    //Send response
    return res.send(invoice);
  } catch (error) {
    return res.status("402").send({ error: { message: error.message } });
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

  //User is authenticated, get the stripe customer id of the user which was created when user signed up
  const { priceId, data } = req.body;

  //Update subscription for current customer
  try {
    console.log("INSIDE SERVER updateSubscription");

    console.log(data);
    console.log(priceId);

    let subId, newData;
    if (data.object === "subscription") {
      subId = data.id;
      newData = {
        current_period_end: data.current_period_end,
        status: data.status,
        product_price_id: priceId,
        product_id: data.items.data[0].price.product,
      };

      await dbHelper.updateTableRowById("subscriptions", subId, newData);
      //Send response
      return res.send("OK TODO");
    } else if (data.object === "invoice") {
      subId = data.subscription;
      if (data.status === "paid") {
        newData = {
          status: "active",
          product_price_id: priceId,
        };
      } else {
        newData = {
          status: data.status,
          product_price_id: priceId,
        };
      }
      await dbHelper.updateTableRowById("subscriptions", subId, newData);
      //Send response
      return res.send("OK TODO");
    } else {
      throw {
        message: "Unknown data object type in updateSubscription Request",
      };
    }
  } catch (error) {
    return res.status("402").send({ error: { message: error.message } });
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

  // Extract the object from the event.
  const dataObject = event.data.object;

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample

  switch (event.type) {
    case "invoice.payment_succeeded":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      console.log("WEBHOOOOOOOOOOOOOKKKK");
      console.log(dataObject);
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break;
    case "invoice.finalized":
      // If you want to manually send out invoices to your customers
      // or store them locally to reference to avoid hitting Stripe rate limits.
      break;
    case "customer.subscription.deleted":
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
