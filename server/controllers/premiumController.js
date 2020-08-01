const dbHelper = require("../lib/dbHelper");
const premium = require("../data/premium");
const stockHelperFh = require("../lib/stockHelperFinnHub");
const stockHelperUni = require("../lib/stockHelperUnibit");

const BasicCompanyCard = require("../models/BasicCompanyCard");
const BasicCompanyFinancial = require("../models/BasicCompanyFinancial");

const getBasicCompanyInfo = async (tickers) => {
  //Request all ticker data
  //Get company info from Unibit
  const tickersCompanyInfo = await stockHelperUni.getBasicCompanyData(tickers, [
    "website",
    "company_name",
    "sector",
    "company_description",
  ]);

  let result = [];
  result = tickers.map((ticker, index) => {
    const tickerCompanyInfo = tickersCompanyInfo[ticker];

    const object = new BasicCompanyCard(
      ticker,
      tickerCompanyInfo.company_name,
      tickerCompanyInfo.company_description,
      tickerCompanyInfo.website,
      tickerCompanyInfo.sector
    );

    const jsonStr = JSON.stringify(object);
    return JSON.parse(jsonStr);
  });

  return result;
};

exports.getWarrenAiTopCompanies = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Check whether user has active subscription first
  const { userId } = req.params;
  const hasAccess = await dbHelper.userHasPremiumAccess(userId);

  if (hasAccess) {
    //Get basic data of WarrenAi Top Companies
    const companyData = await getBasicCompanyInfo(premium.WarrenAiTopCompanies);

    res.json(companyData);
  } else {
    res.json(null);
  }
};

exports.getDividendScanners = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Check whether user has active subscription first
  const { userId } = req.params;
  const hasAccess = await dbHelper.userHasPremiumAccess(userId);

  if (hasAccess) {
    //Get basic data of Dividend Scanners
    const companyData = await getBasicCompanyInfo(premium.DividendScanner);

    res.json(companyData);
  } else {
    res.json(null);
  }
};

const processCompanyFinancials = async (tickers) => {
  let promises = [];
  //Get company basic financials info from FinnHub
  for (let i = 0; i < tickers.length; i++) {
    promises.push(stockHelperFh.getBasicFinancial(tickers[i], "valuation"));
  }
  const tickerFinancesFromFinn = await Promise.all(promises);

  //Get company info from Unibit
  const tickersCompanyFromUni = await stockHelperUni.getBasicCompanyData(
    tickers,
    ["company_name", "sector"]
  );
  const tickerFinancesFromUni = await stockHelperUni.getCompanyFinancialSummary(
    tickers,
    ["pe_ratio", "open", "eps"]
  );

  let tickersData = [];
  tickersData = tickerFinancesFromFinn.map((element, index) => {
    const watchlist = new BasicCompanyFinancial(
      element.ticker,
      tickersCompanyFromUni[element.ticker].company_name,
      tickersCompanyFromUni[element.ticker].sector,
      tickerFinancesFromUni[element.ticker].pe_ratio,
      tickerFinancesFromUni[element.ticker].open,
      tickerFinancesFromUni[element.ticker].eps,
      element.currentDividendYieldTTM,
      element.dividendYield5Y
    );

    const jsonStr = JSON.stringify(watchlist);
    return JSON.parse(jsonStr);
  });

  return tickersData;
};

const doGetCompanyFinancial = async (tickers) => {
  return await processCompanyFinancials(tickers);
};

exports.getRankCompanies = async (req, res) => {
  //Check if user who sent the request is authenticated (signed in)
  if (!req.isAuthUser) {
    res.status(403).json({
      message: "You are unauthenticated. Please sign in or sign up",
    });
    return res.redirect("/signin");
  }

  //Check whether user has active subscription first
  const { userId } = req.params;
  const hasAccess = await dbHelper.userHasPremiumAccess(userId);

  if (hasAccess) {
    //Get basic company financial info of ranked companies
    const companyData = await doGetCompanyFinancial(premium.RankBySector);
    res.json(companyData);
  } else {
    res.json(null);
  }
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
