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

const ConfirmationDialog = ({
  //Required
  disabled,
  btnName,
  btnDlgCancelName,
  btnDlgConfirmName,
  dlgTitle,
  confirmCallback,
  //Optional
  onDlgCloseCallback,
  dlgFullWidth,
  btnStyle,
  children,
  classes,
  fullWidth,
  variant,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const initializeStates = () => {
    setLoading(false);
    setOpenDialog(false);
    setSuccess(false);
  };

  const handleClick = (evt) => {
    setOpenDialog(!openDialog);
  };

  const handleClose = () => {
    initializeStates();
  };

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);
    const result = await confirmCallback();
    // Change UI to show a success to your customer.
    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      //Close the dialog and initialize states after the delay
      handleClose();

      //Call parent's handler when confirmation dialog completes
      if (onDlgCloseCallback) {
        onDlgCloseCallback();
      }
    }, 5000);
  };

  return (
    <Fragment>
      <Button
        fullWidth={fullWidth ? fullWidth : true}
        variant={variant ? variant : "contained"}
        color="primary"
        onClick={handleClick}
        disabled={disabled}
        style={btnStyle ? btnStyle : {}}
      >
        {btnName}
      </Button>
      <Dialog
        disableBackdropClick={loading}
        disableEscapeKeyDown={loading}
        open={openDialog}
        onClose={handleClose}
        fullWidth={dlgFullWidth ? dlgFullWidth : true}
        PaperProps={{ classes: { root: classes.dialogPaper } }}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <div>
              <Typography variant="button">{dlgTitle}</Typography>
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
        <DialogContent>{children}</DialogContent>
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
});

export default withStyles(styles)(ConfirmationDialog);
