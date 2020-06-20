const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createStripeCustomer = async (email) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: email,
  });
  //console.log(customer);

  // Recommendation: save the customer.id in your database.
  return Promise.resolve(customer.id);
};

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
    throw error;
  }
};

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

const attachPaymentToCustomer = async (customerId, paymentMethodId) => {
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Change the default invoice settings on the customer to the new payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  } catch (error) {
    console.error("Error attaching payment method to customer");
    throw error;
  }
};

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
