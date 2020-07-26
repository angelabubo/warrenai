const helper = require("../lib/helper");

class Watchlist {
  constructor(ticker, o, h, l, c, pc, volume, dateInTicks) {
    this.ticker = ticker;
    this.open = o;
    this.high = h;
    this.low = l;
    this.close = c;
    this.prevClose = pc;
    this.volume = volume;
    this.date = dateInTicks ? helper.ticksToDateString(dateInTicks) : null;
    this.change = c && pc ? (c - pc).toFixed(2) : null;
    this.changePercent =
      c && pc ? (((c - pc) / pc) * 100 * -1).toFixed(2) : null; //always a positive
  }
}

module.exports = Watchlist;
