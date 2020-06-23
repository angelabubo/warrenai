export const serverlogger = (type, err) => {
  if (type === "err") {
    if (err.response) {
      // client received an error response (5xx, 4xx)
      console.error(err.response);
    } else if (err.request) {
      // client never received a response, or request never left
      console.error(err.request);
    } else {
      // anything else
      console.error(err);
    }
  }
};
