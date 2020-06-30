import { authInitialProps } from "../../lib/auth";
import NavDrawer from "../../components/navigation/NavDrawer";
import DashboardPane from "../../components/DashboardPane";
import { getWarrenAiTopCompaniesFromServer } from "../../lib/api";
import { useEffect, useState } from "react";

const WarrenAITopCo = (props) => {
  const { auth } = props;
  const [topCoList, setTopCoList] = useState(null);

  useEffect(() => {
    getWarrenAiTopCompaniesFromServer(auth.user.id).then(({ data }) => {
      setTopCoList(data);
    });
  }, []);

  return (
    <div>
      <NavDrawer {...props}>
        <h1>"WARRENAI TOP Companies List"</h1>
        {topCoList ? (
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
