import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import PortfolioTable from "../../components/portfolio/PortfolioTable";

const MyPortfolio = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <PortfolioTable {...props} />
      </NavDrawer>
    </div>
  );
};

MyPortfolio.getInitialProps = authInitialProps(true);
export default MyPortfolio;
