import { withRouter } from "next/router";
import { MenuItem } from "@material-ui/core";
import { useState } from "react";

const NavItem = ({ router, href, children }) => {
  const [isSelected, setIsSelected] = useState(false);
  //Self Executing Function
  (function prefetchPages() {
    if (typeof window !== "undefined") {
      router.prefetch(router.pathname);
    }
  })();

  const handleClick = (event) => {
    event.preventDefault();
    router.push(href);
  };

  const isCurrentPath = router.pathname === href || router.asPath === href;

  return (
    <div>
      <MenuItem button onClick={handleClick} selected={1}>
        {children}
      </MenuItem>
    </div>
  );
};

export default withRouter(NavItem);
