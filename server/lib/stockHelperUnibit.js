const axios = require("axios");

const APIKEY = process.env.UNIBIT_APIKEY;
const baseURL = "https://api.unibit.ai/v2";
const suffixURL = `&dataType=json&accessKey=${APIKEY}`;

//https://api.unibit.ai/v2/stock/historical/?tickers=AAPL,AMZN,IBM&selectedFields=volume&dataType=json&accessKey=
//Supports batch ticker request. Tickers separated by ,
exports.getVolume = async (tickers) => {
  try {
    const { data } = await axios.get(
      baseURL +
        `/stock/historical/?tickers=${tickers.join()}&selectedFields=volume` +
        suffixURL
    );
    return data.result_data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
