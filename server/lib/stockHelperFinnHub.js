const axios = require("axios");
const moment = require("moment");

const APIKEY = process.env.FINNHUB_APIKEY;
const baseURL = "https://finnhub.io/api/v1";
const suffixURL = `&token=${APIKEY}`;

// https://finnhub.io/api/v1/quote?symbol=AAPL&token=
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

//https://finnhub.io/api/v1/stock/metric?symbol=AMZN&metric=valuation&token=
//Get real-time basic financial data for US stocks.
exports.getBasicFinancial = async (ticker, metric) => {
  try {
    const { data } = await axios.get(
      baseURL + `/stock/metric?symbol=${ticker}&metric=${metric}` + suffixURL
    );

    data.metric["ticker"] = ticker;
    return data.metric;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//https://finnhub.io/api/v1/news?category=general&token=bshdb5nrh5r9t1gms83g
//Get latest market news.
exports.getGeneralNews = async () => {
  try {
    // const from = moment().subtract(1, "days").format("YYYY-MM-DD");
    // const to = moment().format("YYYY-MM-DD");

    const { data } = await axios.get(
      baseURL + `/news?category=general` + suffixURL
    );

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
