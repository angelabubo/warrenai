export const clientlogger = (type, err) => {
  if (type === "err") {
    if (err.response) {
      // client received an error response (5xx, 4xx)
      return err.response.data;
    } else if (err.request) {
      // client never received a response, or request never left
      console.error(err.request);
      return; //TODO
    }
  }

  return err;
};
