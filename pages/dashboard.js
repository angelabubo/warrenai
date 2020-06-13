import { authInitialProps } from "../lib/auth";
import NavDrawer from "../components/NavDrawer";
import DashboardPane from "../components/DashboardPane";
import { getDashboard } from "../lib/api";

const Dashboard = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <DashboardPane {...props} message="DASHBOARD" />
      </NavDrawer>
    </div>
  );
};

Dashboard.getInitialProps = authInitialProps(true, getDashboard);
export default Dashboard;
