import { checkNotAuth } from "../lib/auth";
import {
  Typography,
  FormControl,
  InputLabel,
  Input,
  Paper,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Link from "next/link";
import { useState } from "react";
import { signinUser } from "../lib/auth";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Router from "next/router";
import Brand from "../components/Brand";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import { Fragment } from "react";
import { Grid } from "@material-ui/core";

function Signin() {
  const classes = useStyles();
  const theme = useTheme();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [openError, setOpenError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setUser((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    setIsLoading(true);
    setError("");

    signinUser(user)
      .then(() => {
        Router.push("/dashboard");
      })
      .catch((err) => {
        showError(err);
      });
  };

  const showError = (err) => {
    const errorFromServer = (err.response && err.response.data) || err.message;
    setError(errorFromServer);
    setOpenError(true);
    setIsLoading(false);
  };

  const handleClose = () => setOpenError(false);

  const handleSignUpClick = (evt) => {
    evt.preventDefault();
    setError("");
    Router.push("/signup");
  };

  return (
    <Fragment>
      <Container maxWidth={false} className={classes.container}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <div className={classes.root}>
              <Paper
                className={classes.paper}
                square
                variant="elevation"
                elevation={5}
              >
                <Brand />
                <ButtonGroup
                  color="primary"
                  aria-label="outlined primary button group"
                  className={classes.buttongroup}
                >
                  <Button variant="contained">Sign In</Button>
                  <Button variant="outlined" onClick={handleSignUpClick}>
                    Sign Up
                  </Button>
                </ButtonGroup>
                <form onSubmit={handleSubmit} className={classes.form}>
                  <FormControl margin="normal" fullWidth={true}>
                    <InputLabel>Email</InputLabel>
                    <Input
                      name="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="e.g. john@gmail.com"
                      value={user.email}
                    />
                  </FormControl>
                  <FormControl margin="normal" fullWidth={true}>
                    <InputLabel>Password</InputLabel>
                    <Input
                      name="password"
                      type="password"
                      onChange={handleChange}
                      placeholder="●●●●●●●●"
                      value={user.password}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    className={classes.submit}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                {/* Error Snackbar */}
                {error && (
                  <Snackbar
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={openError}
                    onClose={handleClose}
                    autoHideDuration={5000}
                    message={<span className={classes.snack}>{error}</span>}
                  />
                )}
              </Paper>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  container: {
    backgroundImage: `url(${"/img/citybackground.jpg"})`,
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(5),
  },
  buttongroup: {
    marginTop: theme.spacing(3),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  snack: {
    color: theme.palette.error.main,
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green",
  },
}));

Signin.getInitialProps = checkNotAuth;
export default Signin;
