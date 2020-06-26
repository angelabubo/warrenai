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
  createPaymentMethod,
  handlePaymentMethodRequired,
  handleCustomerActionRequired,
  processSubscriptionRequest
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
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
//Dialog

const CardPaymentForm = ({ auth, plan }) => {
  const userId = auth.user.id;
  const elements = useElements();
  const stripe = useStripe();
  const classes = useStyles();

  const handleSubscriptionComplete = async (userId, priceId, result) => {
    // Payment was successful.
    // Remove invoice from localstorage because payment is now complete.
    localStorage.clear();
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      //Create a payment method
      const paymentMethod = await createPaymentMethod(
        stripe,
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
      const result = await handleCustomerActionRequired(stripe, subscription);

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
        fullWidth={true}
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


const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
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
};
export default CardPaymentForm;
