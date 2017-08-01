var knex = require('../db/knex')

function Picks() {
  return knex('picks');
}

function Users() {
  return knex('users');
}

function activePayCalc (line) {
  var payout;
  if (line < 0) {
    payout = (10000 / -line)
  } else {
    payout = line
  };
  return payout
};

module.exports = {
  checkPickPlans: function(game){
    Picks().where({EventID: game.EventID}).then(function(picks){
      picks.forEach(function(pick){
        if (pick.activePick === null) {
          if (pick.plan === 'noPlan') {
            return
          } else if (pick.plan === 'homeSpreads') {

            if (game.PointSpreadHome > 0) {
              var favType = "Underdog";
              var geoType = "Home Dog";
              var betType = "Dog Spread";
            } else if (game.PointSpreadHome < 0) {
              var favType = "Favorite";
              var geoType = "Home Fav";
              var betType = "Fav Spread";
            } else {
              var favType = "Neither";
              var geoType = "Home +0";
              var betType = "Spread +0";
            };


            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game.HomeAbbrev + ' ' + game.PointSpreadHome,
              activeSpread: game.PointSpreadHome,
              activeLine: game.PointSpreadHomeLine,
              activePayout: activePayCalc(activeLine),
              pickType: 'Home Spread',
              favType: favType,
              betType: betType,
              geoType: geoType
            })
          }
        }
      })
    })
  }
}
