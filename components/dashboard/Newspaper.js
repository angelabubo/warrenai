import React, { useEffect, useState } from "react";
import { testnews } from "../../data/news";
import { getGeneralNews } from "../../lib/api";
import CustomSlider from "../slider/CustomSlider";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  newsPaper: {
    padding: 20,
  },
  fonstyle: {
    letterSpacing: "3px",
  },
});

const Newspaper = (props) => {
  const classes = useStyles();
  const userId = props.auth.user.id;

  const [news, setNews] = useState(null);

  useEffect(() => {
    //setNews(testnews);
    getGeneralNews(userId)
      .then((result) => {
        setNews(result);
      })
      .catch((err) => {
        console.log(err.message);
        setNews(null);
      });
  }, []);

  return (
    <Paper elevation={2} className={classes.newsPaper}>
      <Typography
        align="left"
        gutterBottom
        variant="h4"
        className={classes.fonstyle}
      >
        News Feed
      </Typography>
      <Typography
        align="left"
        gutterBottom
        variant="body1"
        color="textSecondary"
        component="p"
      >
        The latest, comprehensive, institutional quality corporate and business
        related news events from trusted sources.
      </Typography>
      <CustomSlider data={news} />
    </Paper>
  );
};

export default Newspaper;
