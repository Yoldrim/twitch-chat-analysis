const Database        = require('./src/helpers/Database');
const ChatSubscriber  = require('./src/subscriber/TMIChatSubscriber');
const Log             = require('./src/helpers/Log');

Log.verbose = true;
const DB = new Database('./src/db/twitch.db');

const main = async () => {
  // Open DB, if fail we throw the error, canceling the main application
  await DB.open().catch((err) => {throw err});

  // Check is 'Messages' table exists, otherwise we create it
  await DB.hasTable('Messages').then((exists) => {
    if (!exists) {
      DB.createTableWithId('Messages', '' +
        'UserId TEXT NOT NULL, ' +
        'UserName TEXT NOT NULL, ' +
        'UserDisplayName TEXT NOT NULL, ' +
        'UserSubscriber INTEGER NOT NULL, ' +
        'UserColor CHAR(7) NOT NULL, ' +

        'SentimentScore INTEGER NOT NULL, ' +
        'SentimentComparative INTEGER NOT NULL, ' +
        'SentimentPositive TEXT, ' +
        'SentimentNegative TEXT, ' +

        'Text TEXT NOT NULL'
      ).catch((err) => {throw err});
    }
  });

  const sub = new ChatSubscriber('luxtHOs');
};

main().catch((err) => {
  Log.e('<<<<< CAUGHT ERROR IN MAIN >>>>>');
  Log.e(err);
  Log.e('<<<<< CAUGHT ERROR IN MAIN >>>>>');
});
