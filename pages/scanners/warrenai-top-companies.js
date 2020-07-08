import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import DashboardPane from "../../components/DashboardPane";
import { getWarrenAiTopCompaniesFromServer } from "../../lib/api";
import { useEffect, useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const WarrenAITopCo = (props) => {
  const { auth } = props;
  const [topCoList, setTopCoList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getWarrenAiTopCompaniesFromServer(auth.user.id).then((data) => {
      setTopCoList(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <NavDrawer {...props}>
        <h1>WARRENAI TOP Companies List</h1>
        {loading ? (
          <CircularProgress size={70} style={{ color: "#26303e" }} />
        ) : topCoList ? (
          topCoList.map((item, index) => {
            return <h1 key={index}>{item.name}</h1>;
          })
        ) : (
          <h1>
            You must be subscribed to WarrenAi Premium to view WarrenAi Top
            Companies.
          </h1>
        )}

        {/* <DashboardPane {...props} message="WARRENAI TOP Companies List" /> */}
      </NavDrawer>
    </div>
  );
};

WarrenAITopCo.getInitialProps = authInitialProps(true);
export default WarrenAITopCo;
