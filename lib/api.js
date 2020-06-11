export const getDashboard = ({ id }) => {
  //Page specific api calls
  const pageSpecificProps = {
    angel: id,
  };
  return pageSpecificProps;
};
