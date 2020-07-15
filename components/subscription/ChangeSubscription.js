import { withStyles } from "@material-ui/core/styles";
import React, { Fragment, useState } from "react";
import Router from "next/router";
import clsx from "clsx";

import { changeSubscription } from "../../lib/api";

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

const ChangeSubscription = ({ classes, auth, plan, isDisabled, btnName }) => {
  const userId = auth.user.id;

  const [openDialog, setOpenDialog] = useState(false);
  const [isChangingSubscription, setIsChangingSubscription] = useState(false);
  const [success, setSuccess] = useState(false);

  const initializeStates = () => {
    setIsChangingSubscription(false);
    setOpenDialog(false);
    setSuccess(false);
  };

  const handleChangePlan = (evt) => {
    setOpenDialog(!openDialog);
  };

  const handleClose = () => {
    initializeStates();
  };

  const handleYesChangePlan = async () => {
    if (isChangingSubscription) return;

    setIsChangingSubscription(true);
    changeSubscription(userId, plan.id).then((data) => {
      // Change your UI to show a success to your customer.
      setSuccess(true);
      setIsChangingSubscription(false);

      setTimeout(() => {
        //Close the dialog and initialize states after the delay
        handleClose();

        //Display Account Settings Page, Plan Details tab
        Router.replace("/account/settings/1");
      }, 1000);
    });
  };

  return (
    <Fragment>
      <Button
        fullWidth={true}
        variant="contained"
        color="primary"
        onClick={handleChangePlan}
        disabled={isDisabled}
      >
        {btnName}
      </Button>
      <Dialog
        disableBackdropClick={isChangingSubscription}
        disableEscapeKeyDown={isChangingSubscription}
        open={openDialog}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{ classes: { root: classes.dialogPaper } }}
      >
        <DialogTitle>
          <div className={classes.dialogTitle}>
            <div>
              <Typography variant="button">Change Subscription Plan</Typography>
            </div>
            <div>
              <IconButton
                edge="end"
                aria-label="close"
                onClick={handleClose}
                disabled={isChangingSubscription}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="left" gutterBottom={true}>
            Are you sure you want to change your current subscription plan to
            the following?
          </Typography>
          <div className={classes.sectionPlan}>
            <Typography variant="h6" align="center">
              {plan.name}
            </Typography>
            <Typography variant="h3" align="center">
              {plan.unitprice ? `$${plan.unitprice / 100}` : "Free"}
            </Typography>
            <Typography color="textSecondary" align="center" gutterBottom>
              {plan.recurring}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions className={classes.dialogActionsSection}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            className={classes.yesButton}
            disabled={isChangingSubscription}
          >
            NO
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={
              success
                ? clsx(classes.yesButton, classes.yesSuccessButton)
                : clsx(classes.yesButton)
            }
            onClick={handleYesChangePlan}
            disableFocusRipple={isChangingSubscription}
            disableRipple={isChangingSubscription}
            disableElevation={isChangingSubscription}
            disabled={isChangingSubscription}
          >
            {isChangingSubscription
              ? "Processing..."
              : success
              ? ""
              : "Change my subscription"}
            {isChangingSubscription && (
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

export default withStyles(styles)(ChangeSubscription);
