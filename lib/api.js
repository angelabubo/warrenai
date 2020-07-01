import axios from "axios";
const base_url = "http://localhost:3000";

//Client side only apis
//Get the user information including subscription details
export const getUserInfo = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

///////////////////////////////////////////////////////////////////
//Server and client side apis
//Get list of WarrenAi Top Companies
export const getWarrenAiTopCompaniesFromServer = async (userId) => {
  return await axios({
    method: "get",
    baseURL: base_url,
    url: `/api/premium/warrenaitopco/${userId}`,
  }).then(({ data }) => {
    return data;
  });
};
