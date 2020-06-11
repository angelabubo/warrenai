import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { signoutUser } from "../lib/auth";
import Link from "next/link";
import Brand from "../components/Brand";
import NavBarLink from "./NavBarLink";

import theme from "../pages/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    height: 40,
    margin: 10,
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    fontSize: "1.5rem",
  },
  ai: {
    color: "#437ff1",
  },
  signout: {
    width: "150px",
  },
}));

export default function NavBar({ auth }) {
  const { user = {} } = auth || {};

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Brand leftalign light />

          {user.id ? (
            //Authorized Navigation
            <Fragment>
              <NavBarLink href="/dashboard">Dashboard</NavBarLink>
              <Button
                color="inherit"
                onClick={signoutUser}
                className={classes.signout}
              >
                Sign Out
              </Button>
            </Fragment>
          ) : (
            //Unauthorized Navigation
            <Fragment>
              <NavBarLink href="/">About</NavBarLink>
              <NavBarLink href="/">Pricing</NavBarLink>
              <NavBarLink href="/">Contact</NavBarLink>

              <NavBarLink href="/signin">Sign In</NavBarLink>
              <NavBarLink href="/signup">Sign Up</NavBarLink>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
