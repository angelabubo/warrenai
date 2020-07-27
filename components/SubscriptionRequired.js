import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    backgroundColor: "#a8dadc",
    letterSpacing: "3px",
  },
  title: {
    letterSpacing: "2px",
  },
  subtitle: {
    letterSpacing: "1.5px",
  },
});

const SubscriptionRequired = ({ feature }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined" elevation={3}>
      <CardContent>
        <Typography variant="h2" component="h2" className={classes.title}>
          Ooops!
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          color="textSecondary"
          className={classes.subtitle}
        >
          {feature
            ? `You must be subscribed to WarrenAi Premium to ${feature}.`
            : "You must be subscribed to WarrenAi Premium to access this feature."}
        </Typography>
      </CardContent>
      <CardActions>
        <Button href="/account/pricingplans" size="medium">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default SubscriptionRequired;
