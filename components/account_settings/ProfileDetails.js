import React, { Fragment, useState } from "react";
import Router from "next/router";
import { withStyles } from "@material-ui/core";

import { updateProfile, updatePassword } from "../../lib/api";
import { signoutUser } from "../../lib/auth";

import ConfirmationDialog from "../ConfirmationDialog";

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
  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fName: user.fname ? user.fname : "",
    lName: user.lname ? user.lname : "",
  });
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
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
    setErrorFromServer("");
    setUpdatingDetails(true);

    //Call backend
    updateProfile(user.id, profile)
      .then((result) => {
        setTimeout(() => {
          Router.reload();
          setLoading(false);
          setUpdatingDetails(false);
        }, 800);
      })
      .catch((err) => {
        showError(err);
      });
  };

  const handleDeleteAccount = () => {
    //Call backend to delete user account record
    return true;
  };

  const handleDeleteComplete = () => {
    //Signout the user
    signoutUser();
  };

  const handleUpdatePassword = (evt) => {
    evt.preventDefault();

    setLoading(true);
    setErrorFromServer("");
    setChangingPassword(true);

    //Call backend
    updatePassword(user.id, password)
      .then((result) => {
        setTimeout(() => {
          setLoading(false);
          setChangingPassword(false);
          Router.reload();
        }, 1000);
      })
      .catch((err) => {
        showError(err);
      });
  };

  const showError = (err) => {
    const errorFromServer = (err.response && err.response.data) || err.message;
    setErrorFromServer(errorFromServer);
    setOpenError(true);

    setLoading(false);
    setUpdatingDetails(false);
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
            <ConfirmationDialog
              disabled={loading}
              btnName="Delete Account"
              variant="outlined"
              btnDlgCancelName="Cancel"
              btnDlgConfirmName="Confirm"
              dlgTitle="Confirm Delete of User Account"
              confirmCallback={handleDeleteAccount}
              onDlgCloseCallback={handleDeleteComplete}
              btnStyle={{ maxWidth: 185 }}
            >
              <div className={classes.deleteConfirmSection}>
                <Typography variant="body1" align="left" gutterBottom={true}>
                  Are you sure you want to delete your user account and
                  subscription (if applicable)?
                </Typography>
                <Typography
                  variant="body1"
                  align="left"
                  gutterBottom={true}
                  className={classes.deleteConfirmMessage}
                >
                  ⚠️ You will lose all your settings and portfolio data. This
                  action is not reversible.
                </Typography>
              </div>
            </ConfirmationDialog>
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
            />
          </FormControl>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="New Password"
              disabled={loading}
              name="newPassword"
              type="password"
              onChange={handleChangePassword}
              value={password.newPassword}
            />
          </FormControl>
          <FormControl margin="normal" fullWidth={true}>
            <TextField
              variant="outlined"
              size="small"
              label="Confirm New Password"
              disabled={loading}
              name="confirmNewPassword"
              type="password"
              onChange={handleChangePassword}
              value={password.confirmNewPassword}
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
  deleteConfirmSection: {
    paddingLeft: 30,
    paddingRight: 30,
  },
  deleteConfirmMessage: {
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 30,
    color: theme.palette.error.main,
  },
});
export default withStyles(styles)(ProfileDetails);
