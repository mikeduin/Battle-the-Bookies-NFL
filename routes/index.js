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
var setLineRanges = require('../modules/setLineRanges.js');
var setCapperGrades = require('../modules/setCapperGrades.js');
var buildPickArrays = require('../modules/buildPickArrays.js');

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
  logLineMoves.logLineMoves();
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
  // hide triple-week setting in offseason
  // var week = setWeek.weekSetter(moment());
  // var week2 = setWeek.weekSetter(moment().add(1, 'w'));
  // var week3 = setWeek.weekSetter(moment().subtract(1, 'w'));

  Line.find({
    Week: {
      $nin: ["Preseason", "Postseason"],
      // $in: [week, week2, week3]
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
      weekNumbers.push(weekNumber);
    };
    weekNumbers.sort(sortNumber);
    console.log('weekNumbers are ', weekNumbers);
    for (i=0; i<weekNumbers.length; i++) {
      var newWeek = "Week " + weekNumbers[i];
      if (newWeek !== 'Week NaN') {
        newWeeks.push(newWeek)
      };
    }

    console.log('new weeks are ', newWeeks);

    // temp replacement
    newWeeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10", "Week 11", "Week 12", "Week 13", "Week 14", "Week 15", "Week 16", "Week 17"];

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

// This massive function below runs every 3 minutes and -- if a game has started and has not yet had the subsequent actions performed -- (a) checks to see whether a game's pick ranges have been added to the original line data, (b) updates the CapperGrades for each pick, and (c) adds the pick arrays to the line data. Once completed, it sets all indicators to 'true' so that the functions do not needlessly repeat themselves in the future.

setInterval(function (){
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
    if (!games[0]) {
      console.log ('no line move objects need to be set');
      return
    };

    games.forEach(function(game){
      setLineRanges.setLineRanges(game)
    })
  })
}, 300000);

setInterval(function(){
  var now = moment();
  Line.find({
    MatchTime: {
      $lt: now
    },
    RangesSet: true,
    CapperGraded: {
      $in: [null, false]
    }
  }, function(err, games){
    if (err) {console.log(err)}

  }).then(function(games){
    if (!games[0]) {
      console.log ('no capper grades need to be set');
      return
    };
    games.forEach(function(game){
      return Pick.find({EventID: game.EventID}).then(function(picks){
        picks.forEach(function(pick){
          if (!pick.activePick) {
            return
          };

          setCapperGrades.setCapperGrades(pick);
        })
      }).then(function(){
        Line.findOneAndUpdate({EventID: game.EventID}, {$set:
          {
            CapperGraded: true
          }
        }, function(err, line){
          if (err) {console.log (err)}

          console.log('CapperGrades set for ', line.EventID)
        })
      })
    })
  })
}, 420000)

setInterval(function (){
  var now = moment();
  Line.find({
    MatchTime: {
      $lt: now
    },
    ArraysBuilt: {
      $in: [false, null]
    },
    CapperGraded: true
  }, function(err, games){
    if(err) {console.log(err)}

  }).then(function(games){
    if (!games[0]) {
      console.log('no pick arrays needing to be built')
      return
    };

    games.forEach(function(game){
      buildPickArrays.buildPickArrays(game);
    })
  })
}, 900000)

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
  Pick.find().distinct('Week', function(err, weeks){
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
    };
    weekNumbers.sort(sortNumber);
    for (i=0; i<weekNumbers.length; i++) {
      var newWeek = "Week " + weekNumbers[i];
      newWeeks.push(newWeek)
    };

    Promise.all(newWeeks.map(function(week){
      return Pick.find({username: username, Week: week}).then(function(results){

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

module.exports = router;
