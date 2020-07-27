import { authInitialProps } from "../lib/auth";
import NavDrawer from "../components/navigation/NavDrawer";
import Newspaper from "../components/Newspaper";
import StocksOverview from "../components/stocks/StocksOverview";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  overview: {
    maxWidth: 880,
  },
});

const Dashboard = (props) => {
  const classes = useStyles();
  return (
    <div>
      <NavDrawer {...props}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={5}
          className={classes.overview}
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
                <StocksOverview title="Portfolio" />
              </Grid>
              <Grid item>
                <StocksOverview title="Watchlist" />
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
