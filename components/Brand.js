import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { Fragment } from "react";
import { Grid } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  logo: {
    height: 25,
  },
  linkdark: {
    textDecoration: "none",
    color: "#212529",
    fontSize: "1.5rem",
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  linklight: {
    textDecoration: "none",
    color: "#f5f5ff",
    fontSize: "1.5rem",
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  ai: {
    color: "#437ff1",
  },
}));

export default (props) => {
  const classes = useStyle();
  return (
    <Fragment>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify={props.leftalign ? "flex-start" : "center"}
        spacing={1}
      >
        <Grid item>
          <img src="/img/warrenai-logo.png" className={classes.logo} />
        </Grid>
        <Grid item>
          <Link href="/">
            <a className={props.light ? classes.linklight : classes.linkdark}>
              Warren<span className={classes.ai}>AI</span>
            </a>
          </Link>
        </Grid>
      </Grid>
    </Fragment>
  );
};
