const _Sentiment = require('src/helpers/sentiment/Sentiment');
const additionalPositiveTokens = require('./positive');
const additionalNegativeTokens = require('./negative');

const emoteSentiments = { ...additionalPositiveTokens, ...additionalNegativeTokens };

class Sentiment {
  sentiment = undefined;

  constructor() {
    this.sentiment = new _Sentiment();
  }

  analyze(msg) {
    return this.sentiment.analyze(msg, {extras: emoteSentiments });
  }
}

module.exports = Sentiment;
