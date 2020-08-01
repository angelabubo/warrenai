import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
  },
  image: {
    width: 150,
  },
});

const FeatureCard = ({ imageSrc, title, subtitle }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <img className={classes.image} src={imageSrc} alt={title} />
        </Grid>
        <Grid item>
          <Typography align="center" gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            align="center"
            variant="body2"
            component="p"
            color="textSecondary"
          >
            {subtitle}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default FeatureCard;
