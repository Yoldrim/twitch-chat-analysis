const Database = require('./src/helpers/Database');
const ChatSubscriber = require('./src/subscriber/TMIChatSubscriber');

// const DB = new Database('./db/twitch.db');
//
// if (DB.initialized) {
//   DB.close();
// }

const sub = new ChatSubscriber('snappy');
