import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    height: 360,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: 0,

    color: "#fff",
  },
  gridHeading: {
    padding: 25,
    letterSpacing: "2px",
    height: "100%",
  },
});

const Detail = ({ title, subtitle }) => {
  return (
    <Fragment>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item>
          <Typography
            style={{ color: "#B0AA96" }}
            align="left"
            variant="button"
            component="h2"
            gutterBottom
          >
            <strong>{title}</strong>
          </Typography>
        </Grid>
        <Grid item>
          <Typography align="left" variant="h5" component="h2" gutterBottom>
            {subtitle}
          </Typography>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const StockDetailsHeading = (props) => {
  const {
    company_name,
    market_cap,
    ticker,
    exchangeShort,
    lastUpdate,
    coverImageUrl,
    sector,
  } = props.data;
  const classes = useStyles();
  return (
    <Fragment>
      <div
        className={classes.root}
        style={{
          backgroundImage: `linear-gradient(to left, rgba(0,0,0,0) , rgba(0,0,0,1)), url(${coverImageUrl})`,
        }}
      >
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="stretch"
          className={classes.gridHeading}
        >
          <Grid item>
            <Typography align="left" variant="h2" component="h2" gutterBottom>
              <strong>{company_name}</strong>
            </Typography>
          </Grid>

          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="flex-start"
              spacing={10}
            >
              <Grid item>
                <Detail title="Market Cap" subtitle={`US$${market_cap}`} />
              </Grid>
              <Grid item>
                <Detail
                  title="Symbol"
                  subtitle={`${exchangeShort} : ${ticker}`}
                />
              </Grid>
              <Grid item>
                <Detail title="Last Updated" subtitle={lastUpdate} />
              </Grid>
              <Grid item>
                <Detail title="Sector" subtitle={sector} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

export default StockDetailsHeading;
