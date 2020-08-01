import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";

import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 250,
    backgroundColor: "transparent",
    color: "#fff",
  },
  media: {
    width: 250,
  },
});

const HowCard = ({ image, title, subtitle }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} square>
      <CardActionArea>
        <CardMedia
          component="img"
          className={classes.media}
          src={image}
          title={title}
        />
        <CardContent>
          <Typography align="center" gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
          <Typography align="center" variant="body2" component="p">
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HowCard;
