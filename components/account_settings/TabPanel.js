import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import React from "react";
import { withStyles } from "@material-ui/core/styles";

const TabPanel = (props) => {
  const { children, value, index, title, classes, ...other } = props;

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item>
            <Typography variant="h6" align="left" gutterBottom>
              {title}
            </Typography>
            <Divider />
          </Grid>
          <Grid item>{children}</Grid>
        </Grid>
      )}
    </div>
  );
};

const styles = (theme) => ({
  tabPanel: {
    padding: "20px 35px",
  },
});

export default withStyles(styles)(TabPanel);
