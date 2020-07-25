import { authInitialProps } from "../lib/auth";
import NavDrawer from "../components/navigation/NavDrawer";
import Newspaper from "../components/Newspaper";

const Dashboard = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <Newspaper {...props} />
      </NavDrawer>
    </div>
  );
};

Dashboard.getInitialProps = authInitialProps(true);
export default Dashboard;
