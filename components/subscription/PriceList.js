import { Container, Grid } from "@material-ui/core";

import React from "react";
import Subscribe from "./Subscribe";
import { plans } from "../../data/prices";

import { makeStyles } from "@material-ui/core/styles";

//Card
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
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

  return (
    <Container>
      <h1>Pricing Plans</h1>
      <div className={classes.header}>
        <Typography variant="h3" component="h3" align="center">
          Become a Better Investor
        </Typography>
        <Typography variant="h5" component="h5" align="center">
          Make non-emotional long-term stock picks
        </Typography>
      </div>

      {/* Card Basic */}
      <div className={classes.root}></div>
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
            <Card key={plan.id} className={classes.cardroot} variant="outlined">
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
                <Button fullWidth={true} variant="contained" color="primary">
                  Subscribe
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
