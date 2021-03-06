var moment = require('moment');
var knex = require ('../db/knex');
var mainDb = knex.mainDb;
var userDb = knex.userDb;

function Lines() {
  return mainDb('lines');
};

function LineMoves() {
  return mainDb('line_moves');
};

// IF LINE MOVES DON'T WORK, IT'S BECAUSE OF DEFAULT KNEX REFS BELOW

// The function below runs once every 35 mins and updates the LineMove arrays to track each game's line movement over the course of the week.

module.exports = {
  logAllLineMoves: function() {
    var now = moment();
    Lines().where('MatchTime', '>', now).select('EventID', 'HomeAbbrev', 'AwayAbbrev', 'PointSpreadHome', 'PointSpreadAway', 'PointSpreadHomeLine', 'PointSpreadAwayLine', 'MoneyLineHome', 'MoneyLineAway', 'TotalNumber', 'OverLine', 'UnderLine').then(function(games){
      games.forEach(function(game){
        var homeSpread = game.PointSpreadHome;
        var homeSpreadJuice = game.PointSpreadHomeLine;
        var awaySpread = game.PointSpreadAway;
        var awaySpreadJuice = game.PointSpreadAwayLine;
        var homeML = game.MoneyLineHome;
        var awayML = game.MoneyLineAway;
        var total = game.TotalNumber;
        var totalOverJuice = game.OverLine;
        var totalUnderJuice = game.UnderLine;

        if (game.PointSpreadHomeLine === 0) {
          homeSpread = null;
          homeSpreadJuice = null;
          awaySpread = null;
          awaySpreadJuice = null;
        };

        if (game.MoneyLineHome === 0) {
          homeML = null;
          awayML = null;
        };

        if (game.TotalNumber === 0){
          total = null;
          totalOverJuice = null;
          totalUnderJuice = null;
        };

        LineMoves().where({EventID: game.EventID}).then(function(result){
          var logged = new Date();
          if(result.length === 0) {
            LineMoves().insert({
              EventID: game.EventID,
              HomeAbbrev: game.HomeAbbrev,
              AwayAbbrev: game.AwayAbbrev,
              HomeSpreads: [homeSpread],
              HomeSpreadJuices: [homeSpreadJuice],
              AwaySpreads: [awaySpread],
              AwaySpreadJuices: [awaySpreadJuice],
              HomeMLs: [homeML],
              AwayMLs: [awayML],
              Totals: [total],
              TotalOverJuices: [totalOverJuice],
              TotalUnderJuices: [totalUnderJuice],
              TimeLogged: [logged]
            }, '*').then(function(line){
              console.log(line, ' has been added');
            });
          } else {
            LineMoves().where({EventID: game.EventID}).update({
              'HomeSpreads': mainDb.raw('array_append("HomeSpreads", ?)', [homeSpread]),
              'HomeSpreadJuices': mainDb.raw('array_append("HomeSpreadJuices", ?)', [homeSpreadJuice]),
              'AwaySpreads': mainDb.raw('array_append("AwaySpreads", ?)', [awaySpread]),
              'AwaySpreadJuices': mainDb.raw('array_append("AwaySpreadJuices", ?)', [awaySpreadJuice]),
              'HomeMLs': mainDb.raw('array_append("HomeMLs", ?)', [homeML]),
              'AwayMLs': mainDb.raw('array_append("AwayMLs", ?)', [awayML]),
              'Totals': mainDb.raw('array_append("Totals", ?)', [total]),
              'TotalOverJuices': mainDb.raw('array_append("TotalOverJuices", ?)', [totalOverJuice]),
              'TotalUnderJuices': mainDb.raw('array_append("TotalUnderJuices", ?)', [totalUnderJuice]),
              'TimeLogged': mainDb.raw('array_append("TimeLogged", ?)', [logged]),
            }, '*').then(function(returned){
              console.log('array updated!');
            })
          }
        });
      })
    })
  },

  logIndLineMove: function(game){
    LineMoves().where({EventID: game[0].EventID}).then(function(result){
      // if (result.length === 0) {
        var homeSpread = game[0].PointSpreadHome;
        var homeSpreadJuice = game[0].PointSpreadHomeLine;
        var awaySpread = game[0].PointSpreadAway;
        var awaySpreadJuice = game[0].PointSpreadAwayLine;
        var homeML = game[0].MoneyLineHome;
        var awayML = game[0].MoneyLineAway;
        var total = game[0].TotalNumber;
        var totalOverJuice = game[0].OverLine;
        var totalUnderJuice = game[0].UnderLine;

        if (game[0].PointSpreadHomeLine === 0) {
          homeSpread = null;
          homeSpreadJuice = null;
          awaySpread = null;
          awaySpreadJuice = null;
        };

        if (game[0].MoneyLineHome === 0) {
          homeML = null;
          awayML = null;
        };

        if (game[0].TotalNumber === 0){
          total = null;
          totalOverJuice = null;
          totalUnderJuice = null;
        };

        var logged = new Date();

        LineMoves().insert({
          EventID: game[0].EventID,
          HomeAbbrev: game[0].HomeAbbrev,
          AwayAbbrev: game[0].AwayAbbrev,
          HomeSpreads: [homeSpread],
          HomeSpreadJuices: [homeSpreadJuice],
          AwaySpreads: [awaySpread],
          AwaySpreadJuices: [awaySpreadJuice],
          HomeMLs: [homeML],
          AwayMLs: [awayML],
          Totals: [total],
          TotalOverJuices: [totalOverJuice],
          TotalUnderJuices: [totalUnderJuice],
          TimeLogged: [logged]
        }, '*').then(function(line){
          console.log('linemove arrays initiated for ', line[0].EventID);
        });
    })
  },

  byId: function(id) {
    return LineMoves().where({EventID: id}).then(function(moves){
      return moves;
    });
  }
}
