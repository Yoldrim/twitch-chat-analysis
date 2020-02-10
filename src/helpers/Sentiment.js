const _Sentiment = require('sentiment');

const positiveEmotes = {
  ":)": 2,
  ";)": 2,
  ":": 2,
  "<3": 3,
  "lul": 2,
  "kreygasm": 2,
  "pogchamp": 2,
  "feelsamazingman": 3,
  "feelsgoodman": 3,
  "giveplz": 2,
  "sourpls": 2,
};

const negativeEmotes = {
  ":(": -1,
  "babyrage": -2,
  "biblethump": -2,
  "cmonbruh": -2,
  "dansgame": -2,
  "failfish": -2,
  "notlikethis": -2,
  "residentsleeper": -2,
  "swiftrage": -2,
  "feelsbadman": -2,
  "wutface": -2
};

const emoteSentiments = { ...positiveEmotes, ...negativeEmotes };

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
