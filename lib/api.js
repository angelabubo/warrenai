import axios from "axios";

//Get the user subscription regardless of status
export const getUserSubscription = async (userId) => {
  const { data } = await axios.get(
    `/api/users/subscription/${userId}/get-any-subscription`
  );
  return data;
};

//Get the plan details of user for display
export const getUserPlan = async (userId) => {
  const { data } = await axios.get(`/api/users/subscription/${userId}`);
  return data;
};

//Get billing information of user for display
export const getUserBilling = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}/billing`);
  return data;
};

//Update subscription
export const updateSubscription = async (userId, subscription) => {
  try {
    await axios.post(`/api/stripe/${userId}/update-subscription`, {
      subscription,
    });
    return true;
  } catch (error) {
    console.error("Backend call to update subscription");
    console.log(error);
    return false;
  }
};

//Change subscription
export const changeSubscription = async (userId, priceId) => {
  try {
    await axios.post(`/api/stripe/${userId}/change-subscription`, {
      priceId,
    });
    return true;
  } catch (error) {
    console.error("Backend call to change subscription");
    console.log(error);
    return false;
  }
};

//Cancel subscription
export const cancelSubscription = async (userId) => {
  const { data } = await axios.post(
    `/api/stripe/${userId}/cancel-subscription`
  );
  return data;
};

//Update User Profile (First and Last Name)
export const updateProfile = async (userId, profile) => {
  const { data } = await axios.post(`/api/users/${userId}`, profile);
  return data;
};

//Get list of WarrenAi Top Companies
export const getWarrenAiTopCompaniesFromServer = async (userId) => {
  const { data } = await axios.get(`/api/premium/warrenaitopco/${userId}`);
  return data;
};
