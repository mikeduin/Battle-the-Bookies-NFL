var express = require('express');
var router = express.Router();
var knex = require ('../db/knex');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var currentSeason = require('../modules/currentSeason.js');
require('dotenv').load();
const getSeasonUsers = require('../modules/getSeasonUsers');

var mainDb = knex.mainDb;
var userDb = knex.userDb;

function Users() {
  return userDb('users');
}

function Picks() {
  return mainDb('picks');
}

function UserSeasons () {
  return mainDb('user_seasons');
}

function generateJWT (user) {
  // this function sets expiration of token to 1000 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+ 1000);

  // this function below takes two arguments - the payload that will be signed by the JWT + the secret.
  return jwt.sign({
    _id: user[0]._id,
    username: user[0].username,
    email: user[0].email,
    nameFirst: user[0].nameFirst,
    nameLast: user[0].nameLast,
    plan: user[0].plan,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.SESSION_SECRET)
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  Users().whereNotNull('btb_seasons').then(function(users){
    res.json(users);
  })
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'You forgot to include either your username or your password!'});
  };

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: generateJWT(user)});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
})

router.get('/seasonUsers/:season', async (req, res, next) => {
  const users = await getSeasonUsers.getUsers(req.params.season)
  res.json(users);
})

router.get('/season/:season', function(req, res, next){
  var players = [];
  var seasonQuery = parseInt(req.params.season);
  Users().select('username', 'btb_seasons').then(function(users){
    var len = users.length;
    var count = 0;
    users.forEach(function(user){
      if (user.btb_seasons) {
        var seasons = [];
        var seasonData = user.btb_seasons;
        for (var i=0; i<seasonData.length; i++){
          seasons.push(parseInt(seasonData[i].season));
        };
        if (seasons.indexOf(seasonQuery) != -1) {
          players.push(user.username);
        };
      };
      count ++;
      if (len == count) {
        res.json(players);
      }
    });
  })
})

router.get('/:username', function (req, res, next){
  Users().where({username: req.params.username}).then(function(user){
    res.json(user);
  })
})

router.get('/stats/:username', function (req, res, next){
  var user = req.params.username;
  Users().where({username: user}).pluck('btb_seasons').then(function(seasonData){
    var seasons = [];
    for (var i=0; i<seasonData[0].length; i++) {
      seasons.push(seasonData[0][i].season);
    };
    var userStats = {};
    var len = seasons.length;
    var count = 0;
    seasons.forEach(function(season){
      var int = parseInt(season);
      Picks().where({
        username: user,
        season: int,
        Final: true
      })
      .sum('finalPayout as profit')
      .sum('resultBinary as wins')
      .count('id as total')
      .then(function(stats){
        userStats[season] = {
          profit: stats[0].profit,
          wins: stats[0].wins,
          losses: stats[0].total - stats[0].wins,
          pct: stats[0].wins / stats[0].total
        };
        if (stats[0].wins == null && stats[0].total == 0) {
          userStats[season].wins = 0;
        };
        count++;
        if (count == len) {
          res.json(userStats)
        };
      })
    })
  })
})

router.post('/register', async (req, res, next) => {
  if(!req.body.username || !req.body.password || !req.body.nameFirst || !req.body.nameLast || !req.body.email || !req.body.buyin
  ){
    return res.status(400).json({message: 'You left something blank!'});
  };

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');
  let plan;

  const usernames = await Users().pluck('username');
  if (usernames.indexOf(req.body.username) != -1) {
    return res.status(400).json({message: 'This username has already been taken.'});
  };

  const emails = await Users().pluck('email');
  if (emails.indexOf(req.body.email) != -1) {
    return res.status(400).json({message: 'This email is already in use.'});
  };

  if (!req.body.plan) {
    plan = 'noPlan';
  } else {
    plan = req.body.plan;
  };

  const buyin = parseInt(req.body.buyin);

  const newEntry = [{
    'plan': plan,
    'buyin': buyin,
    'season': currentSeason.fetchSystemYear(),
    'active': true
  }];

  let increment = 0;

  const data = await Users().max('id');
  value = data[0].max;
  increment = value + 1;
  const user = await Users().insert({
      id: increment,
      username: req.body.username,
      nameFirst: req.body.nameFirst,
      nameLast: req.body.nameLast,
      email: req.body.email,
      btb_seasons: newEntry,
      plan: plan,
      buyin: buyin,
      salt: salt,
      hash: hash,
    }, '*');

  const seasonInsert = await UserSeasons().insert({
    username: user[0].username,
    season: currentSeason.fetchSystemYear(),
    buyin: buyin,
    plan: plan,
    ytd_w: 0,
    ytd_l: 0,
    ytd_dollars: 0,
    capper_grade: 0
  }, '*')

  res.json({token: generateJWT(user)});
});

router.put('/reregister', async (req, res, next) => {
  const seasonData = await Users().where({username: req.body.username}).pluck('btb_seasons');
  const buyin = parseInt(req.body.buyin);
  let plan;
  let newEntry;
  let dbSeasons = seasonData[0];
  if (req.body.plan) {
    plan = req.body.plan;
  } else {
    plan = 'noPlan';
  };
  if (dbSeasons != null) {
    dbSeasons.push({
      'plan': plan,
      'buyin': buyin,
      'active': true,
      'season': req.body.newSeason
    })
  } else {
    dbSeasons = [{
      'plan': plan,
      'buyin': buyin,
      'active': true,
      'season': req.body.newSeason
    }]
  }

  const user = await Users().where({username: req.body.username}).update({
    plan: plan,
    btb_seasons: dbSeasons
  }, '*');

  const seasonInsert = await UserSeasons().insert({
    username: user[0].username,
    season: currentSeason.fetchSystemYear(),
    buyin: buyin,
    plan: plan,
    ytd_w: 0,
    ytd_l: 0,
    ytd_dollars: 0,
    capper_grade: 0
  }, '*')

  console.log(user[0].username, ' has been registered for the new season!');
  res.json(user[0].username);
})

module.exports = router;
