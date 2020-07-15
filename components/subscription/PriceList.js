import { Container, Grid } from "@material-ui/core";

import React, { Fragment, useState, useEffect } from "react";
import Subscribe from "./Subscribe";
import { plans } from "../../data/prices";
import { getUserSubscription } from "../../lib/api";

import { makeStyles } from "@material-ui/core/styles";

//Card
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
  },
  cardroot: {
    minWidth: 275,
    maxWidth: 300,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
  },
  cardBody: {
    padding: 0,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
    fontWeight: "bold",
  },
  list_icon: {
    minWidth: 35,
  },
  card_header: {
    height: 110,
  },
  card_action: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
  },
});

export default function PriceList(props) {
  const classes = useStyles();
  const auth = props.auth;
  const [subscribedTo, setSubscribedTo] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [subscriptionCanceled, setSubscriptionCanceled] = useState(null);

  useEffect(() => {
    getUserSubscription(auth.user.id).then((user) => {
      if (user) {
        setSubscribedTo(user.subscription.product_price_id);
        setSubscriptionStatus(user.subscription.status);
        if (user.subscription.cancel_at_period_end === 1) {
          setSubscriptionCanceled({
            cancel_at_period_end: user.subscription.cancel_at_period_end,
            cancel_at: user.subscription.cancel_at,
          });
        }
      }
    });
  }, []);

  const getCardAction = (plan) => {
    let btnName, isDisabled;
    let subscriptionWasCanceled =
      subscriptionCanceled && subscriptionCanceled.cancel_at_period_end === 1
        ? true
        : false;

    if (subscribedTo && subscriptionStatus === "active") {
      //With active subscription
      if (plan.id === "price_free") {
        return (
          <Typography
            align="center"
            variant="caption"
            display="block"
            color={subscriptionWasCanceled ? "error" : "initial"}
          >
            {subscriptionWasCanceled
              ? `*You will revert to the free service after ${new Date(
                  subscriptionCanceled.cancel_at * 1000
                ).toDateString()}.`
              : "*Cancel your subscription to avail this free service."}
          </Typography>
        );
      } else if (plan.id === subscribedTo) {
        if (subscriptionWasCanceled) {
          btnName = "Subscribe";
          isDisabled = false;
        } else {
          btnName = "Current Plan";
          isDisabled = true;
        }
      } else {
        btnName = "Subscribe";
        isDisabled = false;
      }
    } else {
      //No current and active subscription
      if (plan.id === "price_free") {
        btnName = "Current Plan";
        isDisabled = true;
      } else {
        btnName = "Subscribe";
        isDisabled = false;
      }
    }

    return (
      <Fragment>
        <Subscribe
          {...props}
          plan={plan}
          btnName={btnName}
          isDisabled={isDisabled}
        />
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justify="center"
        // alignItems="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        {plans.map((plan) => (
          <Grid item key={plan.id} md={4}>
            <Card
              square
              key={plan.id}
              className={classes.cardroot}
              variant="elevation"
              elevation={5}
            >
              <CardContent component="div" className={classes.cardBody}>
                <CardContent className={classes.card_header}>
                  <Typography variant="h6" component="h6" align="center">
                    {plan.name}
                  </Typography>
                  <Typography variant="h3" component="h3" align="center">
                    {plan.unitprice ? `$ ${plan.unitprice / 100}` : "Free"}
                  </Typography>
                  <Typography
                    className={classes.pos}
                    color="textSecondary"
                    align="center"
                  >
                    {plan.recurring}
                  </Typography>
                </CardContent>
                <CardContent>
                  <List>
                    {plan.inclusions.map((inclusion, index) => (
                      <ListItem
                        key={index}
                        disabled={inclusion.check ? false : true}
                        dense={true}
                      >
                        <ListItemIcon className={classes.list_icon}>
                          {inclusion.check ? <CheckIcon /> : <ClearIcon />}
                        </ListItemIcon>
                        <ListItemText primary={inclusion.feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </CardContent>
              <CardActions className={classes.card_action}>
                {getCardAction(plan)}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Fragment>
  );
}
