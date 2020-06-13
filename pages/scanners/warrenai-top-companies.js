import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/NavDrawer";
import DashboardPane from "../../components/DashboardPane";

const WarrenAITopCo = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <DashboardPane {...props} message="WARRENAI TOP Companies List" />
      </NavDrawer>
    </div>
  );
};

WarrenAITopCo.getInitialProps = authInitialProps(true);
export default WarrenAITopCo;
