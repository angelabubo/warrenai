const helper = require("../lib/helper");

class BasicTicker {
  constructor(ticker, c, pc, dateInTicks, company, website, state) {
    this.ticker = ticker;
    this.close = c;
    this.date = dateInTicks ? helper.ticksToDateString(dateInTicks) : null;
    this.change = c && pc ? (c - pc).toFixed(2) : null;
    this.changePercent =
      c && pc ? (((c - pc) / pc) * 100 * -1).toFixed(2) : null; //always a positive
    this.company_name = company;
    this.website = website;
    this.currency = helper.getStockCurrency(ticker);
    this.state = state;
  }
}

module.exports = BasicTicker;
