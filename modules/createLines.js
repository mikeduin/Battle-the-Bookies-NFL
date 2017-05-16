var mongoose = require('mongoose');
var fetch = require('node-fetch');
var moment = require('moment');
var abbrevs = require('../modules/abbrevs.js');
var helmets = require('../modules/helmets.js');
var colors = require('../modules/colors.js');
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');
// var Line = mongoose.model('Line');
var knex = require ('../db/knex');

function Lines() {
  return knex('lines');
};

// This function checks every 7 minutes to see if new lines are available and, if so, adds them to the DB.

module.exports = {
  createLines: function(){
    fetch('https://jsonodds.com/api/odds/mlb?oddType=Game', {
      method: 'GET',
      headers: {
        'JsonOdds-API-Key': process.env.API_KEY
      }
    }).then(function(res){
      return res.json()
    }).then(function(odds){
      console.log('odds are ', odds);
      odds.forEach(function(game){
        Lines().where({EventID: game.Odds[0].EventID}).first().then(function(err, line){
          if (err) {console.log(err)};

          if (!line) {
            Lines().insert({
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
              MatchDay: moment(new Date(game.MatchTime)).format('MMMM Do, YYYY'),
              DateNumb: parseInt(moment(new Date(game.MatchTime)).format('YYYYMMDD')),
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
              UnderLine: game.Odds[0].UnderLine
            }, '*').then(function(result){
              console.log(result[0].EventID + ' was added as a new line');
            })
          }
        })
      })
    })
  }
}
