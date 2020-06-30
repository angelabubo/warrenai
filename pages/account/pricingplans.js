import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import PriceList from "../../components/subscription/PriceList";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 40,
  },
});

const PricingPlans = (props) => {
  const classes = useStyles();
  return (
    <div>
      <NavDrawer {...props}>
        <h1>Pricing Plans</h1>
        <div className={classes.header}>
          <Typography variant="h3" component="h3" align="center">
            Become a Better Investor
          </Typography>
          <Typography variant="h5" component="h5" align="center">
            Make non-emotional long-term stock picks
          </Typography>
        </div>
        <PriceList {...props} />
      </NavDrawer>
    </div>
  );
};

PricingPlans.getInitialProps = authInitialProps(true);
export default PricingPlans;
