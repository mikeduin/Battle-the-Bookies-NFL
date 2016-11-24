var moment = require('moment');
var mongoose = require('mongoose');
var Line = mongoose.model('Line');
var LineMove = mongoose.model('LineMove');

// The function below runs once every 35 mins and updates the LineMove arrays to track each game's line movement over the course of the week.

module.exports = {
  logLineMoves: function(){
    var now = moment();
    Line.find({
      MatchTime: {
        $gt: now
      }
    }, function(err, games){
      if (err) {console.log(err)}

    }).then(function(games){
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

        LineMove.findOneAndUpdate({EventID: game.EventID}, {
          $set: {
            AwayAbbrev: game.AwayAbbrev,
            HomeAbbrev: game.HomeAbbrev
          },
          $push: {
            HomeSpreads: homeSpread,
            HomeSpreadJuices: homeSpreadJuice,
            AwaySpreads: awaySpread,
            AwaySpreadJuices: awaySpreadJuice,
            HomeMLs: homeML,
            AwayMLs: awayML,
            Totals: total,
            TotalOverJuices: totalOverJuice,
            TotalUnderJuices: totalUnderJuice,
            TimeLogged: new Date()
          }
        }, {upsert: true}, function(err, line){
          if (err) {console.log(err)}

          console.log('linemoves have been added for ', line.EventID)
        })
      })
    })
  }
}
