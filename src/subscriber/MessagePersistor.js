const Toolkit   = require('../helpers/Toolkit');
const Database  = require('../helpers/Database');
const Log       = require('../helpers/Log');
const Message   = require('../models/Message');

class MessagePersistor {
  DB = undefined;
  message = undefined;

  constructor(DB, message) {
    if (DB === undefined || !(DB instanceof Database)) {
      throw 'invalid DB supplied to MessagePersistor';
    }

    if (message === undefined || !(message instanceof Message)) {
      throw 'invalid message supplied to MessagePersistor';
    }

    this.DB = DB;
    this.message = message;
  }

  persist = async () => {
    if (!this.DB.isOpened) {
      throw 'DB is not opened, cannot persist message.'
    }

    if (this.message.validate()) {
      const persistLock = [ undefined ];
      const sql = `INSERT INTO Messages ${this.message.toSqlWithValues()}`;

      this.DB.run(sql, (err) => {
        persistLock[0] = 'unlocked';
        if (err) {
          throw err;
        }
      });

      await Toolkit.waitFor(persistLock);
      return this.message;
    } else {
      throw { message: 'message invalid', data: this.message.toJson() }
    }
  };
}

module.exports = MessagePersistor;
