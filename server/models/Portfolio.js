function ticksToDateTimeString(ticks) {
  const date = new Date(ticks);
  return date.toLocaleDateString(); // + " " + date.toLocaleTimeString();
}

class Portfolio {
  constructor(ticker, currentPrice, dateInTicks) {
    this.ticker = ticker;
    this.qty = 0;
    this.avgCost = 0;
    this.change = 0;
    this.price = currentPrice;
    this.date = ticksToDateTimeString(dateInTicks);
    this.totalCost = 0;
  }

  //SUM(numShares * costPerShare) / total qty
  computeAverageCost(numShares, costPerShare) {
    this.totalCost += numShares * costPerShare;
    this.qty += numShares;
    this.avgCost = this.totalCost / this.qty;
  }

  //change = ((price - avgCost)/avgCost) * 100
  computePercentChange() {
    this.change = ((this.price - this.avgCost) / this.avgCost) * 100;
  }

  compute(numShares, costPerShare) {
    this.computeAverageCost(numShares, costPerShare);
    this.computePercentChange();
  }
}

module.exports = Portfolio;
