import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import DashboardPane from "../../components/DashboardPane";

const RankCoBySector = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <DashboardPane {...props} message="Rank Companies By Sector" />
      </NavDrawer>
    </div>
  );
};

RankCoBySector.getInitialProps = authInitialProps(true);
export default RankCoBySector;
