var knex = require('../db/knex')
var mainDb = knex.mainDb;
var userDb = knex.userDb;

function Picks() {
  return mainDb('picks');
}

function Users() {
  return userDb('users');
}

function Lines() {
  return mainDb('lines');
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
          retObj.game = game[0];
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

          return Picks().where({id: pick.id}).update({
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
            retObj.pick = newPick[0];
            retObj.game = game[0];
            return retObj;
          });
        } else if (pick.plan === 'roadSpreads') {

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

          return Picks().where({id: pick.id}).update({
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
            retObj.pick = newPick[0];
            retObj.game = game[0];
            return retObj;
          });

        } else if (pick.plan === 'favMLs') {
          if (game[0].MoneyLineHome <= game[0].MoneyLineAway) {
            return Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].HomeAbbrev + ' ' + mlFormat(game[0].MoneyLineHome),
              activeLine: game[0].MoneyLineHome,
              activePayout: activePayCalc(game[0].MoneyLineHome),
              pickType: 'Home Moneyline',
              favType: 'Favorite',
              betType: 'Fav ML',
              geoType: 'Home Fav'
            }, '*').then(function(newPick){
              retObj.pick = newPick[0];
              retObj.game = game[0];
              return retObj;
            });
          } else {
            return Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].AwayAbbrev + ' ' + mlFormat(game[0].MoneyLineAway),
              activeLine: game[0].MoneyLineAway,
              activePayout: activePayCalc(game[0].MoneyLineAway),
              pickType: 'Away Moneyline',
              favType: 'Favorite',
              betType: 'Fav ML',
              geoType: 'Away Fav'
            }, '*').then(function(newPick){
              retObj.pick = newPick[0];
              retObj.game = game[0];
              return retObj;
            });
          }
        } else if (pick.plan === 'dogSpreads') {
          if (game[0].PointSpreadHome >= game[0].PointSpreadAway) {
            return Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].HomeAbbrev + ' ' + mlFormat(game[0].PointSpreadHome),
              activeLine: game[0].PointSpreadHomeLine,
              activeSpread: game[0].PointSpreadHome,
              activePayout: activePayCalc(game[0].PointSpreadHomeLine),
              pickType: 'Home Spread',
              favType: 'Underdog',
              betType: 'Dog Spread',
              geoType: 'Home Dog'
            }, '*').then(function(newPick){
              retObj.pick = newPick[0];
              retObj.game = game[0];
              return retObj;
            });
          } else {
            return Picks().where({id: pick.id}).update({
              submittedAt: new Date(),
              activePick: game[0].AwayAbbrev + ' ' + mlFormat(game[0].PointSpreadAway),
              activeLine: game[0].PointSpreadAwayLine,
              activeSpread: game[0].PointSpreadAway,
              activePayout: activePayCalc(game[0].PointSpreadAwayLine),
              pickType: 'Away Spread',
              favType: 'Underdog',
              betType: 'Dog Spread',
              geoType: 'Away Dog'
            }, '*').then(function(newPick){
              retObj.pick = newPick[0];
              retObj.game = game[0];
              return retObj;
            });
          }
        } else {
          retObj.pick = pick;
          retObj.game = game[0];
          return retObj;
        }
      } else {
        retObj.pick = pick;
        retObj.game = game[0];
        return retObj;
      }
    })
  }
}
