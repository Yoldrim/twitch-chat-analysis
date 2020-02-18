const Database    = require('./src/helpers/Database');
const Subscriber  = require('./src/subscriber/Subscriber');
const Log         = require('./src/helpers/Log');

// Take these as cli args, with defaults
Log.verbose = true;
const DB = new Database('./src/db/twitch.db');

const main = async () => {
  Subscriber.start(DB);
};

main().catch((err) => {
  Log.e('<<<<< CAUGHT ERROR IN MAIN >>>>>');
  Log.e(err);
  Log.e('<<<<< CAUGHT ERROR IN MAIN >>>>>');
});
