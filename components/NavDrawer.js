import { useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import ListSubheader from "@material-ui/core/ListSubheader";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import DashboardPane from "./DashboardPane";
import NavLink from "./NavLink";
import NavItem from "./NavItem";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TuneIcon from "@material-ui/icons/Tune";
import TrackChangesIcon from "@material-ui/icons/TrackChanges";
import BuildIcon from "@material-ui/icons/Build";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import ImportContactsIcon from "@material-ui/icons/ImportContacts";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ComputerIcon from "@material-ui/icons/Computer";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const NavDrawer = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openScanners, setOpenScanners] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClickScanners = () => {
    setOpenScanners(!openScanners);
  };

  const handleClickPortfolio = () => {
    setOpenPortfolio(!openPortfolio);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />

        {/* Stock Research Tools */}
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Stock Research Tools
            </ListSubheader>
          }
        >
          {/* My Dashboard */}
          <ListItem button key={"My Dashboard"}>
            <ListItemIcon>
              <TuneIcon />
            </ListItemIcon>
            <NavLink href="/dashboard">
              <ListItemText primary={"My Dashboard"} />
            </NavLink>
          </ListItem>

          {/* Scanners */}
          <ListItem button onClick={handleClickScanners}>
            <ListItemIcon>
              <TrackChangesIcon />
            </ListItemIcon>
            <ListItemText primary={"Scanners"} />
            {openScanners ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openScanners} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button>
                <ListItemIcon></ListItemIcon>
                <NavLink href="/scanners/warrenai-top-companies">
                  <ListItemText primary="WarrenAi Top Companies" />
                </NavLink>
              </ListItem>

              <ListItem button>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary="Rank Companies by Sector" />
              </ListItem>
              <ListItem button>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary="Dividend Scanner" />
              </ListItem>
            </List>
          </Collapse>

          {/* Portfolio */}
          <ListItem button onClick={handleClickPortfolio}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary={"Portfolio"} />
            {openPortfolio ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openPortfolio} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary="My Portfolio" />
              </ListItem>
              <ListItem button>
                <ListItemIcon></ListItemIcon>
                <ListItemText primary="My Watchlist" />
              </ListItem>
            </List>
          </Collapse>

          {/* Backtesting */}
          <ListItem button key={"Backtesting"}>
            <ListItemIcon>
              <FastRewindIcon />
            </ListItemIcon>
            <ListItemText primary={"Backtesting"} />
          </ListItem>

          {/* Learn */}
          <ListItem button key={"Learn"}>
            <ListItemIcon>
              <ImportContactsIcon />
            </ListItemIcon>
            <ListItemText primary={"Learn"} />
          </ListItem>
        </List>

        <Divider />

        {/* Support */}
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Support
            </ListSubheader>
          }
        >
          {/* Frequently Asked Questions */}
          <ListItem button key={"Frequently Asked Questions"}>
            <ListItemIcon>
              <PeopleAltOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Frequently Asked Questions"} />
          </ListItem>

          {/* Contact Us */}
          <ListItem button key={"Contact Us"}>
            <ListItemIcon>
              <ComputerIcon />
            </ListItemIcon>
            <ListItemText primary={"Contact Us"} />
          </ListItem>
        </List>
      </Drawer>

      <div className={classes.drawerHeader} />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {/* {Content Pane} */}
        {children}
      </main>
    </div>
  );
};

export default NavDrawer;
