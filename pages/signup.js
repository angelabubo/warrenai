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
import { signupUser } from "../lib/auth";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import Router from "next/router";
import Brand from "../components/Brand";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import { Fragment } from "react";
import { Grid } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Signup() {
  const classes = useStyles();
  const theme = useTheme();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [createdUser, setCreatedUser] = useState("");

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

    signupUser(user)
      .then((createdUser) => {
        console.log(createdUser);
        setOpenSuccess(true);
        setCreatedUser(createdUser);
        setError("");
        setIsLoading(false);
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

  const handleSignInClick = (evt) => {
    evt.preventDefault();
    setError("");
    Router.push("/signin");
  };

  const handleClose = () => setOpenError(false);

  const [openSuccess, setOpenSuccess] = useState(false);

  return (
    <Fragment>
      <Container maxWidth={false} className={classes.container}>
        <Grid container direction="column" justify="center" alignItems="center">
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <Brand />
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                className={classes.buttongroup}
              >
                <Button variant="outlined" onClick={handleSignInClick}>
                  Sign In
                </Button>
                <Button variant="contained">Sign Up</Button>
              </ButtonGroup>
              <form onSubmit={handleSubmit} className={classes.form}>
                <FormControl margin="normal" fullWidth={true}>
                  <InputLabel>Name</InputLabel>
                  <Input
                    name="name"
                    type="text"
                    onChange={handleChange}
                    placeholder="e.g. John"
                    value={user.name}
                  />
                </FormControl>
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
                  fullWidth={true}
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  className={classes.submit}
                >
                  {isLoading ? "Signing up..." : "Sign up"}
                </Button>

                <Typography
                  variant="subtitle2"
                  className={classes.tosContainer}
                  align="center"
                >
                  By using WarrenAi you are agreeing to our{" "}
                  <span className={classes.tos}>Terms of Service</span>.
                  WarrenAi provides general investment advice only.
                </Typography>
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

            {/* Success Dialog */}
            <Dialog
              open={openSuccess}
              disableBackdropClick={true}
              TransitionComponent={Transition}
            >
              <DialogTitle>New Account</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  User {createdUser} successfully created!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="primary" variant="contained">
                  <Link href="/signin">
                    <a className={classes.signinLink}>Signin</a>
                  </Link>
                </Button>
              </DialogActions>
            </Dialog>
          </div>
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
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(5),
  },
  buttongroup: {
    marginTop: theme.spacing(3),
  },
  signinLink: {
    textDecoration: "none",
    color: "white",
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
  tosContainer: {
    marginTop: theme.spacing(3),
    fontSize: "1rem",
  },
  tos: {
    color: "#437ff1",
  },
}));

export default Signup;
