import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabPanel from "./TabPanel";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core";

import PlanDetails from "./PlanDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    minHeight: 300,
    maxWidth: 880,
  },
  tabs: {
    borderRight: `0px solid ${theme.palette.divider}`,
  },
}));

const StyledTab = withStyles({
  root: {},
  wrapper: {
    alignItems: "flex-start",
  },
})(Tab);

const StyledTabs = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    maxWidth: 130,
  },
  indicator: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
  },
}))(Tabs);

const VerticalTabMenu = (props) => {
  const userId = props.auth.user.id;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <StyledTabs
        selectionFollowsFocus
        orientation="vertical"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
        indicatorColor="primary"
      >
        <StyledTab label="Profile" id="vertical-tab-profile" />
        <StyledTab label="Plan" id="vertical-tab-plan" />
        <StyledTab label="Billing" id="vertical-tab-billing" />
      </StyledTabs>
      <TabPanel title="Profile Details" value={value} index={0}>
        Profile
      </TabPanel>
      <TabPanel title="Plan Details" value={value} index={1}>
        <PlanDetails userId={userId} />
      </TabPanel>
      <TabPanel title="Billing Details" value={value} index={2}>
        Billing
      </TabPanel>
    </div>
  );
};

export default VerticalTabMenu;
