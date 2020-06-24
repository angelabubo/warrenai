import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/NavDrawer";
import PriceList from "../../components/subscription/PriceList";

const PricingPlans = (props) => {
  return (
    <div>
      <NavDrawer {...props}>
        <PriceList {...props} />
      </NavDrawer>
    </div>
  );
};

PricingPlans.getInitialProps = authInitialProps(true);
export default PricingPlans;
