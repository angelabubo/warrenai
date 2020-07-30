import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";

const MAX_CHAR = 150;
const useStyles = makeStyles({
  root: {
    backgroundColor: "#f4f6ff",
  },
  actionContainer: {
    color: "white",
    minHeight: 415,
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
  actionContainerNoData: {
    minHeight: 415,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  chipStyle: {
    marginTop: -30,
  },
  source: {
    width: 24,
    marginRight: 10,
    marginBottom: 8,
  },
});

export default function Slide(props) {
  const classes = useStyles();
  const { data } = props;

  if (data) {
    const logoSource = data.url
      .replace("http://", "")
      .replace("https://", "")
      .split(/[/?#]/)[0];

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
            {data.url && (
              <img
                className={classes.source}
                src={`https://logo.clearbit.com/${logoSource}`}
                alt="source"
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
          </div>
        </div>
      </Paper>
    );
  } else {
    return (
      <Paper variant="outlined" square className={classes.root} elevation={3}>
        <div className={classes.actionContainerNoData}>
          <div>
            <Typography
              align="center"
              gutterBottom
              variant="h5"
              component="h2"
              color="textSecondary"
            >
              <CircularProgress size={70} style={{ color: "#26303e" }} />
            </Typography>
          </div>
        </div>
      </Paper>
    );
  }
}
