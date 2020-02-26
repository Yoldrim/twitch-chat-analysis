// node imports
const fs          = require('fs');

// src imports
const Database    = require('./src/helpers/Database');
const Subscriber  = require('./src/subscriber/Subscriber');
const Log         = require('./src/helpers/Log');

// Take as cli arg, with defaults
Log.verbose = true;

// Ensure db folder is created, otherwise create it
const dbFolderPath = './db';
if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath);
}

const DB = new Database(`${dbFolderPath}/twitch.db`);

const main = async () => {
  Subscriber.start(DB);
};

main().catch((err) => {
  Log.e('<<<<< CAUGHT ERROR IN MAIN >>>>>');
  Log.e(err);
  Log.e('<<<<< CAUGHT ERROR IN MAIN >>>>>');
});
