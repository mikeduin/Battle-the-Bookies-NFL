var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'});
var fetch = require('node-fetch');
var moment = require('moment');
var passport = require('passport');
var knex = require('../db/knex');

var mainDb = knex.mainDb;
var userDb = knex.userDb;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index.html');
});

var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');
var updateGameResults = require('../modules/updateGameResults.js');
var createLines = require('../modules/createLines.js');
var lineMoves = require('../modules/lineMoves.js');
var checkStartTimes = require('../modules/checkStartTimes.js');
var setLineRanges = require('../modules/setLineRanges.js');
var setCapperGrades = require('../modules/setCapperGrades.js');
var pickArrays = require('../modules/pickArrays.js');
var getWeeks = require('../modules/getWeeks.js');
var fetchLines = require('../modules/fetchLines.js');
var checkActiveLines = require('../modules/checkActiveLines');

// methods for determining pick ranges
Array.max = function(array){
  return Math.max.apply(Math, array)
};

Array.min = function(array){
  return Math.min.apply(Math, array)
};

function sortNumber(a, b) {
  return a - b
};

function Lines() {
  return mainDb('lines');
};

function LineMoves() {
  return mainDb('line_moves');
};

function Picks() {
  return mainDb('picks');
}

function Users() {
  return mainDb('users');
}

// This first function updates game results every 11 minutes.
setInterval(function (){
  updateGameResults.updateGameResults()
}, 660000);

// This function checks every seven minutes to see if new lines are available and, if so, adds them to the DB.
setInterval(function (){
  createLines.createLines();
}, 420000);

// The function below runs once every 15 mins and updates the LineMove arrays to track each game's line movement over the course of the week.
setInterval(function (){
  lineMoves.logAllLineMoves();
}, 900000);

// The function below checks to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page. It runs roughly four times a day.
//
setInterval(function (){
  checkStartTimes.checkStartTimes();
}, 50000000);

// This function checks to make sure there are no stale lines in the DB, available for picking, which have been taken off the board in real life.
// setInterval(() => {
//   checkActiveLines.checkActiveLines();
// }, 60000);

// This next function is that which updates game lines. It runs on every page refresh or every 30 seconds otherwise (via a custom directive) within the application.
router.get('/updateOdds', function(req, res, next) {
  fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
    method: 'GET',
    headers: {
      'x-api-Key': process.env.API_KEY
    }
  }).then(function(res){
    return res.json()
  }).then(function(odds){
      for (i=0; i<odds.length; i++) {
        Lines().where({EventID: odds[i].ID}).update({
          MoneyLineHome: odds[i].Odds[0].MoneyLineHome,
          MoneyLineAway: odds[i].Odds[0].MoneyLineAway,
          PointSpreadHome: odds[i].Odds[0].PointSpreadHome,
          PointSpreadAway: odds[i].Odds[0].PointSpreadAway,
          PointSpreadAwayLine: odds[i].Odds[0].PointSpreadAwayLine,
          PointSpreadHomeLine: odds[i].Odds[0].PointSpreadHomeLine,
          TotalNumber: odds[i].Odds[0].TotalNumber,
          OverLine: odds[i].Odds[0].OverLine,
          UnderLine: odds[i].Odds[0].UnderLine
        }, '*').then(function(upd){
          if (upd.length > 0) {
            console.log('line ', upd[0].EventID, ' has been updated');
          } else {
            console.log('line not created yet')
          }
        })
      };
    }
  ).then(function(){
    return Lines();
  }).then(function(updOdds){
    res.json(updOdds)
  })
});

// This massive function below runs every 3 minutes and -- if a game has started and has not yet had the subsequent actions performed -- (a) checks to see whether a game's pick ranges have been added to the original line data, (b) updates the CapperGrades for each pick, and (c) adds the pick arrays to the line data. Once completed, it sets all indicators to 'true' so that the functions do not needlessly repeat themselves in the future.
setInterval(function (){
  var now = moment();
  Lines()
  .where('MatchTime', '<', now)
  .andWhere('RangesSet', null)
  .then(function(games){
    if (!games[0]) {
      console.log('no line move objects need to be set');
      return
    };
    games.forEach(function(game){
      setLineRanges.setLineRanges(game);
    })
  })
}, 180000);

router.get('/seasons', function(req, res, next){
  Lines().pluck('season').distinct()
  .then(function(seasons){
    var array = [2018, 2017];
    res.json(array)
  })
})

router.get('/weeks/:season', function(req, res, next){
  getWeeks.getWeeks(req.params.season).then(function(weeks){
    res.json(weeks);
  })
})

router.get('/line/:gameID', function(req, res, next){
  fetchLines.byID(req.params.gameID).then(function(lines){
    res.json(lines);
  })
})

router.get('/matchups', function(req, res, next){
  fetchLines.matchups().then(function(matchups){
    res.json(matchups);
  })
})

router.get('/linemove/:gameID', function(req, res, next){
  lineMoves.byId(req.params.gameID).then(function(game){
    res.json(game)
  });
})

router.get('/pullGame/:gameID', function(req, res, next){
  pickArrays.byId(req.params.gameID).then(function(arrays){
    res.json(arrays);
  })
})

router.get('/weeklyStats/:username/:season', function(req, res, next){
  var username = req.params.username;
  var season = req.params.season;
  var weekArray = [];
  Picks()
    .where({season: season})
    .whereNot({WeekNumb: "PRE"})
    .whereNot({WeekNumb: "POST"})
    .pluck('Week')
    .distinct()
  .then(function(weeks){
    weekArray = weeks;
    weeks = weekArray.sort();
    return weeks
  }).then(function(weeks){

    var weekNumbers = [];
    var newWeeks = [];
    for (i=0; i<weeks.length; i++) {
      var weekNumber = parseInt(weeks[i].substring(5));
      weekNumbers.push(weekNumber)
    };
    weekNumbers.sort(sortNumber);
    for (i=0; i<weekNumbers.length; i++) {
      var newWeek = "Week " + weekNumbers[i];
      newWeeks.push(newWeek)
    };

    Promise.all(newWeeks.map(function(week){
      return Picks().where({username: username, Week: week, season: season}).then(function(results){

        var totCapperGrade = 0;
        var cappedGames = 0;

        var totalDollars = 0;
        var totalGames = 0;
        var totalWins = 0;
        var totalLosses = 0;
        var week;
        var username;

        results.forEach(function(result){
          // these results logged below are divided into EACH PICK
            if (result.finalPayout !== 0) {
              username = result.username;
              week = result.Week;
              // MatchDay = result.MatchDay;
              totalDollars += result.finalPayout;
              totalGames += 1;
              totalWins += result.resultBinary;
              totalLosses += (1-result.resultBinary);
              if (result.capperGraded) {
                totCapperGrade += result.capperGrade;
                cappedGames +=1;
              }
            };
        });

        var avgCapperGrade = totCapperGrade / cappedGames;

        return {username: username, week: week, totalDollars: totalDollars, totalWins: totalWins, totalLosses: totalLosses, totalGames: totalGames, avgCapperGrade: avgCapperGrade}
      })

    })).then(function(userArray){
      res.json(userArray)
    })
  })
})

// END PICK ROUTES

module.exports = router;
