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
  processSubscriptionRequest,
} from "../../lib/subscription";

import { clientlogger } from "../../lib/clientlogger";
import clsx from "clsx";
import $ from "jquery";
import PaymentIcon from "react-payment-icons";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import CvvIcon from "../icons/CvvIcon";

//Dialog
import React, { Fragment, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
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
    console.log(result);

    alert("SUCCESS");
    //Display Account Settings Page
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    //Update Pay button state to Processing...
    setButtonStatus("Processing");

    try {
      //Create a payment method
      const paymentMethod = await createPaymentMethod(
        stripe,
        elements.getElement(CardNumberElement),
        billingDetails.name
        // billingDetails.postalCode
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
      //Normalize the error as data object for cases of 40x/50x status code.
      const data = clientlogger("err", error);

      //Display error in UI - data.error.message
      const errorElement = {
        error: {
          message: data.error.message,
        },
        complete: false,
        elementType: "cardNumber",
      };

      //Set the card error for display
      handleStripeElementChange(errorElement);
      setButtonStatus("Pay");
      handleFocusIn(errorElement);
    }
  };
  const [brandIcon, setBrandIcon] = useState("unknown");
  const [errorMsg, setErrorMsg] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [open, setOpen] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: "",
    // postalCode: "",
  });
  const [completeForm, setCompleteForm] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
    name: false,
    // postalCode: false,
  });
  const [buttonStatus, setButtonStatus] = useState("Pay");

  const initializeStates = () => {
    setBrandIcon("unknown");
    setErrorMsg({
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      name: "",
      // postalCode: "",
    });
    setOpen(false);

    setBillingDetails({
      name: "",
      // postalCode: "",
    });
    setCompleteForm({
      cardNumber: false,
      cardExpiry: false,
      cardCvc: false,
      name: false,
      // postalCode: false,
    });

    setButtonStatus("Pay");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    initializeStates();
  };

  const handleFocusIn = (evt) => {
    $(`#${evt.elementType}`).addClass("stripe-element-shadow");
  };

  const handleFocusOut = (evt) => {
    $(`#${evt.elementType}`).removeClass("stripe-element-shadow");
  };

  const handleStripeElementChange = (evt) => {
    console.log(evt);

    setCompleteForm((prev) => {
      return {
        ...prev,
        [evt.elementType]: evt.complete,
      };
    });

    if (evt.error) {
      $(`#${evt.elementType}`).css("border-color", "red");
      setErrorMsg((prev) => {
        return { ...prev, [evt.elementType]: evt.error.message };
      });
    } else {
      $(`#${evt.elementType}`).css("border-color", "#b7b7a4");
      setErrorMsg((prev) => {
        return { ...prev, [evt.elementType]: "" };
      });
    }

    if (evt.brand) {
      setBrandIcon(evt.brand);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBillingDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    setCompleteForm((prev) => {
      return {
        ...prev,
        [name]: value === "" ? false : true,
      };
    });
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
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{ classes: { root: classes.dialogPaper } }}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <div>
              <Typography variant="button">Subscribe</Typography>
            </div>
            <div>
              <IconButton
                edge="end"
                aria-label="close"
                onClick={handleClose}
                // size="small"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" align="center">
            {plan.name}
          </Typography>
          <Typography variant="h3" align="center">
            {plan.unitprice ? `$${plan.unitprice / 100}` : "Free"}
          </Typography>
          <Typography color="textSecondary" align="center" gutterBottom>
            {plan.recurring}
          </Typography>

          <div className={classes.formContainer}>
            <div className={classes.section}>
              <div className={classes.label}>Card Information *</div>
              <div
                id="cardNumber"
                className={clsx(classes.cardNumber, classes.cardContainer1)}
              >
                <div
                  className={clsx(
                    classes.cardNumberElement,
                    classes.stripeElement
                  )}
                >
                  <CardNumberElement
                    options={CARD_ELEMENT_OPTIONS}
                    onFocus={handleFocusIn}
                    onBlur={handleFocusOut}
                    onChange={handleStripeElementChange}
                  />
                </div>
                <div id="cardBrand" className={clsx(classes.cardBrand)}>
                  {brandIcon === "unknown" ? (
                    <CreditCardIcon
                      style={{
                        marginBottom: -3,
                        width: 24,
                        height: 24,
                        color: "#aab7c4",
                      }}
                    />
                  ) : (
                    <PaymentIcon
                      id={brandIcon}
                      style={{ marginBottom: -3, width: 24 }}
                      className="payment-icon"
                    />
                  )}
                </div>
              </div>

              <div className={classes.cardContainer2}>
                <div
                  id="cardExpiry"
                  className={clsx(classes.cardExpiry, classes.stripeElement)}
                >
                  <CardExpiryElement
                    options={CARD_ELEMENT_OPTIONS}
                    onFocus={handleFocusIn}
                    onBlur={handleFocusOut}
                    onChange={handleStripeElementChange}
                  />
                </div>
                <div
                  id="cardCvc"
                  className={clsx(classes.cardCvc, classes.stripeElement)}
                >
                  <CardCvcElement
                    options={CARD_ELEMENT_OPTIONS}
                    onFocus={handleFocusIn}
                    onBlur={handleFocusOut}
                    onChange={handleStripeElementChange}
                  />
                  {/* <CvvIcon fill="#aab7c4" width={24} height={24} /> */}
                </div>
              </div>

              <div id="cardNumber-error" className={classes.errorMsg}>
                {Object.values(errorMsg).find((err) => {
                  if (err !== "") {
                    return true;
                  } else {
                    return false;
                  }
                })}
              </div>
            </div>

            <div className={classes.section}>
              <div className={classes.label}>Name on card *</div>
              <div
                id="nameOnCard"
                className={clsx(classes.cardName, classes.stripeElement)}
              >
                <input
                  id="inputName"
                  name="name"
                  type="text"
                  className={classes.nameOnCard}
                  onFocus={() => {
                    $("#nameOnCard").addClass("stripe-element-shadow");
                  }}
                  onBlur={() => {
                    $("#nameOnCard").removeClass("stripe-element-shadow");
                  }}
                  onChange={handleInputChange}
                  value={billingDetails.name}
                />
              </div>
            </div>

            {/* <div className={classes.section}>
              <div className={classes.label}>Postal code *</div>
              <div
                id="postal-code"
                className={clsx(classes.cardName, classes.stripeElement)}
              >
                <input
                  id="inputPostal"
                  name="postalCode"
                  type="text"
                  className={classes.nameOnCard}
                  onFocus={() => {
                    $("#postal-code").addClass("stripe-element-shadow");
                  }}
                  onBlur={() => {
                    $("#postal-code").removeClass("stripe-element-shadow");
                  }}
                  onChange={handleInputChange}
                  value={billingDetails.postalCode}
                />
              </div>
            </div> */}

            <div className={classes.section}>
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                className={classes.subscribeButton}
                onClick={handleSubmit}
                disabled={
                  Object.values(completeForm).find((value) => {
                    return !value;
                  }) === false
                    ? true
                    : false
                }
              >
                {buttonStatus}
              </Button>
            </div>
            <div className={classes.section}>
              <Typography
                align="center"
                variant="caption"
                display="block"
                gutterBottom
              >
                By confirming your subscription, you allow WarrenAi to charge
                your card for this payment and future payments in accordance
                with the company terms.
              </Typography>
            </div>
          </div>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions> */}
      </Dialog>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    // backgroundColor: "#f4f6ff",
    backgroundColor: "white",
    maxWidth: "500px",
    minWidth: "350px",
    fontFamily: '"Montserrat", Helvetica, sans-serif',
  },
  dialogTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: 500,
    fontSmoothing: "antialiased",
    fontFamily: '"Montserrat", Helvetica, sans-serif',
    fontSize: "16px",
    // color: "#424770",
    // letterSpacing: "0.025em",
    marginBottom: 7,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "450px",
    minWidth: "300px",
    alignContent: "center",
    margin: "23px 15px 0 15px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 23,
  },

  cardContainer1: {
    display: "inherit",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardContainer2: {
    display: "inherit",
    flexDirection: "row",
  },

  cardNumber: {
    border: 1.25,
    borderStyle: "solid",
    borderRadius: "8px 8px 0 0",
    borderColor: "#b7b7a4",
  },

  cardNumberElement: {
    flexGrow: 1,
  },

  cardBrand: {
    padding: "0 15px",
  },

  cardExpiry: {
    flexGrow: 1,
    borderWidth: "0 1.25px 1.25px 1.25px",
    borderStyle: "solid",
    borderRadius: "0 0 0 8px",
    borderColor: "#b7b7a4",
  },

  cardCvc: {
    flexGrow: 1,
    borderWidth: "0 1.25px 1.25px 0",
    borderStyle: "solid",
    borderRadius: "0 0 8px 0",
    borderColor: "#b7b7a4",
  },

  cardName: {
    flexGrow: 1,
    border: 1.25,
    borderStyle: "solid",
    borderRadius: "8px",
    borderColor: "#b7b7a4",
  },

  stripeElement: {
    padding: "8px 15px",
    fontSize: "16px",
  },

  errorMsg: {
    color: "red",
    fontWeight: 600,
    fontFamily: '"Montserrat", Helvetica, sans-serif',
    fontSize: "13px",
    letterSpacing: "0.050em",
    marginTop: 8,
  },

  nameOnCard: {
    flexGrow: 1,
    border: "none",
    fontWeight: 400,
    fontSmoothing: "antialiased",
    fontSize: "16px",
    color: "#424770",
    letterSpacing: "0.025em",
    fontFamily: '"Montserrat", Helvetica, sans-serif',
    "&::placeholder": {
      color: "#aab7c4",
    },
    "&:focus": {
      outline: "none",
    },
  },

  subscribeButton: {
    height: 45,
    color: "white",
    fontSize: "17px",
  },
}));

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontWeight: 400,
      fontSmoothing: "antialiased",
      fontSize: "16px",
      color: "#424770",
      letterSpacing: "0.025em",
      fontFamily: '"Montserrat", Helvetica, sans-serif',
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
