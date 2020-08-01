import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
const MAX_CHAR = 25;
const useStyles = makeStyles({
  root: {
    maxWidth: 360,
    backgroundColor: "#FEFDFF",
  },
  media: {
    height: 90,
    width: 90,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 8,
  },
  cardContent: {
    paddingLeft: 5,
    paddingRight: 0,
    paddingTop: 10,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  cardContent2: {
    paddingRight: 8,
    paddingTop: 10,
  },
  company: {
    width: 110,
  },
});

const TickerBasic = ({ data }) => {
  const classes = useStyles();

  const logoSource = data.website
    .replace("http://", "")
    .replace("https://", "")
    .split(/[/?#]/)[0];

  const renderChange = (data) => {
    const change = data.change && data.changePercent ? data.change : null;
    const changePercent =
      data.change && data.changePercent ? data.changePercent : null;
    const isNegative = change && Math.sign(change) === -1 ? true : false;

    return (
      <Fragment>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          style={{
            fontSize: "14px",
            color: isNegative ? "red" : "green",
            width: 130,
          }}
        >
          {change && changePercent ? (
            <Fragment>
              <Grid item>
                <Typography variant="body2">{`${change}`}&nbsp;</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">{`(${changePercent}%)`}</Typography>
              </Grid>
              <Grid item>
                {isNegative ? (
                  <ArrowDropDownIcon
                    style={{
                      marginBottom: "-5px",
                    }}
                  />
                ) : (
                  <ArrowDropUpIcon
                    style={{
                      marginBottom: "-5px",
                    }}
                  />
                )}
              </Grid>
            </Fragment>
          ) : (
            <Grid
              item
              style={{
                color: "inherit",
              }}
            >
              Data not available
            </Grid>
          )}
        </Grid>
      </Fragment>
    );
  };

  const router = useRouter();
  const openTickerDetails = () => {
    router.push(`/company/details/${data.ticker}`);
  };

  return (
    <Card className={classes.root} elevation={2}>
      <CardActionArea>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="stretch"
        >
          <Grid item>
            <CardMedia
              onClick={() => window.open(`${data.website}`, "_blank")}
              component="img"
              className={classes.media}
              image={`https://logo.clearbit.com/${logoSource}`}
              title={`Click to go to ${data.company_name} website`}
            />
          </Grid>

          <Grid item className={classes.company}>
            <CardContent
              className={classes.cardContent}
              onClick={openTickerDetails}
            >
              <Typography variant="h5" component="h2">
                {data.ticker}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {data.company_name.length > MAX_CHAR
                  ? data.company_name.substring(0, MAX_CHAR) + " ..."
                  : data.company_name}
              </Typography>
            </CardContent>
          </Grid>

          <Grid item>
            <CardContent
              className={classes.cardContent2}
              onClick={openTickerDetails}
            >
              <Typography variant="h5">{`${data.close.toFixed(2)}`}</Typography>
              {renderChange(data)}
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
};

export default TickerBasic;
