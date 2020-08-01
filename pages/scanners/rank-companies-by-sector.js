import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import RankBySectorTable from "../../components/scanners/RankBySectorTable";

const RankCoBySector = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <RankBySectorTable {...props} />
      </NavDrawer>
    </div>
  );
};

RankCoBySector.getInitialProps = authInitialProps(true);
export default RankCoBySector;
