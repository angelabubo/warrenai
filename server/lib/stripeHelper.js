const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dbHelper = require("./dbHelper");

//Customers
exports.createStripeCustomer = async (email) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: email,
  });
  //console.log(customer);

  // Recommendation: save the customer.id in your database.
  return Promise.resolve(customer.id);
};

//Subscriptions
exports.createSubscription = async (customerId, paymentMethodId, priceId) => {
  try {
    // Set the new payment method as the default for the customer
    await attachPaymentToCustomer(customerId, paymentMethodId);

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    return subscription;
  } catch (error) {
    console.error("Error creating the subscription");
    throw error;
  }
};

exports.retrieveSubscription = async (subscriptionId) => {
  try {
    // Create the subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error retrieving the subscription");
    console.log(error);
    return null;
  }
};

exports.cancelSubscription = async (subscriptionId) => {
  try {
    // Cancel the subscription via update
    const canceledSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );
    return canceledSubscription;
  } catch (error) {
    console.error(
      "Stripe error call when attempting to cancel the subscription"
    );
    throw error;
  }
};

exports.deleteSubscription = async (subscriptionId) => {
  try {
    // Delete the subscription. status will become canceled
    const deletedSubscription = await stripe.subscriptions.del(subscriptionId);
    return deletedSubscription;
  } catch (error) {
    console.error(
      "Stripe error call when attempting to delete the subscription"
    );
    throw error;
  }
};

exports.changeSubscriptionPlan = async (subscriptionId, priceId) => {
  try {
    //TODO : instead of having this stripe call, consider saving the items.data[0].id
    //in database
    //Retrieve current subscription from stripe
    const currentSubscription = await exports.retrieveSubscription(
      subscriptionId
    );

    //Update subscription to the new price ID
    const newSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      items: [
        {
          id: currentSubscription.items.data[0].id,
          price: priceId,
        },
      ],
    });

    return newSubscription;
  } catch (error) {
    console.error(
      "Stripe error call when attempting to change the subscription"
    );
    throw error;
  }
};

//Invoice
exports.retryInvoice = async (customerId, paymentMethodId, invoiceId) => {
  try {
    // Set the new payment method as the default for the customer
    await attachPaymentToCustomer(customerId, paymentMethodId);

    // Retrieve updated invoice
    const invoice = await stripe.invoices.retrieve(invoiceId, {
      expand: ["payment_intent"],
    });

    return invoice;
  } catch (error) {
    console.error("Error retrying the latest invoice with new payment method");
    throw error;
  }
};

exports.retrieveInvoice = async (invoiceId) => {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error) {
    console.error("Error retrieving the invoice " + invoiceId);
    return null;
  }
};

//Payment Methods
const attachPaymentToCustomer = async (customerId, paymentMethodId) => {
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Change the default invoice settings on the customer to the new payment method
    const customer = await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    //Update customer information in database with the new payment method
    dbHelper.updateCustomer(customer);
  } catch (error) {
    console.error("Error attaching payment method to customer");
    throw error;
  }
};

exports.getDefaultPaymentMethodDetails = async (paymentMethodId) => {
  // Request Payment Method details from stripe
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  const paymentMethodDetails = {
    id: paymentMethod.id,
    cardBrand: paymentMethod.card.brand,
    cardLast4: paymentMethod.card.last4,
  };
  return Promise.resolve(paymentMethodDetails);
};

exports.updatePaymentMethod = async (
  customerId,
  oldPaymentMethodId,
  newPaymentMethodId
) => {
  try {
    //Detach the old payment method from the customer first
    const detachResult = await stripe.paymentMethods.detach(oldPaymentMethodId);
    if (detachResult.error) {
      throw detachResult.error;
    }

    //Attach the new payment method to the user
    await attachPaymentToCustomer(customerId, newPaymentMethodId);
  } catch (error) {
    console.error("Error updating new payment method to customer");
    throw error;
  }
};

exports.retrieveCharge = async (chargeId) => {
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    return charge;
  } catch (error) {
    console.error("Error retrieving the charge " + chargeId);
    return null;
  }
};

//Webhook
exports.constructWebhookEvent = (req) => {
  try {
    return stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    throw error;
  }
};
