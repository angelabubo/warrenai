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
  // Attach the payment method to the customer
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
  } catch (error) {
    throw error;
  }

  // Change the default invoice settings on the customer to the new payment method
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  // Create the subscription
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
};
