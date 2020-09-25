const knex = require('../db/knex');

function Users () {
  return knex.userDb('users');
}

function UserSeasons () {
  return knex.mainDb('user_seasons')
}

module.exports = {
  getUsers: async season => {
    const users = await UserSeasons()
      .where({
        season: season,
        active: true
      });
    users.forEach(user => {
      user.weekly_results = JSON.parse(user.weekly_results);
    })
    return users;
  }
}
