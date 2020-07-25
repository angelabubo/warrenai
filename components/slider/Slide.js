import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Chip from "@material-ui/core/Chip";
const MAX_CHAR = 150;
const useStyles = makeStyles({
  root: {
    backgroundColor: "#f4f6ff",
  },
  actionContainer: {
    color: "white",
    minHeight: 350,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#363636",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  chipStyle: {
    fontSize: "0.75rem",
    height: 18,
    marginRight: 10,
    paddingTop: 2,
  },
});

export default function Slide(props) {
  const { data } = props;
  const classes = useStyles();

  return (
    <Paper variant="outlined" square className={classes.root} elevation={3}>
      <div
        className={classes.actionContainer}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,1)), url(${
            data && data.image
          })`,
        }}
      >
        <div>
          <Typography align="left" gutterBottom variant="h5" component="h2">
            <Link target="_blank" href={data && data.url} color="inherit">
              {data && data.headline}
            </Link>
          </Typography>
        </div>
        <div>
          <Typography align="left" variant="body2" component="p" gutterBottom>
            {data &&
              (data.summary.length > MAX_CHAR
                ? data.summary.substring(0, MAX_CHAR) + " ..."
                : data.summary)}
          </Typography>
        </div>
        <div>
          <Typography
            align="right"
            variant="caption"
            component="p"
            gutterBottom
          >
            {data.source && (
              <Chip
                className={classes.chipStyle}
                label={data.source}
                color="primary"
                size="small"
                style={{}}
              />
            )}
            {data.category && (
              <Chip
                className={classes.chipStyle}
                label={data.category}
                color="secondary"
                size="small"
              />
            )}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}
