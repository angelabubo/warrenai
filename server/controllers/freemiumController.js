const dbHelper = require("../lib/dbHelper");
const stockHelperFh = require("../lib/stockHelperFinnHub");
const stockHelperUni = require("../lib/stockHelperUnibit");
const Portfolio = require("../models/Portfolio");
const Watchlist = require("../models/Watchlist");
const BasicTicker = require("../models/BasicTicker");
const CompanyDetails = require("../models/CompanyDetails");

const processTickers = async (tickers, portfoliosFromDB) => {
  let promises = [];
  let tickersData;
  let portfolioList = [];

  //Request all ticker data
  for (let i = 0; i < tickers.length; i++) {
    promises.push(stockHelperFh.getQuote(tickers[i]));
  }

  tickersData = await Promise.all(promises);

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

const processTickerData = async (tickers) => {
  let promises = [];

  //Request all ticker data
  //Get stock quote from FinnHub
  for (let i = 0; i < tickers.length; i++) {
    promises.push(stockHelperFh.getQuote(tickers[i].ticker));
  }
  const tickersQuote = await Promise.all(promises);

  const tickerNames = tickers.map((element) => element.ticker);
  //Get company info from Unibit

  const fields = ["website", "company_name"];
  const tickersCompany = await stockHelperUni.getBasicCompanyData(
    tickerNames,
    fields
  );

  let tickersData = [];
  tickersData = tickersQuote.map((quote, index) => {
    const company = tickersCompany[quote.ticker]
      ? tickersCompany[quote.ticker].company_name
      : null;
    const website = tickersCompany[quote.ticker]
      ? tickersCompany[quote.ticker].website
      : null;

    const state = tickers.find((element) => {
      return element.ticker === quote.ticker;
    });

    //constructor(ticker, c, pc, dateInTicks, company, website, state)
    const watchlist = new BasicTicker(
      quote.ticker,
      quote.c,
      quote.pc,
      quote.t ? quote.t * 1000 : null,
      company,
      website,
      state ? state.state : null
    );

    const jsonStr = JSON.stringify(watchlist);
    return JSON.parse(jsonStr);
  });

  return tickersData;
};

const doGetTickerData = async (tickers) => {
  return await processTickerData(tickers);
};
exports.getBasicTickerData = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const { userId } = req.params;

  let tickers = [];
  //Get list of tickers watchlisted by user from database
  const watchlist = await dbHelper.getTableRowsDistinct(
    "ticker",
    "watchlist",
    "userId",
    userId
  );

  if (watchlist) {
    watchlist.map((element) => {
      tickers.push({
        ticker: element.ticker,
        state: "watchlist",
      });
    });
  }

  //Get list of tickers in portfolio by user from database
  const portfolio = await dbHelper.getTableRowsDistinct(
    "ticker",
    "portfolio",
    "userId",
    userId
  );

  if (portfolio) {
    portfolio.map((element) => {
      tickers.push({
        ticker: element.ticker,
        state: "portfolio",
      });
    });
  }

  if (tickers.length > 0) {
    const tickerData = await doGetTickerData(tickers);
    console.log(tickerData);
    res.json(tickerData);
  } else {
    res.json([]);
  }
};

const processCompleteTickerData = async (ticker) => {
  //Get company info from Unibit
  let tickers = [];
  tickers.push(ticker);
  const fields = [
    "company_name",
    "sector",
    "address",
    "phone",
    "website",
    "employee_number",
    "company_description",
  ];
  const companyProfile = await stockHelperUni.getBasicCompanyData(
    tickers,
    fields
  );
  const companyInfo = companyProfile[ticker];

  //Get Company Basic Financial from FinnHub
  const companyFinancial = await stockHelperFh.getBasicFinancial(
    ticker,
    "price"
  );

  const tickerData = new CompanyDetails(
    ticker,
    companyInfo.company_name,
    companyInfo.company_description,
    companyInfo.sector,
    companyInfo.address,
    companyInfo.phone,
    companyInfo.website,
    companyInfo.employee_number,
    companyFinancial.marketCapitalization,
    companyFinancial["5DayPriceReturnDaily"],
    companyFinancial["13WeekPriceReturnDaily"],
    companyFinancial["26WeekPriceReturnDaily"],
    companyFinancial["52WeekPriceReturnDaily"],
    companyFinancial["yearToDatePriceReturnDaily"]
  );

  const jsonStr = JSON.stringify(tickerData);
  return JSON.parse(jsonStr);
};

exports.getCompleteTickerData = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const { userId, ticker } = req.params;

  const tickerData = await processCompleteTickerData(ticker);
  console.log(tickerData);
  if (tickerData) res.json(tickerData);
  else res.json([]);
};

exports.getGeneralNews = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  const news = await stockHelperFh.getGeneralNews();

  if (news) {
    const selectedNews = news.slice(0, 8);
    res.json(selectedNews);
  } else {
    res.json([]);
  }
};
