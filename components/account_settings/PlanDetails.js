import React, { Fragment, useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Router from "next/router";
import { getUserPlan, cancelSubscription } from "../../lib/api";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CheckIcon from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleOutlineIcon from "@material-ui/icons/Check";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { green } from "@material-ui/core/colors";

const PlanDetails = (props) => {
  const classes = props.classes;
  const userId = props.auth.user.id;
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [processingCancel, setProcessingCancel] = useState(false);
  const [success, setSuccess] = useState(false);

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const handleChangePlanBtnClick = () => {
    Router.push("/account/pricingplans");
  };

  const initializeCancelDialogStates = () => {
    setOpenCancelDialog(false);
    setProcessingCancel(false);
    setSuccess(false);
  };

  const handleCancelSubscriptionBtnClick = () => {
    setOpenCancelDialog(true);
  };

  useEffect(() => {
    setLoading(true);
    getUserPlan(userId).then((data) => {
      if (data) {
        setPlan(data);
      }
      setLoading(false);
    });
  }, [refresh]);

  //Cancel Subscription Dialog
  const handleClose = () => {
    initializeCancelDialogStates();
  };

  const handleSubmitCancel = async () => {
    if (processingCancel) return;

    setProcessingCancel(true);
    cancelSubscription(userId).then((data) => {
      // Change your UI to show a success to your customer.
      setSuccess(true);
      setProcessingCancel(false);

      setTimeout(() => {
        //Close the dialog and initialize states after the delay
        handleClose();

        //Trigger update of Plan Details panel
        setRefresh(!refresh);
      }, 2000);
    });
  };
  return (
    <Fragment>
      {loading ? (
        <CircularProgress size={70} className={classes.panelLoading} />
      ) : (
        <Grid container direction="row" justify="space-between" spacing={2}>
          <Grid item>
            <Grid
              container
              direction="column"
              justify="space-between"
              alignContent="flex-start"
              className={classes.colContainer}
              spacing={3}
              wrap="nowrap"
            >
              <Grid item>
                <Typography variant="subtitle1" align="left">
                  Your plan:
                </Typography>
                <Typography
                  variant="h5"
                  align="left"
                  style={{ fontWeight: "bold" }}
                >
                  {plan.name}
                </Typography>
                <Typography color="textSecondary" align="left">
                  {plan.unitprice
                    ? `$${plan.unitprice / 100} ${plan.recurring}`
                    : "Free"}
                </Typography>
                <Typography variant="caption" color="error" align="left">
                  <div className={classes.cancelMessage}>
                    {plan.cancelMessage ? plan.cancelMessage : ""}
                  </div>
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  className={classes.btn}
                  fullWidth={true}
                  variant="contained"
                  color="primary"
                  onClick={handleChangePlanBtnClick}
                >
                  Change Plan
                </Button>
                <Fragment>
                  <Button
                    fullWidth={true}
                    variant="outlined"
                    color="primary"
                    onClick={handleCancelSubscriptionBtnClick}
                    disabled={!plan.cancelSubBtn}
                  >
                    Cancel Subscription
                  </Button>
                  <Dialog
                    disableBackdropClick={processingCancel}
                    disableEscapeKeyDown={processingCancel}
                    open={openCancelDialog}
                    onClose={handleClose}
                    fullWidth={true}
                    PaperProps={{ classes: { root: classes.dialogPaper } }}
                  >
                    <DialogTitle>
                      <div className={classes.dialogTitle}>
                        <div>
                          <Typography variant="button">
                            Cancel Subscription
                          </Typography>
                        </div>
                        <div>
                          <IconButton
                            edge="end"
                            aria-label="close"
                            onClick={handleClose}
                            disabled={processingCancel}
                          >
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </div>
                    </DialogTitle>
                    <DialogContent>
                      <Typography
                        variant="body1"
                        align="left"
                        gutterBottom={true}
                      >
                        Are you sure you want to cancel your current
                        Subscription?
                      </Typography>
                      <div className={classes.sectionPlan}>
                        <Typography variant="h6" align="center">
                          {plan.name}
                        </Typography>
                        <Typography variant="h3" align="center">
                          {plan.unitprice ? `$${plan.unitprice / 100}` : "Free"}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          align="center"
                          gutterBottom
                        >
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
                        disabled={processingCancel}
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
                        onClick={handleSubmitCancel}
                        disableFocusRipple={processingCancel}
                        disableRipple={processingCancel}
                        disableElevation={processingCancel}
                        disabled={processingCancel}
                      >
                        {processingCancel
                          ? "Processing..."
                          : success
                          ? ""
                          : "Cancel my subscription"}
                        {processingCancel && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
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
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Typography
              variant="subtitle1"
              align="left"
              style={{ paddingLeft: 16 }}
            >
              You have access to:
            </Typography>
            <List>
              {plan &&
                plan.inclusions.map((inclusion, index) => (
                  <ListItem key={index} dense={true}>
                    <ListItemIcon className={classes.list_icon}>
                      <CheckIcon />
                    </ListItemIcon>
                    <ListItemText primary={inclusion.feature} />
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

const styles = (theme) => ({
  list_icon: {
    minWidth: 35,
  },
  colContainer: {
    height: "100%",
  },
  cancelMessage: {
    maxWidth: "325px",
  },
  btn: {
    marginBottom: 10,
  },
  dialogPaper: {
    // backgroundColor: "#f4f6ff",
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
  label: {
    fontWeight: 500,
    fontSmoothing: "antialiased",
    fontFamily: '"Montserrat", Helvetica, sans-serif',
    fontSize: "16px",
    // color: "#424770",
    // letterSpacing: "0.025em",
    marginBottom: 7,
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
  panelLoading: {
    color: "#26303e",
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

export default withStyles(styles)(PlanDetails);
