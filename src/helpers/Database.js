const sqlite3 = require('sqlite3').verbose();
const Toolkit = require('./Toolkit');
const Log     = require('./Log');


/*
  Database interface for the analyzer
*/

class Database {
  db          = undefined;
  dbName      = undefined;

  isOpened    = false;

  constructor (dbName) {
    if (dbName === undefined || dbName === '') {
      Log.i('Database initialized without dbName, creating db in memory..');
      dbName = ':memory:';
    }

    this.dbName = dbName;
  }

  // Query db to check for table,
  hasTable = async (tableName) => {
    Log.v('>>>>> Database.hasTable()');
    if (!this.isOpened) {
      return;
    }

    let exists = [ undefined ];
    const sql = `SELECT 1 FROM ${tableName}`;
    this.db.run(sql, (err) => {
      if (err) {
        if (err.message.indexOf('no such table') >= 0) {
          exists[0] = false;
        } else {
          throw err;
        }
      } else {
        exists[0] = true;
      }
    });

    await Toolkit.waitFor(exists);
    Log.v(`has table "${tableName}": ${exists[0]}`);
    Log.v('<<<<< Database.hasTable()');
    return exists[0];
  };

  createTable = async (tableName, columnsString) => {
    Log.v('>>>>> Database.createTable()');
    const createTableLock = [ undefined ];
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsString})`;
    Log.v(`Trying to create table with query "${sql}"`);
    this.db.run(sql, (err) => {
      createTableLock[0] = 'unlocked';
      if (err) {
        throw err;
      }

      Log.i(`Created table with name "${tableName}"`)
    });

    await Toolkit.waitFor(createTableLock);
    Log.v('<<<<< Database.createTable()');
  };

  createTableWithId = async (tableName, columnsString) => {
    Log.v('>>>>> Database.createTableWithId()');
    await this.createTable(tableName, `id INTEGER PRIMARY KEY, ${columnsString}`);
    Log.v('<<<<< Database.createTableWithId()');
  };

  createTableWithIdAndTs = async (tableName, columnsString) => {
    Log.v('>>>>> Database.createTableWithIdAndTs()');
    await this.createTable(tableName, `id INTEGER PRIMARY KEY, Timestamp DATETIME default CURRENT_TIMESTAMP, ${columnsString}`);
    Log.v('<<<<< Database.createTableWithIdAndTs()');
  };

  open = async () => {
    Log.v('>>>>> Database.open()');
    const dbOpenLock = [ undefined ];

    this.db = new sqlite3.Database(this.dbName, (err) => {
      dbOpenLock[0] = 'unlocked';
      if (err) {
        throw err;
      }
      this.isOpened = true;
      Log.i(`Connected to SQlite database at ${this.dbName}`);
    });

    await Toolkit.waitFor(dbOpenLock);
    Log.v('<<<<< Database.open()');
  };

  close = () => {
    Log.v('>>>>> Database.close()');
    if (this.isOpened) {
      this.db.close((err) => {
        this.isOpened = false;
        if (err) {
          return console.error(err.message);
        }
        Log.i(`Closed the database connection at ${this.dbName}.`);
      });
    } else {
      Log.e('Database not opened, cannot close');
    }
    Log.v('<<<<< Database.close()');
  };

  run = (...args) => {
    this.db.run(...args);
  }
}

module.exports = Database;
