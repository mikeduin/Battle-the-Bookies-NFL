var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
//
// router.get('/:season', async (req, res, next) => {
//   // let standings = await knex.mainDb('standings')
//   //   .leftJoin('')
//   console.log('hello');
// })

router.get('/', function(req, res, next) {
  Users().whereNotNull('btb_seasons').then(function(users){
    res.json(users);
  })
});
