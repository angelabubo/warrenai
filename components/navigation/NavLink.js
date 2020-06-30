import { withRouter } from "next/router";

const NavLink = ({ router, href, children }) => {
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

  return (

    <a
      href={href}
      onClick={handleClick}
      style={{
        textDecoration: "none",
        margin: 0,
        padding: 0,
        //   fontWeight: isCurrentPath ? "bold" : "normal",
        color: "inherit",
      }}
    >
      {children}
    </a>

  );
};

export default withRouter(NavLink);
