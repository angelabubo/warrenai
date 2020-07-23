import { withStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import Router from "next/router";
import clsx from "clsx";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { green } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleOutlineIcon from "@material-ui/icons/Check";

const GenericDialog = ({
  //Required
  open,
  btnDlgCancelName,
  btnDlgConfirmName,
  dlgTitle,
  confirmCallback, //Must return true for success and false otherwise
  onDlgCloseCallback,
  //Optional
  dlgFullWidth,
  btnStyle,
  children,
  classes,
  fullWidth,
  variant,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const initializeStates = () => {
    setLoading(false);
    setSuccess(false);
    setError(false);
    setErrorMsg("");
  };

  const handleClose = () => {
    //Call parent's handler when confirmation dialog completes
    if (onDlgCloseCallback) {
      onDlgCloseCallback();
    }

    initializeStates();
  };

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    setError(false);

    const result = await confirmCallback();

    if (result.error) {
      setSuccess(false);
      setLoading(false);
      setError(true);
      setErrorMsg(result.error);
    } else {
      // Change UI to show a success to your customer.
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        //Close the dialog and initialize states after the delay
        handleClose();
      }, 1000);
    }
  };

  return (
    <Fragment>
      <Dialog
        disableBackdropClick={loading}
        disableEscapeKeyDown={loading}
        open={open}
        onClose={handleClose}
        fullWidth={dlgFullWidth ? dlgFullWidth : true}
        PaperProps={{ classes: { root: classes.dialogPaper } }}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <div>
              <Typography variant="h6">{dlgTitle}</Typography>
            </div>
            <div>
              <IconButton
                edge="end"
                aria-label="close"
                onClick={handleClose}
                disabled={loading}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {children}
          {error && (
            <div className={classes.error}>
              <Typography variant="caption" align="center" gutterBottom={true}>
                {errorMsg}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions className={classes.dialogActionsSection}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            className={classes.yesButton}
            disabled={loading}
          >
            {btnDlgCancelName}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={
              success
                ? clsx(classes.yesButton, classes.yesSuccessButton)
                : clsx(classes.yesButton)
            }
            onClick={handleConfirm}
            disableFocusRipple={loading}
            disableRipple={loading}
            disableElevation={loading}
            disabled={loading}
          >
            {loading ? "Processing..." : success ? "" : btnDlgConfirmName}
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}

            <Slide
              timeout={{ enter: 250, exit: 250 }}
              direction="left"
              in={success}
              mountOnEnter
              unmountOnExit
            >
              <CheckCircleOutlineIcon
                id="check"
                size={30}
                className={classes.buttonCheck}
              />
            </Slide>
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

const styles = (theme) => ({
  dialogPaper: {
    backgroundColor: "white",
    maxWidth: "600px",
    minWidth: "500px",
    fontFamily: '"Montserrat", Helvetica, sans-serif',
  },
  dialogTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionPlan: {
    marginTop: 23,
    marginBottom: 15,
  },
  dialogActionsSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  yesButton: {
    height: 38,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    width: 250,
  },
  yesSuccessButton: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[500],
    },
  },
  buttonProgress: {
    color: "#26303e",
    position: "absolute",
    top: "50%",
    right: "3%",
    marginTop: -12,
    marginLeft: -12,
  },
  buttonCheck: {
    color: "#26303e",
    position: "absolute",
    top: "50%",
    right: "50%",
    marginTop: -10,
    marginLeft: -10,
  },
  error: {
    color: theme.palette.error.main,
    paddingTop: 13,
    textAlign: "center",
  },
});

export default withStyles(styles)(GenericDialog);
