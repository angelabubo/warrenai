import { ListItem, withStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Link from "next/link";

const StyledListItem = withStyles({
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

const NavDrawerMenuItem = (props) => {
  const router = useRouter();
  const isCurrentPath =
    router.pathname === props.href || router.asPath === props.href;

  const handleMenuItemClick = (event) => {
    event.preventDefault();
    console.log("Menu Item Clicked");
  };

  return (
    <Fragment>
      {props.href ? (
        <Link href={props.href}>
          <StyledListItem selected={isCurrentPath} button>
            {props.children}
          </StyledListItem>
        </Link>
      ) : (
        <StyledListItem selected={isCurrentPath} button onClick={() => {}}>
          {props.children}
        </StyledListItem>
      )}
    </Fragment>
  );
};

export default NavDrawerMenuItem;
