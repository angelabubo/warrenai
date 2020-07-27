const dbHelper = require("../lib/dbHelper");
const premium = require("../data/premium");
const stockHelperFh = require("../lib/stockHelperFinnHub");
const stockHelperUni = require("../lib/stockHelperUnibit");

const BasicCompanyCard = require("../models/BasicCompanyCard");

const processWarrenAiTopCompaniesData = async (tickers) => {
  //Request all ticker data
  //Get company info from Unibit
  const fields = ["website", "company_name", "sector", "company_description"];
  const tickersCompanyInfo = await stockHelperUni.getBasicCompanyData(
    tickers,
    fields
  );

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
    const companyData = await processWarrenAiTopCompaniesData(
      premium.WarrenAiTopCompanies
    );

    res.json(companyData);
  } else {
    res.json(null);
  }
};

exports.getUsersTest = (req, res) => {
  res.json({ message: "Success getUsersTest call!" });
};
