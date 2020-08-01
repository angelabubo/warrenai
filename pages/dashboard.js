import { useState, useEffect } from "react";
import { authInitialProps } from "../lib/auth";
import NavDrawer from "../components/navigation/NavDrawer";
import Newspaper from "../components/dashboard/Newspaper";
import StocksOverview from "../components/stocks/StocksOverview";
import Grid from "@material-ui/core/Grid";

import { dataTicker } from "../components/stocks/data";
import { getBasicStockData } from "../lib/api";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  dashboard: {
    maxWidth: 900,
  },
});

const Dashboard = (props) => {
  const classes = useStyles();
  const userId = props.auth.user.id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBasicStockData(userId)
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setData([]);
      });
    //setData(dataTicker);
  }, []);

  const watchlistStocks = data.filter((element) => {
    return element.state === "watchlist";
  });

  const portfolioStocks = data.filter((element) => {
    return element.state === "portfolio";
  });

  return (
    <div>
      <NavDrawer {...props}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={5}
          className={classes.dashboard}
        >
          <Grid item>
            <Newspaper {...props} />
          </Grid>

          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-start"
              spacing={5}
            >
              <Grid item>
                <StocksOverview
                  title="Portfolio"
                  stocks={portfolioStocks}
                  isLoading={loading}
                  noDataMessage="You have not added anything to your portfolio yet. Go to
                Portfolio > My Portfolio menu to start tracking your investments."
                />
              </Grid>
              <Grid item>
                <StocksOverview
                  title="Watchlist"
                  stocks={watchlistStocks}
                  isLoading={loading}
                  noDataMessage="You have not added anything to your watchlist yet. Go to
                Portfolio > My Watchlist menu to start tracking the market."
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </NavDrawer>
    </div>
  );
};

Dashboard.getInitialProps = authInitialProps(true);
export default Dashboard;
