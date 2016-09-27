var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'})
var fetch = require('node-fetch');
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index.html');
});

var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Line = mongoose.model('Line');
var Result = mongoose.model('Result');
var Pick = mongoose.model('Pick');
var abbrevs = require('../modules/abbrevs.js');
var helmets = require('../modules/helmets.js');
var colors = require('../modules/colors.js');
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');

// BEGIN ROUTES TO AUTO-UPDATE ODDS + RESULTS (FROM API) AND USER PICKS (FROM DB)

// This first function updates game results.

setInterval(function(){
  fetch('https://jsonodds.com/api/results/nfl?oddType=Game', {
    method: 'GET',
    headers: {
      'JsonOdds-API-Key': process.env.API_KEY
    }
  }).then(function(res){
    return res.json()
  }).then(function(results){

    var bulk = Result.collection.initializeOrderedBulkOp();
    var counter = 0;

    for (i = 0; i < results.length; i++) {
      bulk.find({EventID: results[i].ID}).upsert().updateOne({
        $set: {
          EventID: results[i].ID,
          HomeScore: results[i].HomeScore,
          AwayScore: results[i].AwayScore,
          OddType: results[i].OddType,
          Final: results[i].Final,
          FinalType: results[i].FinalType
        }
      });
      counter++;

      if (counter % 1000 == 0) {
        bulk.execute(function(err, res){
          bulk = Result.collection.initializeOrderedBulkOp();
        });
      }
    };

    if (counter % 1000 != 0)
        bulk.execute(function(err,res) {
           console.log('results bulk update completed at ' + new Date());
        });
    // res.json(odds);
  })
}, 60000)

// The next function below looks for picks that have a finalPayout of ZERO (e.g., they have not been 'settled' yet) then checks to see if the Result of that pick's game is final. If the result IS final, it updates the picks with the HomeScore and AwayScore and sets 'Final' to true for that pick. THEN, it runs through each potential outcome based on PickType and updates the result variables accordingly.

setInterval(function(){
  Pick.find({finalPayout: 0}, function (err, picks){
    if (err) {console.log(err)}

  }).then(function(picks){
    picks.forEach(function(pick){
      var HomeScore;
      var AwayScore;
      Result.findOne({EventID: pick.EventID}, function (err, result){
        if(err) {next(err)};

        if(!result) {return};

        if(result.Final === true) {
          var HomeScore = result.HomeScore;
          var AwayScore = result.AwayScore;

          Pick.update({"_id": pick._id}, {
            HomeScore: HomeScore,
            AwayScore: AwayScore,
            Final: true
          }, function (err, pick) {
            if (err) {console.log(err)}

          })
        }
      }).then(function(result){
        Pick.find({EventID: result.EventID}, function(err, picks){
          if (err) {console.log(err)}

        }).then(function(picks){
          picks.forEach(function(pick){
            var activePayout = pick.activePayout;

            if (pick.Final === true) {

              if (
                ((pick.pickType === "Away Moneyline") && (pick.AwayScore > pick.HomeScore))
                ||
                ((pick.pickType === "Home Moneyline") && (pick.HomeScore > pick.AwayScore))
                ||
                ((pick.pickType === "Away Spread") && ((pick.activeSpread + pick.AwayScore) > pick.HomeScore))
                ||
                ((pick.pickType === "Home Spread") && ((pick.activeSpread + pick.HomeScore) > pick.AwayScore))
                ||
                ((pick.pickType === "Total Over") && ((pick.HomeScore + pick.AwayScore) > pick.activeTotal))
                ||
                ((pick.pickType === "Total Under") && ((pick.HomeScore + pick.AwayScore) < pick.activeTotal))
              ) {
                  Pick.update({"_id": pick._id}, {
                    pickResult: "win",
                    resultBinary: 1,
                    finalPayout: activePayout,
                  }, function(err, result){
                    if (err) {console.log(err)}
                  })
                } else if (
                  ((pick.pickType === "Away Moneyline") && (pick.AwayScore === pick.HomeScore))
                  ||
                  ((pick.pickType === "Home Moneyline") && (pick.HomeScore === pick.AwayScore))
                  ||
                  ((pick.pickType === "Away Spread") && ((pick.activeSpread + pick.AwayScore) === pick.HomeScore))
                  ||
                  ((pick.pickType === "Home Spread") && ((pick.activeSpread + pick.HomeScore) === pick.AwayScore))
                  ||
                  ((pick.pickType === "Total Over") && ((pick.HomeScore + pick.AwayScore) === pick.activeTotal))
                  ||
                  ((pick.pickType === "Total Under") && ((pick.HomeScore + pick.AwayScore) === pick.activeTotal))
                ) {
                    Pick.update({"_id": pick._id}, {
                      pickResult: "push",
                      resultBinary: 0.5,
                      finalPayout: 0.00001,
                    }, function(err, result){
                      if (err) {console.log(err)}
                    })
                  }
                 else
                {
                  Pick.update({"_id": pick._id}, {
                    pickResult: "loss",
                    resultBinary: 0,
                    finalPayout: -100,
                  }, function(err, result){
                    if (err) {console.log(err)}
                  })
                }
              }
            })
          })
        })
      })
    })
  console.log('picks updated at ' + new Date())
}, 60000)

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

      bulk.find({EventID: odds[i].ID}).upsert().updateOne({
        $set : {
          EventID: odds[i].ID,
          HomeTeam: odds[i].HomeTeam,
          AwayTeam: odds[i].AwayTeam,
          HomeAbbrev: abbrevs.teamAbbrev(odds[i].HomeTeam),
          AwayAbbrev: abbrevs.teamAbbrev(odds[i].AwayTeam),
          HomeHelmet: helmets.teamHelmet(odds[i].HomeTeam),
          AwayHelmet: helmets.teamHelmet(odds[i].AwayTeam),
          HomeColor: colors.teamColor(odds[i].HomeTeam),
          AwayColor: colors.teamColor(odds[i].AwayTeam),
          MatchTime: new Date(odds[i].MatchTime),
          MatchDay: moment(odds[i].MatchTime).utcOffset(-7).format('MMMM Do, YYYY'),
          DateNumb: parseInt(moment(odds[i].MatchTime).utcOffset(-7).format('YYYYMMDD')),
          Week: setWeek.weekSetter(odds[i].MatchTime),
          WeekNumb: setWeekNumb.weekNumbSetter(odds[i].MatchTime),
          OddType: odds[i].Odds[0].OddType,
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

// END ROUTES TO AUTO-UPDATE ODDS + RESULTS FROM API
// BEGIN LINE ROUTES

router.get('/lines', function(req, res, next){
  Line.find({
    Week: {
      $nin: ["Preseason", "Postseason"]
    }
  }, function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

router.get('/lines/:week', function(req, res, next){
  Line.find({
    WeekNumb: req.params.week
  }, function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

setInterval(function(){
  Line.find({
    MLHomePicks: {
      $exists: false
    }
  }, function(err, lines){
    if (err) {console.log(err)}

    lines.forEach(function(line){
      Line.findOneAndUpdate({EventID: line.EventID}, {
        MLHomePicks: 0,
        MLAwayPicks: 0,
        SpreadHomePicks: 0,
        SpreadAwayPicks: 0,
        OverPicks: 0,
        UnderPicks: 0
      }, function(err, line){
        console.log(line, " was updated")
      })
    })

    console.log("pick counters updated")
  })
}, 10000)

// This function checks to see if a game is final and, if so, updates the line data with the final score and change's the game status

setInterval(function(){
  Line.find({
    GameStatus: {
      $ne: "Final"
    }
  }, function(err, lines){
    if (err) {console.log(err)}
  }).then(function(lines){
    lines.forEach(function(line){
      Result.find({EventID: line.EventID}, function(err, result){
        if (err) {console.log(err)}

      }).then(function(result){
        if (result[0].Final === true) {
          Line.update({EventID: result[0].EventID}, {
            HomeScore: result[0].HomeScore,
            AwayScore: result[0].AwayScore,
            GameStatus: "Final"
          }, function(err, message){
            if(err) {console.log(err)}

            console.log("game final has been updated")
          })
        } else {
          console.log(result[0].EventID + " is not final")
        }
      })
    })
  })
}, 60000)

// END LINE ROUTES
// BEGIN RESULTS ROUTES

router.get('/results', function(req, res, next){
  Result.find(function(err, games) {
    if (err) { next(err) };

    res.json(games);
  })
})

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

// The function below checks every ten minutes to make sure that no game start times have been adjusted and then updates the associated picks with the new start times in order to show that games and picks are displayed in an identical order on the Results page.

setInterval(function(){
  Line.find({
    GameStatus: {
      $ne: "Final"
    }
  }, function (err, lines){
    if (err) {console.log(err)}

  }).then(function(lines){
    lines.forEach(function(line){
      Pick.update({
        EventID: line.EventID
      }, {
        MatchTime: line.MatchTime
      }, {
        multi: true
      },function(err, result){
        if (err) {console.log(err)}

      })
    })
  })
  console.log("matchtimes have been updated")
}, 600000)

// This function below checks every five minutes to see if new lines have been added, and if so, adds user pick templates for those lines to ensure results are displayed correctly and in the proper order.

setInterval(function(){
  User.find(function(err, users){
    if (err) {console.log(err)}

  }).then(function(users){
    users.forEach(function(user){
      Line.find({
        Week: {
          $nin: ["Preseason", "Postseason"]
        }
      }, function(err, lines){
        if (err) {console.log(err)}

      }).then(function(lines){
        lines.forEach(function(line){
          Pick.find({
            username: user.username,
            EventID: line.EventID
          }, function (err, pick){
            if (err) {console.log(err)}

            if(!pick[0]) {

              var template = Pick({
                username: user.username,
                EventID: line.EventID,
                MatchDay: line.MatchDay,
                MatchTime: line.MatchTime,
                Week: line.Week,
                DateNumb: line.DateNumb,
                WeekNumb: line.WeekNumb,
                finalPayout: 0
              });

              template.save(function(err, template){
                if (err) {console.log(err)}

                console.log(template + 'has been saved as a template!')
              })
            }
          })
        })
      })
    })
  })
  console.log("auto-templating complete")
}, 300000)

setInterval(function(){
  User.find(function(err, users){
    if(err) {console.log(err)}

  }).then(function(users){
    users.forEach(function(user){
      Pick.find({
        username: user.username
      }, function(err, result){
        if(err) {console.log(err)}

        var ytdPicks = result;
        var totalDollars = 0;
        var w1dollars = 0;
        var w1wins = 0;
        var w1games = 0;
        var w2dollars = 0;
        var w2wins = 0;
        var w2games = 0;
        var w3dollars = 0;
        var w3wins = 0;
        var w3games = 0;
        var w4dollars = 0;
        var w4wins = 0;
        var w4games = 0;
        var w5dollars = 0;
        var w5wins = 0;
        var w5games = 0;
        var w6dollars = 0;
        var w6wins = 0;
        var w6games = 0;
        var w7dollars = 0;
        var w7wins = 0;
        var w7games = 0;
        var w8dollars = 0;
        var w8wins = 0;
        var w8games = 0;
        var w9dollars = 0;
        var w9wins = 0;
        var w9games = 0;
        var w10dollars = 0;
        var w10wins = 0;
        var w10games = 0;
        var w11dollars = 0;
        var w11wins = 0;
        var w11games = 0;
        var w12dollars = 0;
        var w12wins = 0;
        var w12games = 0;
        var w13dollars = 0;
        var w13wins = 0;
        var w13games = 0;
        var w14dollars = 0;
        var w14wins = 0;
        var w14games = 0;
        var w15dollars = 0;
        var w15wins = 0;
        var w15games = 0;
        var w16dollars = 0;
        var w16wins = 0;
        var w16games = 0;
        var w17dollars = 0;
        var w17wins = 0;
        var w17games = 0;
        var totalW = 0;
        var totalG = 0;
        for (i=0; i<ytdPicks.length; i++) {
          var pickPayout = ytdPicks[i].finalPayout;
          var resultBinary = ytdPicks[i].resultBinary;
          var week = ytdPicks[i].Week
          if (typeof resultBinary === 'number') {
            if (week === "Week 1") {
              w1dollars += pickPayout;
              w1wins += resultBinary;
              w1games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 2"){
              w2dollars += pickPayout;
              w2wins += resultBinary;
              w2games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 3"){
              w3dollars += pickPayout;
              w3wins += resultBinary;
              w3games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 4"){
              w4dollars += pickPayout;
              w4wins += resultBinary;
              w4games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 5"){
              w5dollars += pickPayout;
              w5wins += resultBinary;
              w5games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 6"){
              w6dollars += pickPayout;
              w6wins += resultBinary;
              w6games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 7"){
              w7dollars += pickPayout;
              w7wins += resultBinary;
              w7games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 8"){
              w8dollars += pickPayout;
              w8wins += resultBinary;
              w8games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 9"){
              w9dollars += pickPayout;
              w9wins += resultBinary;
              w9games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 10"){
              w10dollars += pickPayout;
              w10wins += resultBinary;
              w10games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 11"){
              w11dollars += pickPayout;
              w11wins += resultBinary;
              w11games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 12"){
              w12dollars += pickPayout;
              w12wins += resultBinary;
              w12games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 13"){
              w13dollars += pickPayout;
              w13wins += resultBinary;
              w13games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 14"){
              w14dollars += pickPayout;
              w14wins += resultBinary;
              w14games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 15"){
              w15dollars += pickPayout;
              w15wins += resultBinary;
              w15games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 16"){
              w16dollars += pickPayout;
              w16wins += resultBinary;
              w16games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else if (week === "Week 17"){
              w17dollars += pickPayout;
              w17wins += resultBinary;
              w17games += 1;
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            } else {
              totalDollars += pickPayout;
              totalW += resultBinary;
              totalG += 1;
            }
          };
        }
        User.update({username: user.username}, {
          totalDollars: totalDollars,
          w1dollars: w1dollars,
          w1wins: w1wins,
          w1games: w1games,
          w2dollars: w2dollars,
          w2wins: w2wins,
          w2games: w2games,
          w3dollars: w3dollars,
          w3wins: w3wins,
          w3games: w3games,
          w4dollars: w4dollars,
          w4wins: w4wins,
          w4games: w4games,
          w5dollars: w5dollars,
          w5wins: w5wins,
          w5games: w5games,
          w6dollars: w6dollars,
          w6wins: w6wins,
          w6games: w6games,
          w7dollars: w7dollars,
          w7wins: w7wins,
          w7games: w7games,
          w8dollars: w8dollars,
          w8wins: w8wins,
          w8games: w8games,
          w9dollars: w9dollars,
          w9wins: w9wins,
          w9games: w9games,
          w10dollars: w10dollars,
          w10wins: w10wins,
          w10games: w10games,
          w11dollars: w11dollars,
          w11wins: w11wins,
          w11games: w11games,
          w12dollars: w12dollars,
          w12wins: w12wins,
          w12games: w12games,
          w13dollars: w13dollars,
          w13wins: w13wins,
          w13games: w13games,
          w14dollars: w14dollars,
          w14wins: w14wins,
          w14games: w14games,
          w15dollars: w15dollars,
          w15wins: w15wins,
          w15games: w15games,
          w16dollars: w16dollars,
          w16wins: w16wins,
          w16games: w16games,
          w17dollars: w17dollars,
          w17wins: w17wins,
          w17games: w17games,
          totalW: totalW,
          totalG: totalG,
          totalL: totalG - totalW,
          ytdPct: totalW/totalG
        }, function(err, data){
          if(err) {console.log(err)}

          console.log("user data has been updated")
        })
      })
    })
  })
}, 600000)

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
    Promise.all(weeks.sort().map(function(week){
      return Pick.find({username: username, Week: week}).then(function(results){

        var totalDollars = 0;
        var totalGames = 0;
        var totalWins = 0;
        var totalLosses = 0;
        var week;
        var username;

        results.forEach(function(result){
          // these results logged below are divided into EACH PICK
          // console.log('a pick-level result is: ' + result)
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

// router.get('/newWeeklyStats/:username', function(req, res, next){
//   var username = req.params.username;
//
// })

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
  console.log("this is the server weeknumb", req.params.weeknumb);
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
    console.log(pick + 'has been saved as a template!')
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

    console.log(pick + ' has been updated with pick submission info!');
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
  console.log(req.body);
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

  console.log(req.body);

  passport.authenticate('local', function(err, user, info){
    console.log(user);
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

// router.post('/forgot', function(req, res, next){
//   async.waterfall([
//     function(done) {
//       crypto.randomBytes(20, function(err, buf){
//         var token = buf.toString('hex');
//         done(err, token)
//       });
//     },
//     function(token, done){
//       User.findOne({ email: req.body.email }, function(err, user){
//         if (!user) {
//           return res.status(400).json({message: 'No account with that email address exists'});
//         }
//
//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000;
//
//         user.save(function(err){
//           done(err, token, user);
//         });
//       });
//     },
//     function(token, user, done){
//       var smtpTransport = nodemailer.createTransport('SMTP', {
//         service: 'Mailgun',
//         auth: {
//           user: process.env.MAILGUN_USER,
//           pass: process.env.MAILGUN_PW
//         }
//       });
//       var mailOptions = {
//         to: user.email,
//         from: 'mike@mg.mikeduin.com',
//         subject: 'Battle the Bookies Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       smtpTransport.sendMail(mailOptions, function(err, info){
//         console.log('Message sent: ' + info.response)
//         done(err, 'done');
//       })
//     }
//   ], function(err) {
//     if (err) return next (err);
//     // Need to change this below
//     res.redirect('/forgot')
//   });
// })
//
// router.get('/reset/:token', function(req, res) {
//   User.findOne({
//     resetPasswordToken: req.params.token, resetPasswordExpires: {
//       $gt: Date.now()
//     }
//   }, function(err, user) {
//     if (!user) {
//       return res.status(400).json({message: 'Password reset token is invalid or has expired'});
//     }
//     res.render('reset', {
//       user: req.user
//     });
//   });
// });

// END AUTH ROUTES

module.exports = router;
