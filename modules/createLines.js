var mongoose = require('mongoose');
var fetch = require('node-fetch');
var moment = require('moment');
var abbrevs = require('../modules/abbrevs.js');
var helmets = require('../modules/helmets.js');
var colors = require('../modules/colors.js');
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');
var logLineMoves = require('../modules/lineMoves.js');
// var Line = mongoose.model('Line');
var knex = require ('../db/knex');

function Lines() {
  return knex('lines');
};

function Users() {
  return knex('users');
}

function Picks() {
  return knex('picks');
}

function LineMoves() {
  return knex('line_moves');
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
      odds.forEach(function(game){
        Lines().where({EventID: game.Odds[0].EventID}).then(function(exist){
          if (exist.length === 0) {
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
            }, '*').then(function(line){
              console.log(line[0].EventID + ' was added as a new line');
              // This function below adds the user pick templates for each pick once it's been added as a line.
              Users().then(function(users){
                var count = 0;
                for (var i=0; i<users.length; i++) {
                  Picks().insert({
                    username: users[i].username,
                    plan: users[i].plan,
                    EventID: line[0].EventID,
                    MatchDay: line[0].MatchDay,
                    MatchTime: line[0].MatchTime,
                    Week: line[0].Week,
                    DateNumb: line[0].DateNumb,
                    WeekNumb: line[0].WeekNumb,
                    matchup: line[0].AwayAbbrev + ' @ ' + line[0].HomeAbbrev,
                    finalPayout: 0
                  }, '*').then(function(pick){
                    console.log('pick has been added for user ', pick[0].username, ' and event ', pick[0].EventID);
                    if (count === 0) {
                      count++;
                      console.log('count is ', count);
                      Lines().where({EventID: pick[0].EventID}).then(function(res){
                        console.log('count in second leg is ', count);
                        logLineMoves.logIndLineMove(res);
                      })
                    }
                  })
                }
              })
            })
          } else {
            console.log('line already exists');
          }
        })
      })
    })
  }
}
