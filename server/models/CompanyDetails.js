const helper = require("../lib/helper");
const CompanyCovers = require("../data/companyCovers");

class CompanyDetails {
  constructor(
    ticker,
    company_name,
    company_description,
    sector,
    address,
    phone,
    website,
    employee_number,
    marketCapitalization,
    PriceReturnDaily_5D,
    PriceReturnDaily_13W,
    PriceReturnDaily_26W,
    PriceReturnDaily_52W,
    PriceReturnDaily_YTD
  ) {
    const cleanSector = sector ? sector.replace(" ", "") : "dummy_sector";
    this.ticker = ticker;
    this.company_name = company_name;
    this.company_description = company_description;
    this.sector = sector;
    this.address = address;
    this.phone = phone;
    this.website = website;
    this.employee_number = employee_number;

    this.exchangeShort = helper.getStockExhangeShort(ticker);
    this.coverImageUrl =
      CompanyCovers.ByTicker[ticker] ||
      CompanyCovers.BySector[cleanSector] ||
      CompanyCovers.BySector["default"];

    this.lastUpdate = helper.ticksToDateString(Date.now());
    this.market_cap = marketCapitalization
      ? (marketCapitalization / 1000).toFixed(2) + "B"
      : null;
    this.PriceReturnDaily_5D = PriceReturnDaily_5D;
    this.PriceReturnDaily_13W = PriceReturnDaily_13W;
    this.PriceReturnDaily_26W = PriceReturnDaily_26W;
    this.PriceReturnDaily_52W = PriceReturnDaily_52W;
    this.PriceReturnDaily_YTD = PriceReturnDaily_YTD;
  }
}

module.exports = CompanyDetails;
