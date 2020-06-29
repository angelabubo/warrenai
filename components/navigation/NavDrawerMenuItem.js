import { ListItem, withStyles } from "@material-ui/core";

const NavDrawerMenuItem = withStyles({
  root: {
    color: "white",
    "&:hover": {
      backgroundColor: "#4f5969",
    },
    "&$selected, &$selected:hover": {
      backgroundColor: "#4f5969",
    },
  },

  selected: {},
})(ListItem);

export default NavDrawerMenuItem;
