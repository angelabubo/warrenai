import NavBar from "../components/navigation/NavBar";
import { authInitialProps } from "../lib/auth";

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fragment } from "react";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import MailIcon from "@material-ui/icons/Mail";
import InstagramIcon from "@material-ui/icons/Instagram";

//Custom components
import HowCard from "../components/home/HowCard";
import FeatureCard from "../components/home/FeatureCard";

const useStyles = makeStyles((theme) => ({
  headingContainer: {
    backgroundColor: "#fff",
    color: "#26303e",
    padding: 0,
  },
  contentHeading: {
    padding: 100,
    minHeight: 800,
  },
  content: {
    padding: 100,
  },
  laptop: {
    maxWidth: 500,
  },
  howContainer: {
    backgroundImage: `url(${"/img/howdoesitwork.jpg"})`,
    height: 930,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: 0,
  },
  howPaper: {
    backgroundColor: "black",
    opacity: 0.8,
    color: "#fff",
    padding: 20,
  },
  featuredImg: {
    width: 150,
  },
  featuresContainer: {
    backgroundColor: "#fff",
    color: "#26303e",
    padding: 0,
  },
  reviewsContainer: {
    backgroundColor: "#26303e",
    color: "#fff",
    padding: 0,
  },
  star: {
    padding: 5,
  },
  callToActionContainer: {
    backgroundColor: "#f4f6ff",
    color: "#26303e",
    padding: 0,
  },
  footerContainer: {
    backgroundColor: "#B7CEE0",
    color: "#26303e",
    padding: 0,
  },
  contentFooter: {
    paddingTop: 100,
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 25,
  },
  footerIcons: { fontSize: "2.25rem", color: "#26303e" },
}));

const Index = (props) => {
  const classes = useStyles();
  return (
    <Fragment>
      {/* Title */}
      <Container
        id="about"
        maxWidth={false}
        className={classes.headingContainer}
      >
        <NavBar {...props} />
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
          className={classes.contentHeading}
          wrap="nowrap"
          spacing={2}
        >
          <Grid item>
            <Grid
              container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
              spacing={2}
            >
              <Grid item>
                <Typography
                  variant="h4"
                  gutterBottom
                  style={{ fontWeight: "bold" }}
                >
                  Become a better investor
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  We help you make informed decisions by giving you access to
                  institutional quality data and analysis presented visually.
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  href="#calltoaction"
                  variant="contained"
                  color="primary"
                >
                  Sign up for Free
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <img
              className={classes.laptop}
              src="/img/laptop.jpg"
              alt="laptop"
            />
          </Grid>
        </Grid>
      </Container>
      {/* How does it work */}
      <Container maxWidth={false} className={classes.howContainer}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          className={classes.content}
          spacing={2}
        >
          <Grid item>
            <Paper className={classes.howPaper} elevation={2}>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                style={{ padding: 25 }}
              >
                How does it work?
              </Typography>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                wrap="nowrap"
                spacing={1}
              >
                <Grid item>
                  <HowCard
                    image="/img/s&p.png"
                    title="Institutional quality data"
                    subtitle="Access the same premium data the professionals use"
                  />
                </Grid>
                <Grid item>
                  <ArrowForwardIosIcon style={{ fontSize: 40 }} />
                </Grid>
                <Grid item>
                  <HowCard
                    image="/img/flowchart.png"
                    title="World-class analysis model"
                    subtitle="We analyse 75,000 stocks every 6 hours using our internationally recognised model."
                  />
                </Grid>
                <Grid item>
                  <ArrowForwardIosIcon style={{ fontSize: 40 }} />
                </Grid>
                <Grid item>
                  <HowCard
                    image="/img/infographicreport.png"
                    title="Beautiful infographic reports"
                    subtitle="Stop using confusing spreadsheets to make decisions."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item>
            <Paper className={classes.howPaper} elevation={2}>
              <Typography
                variant="h4"
                gutterBottom
                align="center"
                style={{ padding: 25 }}
              >
                As featured on
              </Typography>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                wrap="nowrap"
                spacing={5}
              >
                <Grid item>
                  <img
                    className={classes.featuredImg}
                    src={`https://logo.clearbit.com/www.afr.com`}
                    alt="afr"
                  />
                </Grid>
                <Grid item>
                  <img
                    className={classes.featuredImg}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQrvuqwrSkUtJMtp1X-HXtgyrMslp4sKzhzUQ&usqp=CAU"
                    alt="forbes"
                  />
                </Grid>
                <Grid item>
                  <img
                    className={classes.featuredImg}
                    src="https://harness.io/wp-content/uploads/2020/04/techcrunch.png"
                    alt="techcrunch"
                  />
                </Grid>

                <Grid item>
                  <img
                    className={classes.featuredImg}
                    src="https://cdn-profiles.tunein.com/s110052/images/logog.png"
                    alt="cnbc"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Features */}
      <Container maxWidth={false} className={classes.featuresContainer}>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
          className={classes.content}
          wrap="nowrap"
        >
          <Grid item>
            <FeatureCard
              imageSrc="/img/search.png"
              title="Stocks"
              subtitle="Our infographics make it really easy for you to understand how the company is performing and if it would be a good investment."
            />
          </Grid>
          <Grid item>
            <FeatureCard
              imageSrc="/img/portfolio.png"
              title="Portfolios"
              subtitle="Find strengths and weaknesses of your investments and keep everything under control with our Portfolio analysis."
            />
          </Grid>
          <Grid item>
            <FeatureCard
              imageSrc="/img/search.png"
              title="Stocks"
              subtitle="Our infographics make it really easy for you to understand how the company is performing and if it would be a good investment."
            />
          </Grid>
        </Grid>
      </Container>

      {/* Reviews */}
      <Container maxWidth={false} className={classes.reviewsContainer}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          className={classes.content}
        >
          <Grid item>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              style={{ padding: 10 }}
            >
              Over 1,000,000 investors use WarrenAi
            </Typography>
          </Grid>
          <Grid item>
            <img className={classes.star} src="/img/star.png" alt="star" />
            <img className={classes.star} src="/img/star.png" alt="star" />
            <img className={classes.star} src="/img/star.png" alt="star" />
            <img className={classes.star} src="/img/star.png" alt="star" />
            <img className={classes.star} src="/img/star.png" alt="star" />
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              style={{ fontSize: "15px", letterSpacing: "1px" }}
            >
              See our <strong>1,923</strong> reviews on ✳️
              <strong>Trustpilot</strong>
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Read our Reviews on Google
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action */}
      <Container
        id="calltoaction"
        maxWidth={false}
        className={classes.callToActionContainer}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          className={classes.content}
        >
          <Grid item>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              style={{ padding: 10 }}
            >
              First time investing?
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              gutterBottom
              align="center"
              style={{ fontSize: "15px", letterSpacing: "1px" }}
            >
              First timers love our basic plan, which helps you learn whilst
              staying in control.
            </Typography>
          </Grid>

          <Grid item style={{ marginTop: 20 }}>
            <Button href="/signup" variant="outlined" color="primary">
              Create your free account now
            </Button>
          </Grid>

          <Grid item style={{ marginTop: 30 }}>
            <Typography
              gutterBottom
              align="center"
              variant="caption"
              color="textSecondary"
            >
              WarrenAi provides general investment advice only.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Container
        id="contact"
        maxWidth={false}
        className={classes.footerContainer}
      >
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="center"
          className={classes.contentFooter}
        >
          <Grid item>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              style={{ padding: 10 }}
            >
              Contact Us
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              gutterBottom
              align="center"
              style={{ fontSize: "15px", letterSpacing: "1px" }}
            >
              We'd love to hear from you!
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item>
                <IconButton>
                  <TwitterIcon className={classes.footerIcons} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <FacebookIcon className={classes.footerIcons} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <InstagramIcon className={classes.footerIcons} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton>
                  <LinkedInIcon className={classes.footerIcons} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton href="/contact">
                  <MailIcon className={classes.footerIcons} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: 30 }}>
            <Typography
              gutterBottom
              align="center"
              variant="caption"
              color="textSecondary"
            >
              © Copyright 2020 WarrenAi
            </Typography>
          </Grid>
          <Grid item style={{ marginTop: 30 }}>
            <Typography
              gutterBottom
              align="justify"
              variant="caption"
              color="textSecondary"
              component="p"
            >
              WarrenAi (ACN XXX XXX XXX), is a Corporate Authorised
              Representative (Authorised Representative Number: 12345678) of
              Angel Private Wealth Pty Ltd (AFSL No. 87654321). Any advice
              contained in this website is general advice only and has been
              prepared without considering your objectives, financial situation
              or needs. You should not rely on any advice and/or information
              contained in this website and before making any investment
              decision we recommend that you consider whether it is appropriate
              for your situation and seek appropriate financial, taxation and
              legal advice. Please read our Financial Services Guide before
              deciding whether to obtain financial services from us.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

Index.getInitialProps = authInitialProps();
export default Index;
