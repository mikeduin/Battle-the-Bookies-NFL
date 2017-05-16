var moment = require('moment');
var mongoose = require('mongoose');
var knex = require ('../db/knex');
// var Line = mongoose.model('Line');
// var LineMove = mongoose.model('LineMove');

function Lines() {
  return knex ('lines');
};

function LineMoves() {
  return knex ('line_moves');
};

// The function below runs once every 35 mins and updates the LineMove arrays to track each game's line movement over the course of the week.

module.exports = {
  logLineMoves: function() {
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
          if(result.length === 0) {
            var logged = new Date();
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
              TotalUnderJuices: [totalUnderJuice]
              // TimeLogged: [''+logged]
            }, '*').then(function(line){
              console.log(line, ' has been added');
            });
          } else {
            LineMoves().where({EventID: game.EventID}).update({
              'HomeSpreads': knex.raw('array_append("HomeSpreads", ?)', [homeSpread]),
              'HomeSpreadJuices': knex.raw('array_append("HomeSpreadJuices", ?)', [homeSpreadJuice]),
              'AwaySpreads': knex.raw('array_append("AwaySpreads", ?)', [awaySpread]),
              'AwaySpreadJuices': knex.raw('array_append("AwaySpreadJuices", ?)', [awaySpreadJuice]),
              'HomeMLs': knex.raw('array_append("HomeMLs", ?)', [homeML]),
              'AwayMLs': knex.raw('array_append("AwayMLs", ?)', [awayML]),
              'Totals': knex.raw('array_append("Totals", ?)', [total]),
              'TotalOverJuices': knex.raw('array_append("TotalOverJuices", ?)', [totalOverJuice]),
              'TotalUnderJuices': knex.raw('array_append("TotalUnderJuices", ?)', [totalUnderJuice]),
            }, '*').then(function(returned){
              console.log('array updated!');
            })
          }
        });
      })
    })
  }

  // logLineMoves: function(){
  //   var now = moment();
  //   Line.find({
  //     MatchTime: {
  //       $gt: now
  //     }
  //   }, function(err, games){
  //     if (err) {console.log(err)}
  //
  //   }).then(function(games){
  //     games.forEach(function(game){
  //       var homeSpread = game.PointSpreadHome;
  //       var homeSpreadJuice = game.PointSpreadHomeLine;
  //       var awaySpread = game.PointSpreadAway;
  //       var awaySpreadJuice = game.PointSpreadAwayLine;
  //       var homeML = game.MoneyLineHome;
  //       var awayML = game.MoneyLineAway;
  //       var total = game.TotalNumber;
  //       var totalOverJuice = game.OverLine;
  //       var totalUnderJuice = game.UnderLine;
  //
  //       if (game.PointSpreadHomeLine === 0) {
  //         homeSpread = null;
  //         homeSpreadJuice = null;
  //         awaySpread = null;
  //         awaySpreadJuice = null;
  //       };
  //
  //       if (game.MoneyLineHome === 0) {
  //         homeML = null;
  //         awayML = null;
  //       };
  //
  //       if (game.TotalNumber === 0){
  //         total = null;
  //         totalOverJuice = null;
  //         totalUnderJuice = null;
  //       };
  //
  //       LineMove.findOneAndUpdate({EventID: game.EventID}, {
  //         $set: {
  //           AwayAbbrev: game.AwayAbbrev,
  //           HomeAbbrev: game.HomeAbbrev
  //         },
  //         $push: {
  //           HomeSpreads: homeSpread,
  //           HomeSpreadJuices: homeSpreadJuice,
  //           AwaySpreads: awaySpread,
  //           AwaySpreadJuices: awaySpreadJuice,
  //           HomeMLs: homeML,
  //           AwayMLs: awayML,
  //           Totals: total,
  //           TotalOverJuices: totalOverJuice,
  //           TotalUnderJuices: totalUnderJuice,
  //           TimeLogged: new Date()
  //         }
  //       }, {upsert: true}, function(err, line){
  //         if (err) {console.log(err)}
  //
  //         console.log('linemoves have been added for ', line.EventID)
  //       })
  //     })
  //   })
  // }
}
