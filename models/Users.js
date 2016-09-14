var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
require('dotenv').load();

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  nameFirst: String,
  nameLast: String,
  buyin: String,
  hash: String,
  salt: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  w1dollars: Number,
  w1wins: Number,
  w1games: Number,
  w2dollars: Number,
  w2wins: Number,
  w2games: Number,
  w3dollars: Number,
  w3wins: Number,
  w3games: Number,
  w4dollars: Number,
  w4wins: Number,
  w4games: Number,
  w5dollars: Number,
  w5wins: Number,
  w5games: Number,
  w6dollars: Number,
  w6wins: Number,
  w6games: Number,
  w7dollars: Number,
  w7wins: Number,
  w7games: Number,
  w8dollars: Number,
  w8wins: Number,
  w8games: Number,
  w9dollars: Number,
  w9wins: Number,
  w9games: Number,
  w10dollars: Number,
  w10wins: Number,
  w10games: Number,
  w11dollars: Number,
  w11wins: Number,
  w11games: Number,
  w12dollars: Number,
  w12wins: Number,
  w12games: Number,
  w13dollars: Number,
  w13wins: Number,
  w13games: Number,
  w14wins: Number,
  w14games: Number,
  w14dollars: Number,
  w15dollars: Number,
  w15wins: Number,
  w15games: Number,
  w16dollars: Number,
  w16wins: Number,
  w16games: Number,
  w17dollars: Number,
  w17wins: Number,
  w17games: Number,
  totalDollars: Number,
  totalW: Number,
  totalG: Number,
  totalL: Number,
  ytdPct: Number
})

UserSchema.methods.setPassword = function(password) {

  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  // this function sets expiration of token to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+ 60);

  //this function below takes two arguments - the payload that will be signed by the JWT + the secret. Hard-coding 'SECRET' for now but need to come back and change that to an environment variable so the secret is kept out of our code. This 'SECRET' reference is also included in the auth variable in index.js, so remember to change that too.
  return jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email,
    nameFirst: this.nameFirst,
    nameLast: this.nameLast,
    exp: parseInt(exp.getTime() / 1000),
  }, process.env.SESSION_SECRET)
};

mongoose.model('User', UserSchema)
