const sqlite3 = require('sqlite3').verbose();

class Database {
  db = undefined;
  initialized = false;

  constructor (dbName) {
    if (dbName === undefined || dbName === '') {
      console.log('Database initialized without dbName, creating db in memory..');
      dbName = ':memory:';
    }

    this.open(dbName);
  }

  open (dbName) {
    this.db = new sqlite3.Database(dbName, (err) => {
      if (err) {
        return console.error(err.message);
      }
      this.initialized = true;
      console.log(`Connected to SQlite database at ${dbName}`);
    });
  }

  close () {
    if (this.initialized) {
      this.db.close((err) => {
        this.initialized = false;
        if (err) {
          return console.error(err.message);
        }
        console.log('Close the database connection.');
      });
    } else {
      console.log('Database not initialized, cannot close');
    }
  }
}

module.exports = Database;
