import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";

import { getWarrenAiTopCompaniesFromServer } from "../../lib/api";
import { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

import React, { Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";
import CompanyCard from "../../components/stocks/CompanyCard";
import SubscriptionRequired from "../../components/SubscriptionRequired";
import { makeStyles } from "@material-ui/core/styles";
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

const WarrenAITopCo = (props) => {
  const classes = useStyles();
  const { auth } = props;
  const [topCoList, setTopCoList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWarrenAiTopCompaniesFromServer(auth.user.id).then((data) => {
      setTopCoList(data);
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
              WarrenAi Top Companies
            </Typography>
            <Typography
              align="left"
              gutterBottom
              variant="body1"
              color="textSecondary"
              component="h1"
            >
              This is a shortlist of companies WarrenAi detected as viable
              long-term investments. This list is updated daily.
            </Typography>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={3}
              className={classes.grid}
            >
              {loading ? (
                <Grid item>
                  <CircularProgress size={70} style={{ color: "#26303e" }} />
                </Grid>
              ) : topCoList ? (
                topCoList.map((element, index) => {
                  return (
                    <Grid key={`warrenaitop-item${index}`} item>
                      <CompanyCard
                        key={`warrenaitop-tickerCard${index}`}
                        data={element}
                      />
                    </Grid>
                  );
                })
              ) : (
                <Grid item>
                  <SubscriptionRequired feature="view WarrenAi Top Companies" />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Fragment>
      </NavDrawer>
    </div>
  );
};

WarrenAITopCo.getInitialProps = authInitialProps(true);
export default WarrenAITopCo;
