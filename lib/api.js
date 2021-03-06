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

//Delete User Account Profile
export const deleteProfile = async (userId) => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  return data;
};

//Update User Password
export const updatePassword = async (userId, password) => {
  const { data } = await axios.post(`/api/users/${userId}/password`, password);
  return data;
};

//Add portfolio
export const addPortfolio = async (userId, portfolio) => {
  const { data } = await axios.post(`/api/free/${userId}/portfolio`, portfolio);
  return data;
};

//Get portfolio
export const getPortfolio = async (userId, portfolio) => {
  const { data } = await axios.get(`/api/free/${userId}/portfolio`);
  return data;
};

//Delete portfolio
export const deletePortfolio = async (userId, ticker) => {
  const { data } = await axios.delete(
    `/api/free/${userId}/portfolio/${ticker}`
  );
  return data;
};

//Add watchlist
export const addWatchlist = async (userId, ticker) => {
  const { data } = await axios.post(`/api/free/${userId}/watchlist`, {
    ticker,
  });
  return data;
};

//Get watchlist
export const getWatchlist = async (userId) => {
  const { data } = await axios.get(`/api/free/${userId}/watchlist`);
  return data;
};

//Delete watchlist
export const deleteWatchlist = async (userId, ticker) => {
  const { data } = await axios.delete(
    `/api/free/${userId}/watchlist/${ticker}`
  );
  return data;
};

//Get basic stock data for dashboard
export const getBasicStockData = async (userId) => {
  const { data } = await axios.get(`/api/free/${userId}/basictickerdata`);
  return data;
};

//Get list of WarrenAi Top Companies
export const getWarrenAiTopCompaniesFromServer = async (userId) => {
  const { data } = await axios.get(`/api/premium/warrenaitopco/${userId}`);
  return data;
};

//Get list of potential stocks for Dividend Scanner
export const getPotentialDividendStocksFromServer = async (userId) => {
  const { data } = await axios.get(`/api/premium/dividendscanner/${userId}`);
  return data;
};

//Get list of Companies by sector
export const getCompaniesBySectorFromServer = async (userId) => {
  const { data } = await axios.get(`/api/premium/rankcompanies/${userId}`);
  return data;
};

//Get Company Details
export const getCompanyDetailsFromServer = async (userId, ticker) => {
  const { data } = await axios.get(
    `/api/free/${userId}/completetickerdata/${ticker}`
  );
  return data;
};

//Get General News
export const getGeneralNews = async (userId) => {
  const { data } = await axios.get(`/api/free/${userId}/news`);
  return data;
};

//Get 2 Months candlestick data
export const getCandlesticks = async (userId, ticker) => {
  const { data } = await axios.get(`/api/free/${userId}/candlestick/${ticker}`);
  return data;
};

//Send customer feedback
export const sendFeedback = async (message) => {
  const { data } = await axios.post("/api/feedback", message);
  return data;
};
