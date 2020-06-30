import { authInitialProps } from "../lib/auth";
import NavDrawer from "../components/navigation/NavDrawer";
import DashboardPane from "../components/DashboardPane";

const Dashboard = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <DashboardPane {...props} message="DASHBOARD" />
      </NavDrawer>
    </div>
  );
};

Dashboard.getInitialProps = authInitialProps(true);
export default Dashboard;
