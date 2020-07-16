import React, { Fragment, useState } from "react";
import Router from "next/router";
import { withStyles } from "@material-ui/core";

import { updateProfile } from "../../lib/api";

import { FormControl, Snackbar } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const ProfileDetails = ({ classes, auth }) => {
  const user = auth.user;

  const [errorFromServer, setErrorFromServer] = useState("");
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState({
    error: "",
    oldPasswordError: "",
    newPasswordError: "",
    confirmNewPasswordError: "",
  });
  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fName: user.fname ? user.fname : "",
    lName: user.lname ? user.lname : "",
  });
  const [password, setPassword] = useState({
    oldPassword: "randompassword",
    password: "randompassword",
    confirmPassword: "randompassword",
  });

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setProfile((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleChangePassword = (evt) => {
    const { name, value } = evt.target;

    setPassword((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  };

  const handleUpdateDetails = (evt) => {
    evt.preventDefault();

    setLoading(true);
    setError((prev) => {
      return {
        ...prev,
        error: "",
      };
    });
    setErrorFromServer("");
    setUpdatingDetails(true);

    //Call backend
    updateProfile(user.id, profile)
      .then((result) => {
        setTimeout(() => {
          setLoading(false);
          setUpdatingDetails(false);
          Router.reload();
        }, 1000);
      })
      .catch((err) => {
        showError(err);
      });
  };

  const handleDeleteAccount = (evt) => {
    //Should display a confirmation dialog
    evt.preventDefault();

    setLoading(true);
    setError((prev) => {
      return {
        ...prev,
        error: "",
      };
    });
    setDeleting(true);

    //Call backend
    setTimeout(() => {
      setLoading(false);
      setDeleting(false);
    }, 5000);
  };

  const handleUpdatePassword = (evt) => {
    evt.preventDefault();

    setLoading(true);
    setError((prev) => {
      return {
        ...prev,
        oldPasswordError: "",
        newPasswordError: "",
        confirmNewPasswordError: "",
      };
    });
    setChangingPassword(true);

    //Call backend
    setTimeout(() => {
      setLoading(false);
      setChangingPassword(false);
    }, 5000);
  };

  const showError = (err) => {
    const errorFromServer = (err.response && err.response.data) || err.message;
    setErrorFromServer(errorFromServer);
    setOpenError(true);

    setLoading(false);
    setUpdatingDetails(false);
    setDeleting(false);
    setChangingPassword(false);
  };

  const handleCloseError = () => setOpenError(false);

  return (
    <Fragment>
      <div className={classes.profile}>
        <form onSubmit={handleUpdateDetails} className={classes.form}>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              label="Email"
              id="email"
              variant="outlined"
              size="small"
              readOnly={true}
              disabled={true}
              name="email"
              type="email"
              onChange={handleChange}
              value={user.email}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="First Name"
              id="fname"
              disabled={loading}
              name="fName"
              type="text"
              onChange={handleChange}
              value={profile.fName}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="Last Name"
              id="lname"
              disabled={loading}
              name="lName"
              type="text"
              onChange={handleChange}
              value={profile.lName}
            />
          </FormControl>

          <div className={classes.profileActions}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.btn}
            >
              {updatingDetails ? "Updating..." : "Update Details"}
              {updatingDetails && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="primary"
              disabled={loading}
              className={classes.btn}
              onClick={handleDeleteAccount}
            >
              {deleting ? "Deleting..." : "Delete Account"}
              {deleting && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          </div>
        </form>
      </div>
      <div className={classes.changePassword}>
        <div className={classes.changeHeading}>
          <Typography variant="h6" align="left" gutterBottom>
            Change Password
          </Typography>
          <Divider variant="fullWidth" />
        </div>

        <form onSubmit={handleUpdatePassword} className={classes.profile}>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="Old Password"
              disabled={loading}
              name="oldPassword"
              type="password"
              onChange={handleChangePassword}
              value={password.oldPassword}
              error={error.oldPasswordError === "" ? false : true}
              helperText={error.oldPasswordError}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="New Password"
              disabled={loading}
              name="password"
              type="password"
              onChange={handleChangePassword}
              value={password.password}
              error={error.newPasswordError === "" ? false : true}
              helperText={error.newPasswordError}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="Confirm New Password"
              disabled={loading}
              name="confirmPassword"
              type="password"
              onChange={handleChangePassword}
              value={password.confirmPassword}
              error={error.confirmNewPasswordError === "" ? false : true}
              helperText={error.confirmNewPasswordError}
            />
          </FormControl>
          <div className={classes.profileActions}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.btn}
            >
              {changingPassword ? "Changing..." : "Change Password"}
              {changingPassword && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </Button>
          </div>
        </form>
      </div>
      {/* Error Snackbar */}
      {errorFromServer && (
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={openError}
          onClose={handleCloseError}
          autoHideDuration={5000}
          message={
            <span className={classes.snackMessage}>{errorFromServer}</span>
          }
        />
      )}
    </Fragment>
  );
};

const styles = (theme) => ({
  profile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    maxWidth: 400,
  },
  profileActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  btn: {
    maxWidth: 185,
  },
  buttonProgress: {
    color: "#26303e",
    position: "absolute",
    top: "50%",
    right: "3%",
    marginTop: -12,
    marginLeft: -12,
  },
  changePassword: {
    marginTop: 20,
  },
  changeHeading: {
    marginBottom: 15,
  },
  snackMessage: {
    color: theme.palette.error.main,
  },
});
export default withStyles(styles)(ProfileDetails);
