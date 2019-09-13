var environment = process.env.NODE_ENV || 'development';
var mainDb = require('../knexfile.js')[environment];
var userDb = require('../knexfile_users.js')[environment];


// module.exports = require('knex')(mainDb);

module.exports = {
  mainDb: require('knex')(mainDb),
  userDb: require('knex')(userDb)
}
