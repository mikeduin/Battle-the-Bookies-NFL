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
  checkPickPlans: function(pick){
    return Lines().where({EventID: pick.eventID}).then(function(game){
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
            activePayout: activePayCalc(game.PointSpreadHomeLine),
            pickType: 'Home Spread',
            favType: favType,
            betType: betType,
            geoType: geoType
          }, '*').then(function(planned){
            console.log(planned[0].id, ' has been updated as homeSpread');
            return planned[0].id;
          });
        } else if (pick.plan === 'awaySpreads') {

          if (game.PointSpreadAway > 0) {
            var favType = "Underdog";
            var geoType = "Away Dog";
            var betType = "Dog Spread";
          } else if (game.PointSpreadAway < 0) {
            var favType = "Favorite";
            var geoType = "Away Fav";
            var betType = "Fav Spread";
          } else {
            var favType = "Neither";
            var geoType = "Away +0";
            var betType = "Spread +0";
          };

          Picks().where({id: pick.id}).update({
            submittedAt: new Date(),
            activePick: game.AwayAbbrev + ' ' + game.PointSpreadAway,
            activeSpread: game.PointSpreadAway,
            activeLine: game.PointSpreadAwayLine,
            activePayout: activePayCalc(game.PointSpreadAwayLine),
            pickType: 'Away Spread',
            favType: favType,
            betType: betType,
            geoType: geoType
          }, '*').then(function(planned){
            console.log(planned[0].id, ' has been updated as awaySpread');
            return planned[0].id;
          });

        } else if (pick.plan === 'favMLs') {
          if (game.MoneyLineHome <= game.MoneyLineAway) {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game.HomeAbbrev + ' ' + game.MoneyLineHome,
              activeLine: game.MoneyLineHome,
              activePayout: activePayCalc(game.MoneyLineHome),
              pickType: 'Home Moneyline',
              favType: 'Favorite',
              betType: 'Fav ML',
              geoType: 'Home Fav'
            }, '*').then(function(planned){
              console.log(planned[0].id, ' has been updated as favML');
              return planned[0].id;
            });
          } else {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game.AwayAbbrev + ' ' + game.MoneyLineAway,
              activeLine: game.MoneyLineAway,
              activePayout: activePayCalc(game.MoneyLineAway),
              pickType: 'Away Moneyline',
              favType: 'Favorite',
              betType: 'Fav ML',
              geoType: 'Away Fav'
            }, '*').then(function(planned){
              console.log(planned[0].id, ' has been updated as favML');
              return planned[0].id;
            });
          }
        } else if (pick.plan === 'dogSpreads') {
          if (game.PointSpreadHome >= game.PointSpreadAway) {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game.HomeAbbrev + ' ' + game.PointSpreadHome,
              activeLine: game.PointSpreadHomeLine,
              activePayout: activePayCalc(game.PointSpreadHomeLine),
              pickType: 'Home Spread',
              favType: 'Underdog',
              betType: 'Dog Spread',
              geoType: 'Home Dog'
            }, '*').then(function(planned){
              console.log(planned[0].id, ' has been updated as dogSpread');
              return planned[0].id;
            });
          } else {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game.AwayAbbrev + ' ' + game.PointSpreadAway,
              activeLine: game.PointSpreadAwayLine,
              activePayout: activePayCalc(game.PointSpreadAwayLine),
              pickType: 'Away Spread',
              favType: 'Underdog',
              betType: 'Dog Spread',
              geoType: 'Away Dog'
            }, '*').then(function(planned){
              console.log(planned[0].id, ' has been updated as dogSpread');
              return planned[0].id;
            });
          }
        } else {
          return
        }
      }
    })
  }
}
