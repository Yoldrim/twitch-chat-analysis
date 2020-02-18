// Imports
const tmi = require('tmi.js');
const Sentiment = require('../helpers/Sentiment');
const Log = require('../helpers/Log');
const Message = require('../models/Message');

// Instantiate constants
const sentiment = new Sentiment();

class TMIChatListener {
  channel = undefined;
  onMessageListeners = [];

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
    let msg = {...context, text};

    // Sort out messages we do not want to save
    // Messages sent by bots, seems all bots have partner flag (?) Naive????
    if (msg.badges && msg.badges.partner) { return Log.v('don\'t handle messages from bots');}
    if (msg.mod === true)                 { return Log.v('don\'t handle messages from mods'); }
    if (msg.text[0] === '!')              { return Log.v('don\'t handle commands'); }


    msg.sentiment = this.evaluateSentiment(msg.text);

    Log.v('=============== MESSAGE ================');
    Log.v(msg);

    const message = new Message(
      msg['id'],
      msg['room-id'],
      msg['user-id'],
      msg['username'],
      msg['display-name'],
      msg['color'],
      msg['subscriber'],
      msg.sentiment['score'],
      msg.sentiment['comparative'],
      msg.sentiment['positive'],
      msg.sentiment['negative'],
      msg['text']
    );

    Log.v("Broadcasting message:", message);
    this.onMessageListeners.forEach((listener) => {
      listener(message);
    });
  }

  onConnectedHandler (addr, port) {
    // tmi.js handles reconnecting, so we don't to implement that :-)
    Log.i(`* Connected to ${addr}:${port} @ channel ${this.channel}`);
  }


  // Do very basic sentimental analysis
  evaluateSentiment = (msg) => {
    return sentiment.analyze(msg);
  };

  registerOnMessageListener = (cb) => {
    if (cb instanceof Function) {
      this.onMessageListeners.push(cb);
    } else {
      Log.e('Did not register onMessageListener, supplied cb is not a function');
    }
  }
}

module.exports = TMIChatListener;
