import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";

import { getPotentialDividendStocksFromServer } from "../../lib/api";
import { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CompanyCard from "../../components/stocks/CompanyCard";
import SubscriptionRequired from "../../components/SubscriptionRequired";

const useStyles = makeStyles({
  root: {
    padding: 33,
  },
  fonstyle: {
    letterSpacing: "2px",
  },
  grid: {
    paddingTop: 20,
  },
});

const DividendScanner = (props) => {
  const classes = useStyles();
  const { auth } = props;
  const [dividendStocks, setDividendStocks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPotentialDividendStocksFromServer(auth.user.id).then((data) => {
      setDividendStocks(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <NavDrawer {...props}>
        <Fragment>
          <Paper variant="outlined" className={classes.root} elevation={5}>
            <Typography
              align="left"
              gutterBottom
              variant="h4"
              className={classes.fonstyle}
            >
              Dividend Scanner
            </Typography>
            <Typography
              align="left"
              gutterBottom
              variant="body1"
              color="textSecondary"
              component="h1"
            >
              This is a shortlist of potential dividend stocks to consider. This
              list is updated daily.
            </Typography>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="stretch"
              spacing={3}
              className={classes.grid}
            >
              {loading ? (
                <Grid item>
                  <CircularProgress size={70} style={{ color: "#26303e" }} />
                </Grid>
              ) : dividendStocks ? (
                dividendStocks.map((element, index) => {
                  return (
                    <Grid key={`dividend-item${index}`} item>
                      <CompanyCard
                        key={`dividend-tickerCard${index}`}
                        data={element}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item>
                  <SubscriptionRequired feature="use the Dividend Scanner" />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Fragment>
      </NavDrawer>
    </div>
  );
};

DividendScanner.getInitialProps = authInitialProps(true);
export default DividendScanner;
