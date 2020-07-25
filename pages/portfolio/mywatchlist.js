import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import WatchlistTable from "../../components/portfolio/WatchlistTable";

const MyWatchlist = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <WatchlistTable {...props} />
      </NavDrawer>
    </div>
  );
};

MyWatchlist.getInitialProps = authInitialProps(true);
export default MyWatchlist;
