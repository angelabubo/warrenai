import React from "react";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    color: "#26303e",
    padding: 20,
  },
});

const FAQ = ({ question, answer }) => {
  const classes = useStyles();
  return (
    <Paper variant="outlined" square className={classes.root} elevation={3}>
      <Typography variant="h5" gutterBottom component="p">
        {question}
      </Typography>
      <Typography align="justify" variant="body2" gutterBottom>
        {answer}
      </Typography>
    </Paper>
  );
};

export default FAQ;
