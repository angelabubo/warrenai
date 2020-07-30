import { authInitialProps } from "../../lib/auth";
import { getCompanyDetailsFromServer } from "../../lib/api";
import { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

//Custom components
import NavDrawer from "../../components/navigation/NavDrawer";
import StockDetailsHeading from "../../components/stock_details/StockDetailsHeading";
import MarketPerformance from "../../components/stock_details/MarketPerformance";
import CompanyProfile from "../../components/stock_details/CompanyProfile";

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
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <NavDrawer {...props}>
        {loading ? (
          <CircularProgress size={150} className={classes.loadingIcon} />
        ) : (
          <Fragment>
            <StockDetailsHeading data={data} />
            <MarketPerformance data={data} />
            <CompanyProfile data={data} />
          </Fragment>
        )}
      </NavDrawer>
    </div>
  );
};

CompanyDetails.getInitialProps = authInitialProps(true);
export default CompanyDetails;
