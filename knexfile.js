// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/btb-nfl'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

};
