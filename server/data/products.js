exports.PROD_ID_FREE = "price_free";

const basic_features = [
  { feature: "Institutional quality data" },
  { feature: "Limited stock analysis reports" },
  { feature: "Scoring, fundamental and insider data" },
  { feature: "Learn with WarrenAi" },
  { feature: "Portfolio and Watchlist" },
];
const premium_features = [
  { feature: "Basic Membership inclusions" },
  { feature: "Unimited stock analysis reports" },
  { feature: "Fair value calculations" },
  { feature: "Stock projections and comparisons" },
  { feature: "WarrenAi top companies list" },
  { feature: "Rank companies by sector" },
  { feature: "Dividend Scanner" },
  { feature: "Backtesting" },
];

const products = [
  {
    id: exports.PROD_ID_FREE,
    unitprice: 0,
    recurring: "",
    main_prod_id: "prod_basic",
    main_prod_name: "Basic Membership",
    inclusions: basic_features,
  },
  {
    id: "price_1Gu2n8AOCcUhE0MFLb8xXxIr",
    unitprice: 699,
    recurring: "billed monthly",
    main_prod_id: "prod_HSykBxWGIEQGU2",
    main_prod_name: "WarrenAi Premium",
    inclusions: premium_features,
  },
  {
    id: "price_1Gu2n8AOCcUhE0MFnYjBUAH9",
    unitprice: 8099,
    recurring: "billed yearly",
    main_prod_id: "prod_HSykBxWGIEQGU2",
    main_prod_name: "WarrenAi Premium",
    inclusions: premium_features,
  },
];

exports.getProductById = (id) => {
  const product = products.find((item) => {
    return item.id === id;
  });

  if (product) {
    //User has active subscription
    const data = {
      name: product.main_prod_name,
      unitprice: product.unitprice,
      recurring: product.recurring,
      cancelSubBtn: id !== exports.PROD_ID_FREE,
      inclusions: product.inclusions,
    };
    return data;
  } else return null;
};
