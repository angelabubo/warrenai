import TextField from "@material-ui/core/TextField";
import {
  Typography,
  FormControl,
  Paper,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { authInitialProps } from "../lib/auth";
import { useState } from "react";
import { sendFeedback } from "../lib/api";
import Button from "@material-ui/core/Button";
import Slide from "@material-ui/core/Slide";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Brand from "../components/Brand";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Container from "@material-ui/core/Container";
import { Fragment } from "react";
import { Grid } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const base_url = "http://localhost:3000";

const DialogTitle = (props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.rootDlg} {...other}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h6" display="inline">
            {children}
          </Typography>
        </Grid>
        <Grid item>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Grid>
      </Grid>
    </MuiDialogTitle>
  );
};

const Contact = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [message, setMessage] = useState({
    email: "",
    content: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleClose = () => {
    location.replace("/");
    setOpenSuccess(false);
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setMessage((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    setIsLoading(true);

    sendFeedback(message)
      .then(() => {
        setMessage({
          email: "",
          content: "",
        });
        setIsLoading(false);
        setOpenSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage({
          email: "",
          content: "",
        });
        setIsLoading(false);
        setOpenSuccess(true);
      });
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

                <div className={classes.headings}>
                  <Typography
                    align="center"
                    variant="h4"
                    gutterBottom
                    component="p"
                  >
                    <strong>Contact Us</strong>
                  </Typography>
                  <Typography align="justify" variant="body1" gutterBottom>
                    Please enter your email address and your message and we will
                    get back to you as soon as possible.
                  </Typography>
                </div>

                <form onSubmit={handleSubmit} className={classes.form}>
                  <FormControl margin="normal" fullWidth={true}>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Email"
                      name="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="e.g. john@gmail.com"
                      value={message.email}
                    />
                  </FormControl>
                  <FormControl margin="normal" fullWidth={true}>
                    <TextField
                      id="outlined-multiline-static"
                      variant="outlined"
                      size="small"
                      label="Message"
                      placeholder="How can we help?"
                      name="content"
                      onChange={handleChange}
                      value={message.content}
                      multiline
                      rows={5}
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
                    {isLoading ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              </Paper>
            </div>
          </Grid>
        </Grid>

        {/* Success Dialog */}
        <Dialog
          open={openSuccess}
          TransitionComponent={Transition}
          style={{ minWidth: 350, minHeight: 250 }}
          onClose={handleClose}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            classes
          >
            Contact Us
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thank you for your feedback! Have a great day!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  rootDlg: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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
  headings: {
    paddingTop: 20,
  },
}));

export default Contact;
