import { useState } from "react";
import clsx from "clsx";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Brand from "./Brand";
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
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
import InputBase from "@material-ui/core/InputBase";

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
import SearchIcon from "@material-ui/icons/Search";

import AccountMenu from "./AccountMenu";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "secondary",
  },
  appBar: {
    backgroundColor: "#fff",
    color: "black",
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
    backgroundColor: "#26303e",
    color: "#fff",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
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
  brand: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: 0, //theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const NavDrawer = ({ children, auth }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openScanners, setOpenScanners] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const {
    user: { name },
  } = auth;

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
          <Grid
            container
            direction="row"
            alignItems="center"
            justify="space-between"
          >
            <Grid item>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            </Grid>
            <Grid item>
              <AccountMenu userName={name} />
            </Grid>
          </Grid>
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
          <span className={classes.brand}>
            <Brand light />
          </span>
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
              <TuneIcon color="secondary" />
            </ListItemIcon>
            <NavLink href="/dashboard">
              <ListItemText primary={"My Dashboard"} />
            </NavLink>
          </ListItem>

          {/* Scanners */}
          <ListItem button onClick={handleClickScanners}>
            <ListItemIcon>
              <TrackChangesIcon color="secondary" />
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
              <BuildIcon color="secondary" />
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
              <FastRewindIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Backtesting"} />
          </ListItem>

          {/* Learn */}
          <ListItem button key={"Learn"}>
            <ListItemIcon>
              <ImportContactsIcon color="secondary" />
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
              <PeopleAltOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Frequently Asked Questions"} />
          </ListItem>

          {/* Contact Us */}
          <ListItem button key={"Contact Us"}>
            <ListItemIcon>
              <ComputerIcon color="secondary" />
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
