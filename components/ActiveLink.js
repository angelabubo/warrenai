import { withRouter } from "next/router";
import { Fragment } from "react";

const ActiveLink = ({ router, href, children }) => {
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
    <Fragment>
      <a
        href={href}
        onClick={handleClick}
        style={{
          textDecoration: "none",
          margin: 0,
          padding: 10,
          // fontWeight: isCurrentPath ? "bold" : "normal",
          // color: isCurrentPath ? "#C62828" : "#fff",
          color: "#fff",
        }}
      >
        {children}
      </a>
    </Fragment>
  );
};

export default withRouter(ActiveLink);
