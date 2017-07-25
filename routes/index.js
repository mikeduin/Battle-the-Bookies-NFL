var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'});
var fetch = require('node-fetch');
var moment = require('moment');
var mongoose = require('mongoose');
var passport = require('passport');
var knex = require('../db/knex');
var request = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index.html');
});

var User = mongoose.model('User');
var Line = mongoose.model('Line');
var Result = mongoose.model('Result');
var Pick = mongoose.model('Pick');
var PickArray = mongoose.model('PickArray');
var LineMove = mongoose.model('LineMove');
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');
var updateGameResults = require('../modules/updateGameResults.js');
var updatePickResults = require('../modules/updatePickResults.js');
var createLines = require('../modules/createLines.js');
var updateFinalScores = require('../modules/updateFinalScores.js');
var lineMoves = require('../modules/lineMoves.js');
var checkStartTimes = require('../modules/checkStartTimes.js');
var addPickTemplates = require('../modules/addPickTemplates.js');
var setLineRanges = require('../modules/setLineRanges.js');
var setCapperGrades = require('../modules/setCapperGrades.js');
var pickArrays = require('../modules/pickArrays.js');
var getWeeks = require('../modules/getWeeks.js');
var fetchLines = require('../modules/fetchLines.js');

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
  return knex('lines');
};

function LineMoves() {
  return knex ('line_moves');
};

function Picks() {
  return knex('picks');
}

// This first function updates game results every 11 minutes.
// DISABLED + COMMENTED OUT AS OF 1.5.17 (offseason = no results to update)
// ! UPDATED FOR SQL + merged w/updateFinalScores and updatePickResults !

setInterval(function (){
  updateGameResults.updateGameResults()
}, 660000);

// The next function below looks for picks that have a finalPayout of ZERO (e.g., they have not been 'settled' yet) then checks to see if the Result of that pick's game is final. If the result IS final, it updates the picks with the HomeScore and AwayScore and sets 'Final' to true for that pick. THEN, it runs through each potential outcome based on PickType and updates the result variables accordingly.
// DISABLED + COMMENTED OUT AS OF 1.5.17 (offseason = no picks to update)
// !! THIS CAN BE DELETED - updatePickResults was merged into updateGameResults

// setInterval(function (){
//   updatePickResults.updatePickResults();
// }, 840000);

// This function checks every seven minutes to see if new lines are available and, if so, adds them to the DB.
// DISABLED + COMMENTED OUT AS OF 1.5.17 (offseason = no lines to update)
// ! UPDATED FOR SQL !
//
setInterval(function (){
  createLines.createLines();
}, 420000);

// This function runs every eight minutes and checks to see if a game is final and, if so, updates the line data with the final score and change's the game status
// DISABLED + COMMENTED OUT AS OF 1.5.17 (offseason = no results to update)
// !! THIS CAN BE DELETED - updateFinalScores was merged into updateGameResults

// setInterval(function (){
//   updateFinalScores.updateFinalScores();
// }, 480000);

// The function below runs once every 35 mins and updates the LineMove arrays to track each game's line movement over the course of the week.
// DISABLED + COMMENTED OUT AS OF 1.5.17 (offseason = no results to update)
// ! UPDATED FOR SQL !
//
setInterval(function (){
  lineMoves.logAllLineMoves();
}, 3500000);

// The function below checks to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page. It runs roughly four times a day.

// setInterval(function (){
//   checkStartTimes.checkStartTimes();
// }, 50000000)

// This function below checks every 17 minutes to see if new lines have been added, and if so, adds user pick templates for those lines to ensure results are displayed correctly and in the proper order.
// DISABLED + COMMENTED OUT AS OF 1.5.17 (offseason = no picks to update)

// setInterval(function (){
//   addPickTemplates.addPickTemplates()
// }, 1020000);

// This next function is that which updates game lines. It runs on every page refresh or every 30 seconds otherwise (via a custom directive) within the application.

router.get('/updateOdds', function(req, res, next) {
  fetch('https://jsonodds.com/api/odds/mlb?oddType=Game', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': process.env.API_KEY
    }
  }).then(function(res){
    return res.json()
  }).then(function(odds){
      for (i=0; i<odds.length; i++) {

        if (Lines().where({EventID: odds[i].ID}).then(function(line){
          if (line.length > 0) {true}
        })) {
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
          }, '*').then(function(line){
            console.log('line ', line[0].EventID, ' has been updated');
          })
        } else {
          console.log('line not found')
        }
      };
    }
  ).then(function(){
    return Lines();
  }).then(function(updOdds){
    res.json(updOdds)
  })
});

// below REBUILT FOR SQL
router.get('/weeks', function(req, res, next){
  getWeeks.getWeeks().then(function(weeks){
    res.json(weeks);
  })
})

// below REBUILT FOR SQL -- NOT TESTED YET!
router.get('/line/:gameID', function(req, res, next){
  fetchLines.byID(req.params.gameID).then(function(lines){
    res.json(lines);
  })
})

// below REBUILT FOR SQL -- NOT TESTED YET!
router.get('/matchups', function(req, res, next){
  fetchLines.matchups().then(function(matchups){
    res.json(matchups);
  })
})

// below REBUILT FOR SQL -- NOT TESTED YET!
router.get('/linemove/:gameID', function(req, res, next){
  lineMoves.byId(req.params.gameID).then(function(game){
    res.json(game)
  });
})

router.get('/results', function(req, res, next){
  Result.find(function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

// below REBUILT FOR SQL -- NOT TESTED YET!
router.get('/pullGame/:gameID', function(req, res, next){
  pickArrays.byId(req.params.gameID).then(function(arrays){
    console.log('arrays in server are ', arrays);
    res.json(arrays);
  })
})

// This massive function below runs every 3 minutes and -- if a game has started and has not yet had the subsequent actions performed -- (a) checks to see whether a game's pick ranges have been added to the original line data, (b) updates the CapperGrades for each pick, and (c) adds the pick arrays to the line data. Once completed, it sets all indicators to 'true' so that the functions do not needlessly repeat themselves in the future.

// REBUILT FOR SQL -- Initial tests good, re-test with differing line data
// MODULE REBUILT TO TRANSITION TO CAPPER GRADES
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

// below REBUILT FOR SQL -- INITIAL TEST GOOD, RUN AGAIN ONCE PICKS ADDED TO ENSURE PROPERLY ADDED TO ARRAYS
setInterval(function (){
  var now = moment();
  pickArrays.buildArrays().then(function(arrays){
    console.log(arrays)
  })
}, 900000)

// CAN LIKELY DELETE THIS BELOW ... SHOULDN'T NEED ANYMORE?
// router.param('EventID', function(req, res, next, EventID) {
//   var query = Result.find({ EventID: EventID });
//
//   query.exec(function (err, result) {
//     if (err) { next(err) }
//     if (!result) {return next(new Error("can't find game")); }
//
//     req.result = result;
//     return next();
//   })
// })

// REBUILT FOR SQL, NOT TESTED YET
router.get('/weeklyStats/:username', function(req, res, next){
  var username = req.params.username;
  var weekArray = [];
  Picks().pluck('Week').distinct().then(function(weeks){
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
      return Picks().where({username: username, Week: week}).then(function(results){

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
