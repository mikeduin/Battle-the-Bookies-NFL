var knex = require('../db/knex')

function Picks() {
  return knex('picks');
}

function Users() {
  return knex('users');
}


module.exports = {
  checkPickPlans: function(game){
    Picks().where({EventID: game.EventID}).then(function(picks){
      picks.forEach(function(pick){
        if (pick.activePick === null) {

        }
      })
    })
  }
}
