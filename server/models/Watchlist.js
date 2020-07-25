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
  }
}

module.exports = Watchlist;
