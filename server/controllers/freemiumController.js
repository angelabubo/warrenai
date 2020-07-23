const dbHelper = require("../lib/dbHelper");
const stockHelperFh = require("../lib/stockHelperFinnHub");

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
  const hasAccess = await dbHelper.userHasPremiumAccess(userId);

  if (hasAccess) {
    //ANGEL TODO - using dummy data for now
    res.json(dummyData.topCompanies);
  } else {
    res.json(null);
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
