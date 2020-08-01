import ActiveLink from "./ActiveLink";
import Typography from "@material-ui/core/Typography";

export default ({ href, children }) => {
  return (
    <div style={{ color: "inherit" }}>
      <ActiveLink href={href}>
        <Typography variant="button" noWrap={true}>
          {children}
        </Typography>
      </ActiveLink>
    </div>
  );
};
