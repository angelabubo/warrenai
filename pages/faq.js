import { authInitialProps } from "../lib/auth";

//Custom components
import NavDrawer from "../components/navigation/NavDrawer";
import FAQ from "../components/FAQ";

import React, { Fragment } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

//Data
const data = [
  {
    question: "How do you research a stock?",
    answer:
      "Type the company name or the ticker into the search bar at the very top to open up a detailed stock analysis report that covers everything from historical financials, valuations, projections, insider activity and much more.",
  },
  {
    question: "Is WarrenAi free?",
    answer:
      "Yes, many of our tools and features are accessible to the public. Sign up for free to use the My Portfolio and My Watchlist tools. For valuations and projections, you must be WarrenAi Premium.",
  },
  {
    question: "Do you offer a risk-free money back guarantee?",
    answer:
      "Yes! You can get a full refund up to 30 days from subscription. No questions asked.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "If you cancel anytime after the grace period of 30 days, you will continue to have WarrenAi premium access until the end of last paid billing period.",
  },
  {
    question: "How can I look up wonderful companies to invest in?",
    answer:
      "Click on WarrenAi Top Companies on the side navigation to see a short list of companies WarrenAi flagged for being exceptional long term investments.",
  },
  {
    question: "Where can I find the fair value and projections of a stock?",
    answer:
      "Search the company name or ticker at the very to search bar and click the Valuations and Projections tab.",
  },
];

const useStyles = makeStyles({
  root: {
    // maxWidth: 800,
    padding: 20,
  },
  faqGrid: {
    color: "#26303e",
    padding: 10,
  },
  heading: {
    letterSpacing: "2px",
  },
});

const FAQpage = (props) => {
  const classes = useStyles();

  return (
    <div>
      <NavDrawer {...props}>
        <Fragment>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing={2}
            className={classes.root}
          >
            <Grid item>
              <Typography
                align="center"
                gutterBottom
                variant="h4"
                className={classes.heading}
              >
                Frequently Asked Questions
              </Typography>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                spacing={3}
                className={classes.faqGrid}
              >
                {data.map((item, index) => {
                  return (
                    <Grid key={`faqItem${index}`} item>
                      <FAQ question={item.question} answer={item.answer} />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Fragment>
      </NavDrawer>
    </div>
  );
};

FAQpage.getInitialProps = authInitialProps(true);
export default FAQpage;
