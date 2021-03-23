// Update with your config settings.
require('dotenv').config();
const pg = require('pg')
pg.defaults.ssl = {
   rejectUnauthorized: false,
}

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    // connection: process.env.TEST_DB_URL
    ssl: {
      rejectUnauthorized: false,  
    },
    ssl: 'no-verify' // try this if above does not work for you
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
    // connection: process.env.TEST_DB_URL
  }

};
