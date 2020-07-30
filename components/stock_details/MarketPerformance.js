import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import { dataFromServer } from "./dataFromServer";

//Custom components
import MarketPerformanceTable from "./MarketPerformanceTable";
import CandlestickChart from "./CandlestickChart";

const useStyles = makeStyles({
  root: {
    padding: 25,
    color: "#26303e",
    letterSpacing: "2px",
    backgroundColor: "#B8D1E0",
  },
});

const MarketPerformance = (props) => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="stretch"
          className={classes.gridHeading}
          spacing={2}
        >
          <Grid item>
            <Typography align="left" variant="h4" component="p" gutterBottom>
              <strong>Market Performance</strong>
            </Typography>
          </Grid>

          <Grid item>
            <Typography align="left" variant="h5" component="h2">
              Price Return
            </Typography>
          </Grid>

          <Grid item style={{ paddingBottom: 30 }}>
            <MarketPerformanceTable data={props.data} />
          </Grid>

          <Grid item>
            <Typography align="left" variant="h5" component="h2">
              3-Month Candlestick
            </Typography>
          </Grid>

          <Grid item>
            <CandlestickChart data={dataFromServer} />
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default MarketPerformance;
