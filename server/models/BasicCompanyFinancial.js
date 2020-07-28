const helper = require("../lib/helper");

class BasicCompanyFinancial {
  constructor(
    ticker,
    company_name,
    sector,
    pe_ratio,
    open,
    eps,
    dividendYieldTTM,
    dividendYield5Y
  ) {
    this.ticker = ticker;
    this.company_name = company_name;
    this.sector = sector;
    this.pe_ratio = pe_ratio;
    this.price = open;
    this.earnings_yield = eps && open ? (eps / open) * 100 : null;
    this.dividendYieldTTM = dividendYieldTTM;
    this.dividendYield5Y = dividendYield5Y;
  }
}

module.exports = BasicCompanyFinancial;
