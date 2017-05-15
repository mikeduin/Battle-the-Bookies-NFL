// THIS CAN BE DELETED ONCE FULL USER MIGRATION TO POSTGRES HAS BEEN COMPLETED

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
  resetPasswordExpires: Date
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
  // this function sets expiration of token to 300 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate()+ 300);

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
