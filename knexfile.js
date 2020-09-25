// Update with your config settings.
require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
    // connection: 'postgres://localhost/btb-nfl'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

};
