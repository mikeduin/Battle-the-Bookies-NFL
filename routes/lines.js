var express = require('express');
var router = express.Router();
var fetchLines = require('../modules/fetchLines.js');

router.get('/season/:season', function(req, res, next){
  fetchLines.allLines(req.params.season).then(function(lines){
    res.json(lines);
  })
})

router.get('/:season/:week', function(req, res, next){
  fetchLines.wkLines(req.params.season, req.params.week).then(function(lines){
    res.json(lines);
  })
})

module.exports = router;
