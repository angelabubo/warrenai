import axios from "axios";

export const STRIPE_PUBLIC_KEY =
  "pk_test_51GtbV6AOCcUhE0MFvAWMLeKwzSng9HKU4TVeTAyLo9yTdB0NNPDRDINgrMlW2NmxJe5Y4vzGITvmcavcElXpEpXD00tsidmwlf";

//test1 user cus_HT4gEtc9Zy8ndM
export const createSubscription = async ({
  userId,
  paymentMethodId,
  priceId,
}) => {
  try {
    const result = await axios.post(
      `/api/stripe/${userId}/create-subscription`,
      {
        paymentMethodId,
        priceId,
      }
    );

    // If the card is declined, display an error to the user.
    if (result.error) {
      // The card had an error when trying to attach it to a customer.
      throw result;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const retryInvoiceWithNewPaymentMethod = async ({
  userId,
  paymentMethodId,
  invoiceId,
}) => {
  try {
    const result = await axios.post(`/api/stripe/${userId}/retry-invoice`, {
      paymentMethodId,
      invoiceId,
    });

    // If the card is declined, display an error to the user.
    if (result.error) {
      // The card had an error when trying to attach it to a customer.
      throw result;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const updateSubscription = async (userId, priceId, data) => {
  try {
    const result = await axios.post(
      `/api/stripe/${userId}/update-subscription`,
      {
        priceId,
        data,
      }
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const createPaymentMethod = async (
  stripe,
  cardElement,
  name
  // postalCode
) => {
  try {
    const result = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        // address: {
        //   postal_code: postalCode,
        // },
        name: name,
      },
    });

    if (result.error) {
      throw result;
    }

    console.log(result);

    return result;
  } catch (error) {
    console.error("Error Creating Payment Method");
    throw error;
  }
};

export const confirmCardPayment = async (
  stripe,
  paymentIntent,
  paymentMethodId
) => {
  try {
    const result = await stripe.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: paymentMethodId,
      }
    );

    if (result.error) {
      throw result;
    }

    return result;
  } catch (error) {
    console.error("Error Confirming Card Payment");
    throw error;
  }
};

export const handlePaymentMethodRequired = ({
  subscription,
  paymentMethodId,
  priceId,
}) => {
  try {
    if (subscription.status === "active") {
      // subscription is active, no customer actions required.
      return { subscription, priceId, paymentMethodId };
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      "requires_payment_method"
    ) {
      // Using localStorage to store the state of the retry here
      // (feel free to replace with what you prefer)
      // Store the latest invoice ID and status
      localStorage.setItem("latestInvoiceId", subscription.latest_invoice.id);
      localStorage.setItem(
        "latestInvoicePaymentIntentStatus",
        subscription.latest_invoice.payment_intent.status
      );
      throw { error: { message: "Your card was declined." } };
    } else {
      return { subscription, priceId, paymentMethodId };
    }
  } catch (error) {
    throw error;
  }
};

export const handleCustomerActionRequired = async (
  stripe,
  { subscription, invoice, priceId, paymentMethodId, isRetry }
) => {
  if (subscription && subscription.status === "active") {
    // subscription is active, no customer actions required.
    return { subscription, priceId, paymentMethodId };
  }

  // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
  // If it's a retry, the payment intent will be on the invoice itself.
  let paymentIntent = invoice
    ? invoice.payment_intent
    : subscription.latest_invoice.payment_intent;

  if (
    paymentIntent.status === "requires_action" ||
    (isRetry === true && paymentIntent.status === "requires_payment_method")
  ) {
    try {
      const result = await confirmCardPayment(
        stripe,
        paymentIntent,
        paymentMethodId
      );

      if (result.paymentIntent.status === "succeeded") {
        // There's a risk of the customer closing the window before callback
        // execution. To handle this case, set up a webhook endpoint and
        // listen to invoice.payment_succeeded. This webhook endpoint
        // returns an Invoice.
        return {
          priceId: priceId,
          subscription: subscription,
          invoice: invoice,
          paymentMethodId: paymentMethodId,
        };
      }
    } catch (error) {
      throw error;
    }
  } else {
    // No customer action needed
    return { subscription, priceId, paymentMethodId };
  }
};

export const processSubscriptionRequest = async (
  userId,
  priceId,
  paymentMethod
) => {
  // If a previous payment was attempted, get the lastest invoice
  const latestInvoicePaymentIntentStatus = localStorage.getItem(
    "latestInvoicePaymentIntentStatus"
  );

  try {
    if (latestInvoicePaymentIntentStatus === "requires_payment_method") {
      //This is a payment retry, get the latest invoice id
      const invoiceId = localStorage.getItem("latestInvoiceId");

      //Update the payment method and retry invoice payment
      const { data } = await retryInvoiceWithNewPaymentMethod({
        userId: userId,
        paymentMethodId: paymentMethod.paymentMethod.id,
        invoiceId: invoiceId,
      });
      return {
        // Use the Stripe 'object' property on the
        // returned result to understand what object is returned.
        invoice: data,
        paymentMethodId: paymentMethod.paymentMethod.id,
        priceId: priceId,
        isRetry: true,
      };
    } else {
      //First payment attempt
      //Attach the payment method to a customer and create subsciption
      const { data } = await createSubscription({
        userId: userId,
        paymentMethodId: paymentMethod.paymentMethod.id,
        priceId: priceId,
      });

      return {
        // Use the Stripe 'object' property on the
        // returned result to understand what object is returned.
        subscription: data,
        paymentMethodId: paymentMethod.paymentMethod.id,
        priceId: priceId,
      };
    }
  } catch (error) {
    throw error;
  }
};
