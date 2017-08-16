var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var knex = require ('../db/knex');
var crypto = require ('crypto');

function Users() {
  return knex('users');
}

function checkPassword (user, password) {
  var hash = crypto.pbkdf2Sync(password, user[0].salt, 1000, 64, 'sha512').toString('hex');

  return user[0].hash === hash;
};

passport.use(new LocalStrategy(function(username, password, done) {
  Users().where({username: username}).then(function(user){
    if (user.length === 0) {
      return done(null, false, {
        message: 'Username not found'
      });
    };
    if (!checkPassword(user, password)) {
      return done(null, false, {
        message: 'Password is incorrect'
      });
    };
    return done(null, user);
  })
}));
