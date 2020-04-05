const knex = require('../db/knex');

function Users () {
  return knex.userDb('users');
}

function UserSeasons () {
  return knex.mainDb('user_seasons')
}

module.exports = {
  // getUsers: async season => {
  //   const users = await Users().whereNotNull('btb_seasons').select('username', 'btb_seasons');
  //   return users.filter(user => user.btb_seasons.some(entry => entry.season == season));
  // }
  getUsers: async season => {
    const users = await UserSeasons().where({season: season});
    users.forEach(user => {
      user.weekly_results = JSON.parse(user.weekly_results);
    })
    return users;
  }
}
