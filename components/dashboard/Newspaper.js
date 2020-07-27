import { news } from "../../data/news";
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
  return (
    <Paper variant="outlined" className={classes.newsPaper}>
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
