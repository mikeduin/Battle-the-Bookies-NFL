// Update with your config settings.
require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    // connection: process.env.DATABASE_URL
    connection: process.env.TEST_DB_URL
  },

  production: {
    client: 'postgresql',
    // connection: process.env.DATABASE_URL
    connection: process.env.TEST_DB_URL
  }

};
