const axios = require("axios");

const APIKEY = process.env.FINNHUB_APIKEY;
const baseURL = "https://finnhub.io/api/v1";
const suffixURL = `&token=${APIKEY}`;
// https://finnhub.io/api/v1/quote?symbol=AAPL&token=bsatml7rh5r96cvcrbq0

//Get real-time quote data for US stocks.
exports.getQuote = async (ticker) => {
  try {
    const { data } = await axios.get(
      baseURL + `/quote?symbol=${ticker}` + suffixURL
    );

    data["ticker"] = ticker;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
