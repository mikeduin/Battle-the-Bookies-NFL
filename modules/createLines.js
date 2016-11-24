var mongoose = require('mongoose');
var fetch = require('node-fetch');
var moment = require('moment');
var abbrevs = require('../modules/abbrevs.js');
var helmets = require('../modules/helmets.js');
var colors = require('../modules/colors.js');
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');
var Line = mongoose.model('Line');

module.exports = {
  createLines: function(){
    fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
      method: 'GET',
      headers: {
        'JsonOdds-API-Key': process.env.API_KEY
      }
    }).then(function(res){
      return res.json()
    }).then(function(odds){
      odds.forEach(function(game){
        Line.find({EventID: game.Odds[0].EventID}, function(err, line){
          if (err) {console.log(err)}

          if (!line[0]) {
            var newLine = new Line({
              EventID: game.ID,
              HomeTeam: game.HomeTeam,
              AwayTeam: game.AwayTeam,
              HomeAbbrev: abbrevs.teamAbbrev(game.HomeTeam),
              AwayAbbrev: abbrevs.teamAbbrev(game.AwayTeam),
              HomeHelmet: helmets.teamHelmet(game.HomeTeam),
              AwayHelmet: helmets.teamHelmet(game.AwayTeam),
              HomeColor: colors.teamColor(game.HomeTeam),
              AwayColor: colors.teamColor(game.AwayTeam),
              MatchTime: new Date(game.MatchTime),
              MatchDay: moment(game.MatchTime).utcOffset(-7).format('MMMM Do, YYYY'),
              DateNumb: parseInt(moment(game.MatchTime).utcOffset(-7).format('YYYYMMDD')),
              Week: setWeek.weekSetter(game.MatchTime),
              WeekNumb: setWeekNumb.weekNumbSetter(game.MatchTime),
              OddType: game.Odds[0].OddType,
              MoneyLineHome: game.Odds[0].MoneyLineHome,
              MoneyLineAway: game.Odds[0].MoneyLineAway,
              PointSpreadHome: game.Odds[0].PointSpreadHome,
              PointSpreadAway: game.Odds[0].PointSpreadAway,
              PointSpreadAwayLine: game.Odds[0].PointSpreadAwayLine,
              PointSpreadHomeLine: game.Odds[0].PointSpreadHomeLine,
              TotalNumber: game.Odds[0].TotalNumber,
              OverLine: game.Odds[0].OverLine,
              UnderLine: game.Odds[0].UnderLine,
              MLHomePicks: 0,
              MLAwayPicks: 0,
              SpreadHomePicks: 0,
              SpreadAwayPicks: 0,
              OverPicks: 0,
              UnderPicks: 0
            });

            newLine.save(function(err, result){
              if (err) {console.log(err)};

              console.log(result.EventID + ' was added as a new line');
            })
          }
        })
      })
    })
  }
}
