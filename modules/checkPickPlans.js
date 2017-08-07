var knex = require('../db/knex')

function Picks() {
  return knex('picks');
}

function Users() {
  return knex('users');
}

function Lines() {
  return knex('lines');
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

function mlFormat (ml) {
  if (ml < 0) {
    return ml
  } else {
    return "+" + ml
  }
};

module.exports = {
  checkPickPlans: function(pick){
    var retObj = {};
    return Lines().where({EventID: pick.EventID}).then(function(game){
      if (pick.activePick === null) {
        if (pick.plan === 'noPlan' || pick.plan === null) {
          retObj.pick = pick;
          retObj.game = game;
          return retObj;
        } else if (pick.plan === 'homeSpreads') {

          if (game[0].PointSpreadHome > 0) {
            var favType = "Underdog";
            var geoType = "Home Dog";
            var betType = "Dog Spread";
          } else if (game[0].PointSpreadHome < 0) {
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
            activePick: game[0].HomeAbbrev + ' ' + mlFormat(game[0].PointSpreadHome),
            activeSpread: game[0].PointSpreadHome,
            activeLine: game[0].PointSpreadHomeLine,
            activePayout: activePayCalc(game[0].PointSpreadHomeLine),
            pickType: 'Home Spread',
            favType: favType,
            betType: betType,
            geoType: geoType
          }, '*').then(function(newPick){
            console.log(newPick[0].id, ' has been updated as homeSpread');
            retObj.pick = newPick;
            retObj.game = game;
            return retObj;
          });
        } else if (pick.plan === 'awaySpreads') {

          if (game[0].PointSpreadAway > 0) {
            var favType = "Underdog";
            var geoType = "Away Dog";
            var betType = "Dog Spread";
          } else if (game[0].PointSpreadAway < 0) {
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
            activePick: game[0].AwayAbbrev + ' ' + mlFormat(game[0].PointSpreadAway),
            activeSpread: game[0].PointSpreadAway,
            activeLine: game[0].PointSpreadAwayLine,
            activePayout: activePayCalc(game[0].PointSpreadAwayLine),
            pickType: 'Away Spread',
            favType: favType,
            betType: betType,
            geoType: geoType
          }, '*').then(function(newPick){
            console.log(newPick[0].id, ' has been updated as awaySpread');
            retObj.pick = newPick;
            retObj.game = game;
            return retObj;
          });

        } else if (pick.plan === 'favMLs') {
          if (game[0].MoneyLineHome <= game[0].MoneyLineAway) {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].HomeAbbrev + ' ' + mlFormat(game[0].MoneyLineHome),
              activeLine: game[0].MoneyLineHome,
              activePayout: activePayCalc(game[0].MoneyLineHome),
              pickType: 'Home Moneyline',
              favType: 'Favorite',
              betType: 'Fav ML',
              geoType: 'Home Fav'
            }, '*').then(function(newPick){
              console.log(newPick[0].id, ' has been updated as favML');
              retObj.pick = newPick;
              retObj.game = game;
              return retObj;
            });
          } else {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].AwayAbbrev + ' ' + mlFormat(game[0].MoneyLineAway),
              activeLine: game[0].MoneyLineAway,
              activePayout: activePayCalc(game[0].MoneyLineAway),
              pickType: 'Away Moneyline',
              favType: 'Favorite',
              betType: 'Fav ML',
              geoType: 'Away Fav'
            }, '*').then(function(newPick){
              console.log(newPick[0].id, ' has been updated as favML');
              retObj.pick = newPick;
              retObj.game = game;
              return retObj;
            });
          }
        } else if (pick.plan === 'dogSpreads') {
          if (game[0].PointSpreadHome >= game[0].PointSpreadAway) {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].HomeAbbrev + ' ' + mlFormat(game[0].PointSpreadHome),
              activeLine: game[0].PointSpreadHomeLine,
              activePayout: activePayCalc(game[0].PointSpreadHomeLine),
              pickType: 'Home Spread',
              favType: 'Underdog',
              betType: 'Dog Spread',
              geoType: 'Home Dog'
            }, '*').then(function(newPick){
              console.log(newPick[0].id, ' has been updated as dogSpread');
              retObj.pick = newPick;
              retObj.game = game;
              return retObj;
            });
          } else {
            Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].AwayAbbrev + ' ' + mlFormat(game[0].PointSpreadAway),
              activeLine: game[0].PointSpreadAwayLine,
              activePayout: activePayCalc(game[0].PointSpreadAwayLine),
              pickType: 'Away Spread',
              favType: 'Underdog',
              betType: 'Dog Spread',
              geoType: 'Away Dog'
            }, '*').then(function(newPick){
              console.log(newPick[0].id, ' has been updated as dogSpread');
              retObj.pick = newPick;
              retObj.game = game;
              return retObj;
            });
          }
        } else {
          retObj.pick = pick;
          retObj.game = game;
          return retObj;
        }
      }
    })
  }
}
