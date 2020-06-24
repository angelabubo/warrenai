export const basic_features = [
  { check: true, feature: "Institutional quality data" },
  { check: true, feature: "Limited stock analysis reports" },
  { check: true, feature: "Scoring, fundamental and insider data" },
  { check: true, feature: "Learn with WarrenAi" },
  { check: true, feature: "Portfolio and Watchlist" },
];

export const premium_features = [
  { check: true, feature: "Basic Membership inclusions" },
  { check: true, feature: "Unimited stock analysis reports" },
  { check: true, feature: "Fair value calculations" },
  { check: true, feature: "Stock projections and comparisons" },
  { check: true, feature: "WarrenAi top companies list" },
  { check: true, feature: "Rank companies by sector" },
  { check: true, feature: "Dividend Scanner" },
  { check: true, feature: "Backtesting" },
];

export const plans = [
  {
    id: "price_free",
    name: "Basic Membership",
    unitprice: 0,
    recurring: "  ",
    inclusions: basic_features,
  },
  {
    id: "price_1Gu2n8AOCcUhE0MFLb8xXxIr",
    name: "WarrenAi Premium",
    unitprice: 699,
    recurring: "billed monthly",
    inclusions: premium_features,
  },
  {
    id: "price_1Gu2n8AOCcUhE0MFnYjBUAH9",
    name: "WarrenAi Premium",
    unitprice: 8099,
    recurring: "billed yearly",
    inclusions: premium_features,
  },
];
