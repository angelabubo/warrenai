import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import PriceList from "../../components/subscription/PriceList";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import VerticalTabMenu from "../../components/account_settings/VerticalTabMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const AccountSettings = (props) => {
  const classes = useStyles();
  return (
    <div>
      <NavDrawer {...props}>
        <h1>Account Settings</h1>
        <VerticalTabMenu {...props} />
      </NavDrawer>
    </div>
  );
};

AccountSettings.getInitialProps = authInitialProps(true);
export default AccountSettings;
