const stocks_us = require("../data/stocks_us");
const stocks_ca = require("../data/stocks_ca");
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
