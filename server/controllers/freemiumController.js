const dbHelper = require("../lib/dbHelper");
const stockHelperFh = require("../lib/stockHelperFinnHub");
const Portfolio = require("../models/Portfolio");

const processTickers = async (tickers, portfoliosFromDB) => {
  let promises = [];
  let tickersData;
  let portfolioList = [];

  //Request all ticker data
  for (let i = 0; i < tickers.length; i++) {
    promises.push(stockHelperFh.getQuote(tickers[i]));
  }

  tickersData = await Promise.all(promises);
  console.log(tickersData);

  for (let i = 0; i < tickersData.length; i++) {
    if (tickersData[i]) {
      let portfolio = new Portfolio(
        tickersData[i].ticker,
        tickersData[i].c,
        tickersData[i].t * 1000
      );

      //Compute the portfolio based on data from database
      portfoliosFromDB.forEach((element) => {
        if (element.ticker === tickersData[i].ticker) {
          portfolio.compute(element.qty, element.cost_per_share);
        }
      });

      //Add the computed portfolio as JSON object to the list for client consumption
      //Convert class instance to JSON String
      const jsonStr = JSON.stringify(portfolio);
      const jsonObj = JSON.parse(jsonStr);
      portfolioList.push(jsonObj);
    }
  }

  return portfolioList;
};

const doGetPortfolioTask = async (tickers, portfoliosFromDB) => {
  return await processTickers(tickers, portfoliosFromDB);
};

exports.getPortfolio = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Check whether user has active subscription first
  const { userId } = req.params;

  //Get list of portfolio from database
  const portfoliosFromDB = await dbHelper.getTableRows(
    "portfolio",
    "userId",
    userId
  );

  if (portfoliosFromDB) {
    //Extract tickers
    let tickerSet = new Set();
    portfoliosFromDB.forEach((element) => {
      tickerSet.add(element.ticker);
    });

    const portfolios = await doGetPortfolioTask(
      Array.from(tickerSet),
      portfoliosFromDB
    );
    res.json(portfolios);
  } else {
    res.json([]);
  }
};

exports.addPortfolio = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const { userId } = req.params;
  const portfolio = req.body;

  //Persist data in database
  await dbHelper.addPortfolio(userId, portfolio, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(result);
  });
};

exports.deletePortfolio = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Check whether user has active subscription first
  const { userId } = req.params;
  res.json(null);
};
