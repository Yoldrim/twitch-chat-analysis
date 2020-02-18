const Database          = require('../helpers/Database');
const Log               = require('../helpers/Log');
const ChatListener      = require('./TMIChatListener');
const MessagePersistor  = require('./MessagePersistor');
const Message           = require('../models/Message');

class Subscriber {
  static start = async (DB) => {
    if (DB === undefined || !(DB instanceof Database)) {
      throw 'invalid DB supplied to Subscriber.start()'
    }

    // Open DB, if fail we throw the error, canceling the main application
    await DB.open().catch((err) => {throw err});

    // Check is 'Messages' table exists, otherwise we create it
    await DB.hasTable('Messages').then((exists) => {
      if (!exists) {
        DB.createTableWithIdAndTs('Messages', Message.SQL_TABLE_COLUMNS).catch((err) => {throw err});
      }
    });

    const sub = new ChatListener('luxtHOs');
    sub.registerOnMessageListener((message) => {
      const persistor = new MessagePersistor(DB, message);

      persistor.persist().then((msg) => {
        Log.v('successfully persisted message with externalId', msg.externalId);
      }).catch((err) => {throw err});
    })
  }
}

module.exports = Subscriber;
