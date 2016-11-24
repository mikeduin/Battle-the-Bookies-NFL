var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'})
var fetch = require('node-fetch');
var moment = require('moment');
var mongoose = require('mongoose');
var passport = require('passport');

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
var logLineMoves = require('../modules/logLineMoves.js');
var checkStartTimes = require('../modules/checkStartTimes.js');
var addPickTemplates = require('../modules/addPickTemplates.js');

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

// This first function updates game results every nine minutes.

setInterval(function (){
  updateGameResults.updateGameResults()
}, 540000);

// The next function below looks for picks that have a finalPayout of ZERO (e.g., they have not been 'settled' yet) then checks to see if the Result of that pick's game is final. If the result IS final, it updates the picks with the HomeScore and AwayScore and sets 'Final' to true for that pick. THEN, it runs through each potential outcome based on PickType and updates the result variables accordingly.

setInterval(function (){
  updatePickResults.updatePickResults();
}, 600000);

// This function checks every seven minutes to see if new lines are available and, if so, adds them to the DB.

setInterval(function (){
  createLines.createLines();
}, 420000)

// This function runs every eight minutes and checks to see if a game is final and, if so, updates the line data with the final score and change's the game status

setInterval(function (){
  updateFinalScores.updateFinalScores();
}, 480000)

// The function below runs once every 35 mins and updates the LineMove arrays to track each game's line movement over the course of the week.

setInterval(function (){
  logLineMoves.logLineMoves();
}, 60000);

// The function below checks to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page. It runs roughly four times a day.

setInterval(function (){
  checkStartTimes.checkStartTimes();
}, 50000000)

// This function below checks every 12 minutes to see if new lines have been added, and if so, adds user pick templates for those lines to ensure results are displayed correctly and in the proper order.

setInterval(function (){
  addPickTemplates.addPickTemplates()
}, 720000)

// This next function is that which updates game lines. It runs on every page refresh or every 30 seconds otherwise (via a custom directive) within the application.

router.get('/updateOdds', function(req, res, next) {
  fetch('https://jsonodds.com/api/odds/nfl?oddType=Game', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': process.env.API_KEY
    }
  }).then(function(res){
    return res.json()
  }).then(function(odds){

    var bulk = Line.collection.initializeOrderedBulkOp();
    var counter = 0;

    for (i = 0; i < odds.length; i++) {

      bulk.find({EventID: odds[i].ID}).updateOne({
        $set : {
          MoneyLineHome: odds[i].Odds[0].MoneyLineHome,
          MoneyLineAway: odds[i].Odds[0].MoneyLineAway,
          PointSpreadHome: odds[i].Odds[0].PointSpreadHome,
          PointSpreadAway: odds[i].Odds[0].PointSpreadAway,
          PointSpreadAwayLine: odds[i].Odds[0].PointSpreadAwayLine,
          PointSpreadHomeLine: odds[i].Odds[0].PointSpreadHomeLine,
          TotalNumber: odds[i].Odds[0].TotalNumber,
          OverLine: odds[i].Odds[0].OverLine,
          UnderLine: odds[i].Odds[0].UnderLine
        }
      });
      counter++;

      if (counter % 1000 == 0) {
        bulk.execute(function(err, result){
          bulk = Line.collection.initializeOrderedBulkOp();
        });
      }
    };

    if (counter % 1000 != 0)
        bulk.execute(function(err,result) {
           console.log('odds bulk update completed at ' + new Date());
        });

    res.json(odds);
    }
  )
});

router.get('/line/:gameID', function(req, res, next){
  Line.find({EventID: req.params.gameID}, function(err, result){
    if (err) {console.log(err)}

    res.json(result)
  })
});

router.get('/linemove/:gameID', function(req, res, next){
  LineMove.find({EventID: req.params.gameID}, function(err, result){
    if (err) {console.log(err)}

    res.json(result)
  })
});

router.get('/lines', function(req, res, next){
  var week = setWeek.weekSetter(moment());
  var week2 = setWeek.weekSetter(moment().add(1, 'w'));
  var week3 = setWeek.weekSetter(moment().subtract(1, 'w'));

  Line.find({
    Week: {
      $nin: ["Preseason", "Postseason"],
      $in: [week, week2, week3]
    }
  }, function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.get('/weeks', function(req, res, next){
  Line.find().distinct('Week', function(err, weeks){
    if (err) {console.log (err)}

    var weekNumbers = [];
    var newWeeks = [];
    for (i=0; i<weeks.length; i++) {
      var weekNumber = parseInt(weeks[i].substring(5));
      weekNumbers.push(weekNumber)
    }
    weekNumbers.sort(sortNumber);
    for (i=0; i<weekNumbers.length; i++) {
      var newWeek = "Week " + weekNumbers[i];
      newWeeks.push(newWeek)
    }

    res.json(newWeeks)
  })
})

router.get('/lines/:week', function(req, res, next){
  var week;
  if (req.params.week.length === 1) {
    week = "0"+req.params.week
  } else {
    week = req.params.week
  };

  Line.find({
    WeekNumb: week
  }, function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.get('/matchups', function(req, res, next){
  Line.find(function(err, games){
    if (err) {console.log(err)}

    var matchups = {};
    for (var i=0; i<games.length; i++){
      var id = games[i].EventID;
      var obj = {}

      matchups[id] = {
        "HomeAbbrev": games[i].HomeAbbrev,
        "AwayAbbrev": games[i].AwayAbbrev
      }
    }

    res.json(matchups);
  })
})

router.get('/results', function(req, res, next){
  Result.find(function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.get('/pullGame/:gameID', function(req, res, next){
  PickArray.find({
    EventID: req.params.gameID
  }, function(err, arrays){
    if (err) {console.log(err)}

    res.json(arrays);
  })
})

// This massive function below runs every 5 minutes and -- if a game has started and has not yet had the subsequent actions performed -- (a) checks to see whether a game's pick ranges have been added to the original line data, (b) updates the CapperGrades for each pick, and (c) adds the pick arrays to the line data. Once completed, it sets all indicators to 'true' so that the functions do not needlessly repeat themselves in the future.

setInterval(function addPickRanges(){
  var now = moment();
  Line.find({
    MatchTime: {
      $lt: now
    },
    RangesSet: {
      $in: [false, null]
    },
    Week: {
      $nin: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
    }
  }, function(err, games){
    if (err) {console.log(err)}

  }).then(function(games){
    games.forEach(function(game){
      LineMove.find({EventID: game.EventID}, function(err, gameArrays){
        if(err) {console.log(err)}

      }).then(function(gameArrays){

        var homeSpreads = gameArrays[0].HomeSpreads;
        var homeSpreadJuices = gameArrays[0].HomeSpreadJuices;
        var awaySpreads = gameArrays[0].AwaySpreads;
        var awaySpreadJuices = gameArrays[0].AwaySpreadJuices;
        var homeMLs = gameArrays[0].HomeMLs;
        var awayMLs = gameArrays[0].AwayMLs;
        var totals = gameArrays[0].Totals;
        var totalOverJuices = gameArrays[0].TotalOverJuices;
        var totalUnderJuices = gameArrays[0].TotalUnderJuices;

        var awayMLValues = [];
        var homeMLValues = [];

        var awaySpreadValues = [];
        var awaySpreadBestJuices = [];
        var awaySpreadObject = {};

        var homeSpreadValues = [];
        var homeSpreadBestJuices = [];
        var homeSpreadObject = {};

        var totalValues = [];
        var totalOverBestJuices = [];
        var totalOverObject = {};
        var totalUnderBestJuices = [];
        var totalUnderObject = {};

        for (var i=0; i<awayMLs.length; i++){
          if (awayMLValues.indexOf(awayMLs[i]) === -1 && awayMLs[i] !== null) {
            awayMLValues.push(awayMLs[i])
          }
        };

        for (var i=0; i<homeMLs.length; i++){
          if (homeMLValues.indexOf(homeMLs[i]) === -1 && homeMLs[i] !== null) {
            homeMLValues.push(homeMLs[i])
          }
        };

        // This loops through the timelog of AwaySpreads and pushes each unique spread into the awaySpreadValues array

        for (var i=0; i<awaySpreads.length; i++) {
          if (awaySpreadValues.indexOf(awaySpreads[i]) === -1 && awaySpreads[i] !== null) {
            awaySpreadValues.push(awaySpreads[i])
          }
        };
        awaySpreadValues.sort();

        // This loops through each spread value and finds the best juice that was ever available for that spread, then writes the values to the awaySpreadObject

        for (var i=0; i<awaySpreadValues.length; i++) {
          var juicesArray = [];
          for (var j=0; j<awaySpreads.length; j++) {
            if (awaySpreads[j] === awaySpreadValues[i]) {
              juicesArray.push(awaySpreadJuices[j])
            };
          };
          var bestJuice = Array.max(juicesArray);
          awaySpreadBestJuices.push(bestJuice);
        };

        awaySpreadObject['spreads'] = awaySpreadValues;
        awaySpreadObject['juices'] = awaySpreadBestJuices;

        for (var i=0; i<homeSpreads.length; i++) {
          if (homeSpreadValues.indexOf(homeSpreads[i]) === -1 && homeSpreads[i] !== null) {
            homeSpreadValues.push(homeSpreads[i])
          }
        };
        homeSpreadValues.sort();

        for (var i=0; i<homeSpreadValues.length; i++) {
          var juicesArray = [];
          for (var j=0; j<homeSpreads.length; j++) {
            if (homeSpreads[j] === homeSpreadValues[i]) {
              juicesArray.push(homeSpreadJuices[j])
            };
          };
          var bestJuice = Array.max(juicesArray);
          homeSpreadBestJuices.push(bestJuice);
        };

        homeSpreadObject['spreads'] = homeSpreadValues;
        homeSpreadObject['juices'] = homeSpreadBestJuices;

        for (var i=0; i<totals.length; i++) {
          if (totalValues.indexOf(totals[i]) === -1 && totals[i] !== null) {
            totalValues.push(totals[i])
          }
        };
        totalValues.sort();

        for (var i=0; i<totalValues.length; i++) {
          var juicesArray = [];
          for (var j=0; j<totals.length; j++) {
            if (totals[j] === totalValues[i]) {
              juicesArray.push(totalOverJuices[j])
            };
          };
          var bestJuice = Array.max(juicesArray);
          totalOverBestJuices.push(bestJuice);
        };

        totalOverObject['totals'] = totalValues;
        totalOverObject['juices'] = totalOverBestJuices;

        for (var i=0; i<totalValues.length; i++) {
          var juicesArray = [];
          for (var j=0; j<totals.length; j++) {
            if (totals[j] === totalValues[i]) {
              juicesArray.push(totalUnderJuices[j])
            };
          };
          var bestJuice = Array.max(juicesArray);
          totalUnderBestJuices.push(bestJuice);
        };

        totalUnderObject['totals'] = totalValues;
        totalUnderObject['juices'] = totalUnderBestJuices;

        var awayMLLow = Array.min(awayMLValues);
        var awayMLHigh = Array.max(awayMLValues);
        var homeMLLow = Array.min(homeMLValues);
        var homeMLHigh = Array.max(homeMLValues);
        var homeSpreadLow = Array.min(homeSpreadValues);
        var homeSpreadHigh = Array.max(homeSpreadValues);
        var awaySpreadLow = Array.min(awaySpreadValues);
        var awaySpreadHigh = Array.max(awaySpreadValues);
        var totalHigh = Array.max(totalValues);
        var totalLow = Array.min(totalValues);

        Line.findOneAndUpdate({EventID: game.EventID}, {
          $set: {
            AwaySpreadIndex: awaySpreadObject,
            HomeSpreadIndex: homeSpreadObject,
            TotalOverIndex: totalOverObject,
            TotalUnderIndex: totalUnderObject,
            AwayMLBest: awayMLHigh,
            AwayMLWorst: awayMLLow,
            HomeMLBest: homeMLHigh,
            HomeMLWorst: homeMLLow,
            TotalHigh: totalHigh,
            TotalLow: totalLow,
            HomeSpreadBest: homeSpreadHigh,
            HomeSpreadWorst: homeSpreadLow,
            AwaySpreadBest: awaySpreadHigh,
            AwaySpreadWorst: awaySpreadLow,
            RangesSet: true
          }
        }, function(err){
          if (err) {console.log(err)};

          console.log("line move objects have been set for ", game.EventID);
        });
      })
    })
  }).then(function setCapperGrades(){
    var now = moment();
    // This upcoming chain of functions sets a pick's CapperGrades score if the game has started and the CapperGrades have not previously been set
    Pick.find({
      MatchTime: {
        $lt: now
      },
      Week: {
        $nin: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
      },
      capperGraded: {
        $in: [false, null]
      }
    }, function(err, picks){
      if (err) {console.log(err)}

    }).then(function(picks){
      picks.forEach(function(pick){
        if (!pick.activePick) {
          return
        };

        var startGrade = 10;
        var capperGrade;
        var bestLineAvail;
        var bestJuiceAvail;
        var pickID = pick._id;
        Line.find({EventID: pick.EventID}, function(err, line){
          if (err) {console.log(err)}

          if (pick.pickType === "Away Spread") {
            bestLineAvail = line[0].AwaySpreadBest;
            if (pick.activeSpread > bestLineAvail) {
              bestLineAvail = pick.activeSpread
            };
            startGrade -= (bestLineAvail - pick.activeSpread);
            var sprIndex = line[0].AwaySpreadIndex.spreads.indexOf(pick.activeSpread);
            bestJuiceAvail = line[0].AwaySpreadIndex.juices[sprIndex];
            if (pick.activeLine > bestJuiceAvail) {
              bestJuiceAvail = pick.activeLine
            };
            if (bestJuiceAvail < 1) {
              capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
            } else {
              if (pick.activeLine < 1) {
                capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
              } else {
                capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
              }
            }
          } else if (pick.pickType === "Home Spread") {
            bestLineAvail = line[0].HomeSpreadBest;
            if (pick.activeSpread > bestLineAvail) {
              bestLineAvail = pick.activeSpread
            };
            startGrade -= (bestLineAvail - pick.activeSpread);
            var sprIndex = line[0].HomeSpreadIndex.spreads.indexOf(pick.activeSpread);
            bestJuiceAvail = line[0].HomeSpreadIndex.juices[sprIndex];
            if (pick.activeLine > bestJuiceAvail) {
              bestJuiceAvail = pick.activeLine
            };
            if (bestJuiceAvail < 1) {
              capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
            } else {
              if (pick.activeLine < 1) {
                capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
              } else {
                capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
              }
            }
          } else if (pick.pickType === "Away Moneyline") {
            bestLineAvail = line[0].AwayMLBest;
            bestJuiceAvail = 0;
            if (pick.activeLine > bestLineAvail) {
              bestLineAvail = pick.activeLine
            };
            if (bestLineAvail < 1) {
              startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
            } else {
              if (pick.activeLine < 1) {
                startGrade -= (((bestLineAvail - (pick.activeLine+200))/20)*0.5)
              } else {
                startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
              }
            }
            capperGrade = startGrade;
          } else if (pick.pickType === "Home Moneyline") {
            bestLineAvail = line[0].HomeMLBest;
            bestJuiceAvail = 0;
            if (pick.activeLine > bestLineAvail) {
              bestLineAvail = pick.activeLine
            };
            if (bestLineAvail < 1) {
              startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
            } else {
              if (pick.activeLine < 1) {
                startGrade -= (((bestLineAvail - (pick.activeLine+200))/20)*0.5)
              } else {
                startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
              }
            }
            capperGrade = startGrade;
          } else if (pick.pickType === "Total Over") {
            bestLineAvail = line[0].TotalLow;
            if (pick.activeTotal < bestLineAvail) {
              bestLineAvail = pick.activeTotal
            };
            startGrade -= (pick.activeTotal - bestLineAvail);
            var totIndex = line[0].TotalOverIndex.totals.indexOf(pick.activeTotal);
            bestJuiceAvail = line[0].TotalOverIndex.juices[totIndex];
            if (pick.activeLine > bestJuiceAvail) {
              bestJuiceAvail = pick.activeLine
            };
            if (bestJuiceAvail < 1) {
              capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
            } else {
              if (pick.activeLine < 1) {
                capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
              } else {
                capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
              }
            }
          } else if (pick.pickType === "Total Under"){
            bestLineAvail = line[0].TotalHigh;
            if (pick.activeTotal > bestLineAvail) {
              bestLineAvail = pick.activeTotal
            };
            startGrade -= (bestLineAvail - pick.activeTotal);
            var totIndex = line[0].TotalUnderIndex.totals.indexOf(pick.activeTotal);
            bestJuiceAvail = line[0].TotalUnderIndex.juices[totIndex];
            if (pick.activeLine > bestJuiceAvail) {
              bestJuiceAvail = pick.activeLine
            };
            if (bestJuiceAvail < 1) {
              capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
            } else {
              if (pick.activeLine < 1) {
                capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
              } else {
                capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
              }
            }
          } else {
            return
          };

          Pick.findOneAndUpdate({_id: pickID}, {
            $set: {
              capperGrade: capperGrade,
              capperGraded: true,
              bestLineAvail: bestLineAvail,
              bestJuiceAvail: bestJuiceAvail
            }
          }, {upsert: true}, function(err){
            if (err) {console.log(err)}

            console.log(pickID, " has been updated")
          });
        })
      })
    })
  })
  .then(setTimeout(function createPickObjects(){
    var now = moment();
    Line.find({
      MatchTime: {
        $lt: now
      },
      ArraysBuilt: {
        $in: [false, null]
      }
    }, function(err, games){
      if(err) {console.log(err)}

    }).then(function(games){
      if (!games) {
        return
      };

      games.forEach(function(game){
        var overPickArray = [];
        var underPickArray = [];
        var homeSpreadPickArray = [];
        var awaySpreadPickArray = [];
        var homeMLPickArray = [];
        var awayMLPickArray = [];
        var noPickArray = [];
        Pick.find({EventID: game.EventID}, function(err, picks){
          if(err) {console.log(err)}

        }).then(function(picks){
          picks.forEach(function(pick){
            var relevantLine;
            if (pick.pickType === "Total Over" || pick.pickType === "Total Under") {
              relevantLine = pick.activeTotal
            } else if (pick.pickType === "Home Spread" || pick.pickType === "Away Spread") {
              relevantLine = pick.activeSpread
            } else {
              relevantLine = pick.activeLine
            };
            var pickObject = {
              id: pick.id,
              username: pick.username,
              submittedAt: pick.submittedAt,
              pickType: pick.pickType,
              geoType: pick.geoType,
              betType: pick.betType,
              favType: pick.favType,
              activePayout: pick.activePayout,
              activePick: pick.activePick,
              activeLine: pick.activeLine,
              capperGrade: pick.capperGrade,
              relevantLine: relevantLine
            };
            if (pick.pickType === "Total Over") {
              overPickArray.push(pickObject)
            } else if (pick.pickType === "Total Under") {
              underPickArray.push(pickObject)
            } else if (pick.pickType === "Away Spread") {
              awaySpreadPickArray.push(pickObject)
            } else if (pick.pickType === "Home Spread") {
              homeSpreadPickArray.push(pickObject)
            } else if (pick.pickType === "Away Moneyline") {
              awayMLPickArray.push(pickObject)
            } else if (pick.pickType === "Home Moneyline") {
              homeMLPickArray.push(pickObject)
            } else {
              noPickArray.push(pickObject)
            };
          })

        }).then(function buildPickArrays(){
          PickArray.findOneAndUpdate({EventID: game.EventID}, {
            $set: {
              EventID: game.EventID,
              OverPickArray: overPickArray,
              UnderPickArray: underPickArray,
              AwaySpreadPickArray: awaySpreadPickArray,
              HomeSpreadPickArray: homeSpreadPickArray,
              AwayMLPickArray: awayMLPickArray,
              HomeMLPickArray: homeMLPickArray,
              NoPickArray: noPickArray
            }
          }, {upsert: true}, function(err){
            if(err) {console.log(err)}

            console.log("arrays have been built for", game.EventID)

          })
        }).then(function(){
          Line.findOneAndUpdate({EventID: game.EventID}, {$set:
            {
              ArraysBuilt: true
            }
          }, function(err, updatedLine){
            if (err) {console.log(err)}

            console.log('arrays built set to true for', updatedLine.EventID)
          })
        })
      })
    })
  }, 60000))
}, 300000)

router.param('EventID', function(req, res, next, EventID) {
  var query = Result.find({ EventID: EventID });

  query.exec(function (err, result) {
    if (err) { next(err) }
    if (!result) {return next(new Error("can't find game")); }

    req.result = result;
    return next();
  })
})

// END RESULTS ROUTES
// BEGIN PICK ROUTES

router.get('/picks', function (req, res, next){
  Pick.find(function(err, picks){
    if(err) { next(err) }

    res.json(picks)
  })
})

router.get('/picks/:week', function (req, res, next){
  Pick.find({
    WeekNumb: req.params.week
  }, function(err, picks){
    if(err) { next(err) }

    res.json(picks)
  })
})

router.get('/picks/checkSubmission/:EventID', auth, function(req, res, next){
  Pick.find({
    username: req.payload.username,
    EventID: req.params.EventID
  }, function(err, pick){
    if (err) {console.log(err)}

    res.json(pick)
  })
})

router.get('/picks/:username/all', function (req, res, next) {
  Pick.find({
    username: req.params.username
  }, function(err, result){
    if(err) {console.log(err)}

    res.json(result)
  })
})

router.get('/weeklyStats/:username', function(req, res, next){
  var username = req.params.username;
  var weekArray = [];
  Pick.find().distinct('Week',function(err, weeks){
    if (err) {console.log(err)}

    weekArray = weeks;
    weeks = weekArray.sort();
    return weeks
  }).then(function(weeks){

    var weekNumbers = [];
    var newWeeks = [];
    for (i=0; i<weeks.length; i++) {
      var weekNumber = parseInt(weeks[i].substring(5));
      weekNumbers.push(weekNumber)
    }
    weekNumbers.sort(sortNumber);
    for (i=0; i<weekNumbers.length; i++) {
      var newWeek = "Week " + weekNumbers[i];
      newWeeks.push(newWeek)
    }

    Promise.all(newWeeks.map(function(week){
      return Pick.find({username: username, Week: week}).then(function(results){

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
              MatchDay = result.MatchDay;
              totalDollars += result.finalPayout;
              totalGames += 1;
              totalWins += result.resultBinary;
              totalLosses += (1-result.resultBinary);
            }
        })

        return {username: username, week: week, MatchDay: MatchDay, totalDollars: totalDollars, totalWins: totalWins, totalLosses: totalLosses, totalGames: totalGames}
      })

    })).then(function(userArray){
      res.json(userArray)
    })
  })
})

router.get('/picks/:username/stats', function (req, res, next){
  Pick.find({
    username: req.params.username
  }, function(err, picks){
    if (err) {console.log(err)}

    var awaySpreadPicks = 0;
    var homeSpreadPicks = 0;
    var awayMlPicks = 0;
    var homeMlPicks = 0;
    var totalOverPicks = 0;
    var totalUnderPicks = 0;
    var favPicks = 0;
    var dogPicks = 0;

    for (i=0; i<picks.length; i++) {
      if (picks[i].pickType === "Away Moneyline"){
        awayMlPicks += 1;
      } else if (picks[i].pickType === "Home Moneyline"){
        homeMlPicks += 1;
      } else if (picks[i].pickType === "Away Spread"){
        awaySpreadPicks += 1;
      } else if (picks[i].pickType === "Home Spread"){
        homeSpreadPicks += 1;
      } else if (picks[i].pickType === "Total Over"){
        totalOverPicks += 1;
      } else if (picks[i].pickType === "Total Under"){
        totalUnderPicks += 1;
      } else {
        null
      };

      if (picks[i].favType === "Favorite") {
        favPicks += 1
      } else if (picks[i].favType === "Underdog") {
        dogPicks += 1
      } else {
        null
      };
    }

    res.json({
      awayMlPicks: awayMlPicks,
      homeMlPicks: homeMlPicks,
      awaySpreadPicks: awaySpreadPicks,
      homeSpreadPicks: homeSpreadPicks,
      totalOverPicks: totalOverPicks,
      totalUnderPicks: totalUnderPicks,
      favPicks: favPicks,
      dogPicks: dogPicks
    })
  })
})

router.get('/picks/:username/:weeknumb', function (req, res, next) {
  Pick.find({
    username: req.params.username,
    WeekNumb: req.params.weeknumb
  }, function(err, result){
    if(err) {console.log(err)}

    res.json(result)
  })
})

// Adding auth as middleware here will ensure that the JWTToken is valid in order for a user to be accessing this route
router.post('/picks/addTemp', auth, function (req, res, next){
  var pick = Pick({
    username: req.payload.username,
    EventID: req.body.EventID,
    MatchDay: req.body.MatchDay,
    MatchTime: req.body.MatchTime,
    DateNumb: req.body.DateNumb,
    WeekNumb: setWeekNumb.weekNumbSetter(req.body.MatchTime),
    Week: setWeek.weekSetter(req.body.MatchTime),
    finalPayout: 0
  });

  pick.save(function(err, pick){
    if (err) {console.log(err)}

    res.json(pick);
  })
})

// The following function both updates the user pick template with the user's actual pick and then updates the line's counters that track pick types.

router.put('/picks', auth, function(req, res, next){
  var activeSpread;
  var activeTotal;
  if (req.body.activeSpread) {
    activeSpread = req.body.activeSpread
  } else {
    activeSpread = 0;
  };
  if (req.body.activeTotal) {
    activeTotal = req.body.activeTotal
  } else {
    activeTotal = 0;
  };

  Pick.findOneAndUpdate({
    EventID: req.body.activeGame,
    username: req.payload.username,
  }, {
    activePick: req.body.activePick,
    activeSpread: activeSpread,
    activeTotal: activeTotal,
    activeLine: req.body.activeLine,
    activePayout: req.body.activePayout,
    pickType: req.body.pickType,
    favType: req.body.favType,
    betType: req.body.betType,
    geoType: req.body.geoType,
    submittedAt: new Date()
  }, {new: true}, function(err, pick) {
    if (err) {console.log(err)}

    if (pick.pickType === "Away Moneyline") {
      Line.findOneAndUpdate({EventID: pick.EventID}, {
        $inc: {
          MLAwayPicks: 1
        }
      }, {new: true},
      function(err, line){
        if (err) {console.log(err)}

      })
    } else if (pick.pickType === "Home Moneyline") {
      Line.findOneAndUpdate({EventID: pick.EventID}, {
        $inc: {
          MLHomePicks: 1
        }
      }, {new: true},
      function(err, line){
        if (err) {console.log(err)}

      })
    } else if (pick.pickType === "Home Spread") {
      Line.findOneAndUpdate({EventID: pick.EventID}, {
        $inc: {
          SpreadHomePicks: 1
        }
      }, {new: true},
      function(err, line){
        if (err) {console.log(err)}

      })
    } else if (pick.pickType === "Away Spread") {
      Line.findOneAndUpdate({EventID: pick.EventID}, {
        $inc: {
          SpreadAwayPicks: 1
        }
      }, {new: true},
      function(err, line){
        if (err) {console.log(err)}

      })
    } else if (pick.pickType === "Total Over") {
      Line.findOneAndUpdate({EventID: pick.EventID}, {
        $inc: {
          OverPicks: 1
        }
      }, {new: true},
      function(err, line){
        if (err) {console.log(err)}

      })
    } else if (pick.pickType === "Total Under") {
      Line.findOneAndUpdate({EventID: pick.EventID}, {
        $inc: {
          UnderPicks: 1
        }
      }, {new: true},
      function(err, line){
        if (err) {console.log(err)}

      })
    } else {
      console.log("no pick type was found")
    }

    res.json(pick);
  })
})

// END PICK ROUTES
// BEGIN USER ROUTES

router.get('/users', function (req, res, next){
  User.find(function(err, users){
    if (err) {console.log(err)}

    res.json(users)
  })
})

router.get('/users/:username', function (req, res, next){
  User.find({
    username: req.params.username
  }, function(err, user){
    if (err) {console.log(err)}

    res.json(user)
  })
})

// END USER ROUTES
// BEGIN AUTH ROUTES

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.nameFirst || !req.body.nameLast || !req.body.email || !req.body.buyin
  ){
    return res.status(400).json({message: 'You left something blank!'});
  }

  // User.findOne({
  //   username: req.body.username
  // }, function(err, username, next){
  //   if(username) {
  //     return res.status(400).json({message: 'That username already exists.'})
  //   } else {
      var user = new User();

      user.username = req.body.username;
      user.nameFirst = req.body.nameFirst;
      user.nameLast = req.body.nameLast;
      user.email = req.body.email;
      user.buyin = req.body.buyin;
      user.setPassword(req.body.password);

      console.log(user);

      user.save(function (err){
        if(err){ console.log(err); }

        console.log(user + 'has been added to db!');
        res.json({token: user.generateJWT()})
      });
  //   }
  // })

});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'You forgot to include either your username or your password!'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

// END AUTH ROUTES

module.exports = router;
