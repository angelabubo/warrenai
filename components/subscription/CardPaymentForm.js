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
} from "../../lib/subscription";

import { clientlogger } from "../../lib/clientlogger";

//Dialog
import React, { Fragment, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { STRIPE_PUBLIC_KEY } from "../../lib/subscription";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
//Dialog

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontWeight: 400,
      fontSmoothing: "antialiased",
      fontSize: "18px",
      color: "#424770",
      letterSpacing: "0.025em",
      fontFamily: "Source Code Pro, monospace",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
  // iconStyle: "solid",
  // style: {
  //   base: {
  //     color: "#32325d",
  //     iconColor: "#fa755a",
  //     fontWeight: 400,
  //     fontFamily: '"Montserrat", Helvetica, sans-serif',
  //     fontSmoothing: "antialiased",
  //     fontSize: "18px",
  //     "::placeholder": {
  //       color: "#aab7c4",
  //     },
  //   },
  //   invalid: {
  //     color: "#fa755a",
  //     iconColor: "#fa755a",
  //   },
  // },
  // iconStyle: "solid",
  // style: {
  //   base: {
  //     iconColor: "#c4f0ff",
  //     color: "#fff",
  //     fontWeight: 300,
  //     fontFamily: "Montserrat, Open Sans, Segoe UI, sans-serif",
  //     fontSize: "18px",
  //     fontSmoothing: "antialiased",
  //     ":-webkit-autofill": {
  //       color: "#fce883",
  //     },
  //     "::placeholder": {
  //       color: "#87bbfd",
  //     },
  //   },
  //   invalid: {
  //     iconColor: "#ffc7ee",
  //     color: "#ffc7ee",
  //   },
  // },
};

const CardPaymentForm = ({ auth, plan }) => {
  const userId = auth.user.id;
  const elements = useElements();
  const stripe = useStripe();

  const classes = useStyles();

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
        elements.getElement(CardNumberElement)
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

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
      >
        Subscribe
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        PaperProps={{ classes: { root: classes.dialogPaper } }}
      >
        <DialogTitle id="form-dialog-title">
          Subscribe to {plan.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" component="h3" align="center">
            {plan.unitprice ? `$ ${plan.unitprice / 100}` : "Free"}
          </Typography>
          <Typography color="textSecondary" align="center">
            {plan.recurring}
          </Typography>
          {/* <CardElement options={CARD_ELEMENT_OPTIONS} /> */}
          <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
          <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
          <Divider />
          <label>Name on Card</label>
          <TextField id="name-on-card" label="" variant="outlined" />
          <label>Postal Code</label>
          <TextField id="postal-code" label="" variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const useStyles = makeStyles({
  dialogPaper: {
    backgroundColor: "#f4f6ff",
  },
});

export default CardPaymentForm;
