const helper = require("../lib/helper");
const CompanyCovers = require("../data/companyCovers");

class BasicCompanyCard {
  constructor(ticker, companyName, companyDesc, website, sector) {
    this.ticker = ticker;
    this.company_name = companyName;
    this.website = website;
    this.sector = sector;
    this.company_description = company_description;
    this.exchangeShort = helper.getStockExhangeShort(ticker);
    this.coverImageUrl =
      CompanyCovers.ByTicker[ticker] &&
      CompanyCovers.BySector[sector] &&
      CompanyCovers.ByTicker["default"];
  }
}

module.exports = BasicCompanyCard;
