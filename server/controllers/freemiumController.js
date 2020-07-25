const dbHelper = require("../lib/dbHelper");
const stockHelperFh = require("../lib/stockHelperFinnHub");
const stockHelperUni = require("../lib/stockHelperUnibit");
const Portfolio = require("../models/Portfolio");
const Watchlist = require("../models/Watchlist");

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
        tickersData[i].c ? tickersData[i].c : null,
        tickersData[i].t ? tickersData[i].t * 1000 : null
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

  const { userId, ticker } = req.params;

  //Persist data in database
  await dbHelper.deletePortfolio(userId, ticker, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(result);
  });
};

exports.addWatchlist = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const { userId } = req.params;
  const { ticker } = req.body;

  //Persist data in database
  await dbHelper.addWatchlist(userId, ticker, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(result);
  });
};

exports.deleteWatchlist = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const { userId, ticker } = req.params;

  //Persist data in database
  await dbHelper.deleteWatchlist(userId, ticker, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(result);
  });
};

const processWatchlist = async (tickers) => {
  let promises = [];
  let watchlist = [];

  //Request all ticker data
  //Get stock quote from FinnHub
  for (let i = 0; i < tickers.length; i++) {
    promises.push(stockHelperFh.getQuote(tickers[i]));
  }
  const tickersQuote = await Promise.all(promises);

  //Get stock volume from Unibit
  const tickersVolume = await stockHelperUni.getVolume(tickers);

  watchlist = tickersQuote.map((quote) => {
    const tickerVolume = tickersVolume[quote.ticker];
    const volume =
      tickerVolume && tickerVolume.length > 0 ? tickerVolume[0].volume : null;
    const watchlist = new Watchlist(
      quote.ticker,
      quote.o,
      quote.h,
      quote.l,
      quote.c,
      quote.pc,
      volume,
      quote.t ? quote.t * 1000 : null
    );

    const jsonStr = JSON.stringify(watchlist);
    return JSON.parse(jsonStr);
  });

  return watchlist;
};

const doGetWatchlist = async (tickers) => {
  return await processWatchlist(tickers);
};

exports.getWatchlist = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const { userId } = req.params;

  //Get list of tickers watchlisted by user from database
  const cols = ["ticker"];
  const datarows = await dbHelper.getTableRowsWithSelectColumns(
    cols,
    "watchlist",
    "userId",
    userId
  );

  if (datarows) {
    //Extract tickers
    const tickers = datarows.map((element) => element.ticker);

    const watchlist = await doGetWatchlist(tickers);
    res.json(watchlist);
  } else {
    res.json([]);
  }
};
