var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'});
var fetch = require('node-fetch');
var moment = require('moment');
var passport = require('passport');
var knex = require('../db/knex');
// require('../modules/updateStandings');

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
var currentSeason = require('../modules/currentSeason.js');

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
  return userDb('users');
}

function UserSeasons() {
  return mainDb('user_seasons');
}


// This function updates a game with the earliest pick from a chosen matchup
// (async () => {
//   const matchup = "DAL @ BAL";
//   const season = 2020;
//   const users = await UserSeasons().where({season}).distinct('username').pluck('username');
//   const trueEventID = '0e17f302-92b5-410f-be6a-85eabf67de95';
//   users.forEach(async user => {
//     const picks = await Picks().where({username: user, season, matchup}).orderBy('submittedAt', 'asc');
//     console.log('picks are ', picks);
//     // const update = await Picks().where({
//     //   username: user,
//     //   EventID: trueEventID,
//     //   }).update({
//     //   submittedAt: picks[0].submittedAt,
//     //   activePick: picks[0].activePick,
//     //   activeSpread: picks[0].activeSpread,
//     //   activeTotal: picks[0].activeTotal,
//     //   activeLine: picks[0].activeLine,
//     //   activePayout: picks[0].activePayout,
//     //   pickType: picks[0].pickType,
//     //   favType: picks[0].favType,
//     //   betType: picks[0].betType,
//     //   geoType: picks[0].geoType,
//     // }, '*');
//     // console.log('pick has been updated for ', update[0].username);
//   })
//
// })

// This first function updates game results every 5 minutes.
// DISABLING FOR OFFSEASON
// setInterval(function (){
//   let dateCheck = false;
//   let pstMoment = moment().subtract(8, 'hours');
//   const noScoreDays = [2, 3, 5];
//
//   if (!noScoreDays.includes(moment(pstMoment).day()) && moment(pstMoment).hour() > 8) {
//     console.log('results being updated');
//     updateGameResults.updateGameResults();
//   } else {
//     console.log('results NOT being updated');
//   }
// }, 300000);

// This function checks every seven minutes to see if new lines are available and, if so, adds them to the DB.
// DISABLING FOR OFFSEASON
// setInterval(function (){
//   createLines.createLines();
// }, 420000);

// The function below runs once every 15 mins and updates the LineMove arrays to track each game's line movement over the course of the week.
// DISABLING FOR OFFSEASON
// setInterval(function (){
//   lineMoves.logAllLineMoves();
// }, 900000);

// The function below checks to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page. It runs roughly four times a day.
// DISABLING FOR OFFSEASON
// setInterval(function (){
//   checkStartTimes.checkStartTimes();
// }, 50000000);

// This function checks to make sure there are no stale lines in the DB, available for picking, which have been taken off the board in real life.
// DISABLING FOR OFFSEASON
// setInterval(() => {
//   checkActiveLines.checkActiveLines();
// }, 60000);

// This next function is that which updates game lines. It runs on every page refresh or every 30 seconds otherwise (via a custom directive) within the application.
// router.get('/updateOdds', function(req, res, next) {
//   fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
//     method: 'GET',
//     headers: {
//       'x-api-Key': process.env.API_KEY
//     }
//   }).then(function(res){
//     return res.json()
//   }).then(function(odds){
//       for (i=0; i<odds.length; i++) {
//         Lines().where({EventID: odds[i].ID}).update({
//           MoneyLineHome: odds[i].Odds[0].MoneyLineHome,
//           MoneyLineAway: odds[i].Odds[0].MoneyLineAway,
//           PointSpreadHome: odds[i].Odds[0].PointSpreadHome,
//           PointSpreadAway: odds[i].Odds[0].PointSpreadAway,
//           PointSpreadAwayLine: odds[i].Odds[0].PointSpreadAwayLine,
//           PointSpreadHomeLine: odds[i].Odds[0].PointSpreadHomeLine,
//           TotalNumber: odds[i].Odds[0].TotalNumber,
//           OverLine: odds[i].Odds[0].OverLine,
//           UnderLine: odds[i].Odds[0].UnderLine
//         }, '*').then(function(upd){
//           if (upd.length > 0) {
//             console.log('line ', upd[0].EventID, ' has been updated');
//           } else {
//             console.log('line not created yet')
//           }
//         })
//       };
//     }
//   ).then(function(){
//     return Lines();
//   }).then(function(updOdds){
//     console.log('updOdds are ', updOdds);
//     res.json(updOdds);
//   })
// });

// This next function is that which updates game lines. It runs on every page refresh or every 30 seconds otherwise (via a custom directive) within the application.
// DISABLING FOR OFFSEASON
// setInterval(function() {
//   fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
//     method: 'GET',
//     headers: {
//       'x-api-Key': process.env.API_KEY
//     }
//   }).then(function(res){
//     return res.json()
//   }).then(function(odds){
//       for (i=0; i<odds.length; i++) {
//         Lines().where({EventID: odds[i].ID}).update({
//           MatchTime: moment.utc(odds[i].MatchTime),
//           MatchDay: moment.utc(odds[i].MatchTime).format('MMMM Do, YYYY'),
//           MoneyLineHome: odds[i].Odds[0].MoneyLineHome,
//           MoneyLineAway: odds[i].Odds[0].MoneyLineAway,
//           PointSpreadHome: odds[i].Odds[0].PointSpreadHome,
//           PointSpreadAway: odds[i].Odds[0].PointSpreadAway,
//           PointSpreadAwayLine: odds[i].Odds[0].PointSpreadAwayLine,
//           PointSpreadHomeLine: odds[i].Odds[0].PointSpreadHomeLine,
//           TotalNumber: odds[i].Odds[0].TotalNumber,
//           OverLine: odds[i].Odds[0].OverLine,
//           UnderLine: odds[i].Odds[0].UnderLine
//         }, '*').then(function(upd){
//           if (upd.length > 0) {
//             console.log('line ', upd[0].EventID, ' has been updated');
//           } else {
//             console.log('line not created yet')
//           }
//         })
//       };
//     }
//   )
// }, 30000);

// This massive function below runs every 3 minutes and -- if a game has started and has not yet had the subsequent actions performed -- (a) checks to see whether a game's pick ranges have been added to the original line data, (b) updates the CapperGrades for each pick, and (c) adds the pick arrays to the line data. Once completed, it sets all indicators to 'true' so that the functions do not needlessly repeat themselves in the future.
// DISABLING FOR OFFSEASON
setInterval(function (){
  var season = currentSeason.returnSeason(new Date());
  Lines()
  .where('MatchTime', '<', new Date())
  .andWhere('RangesSet', null)
  .andWhere({season: season})
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

router.get('/updateOdds', async (req, res, next) => {
  const lines = await Lines();
  res.json(lines);
});

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
      console.log(userArray);
      res.json(userArray)
    })
  })
})

// END PICK ROUTES

module.exports = router;
