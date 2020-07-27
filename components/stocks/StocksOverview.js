import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TickerBasic from "./TickerBasic";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  portfolio: {
    padding: 25,
    backgroundColor: "transparent",
  },
  fonstyle: {
    letterSpacing: "3px",
  },
});
const StocksOverview = ({ title, stocks, isLoading }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Paper variant="outlined" className={classes.portfolio}>
        <Typography
          align="left"
          gutterBottom
          variant="h4"
          className={classes.fonstyle}
        >
          {title}
        </Typography>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          {isLoading ? (
            <CircularProgress size={70} className={classes.panelLoading} />
          ) : (
            stocks.map((element, index) => {
              return (
                <Grid key={`item${index}`} item>
                  <TickerBasic key={`ticker${index}`} data={element} />
                </Grid>
              );
            })
          )}
        </Grid>
      </Paper>
    </Fragment>
  );
};

export default StocksOverview;
