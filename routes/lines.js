var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var fetchLines = require('../modules/fetchLines.js');

router.get('/', function(req, res, next){
  fetchLines.allLines().then(function(lines){
    res.json(lines);
  })
})

router.get('/:week', function(req, res, next){
  fetchLines.wkLines(req.params.week).then(function(lines){
    res.json(lines);
  })
})

module.exports = router;
