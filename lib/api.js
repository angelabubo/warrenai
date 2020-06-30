import axios from "axios";

//Get the user information including subscription details
export const getUserInfo = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

//Get list of WarrenAi Top Companies
export const getWarrenAiTopCompaniesFromServer = async (userId) => {
  const { data } = await axios.get(`/api/premium/warrenaitopco/${userId}`);
  return data;
};
