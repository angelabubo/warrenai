import React, { Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { green } from "@material-ui/core/colors";

import UpdatePaymentMethodForm from "./UpdatePaymentMethodForm";
import { STRIPE_PUBLIC_KEY } from "../subscription/subscriptionHelper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { getUserBilling } from "../../lib/api";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const BillingDetails = (props) => {
  const classes = props.classes;
  const userId = props.auth.user.id;

  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [billingInfo, setBilingInfo] = useState(null);

  const initializeCancelDialogStates = () => {
    setLoading(true);
    setRefresh(false);
    setBilingInfo(null);
  };

  useEffect(() => {
    setLoading(true);

    //Get user's information from database
    getUserBilling(userId).then((billing) => {
      if (billing) {
        setBilingInfo(billing);
      }
      setLoading(false);
    });
  }, [refresh]);

  return (
    <Elements stripe={stripePromise}>
      <Fragment>
        {loading ? (
          <CircularProgress size={70} className={classes.panelLoading} />
        ) : (
          <Grid
            container
            direction="column"
            justify="space-between"
            alignContent="flex-start"
            className={classes.colContainer}
            spacing={5}
            wrap="nowrap"
          >
            {billingInfo ? (
              <Fragment>
                <Grid item>
                  <Typography variant="subtitle1" align="left">
                    Your next billing date:
                  </Typography>
                  <Typography
                    variant="h5"
                    align="left"
                    style={{ fontWeight: "bold" }}
                  >
                    {billingInfo.cancel_at_period_end === 1
                      ? "Not applicable"
                      : new Date(
                          billingInfo.current_period_end * 1000
                        ).toDateString()}
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography variant="subtitle1" align="left">
                    Your payment information:
                  </Typography>
                  <Typography
                    variant="h5"
                    align="left"
                    style={{ fontWeight: "bold" }}
                  >
                    {billingInfo.cardBrand && billingInfo.cardLast4
                      ? `${billingInfo.cardBrand} **** **** **** ${billingInfo.cardLast4}`
                      : "None"}

                    <UpdatePaymentMethodForm
                      btnName="Change Payment Information"
                      isDisabled={
                        billingInfo.cardBrand && billingInfo.cardLast4
                          ? false
                          : true
                      }
                      {...props}
                    />
                  </Typography>
                </Grid>
              </Fragment>
            ) : (
              <Fragment>
                <Grid item>
                  <Typography variant="subtitle1" align="left">
                    You have no active subscription.
                  </Typography>
                  <Typography variant="subtitle1" align="left">
                    Subscribe to WarrenAi Premium to avail of advanced services
                    in stock picking. <a>Learn More.</a>
                  </Typography>
                </Grid>
              </Fragment>
            )}
          </Grid>
        )}
      </Fragment>
    </Elements>
  );
};

const styles = (theme) => ({
  colContainer: {
    height: "100%",
  },
  panelLoading: {
    color: "#26303e",
  },
});

export default withStyles(styles)(BillingDetails);
