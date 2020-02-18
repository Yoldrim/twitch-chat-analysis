// Imports
const tmi = require('tmi.js');
const Sentiment = require('../helpers/Sentiment');

// Instantiate constants
const sentiment = new Sentiment();

class TMIChatSubscriber {
  channel = undefined;

  constructor(channel) {
    this.channel = channel;

    // Create a client instance for supplied channel
    const client = new tmi.Client({
      connection: {
        reconnect: true,
        secure: true,
      },
      channels: [channel]
    });

    // Register event handlers
    this.onMessageHandler = this.onMessageHandler.bind(this);
    this.onConnectedHandler = this.onConnectedHandler.bind(this);
    client.on('message', this.onMessageHandler);
    client.on('connected', this.onConnectedHandler);

    // Connect to Twitch
    client.connect();
  }

  // Called every time a message is received
  onMessageHandler (target, context, text) {
    let message = {...context, text};

    // Sort out messages sent by bots, seems all bots have partner flag (?)
    if (message.badges && message.badges.partner) {
      return console.log('don\'t handle messages from bots');
    }

    message.sentiment = this.evaluateSentiment(message.text);

    console.log('=============== MESSAGE ================');
    console.log(message);
  }

  onConnectedHandler (addr, port) {
    // tmi.js handles reconnecting, so we don't to implement that :-)
    console.log(`* Connected to ${addr}:${port} @ channel ${this.channel}`);
  }


  // Do very basic sentimental analysis
  evaluateSentiment = (msg) => {
    return sentiment.analyze(msg);
  }
}

module.exports = TMIChatSubscriber;
