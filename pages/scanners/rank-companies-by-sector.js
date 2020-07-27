import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";

const RankCoBySector = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <h1>"Rank Companies By Sector" </h1>
      </NavDrawer>
    </div>
  );
};

RankCoBySector.getInitialProps = authInitialProps(true);
export default RankCoBySector;
