var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'});
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');
var moment = require('moment');
var currentSeason = require('../modules/currentSeason.js');

function Picks () {
  return knex('picks')
}

function Lines () {
  return knex('lines')
}

router.get('/', function (req, res, next){
  Picks().then(function(picks){
    res.json(picks);
  })
})

router.get('/season/:season/:week', function (req, res, next){
  Picks().where({
    season: req.params.season,
    WeekNumb: req.params.week,
  }).then(function(picks){
    res.json(picks);
  })
})

router.get('/checkSubmission/:EventID', auth, function(req, res, next){
  Picks().where({
    username: req.payload.username,
    EventID: req.params.EventID
  }).then(function(pick){
    res.json(pick);
  })
})

router.get('/:username/all', function (req, res, next) {
  Picks().where({username: req.params.username}).then(function(picks){
    res.json(picks);
  })
})

router.get('/:username/:season/all', function (req, res, next) {
  Picks().where({
    username: req.params.username,
    season: req.params.season
  }).then(function(picks){
    res.json(picks);
  })
})

router.get('/:username/stats/:season', function (req, res, next){
  Picks().where({
    username: req.params.username,
    season: req.params.season
  }).then(function(picks){
    var awaySpreadPicks = 0;
    var homeSpreadPicks = 0;
    var awayMlPicks = 0;
    var homeMlPicks = 0;
    var totalOverPicks = 0;
    var totalUnderPicks = 0;
    var favPicks = 0;
    var dogPicks = 0;

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

router.get('/:username/:season/:weeknumb', function (req, res, next) {
  if (req.params.weeknumb < 10) {
    var weekNumb = '0' + req.params.weeknumb
  } else {
    var weekNumb = req.params.weeknumb
  };
  Picks().where({
    username: req.params.username,
    season: req.params.season,
    WeekNumb: weekNumb
  }).then(function(picks){
    res.json(picks);
  })
})

// Adding auth as middleware here will ensure that the JWTToken is valid in order for a user to be accessing this route
router.post('/addTemp', auth, function (req, res, next){
  var pickSeason = currentSeason.returnSeason(moment());
  Picks().insert({
    username: req.payload.username,
    EventID: req.body.EventID,
    MatchDay: req.body.MatchDay,
    matchup: req.body.AwayAbbrev + ' @ ' + req.body.HomeAbbrev,
    MatchTime: req.body.MatchTime,
    DateNumb: req.body.DateNumb,
    WeekNumb: setWeekNumb.weekNumbSetter(req.body.MatchTime),
    Week: setWeek.weekSetter(req.body.MatchTime),
    finalPayout: 0,
    plan: req.payload.plan,
    season: pickSeason
  }, '*').then(function(pick){
    res.json(pick)
  })
})

// The following function both updates the user pick template with the user's actual pick and then updates the line's counters that track pick types.
router.put('/', auth, function(req, res, next){
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

  Picks().where({
    EventID: req.body.activeGame,
    username: req.payload.username
  }).update({
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
  }, '*').then(function(pick){
    if (pick[0].pickType === "Away Moneyline") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('MLAwayPicks', 1)
      .then(function(){
        console.log('MLAway picks have been incremented')
      });
    } else if (pick[0].pickType === "Home Moneyline") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('MLHomePicks', 1)
      .then(function(){
        console.log('MLHome picks have been incremented')
      });
    } else if (pick[0].pickType === "Home Spread") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('SpreadHomePicks', 1)
      .then(function(){
        console.log('SpreadHome picks have been incremented')
      });
    } else if (pick[0].pickType === "Away Spread") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('SpreadAwayPicks', 1)
      .then(function(){
        console.log('SpreadAway have been incremented')
      });
    } else if (pick[0].pickType === 'Total Over') {
      console.log('pick type is total over');
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('OverPicks', 1)
      .then(function(){
        console.log('Over picks have been incremented')
      });
    } else if (pick[0].pickType === "Total Under") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('UnderPicks', 1)
      .then(function(){
        console.log('Under picks have been incremented')
      });
    } else {
      console.log("no pick type was found")
    };

    res.json(pick[0]);
  })
})

module.exports = router;
