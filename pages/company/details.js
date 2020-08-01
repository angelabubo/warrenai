import { authInitialProps } from "../../lib/auth";
import { getCompanyDetailsFromServer, getCandlesticks } from "../../lib/api";

import { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

//Custom components
import NavDrawer from "../../components/navigation/NavDrawer";
import StockDetailsHeading from "../../components/stock_details/StockDetailsHeading";
import MarketPerformance from "../../components/stock_details/MarketPerformance";
import CompanyProfile from "../../components/stock_details/CompanyProfile";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  loadingIcon: {
    color: "#26303e",
  },
}));

const CompanyDetails = (props) => {
  const classes = useStyles();
  const ticker = props.ticker;
  const userId = props.auth.user.id;

  const [data, setData] = useState({});
  const [candleData, setCandleData] = useState({ s: "nodata" });
  const [loading, setLoading] = useState(false);
  const [loadingCandle, setLoadingCandle] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCompanyDetailsFromServer(userId, ticker)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
        setData({});
      });
  }, []);

  useEffect(() => {
    setLoadingCandle(true);
    getCandlesticks(userId, ticker)
      .then((result) => {
        setCandleData(result);
        setLoadingCandle(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingCandle(false);
        setCandleData({ s: "nodata" });
      });
  }, []);

  return (
    <div>
      <NavDrawer {...props}>
        {loading || loadingCandle ? (
          <Fragment>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <CircularProgress size={70} className={classes.loadingIcon} />{" "}
              </Grid>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <StockDetailsHeading data={data} />
            <MarketPerformance data={data} candleData={candleData} />
            <CompanyProfile data={data} />
          </Fragment>
        )}
      </NavDrawer>
    </div>
  );
};

CompanyDetails.getInitialProps = authInitialProps(true);
export default CompanyDetails;
