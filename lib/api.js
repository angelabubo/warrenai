import axios from "axios";
export const getDashboard = ({ id }) => {
  //Page specific api calls
  const pageSpecificProps = {
    angel: id,
  };
  return pageSpecificProps;
};

//Get the user information including subscription details
export const getUserInfo = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};
