import { Container, Divider } from "@material-ui/core";
import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {
  createSubscription,
  retryInvoiceWithNewPaymentMethod,
} from "../lib/subscription";

import { clientlogger } from "../lib/clientlogger";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ userId }) => {
  const elements = useElements();
  const stripe = useStripe();

  const createPaymentMethod = async (cardElement) => {
    try {
      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (result.error) {
        throw result;
      }

      return result;
    } catch (error) {
      console.error("Error Creating Payment Method");
      throw error;
    }
  };

  const confirmCardPayment = async (paymentIntent, paymentMethodId) => {
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

  const handleSubscriptionComplete = async (userId, priceId, result) => {
    // Payment was successful.
    // Remove invoice from localstorage because payment is now complete.
    localStorage.clear();

    console.log("handleSubscriptionComplete");
    console.log(result);

    // Call your backend to grant access to your service based on
    // the product your customer subscribed to.
    // Get the product by using result.subscription.price.product
    // try {
    //   const serverStatus = await updateSubscription(userId, priceId, result);
    //   console.log(serverStatus);
    // } catch (error) {
    //   console.error("Backend Call error - " + error.message);
    // }

    // Change your UI to show a success message to your customer.
    //onSubscriptionSampleDemoComplete(result);
    alert("SUCCESS");
    //Display Account Settings Page
  };

  const handlePaymentMethodRequired = ({
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
      //console.error("handlePaymentMethodRequired - " + error.error.message);
      throw error;
    }
  };

  const handleCustomerActionRequired = async ({
    subscription,
    invoice,
    priceId,
    paymentMethodId,
    isRetry,
  }) => {
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
        const result = await confirmCardPayment(paymentIntent, paymentMethodId);

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

  const processSubscriptionRequest = async (userId, priceId, paymentMethod) => {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      //Create a payment method
      const paymentMethod = await createPaymentMethod(
        elements.getElement(CardElement)
      );

      //Process Subscription Request
      const subscription = await processSubscriptionRequest(
        userId,
        "price_1Gu2n8AOCcUhE0MFLb8xXxIr", //TODO
        paymentMethod
      );

      // Some payment methods require a customer to be on session
      // to complete the payment process or do additional
      // authentication with their financial institution.
      // Eg: 2FA for cards.
      // Check the status of the
      // payment intent to handle these actions.
      const result = await handleCustomerActionRequired(subscription);

      // You will get a requires_payment_method error if attempt
      // to charge the card for the subscription failed.
      if (result.subscription) {
        const { subscription, priceId } = await handlePaymentMethodRequired(
          result
        );
        // No more actions required. Provision your service for the user.
        await handleSubscriptionComplete(userId, priceId, subscription);
      } else if (result.invoice) {
        // No more actions required. Provision your service for the user.
        await handleSubscriptionComplete(
          userId,
          result.priceId,
          result.invoice
        );
      } else {
        throw {
          error: {
            message: "Unknown result object. Neither subscription nor invoice",
          },
        };
      }
    } catch (error) {
      //Normalize the error as data object for cases of 40x/50x status codes
      const data = clientlogger("err", error);

      //Display error in UI - data.error.message
      alert(data.error.message);
    }
  };

  return (
    <Paper>
      <form onSubmit={handleSubmit}>
        <h3>Card Information</h3>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>

      {/* <CardNumberElement />
      <CardExpiryElement />
      <CardCvcElement />
      <Divider />
      <label>Name on Card</label>
      <TextField id="name-on-card" label="" variant="outlined" />
      <label>Postal Code</label>
      <TextField id="postal-code" label="" variant="outlined" /> */}
    </Paper>
  );
};

export default CheckoutForm;
