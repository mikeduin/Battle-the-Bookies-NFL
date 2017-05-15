var express = require('express');
var router = express.Router();
var knex = require ('../db/knex');
var crypto = require('crypto');

function Users() {
  return knex('users');
}

function generateJWT (user) {
  // this function sets expiration of token to 1000 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+ 1000);

  //this function below takes two arguments - the payload that will be signed by the JWT + the secret. Hard-coding 'SECRET' for now but need to come back and change that to an environment variable so the secret is kept out of our code. This 'SECRET' reference is also included in the auth variable in index.js, so remember to change that too.
  return jwt.sign({
    _id: user._id,
    username: user.username,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.SESSION_SECRET)
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password || !req.body.nameFirst || !req.body.nameLast || !req.body.email || !req.body.buyin
  ){
    return res.status(400).json({message: 'You left something blank!'});
  };

  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64).toString('hex');

  Users().insert({
    username: req.body.username,
    nameFirst: req.body.nameFirst,
    nameLast: req.body.nameLast,
    email: req.body.email,
    buyin: req.body.buyin,
    salt: salt,
    hash: hash,
  }, '*').then(function(user){
    // delete this logging later, just making sure we get to this step
    console.log('user has been added to the database!')
    console.log('user is ', user)
  });
});

module.exports = router;
