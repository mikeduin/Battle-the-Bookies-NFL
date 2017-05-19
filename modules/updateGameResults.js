var fetch = require('node-fetch');
var mongoose = require('mongoose');
var knex = require('../db/knex');

function Results () {
  return knex('results');
};

function Lines () {
  return knex('lines');
}

// This function updates game results.

module.exports = {

  updateGameResults: function() {
    fetch('https://jsonodds.com/api/results/mlb?oddType=Game&final=true', {
      method: 'GET',
      headers: {
        'JsonOdds-API-Key': process.env.API_KEY
      }
    }).then(function(res){
      return res.json()
    }).then(function(results){
      Results().pluck('EventID').then(function(events){
        for (i=0; i<results.length; i++) {
          if (events.indexOf(results[i].EventID) === -1 && results[i].FinalType === 'Finished') {
            Results().insert({
              EventID: results[i].EventID,
              HomeScore: results[i].HomeScore,
              AwayScore: results[i].AwayScore,
              OddType: results[i].OddType,
              Final: results[i].Final,
              FinalType: results[i].FinalType
            }, '*').then(function(game){
              Lines().where({EventID: game[0].EventID}).update({
                HomeScore: game[0].HomeScore,
                AwayScore: game[0].AwayScore,
                GameStatus: "Final"
              }, '*').then(function(line){
                console.log('line has been updated with final score');
              })
            })
          }
        }
      }).then(function(){
        console.log('results have been updated');
      })
    })
  }
}
