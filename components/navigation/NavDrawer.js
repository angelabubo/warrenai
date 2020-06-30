import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { fade, makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Brand from "../Brand";
import { Grid } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import NavDrawerMenuItem from "./NavDrawerMenuItem";

import ListSubheader from "@material-ui/core/ListSubheader";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
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

import AccountMenu from "../AccountMenu";

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
  listItem: {
    color: "white",
    "&:hover": {
      backgroundColor: "#4f5969",
    },
  },
}));

const NavDrawer = ({ children, auth }) => {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openScanners, setOpenScanners] = useState(false);
  const [openScannersByPath, setOpenScannersByPath] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(false);
  const {
    user: { name },
  } = auth;

  const scannerMenus = [
    {
      primary: "WarrenAi Top Companies",
      href: "/scanners/warrenai-top-companies",
    },
    {
      primary: "Rank Companies by Sector",
      href: "/scanners/rank-companies-by-sector",
    },
    {
      primary: "Dividend Scanner",
      href: "/scanners/dividend",
    },
  ];

  const portfolioMenus = [
    {
      primary: "My Portfolio",
      href: "/portfolio/my-portfolio",
    },
    {
      primary: "My Watchlist",
      href: "/portfolio/my-watchlist",
    },
  ];

  const isCurrentHref = (objList) => {
    return objList.find((obj) => {
      if (router.pathname === obj.href || router.asPath === obj.href) {
        return true;
      }
    })
      ? true
      : false;
  };

  useEffect(() => {});
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
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  placeholder="Search…"
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
              <ChevronLeftIcon style={{ color: "white" }} />
            ) : (
              <ChevronRightIcon style={{ color: "white" }} />
            )}
          </IconButton>
        </div>
        <Divider />

        {/* Stock Research Tools */}
        <List
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              style={{ color: "white" }}
            >
              Stock Research Tools
            </ListSubheader>
          }
        >
          {/* My Dashboard */}
          <NavDrawerMenuItem href="/dashboard">
            <ListItemIcon>
              <TuneIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"My Dashboard"} />
          </NavDrawerMenuItem>

          {/* Scanners */}
          <ListItem
            button
            onClick={handleClickScanners}
            className={classes.listItem}
          >
            <ListItemIcon>
              <TrackChangesIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Scanners"} />
            {openScanners || isCurrentHref(scannerMenus) ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>
          <Collapse
            in={openScanners || isCurrentHref(scannerMenus)}
            timeout="auto"
          >
            <List component="div" disablePadding>
              {scannerMenus.map((menu, index) => {
                return (
                  <NavDrawerMenuItem key={index} href={menu.href}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={menu.primary} />
                  </NavDrawerMenuItem>
                );
              })}
            </List>
          </Collapse>

          {/* Portfolio */}
          <ListItem
            button
            onClick={handleClickPortfolio}
            className={classes.listItem}
          >
            <ListItemIcon>
              <BuildIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Portfolio"} />
            {openPortfolio || isCurrentHref(portfolioMenus) ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItem>
          <Collapse
            in={openPortfolio || isCurrentHref(portfolioMenus)}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {portfolioMenus.map((menu, index) => {
                return (
                  <NavDrawerMenuItem key={index} href={menu.href}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={menu.primary} />
                  </NavDrawerMenuItem>
                );
              })}
            </List>
          </Collapse>

          {/* Backtesting */}
          <NavDrawerMenuItem href="">
            <ListItemIcon>
              <FastRewindIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Backtesting"} />
          </NavDrawerMenuItem>

          {/* Learn */}
          <NavDrawerMenuItem href="">
            <ListItemIcon>
              <ImportContactsIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Learn"} />
          </NavDrawerMenuItem>
        </List>

        <Divider />

        {/* Support */}
        <List
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              style={{ color: "white" }}
            >
              Support
            </ListSubheader>
          }
        >
          {/* Frequently Asked Questions */}
          <NavDrawerMenuItem href="">
            <ListItemIcon>
              <PeopleAltOutlinedIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Frequently Asked Questions"} />
          </NavDrawerMenuItem>

          {/* Contact Us */}
          <NavDrawerMenuItem href="">
            <ListItemIcon>
              <ComputerIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary={"Contact Us"} />
          </NavDrawerMenuItem>
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
