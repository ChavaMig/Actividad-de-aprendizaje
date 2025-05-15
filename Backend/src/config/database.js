
const knex = require('knex');
const { config } = require('./configuration');

const client = config.db.client === 'mysql' ? 'mysql2' : config.db.client;

const db = knex({
  client,
  connection: client === 'sqlite3'
    ? { filename: config.db.filename }
    : {
        host: config.db.host,
        port: config.db.port   || 3306,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
      },
  useNullAsDefault: client === 'sqlite3'
});

module.exports = db;
