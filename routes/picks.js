var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var jwt = require('express-jwt');
var auth = jwt({secret: process.env.SESSION_SECRET, userProperty: 'payload'});
var setWeek = require('../modules/weekSetter.js');
var setWeekNumb = require('../modules/weekNumbSetter.js');

function Picks () {
  return knex('picks')
}

router.get('/', function (req, res, next){
  Picks().then(function(picks){
    res.json(picks);
  })
})

router.get('/:week', function (req, res, next){
  Picks().where({WeekNumb: req.params.week}).then(function(picks){
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

router.get('/:username/stats', function (req, res, next){
  Picks().where({username: req.params.username}).then(function(picks){
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

router.get('/:username/:weeknumb', function (req, res, next) {
  Picks().where({
    username: req.params.username,
    WeekNumb: req.params.weeknumb
  }).then(function(picks){
    res.json(picks);
  })
})

// Adding auth as middleware here will ensure that the JWTToken is valid in order for a user to be accessing this route
// TEST THIS TO MAKE SURE IT RETURNS / POSTS PROPERLY
router.post('/addTemp', auth, function (req, res, next){
  Picks().insert({
    username: req.payload.username,
    EventID: req.body.EventID,
    MatchDay: req.body.MatchDay,
    MatchTime: req.body.MatchTime,
    DateNumb: req.body.DateNumb,
    WeekNumb: setWeekNumb.weekNumbSetter(req.body.MatchTime),
    Week: setWeek.weekSetter(req.body.MatchTime),
    finalPayout: 0
  }, '*').then(function(pick){
    res.json(pick)
  })
})

// The following function both updates the user pick template with the user's actual pick and then updates the line's counters that track pick types.
// NEEDS TO BE TESTED

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
    } else if (pick[0].pickType === "Home Moneyline") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('MLHomePicks', 1)
    } else if (pick[0].pickType === "Home Spread") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('SpreadHomePicks', 1)
    } else if (pick[0].pickType === "Away Spread") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('SpreadAwayPicks', 1)
    } else if (pick[0].pickType === "Total Over") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('OverPicks', 1)
    } else if (pick[0].pickType === "Total Under") {
      Lines()
      .where({EventID: pick[0].EventID})
      .increment('UnderPicks', 1)
    } else {
      console.log("no pick type was found")
    };

    res.json(pick[0]);
  })

  // Pick.findOneAndUpdate({
  //   EventID: req.body.activeGame,
  //   username: req.payload.username,
  // }, {
  //   activePick: req.body.activePick,
  //   activeSpread: activeSpread,
  //   activeTotal: activeTotal,
  //   activeLine: req.body.activeLine,
  //   activePayout: req.body.activePayout,
  //   pickType: req.body.pickType,
  //   favType: req.body.favType,
  //   betType: req.body.betType,
  //   geoType: req.body.geoType,
  //   submittedAt: new Date()
  // }, {new: true}, function(err, pick) {
  //   if (err) {console.log(err)}
  //
  //   if (pick.pickType === "Away Moneyline") {
  //     Line.findOneAndUpdate({EventID: pick.EventID}, {
  //       $inc: {
  //         MLAwayPicks: 1
  //       }
  //     }, {new: true},
  //     function(err, line){
  //       if (err) {console.log(err)}
  //
  //     })
  //   } else if (pick.pickType === "Home Moneyline") {
  //     Line.findOneAndUpdate({EventID: pick.EventID}, {
  //       $inc: {
  //         MLHomePicks: 1
  //       }
  //     }, {new: true},
  //     function(err, line){
  //       if (err) {console.log(err)}
  //
  //     })
  //   } else if (pick.pickType === "Home Spread") {
  //     Line.findOneAndUpdate({EventID: pick.EventID}, {
  //       $inc: {
  //         SpreadHomePicks: 1
  //       }
  //     }, {new: true},
  //     function(err, line){
  //       if (err) {console.log(err)}
  //
  //     })
  //   } else if (pick.pickType === "Away Spread") {
  //     Line.findOneAndUpdate({EventID: pick.EventID}, {
  //       $inc: {
  //         SpreadAwayPicks: 1
  //       }
  //     }, {new: true},
  //     function(err, line){
  //       if (err) {console.log(err)}
  //
  //     })
  //   } else if (pick.pickType === "Total Over") {
  //     Line.findOneAndUpdate({EventID: pick.EventID}, {
  //       $inc: {
  //         OverPicks: 1
  //       }
  //     }, {new: true},
  //     function(err, line){
  //       if (err) {console.log(err)}
  //
  //     })
  //   } else if (pick.pickType === "Total Under") {
  //     Line.findOneAndUpdate({EventID: pick.EventID}, {
  //       $inc: {
  //         UnderPicks: 1
  //       }
  //     }, {new: true},
  //     function(err, line){
  //       if (err) {console.log(err)}
  //
  //     })
  //   } else {
  //     console.log("no pick type was found")
  //   }
  //
  //   res.json(pick);
  // })
})

module.exports = router;
