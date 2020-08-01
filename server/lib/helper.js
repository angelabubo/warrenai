const stocks_us = require("../data/stocks_us");
const stocks_ca = require("../data/stocks_ca");
const moment = require("moment");

fs = require("fs");

exports.cleandata = () => {
  const clean = stocks_ca.symbols.filter((stock) => {
    if (
      stock.companyName &&
      isNaN(stock.companyName) &&
      stock.companyName !== "nan"
    ) {
      return true;
    } else {
      return false;
    }
  });

  const cleanString = JSON.stringify(clean);
  fs.writeFile("D:\\testing\\cleandata_ca.txt", cleanString, function (err) {
    if (err) return console.log(err);
  });
};

exports.ticksToDateTimeString = (ticks) => {
  const date = new Date(ticks);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

exports.ticksToDateString = (ticks) => {
  const date = new Date(ticks);
  return date.toLocaleDateString();
};

exports.getStockCurrency = (ticker) => {
  let stock = null;

  stock = stocks_us.symbols.find((element) => {
    return element.ticker === ticker;
  });

  if (stock) return stock.currency;
  else {
    stock = stocks_ca.symbols.find((element) => {
      return element.ticker === ticker;
    });
    return stock ? stock.currency : null;
  }
};

exports.getStockExhangeShort = (ticker) => {
  let stock = null;

  stock = stocks_us.symbols.find((element) => {
    return element.ticker === ticker;
  });

  if (stock) return stock.exchangeShort;
  else {
    stock = stocks_ca.symbols.find((element) => {
      return element.ticker === ticker;
    });
    return stock ? stock.exchangeShort : null;
  }
};

exports.get2MonthsTicks = () => {
  const from = Math.floor(moment().subtract(2, "months").valueOf() / 1000);
  const to = Math.floor(moment().valueOf() / 1000);

  return { from, to };
};

exports.getYesterDayNow = (formatString) => {
  const from = moment().subtract(1, "days").format("YYYY-MM-DD");
  const to = moment().format("YYYY-MM-DD");

  return { from, to };
};
