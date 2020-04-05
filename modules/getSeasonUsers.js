const knex = require('../db/knex');

function Users () {
  return knex.mainDb('users');
}

module.exports = {
  getUsers: async season => {
    const users = await Users().whereNotNull('btb_seasons').select('username', 'btb_seasons');
    return users.filter(user => user.btb_seasons.some(entry => entry.season == season));
  }
}
