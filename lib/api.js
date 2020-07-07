import axios from "axios";

//Get the user information including subscription details
export const getUserInfo = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

//Get the plan details of user
export const getUserPlan = async (userId) => {
  const { data } = await axios.get(`/api/users/subscription/${userId}`);
  return data;
};

//Cancel subscription
export const cancelSubscription = async (userId) => {
  const { data } = await axios.post(
    `/api/stripe/${userId}/cancel-subscription`
  );
  return data;
};

//Get list of WarrenAi Top Companies
export const getWarrenAiTopCompaniesFromServer = async (userId) => {
  const { data } = await axios.get(`/api/premium/warrenaitopco/${userId}`);
  return data;
};
