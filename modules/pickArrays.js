var moment = require('moment');
var knex = require('../db/knex');
var mainDb = knex.mainDb;
var userDb = knex.userDb;

function Lines() {
  return mainDb('lines');
}

function Picks() {
  return mainDb('picks');
}

function PickArrays() {
  return mainDb('pick_arrays');
}

module.exports = {

  buildArrays: function(game) {
    var overPickArray = [];
    var underPickArray = [];
    var homeSpreadPickArray = [];
    var awaySpreadPickArray = [];
    var homeMLPickArray = [];
    var awayMLPickArray = [];
    var noPickArray = [];
    Picks().where({EventID: game}).then(function(picks){
      picks.forEach(function(pick){
        var relevantLine;
        if (pick.pickType === "Total Over" || pick.pickType === "Total Under") {
          relevantLine = pick.activeTotal
        } else if (pick.pickType === "Home Spread" || pick.pickType === "Away Spread") {
          relevantLine = pick.activeSpread
        } else {
          relevantLine = pick.activeLine
        };
        var pickObject = {
          id: pick.id,
          username: pick.username,
          submittedAt: pick.submittedAt,
          pickType: pick.pickType,
          geoType: pick.geoType,
          betType: pick.betType,
          favType: pick.favType,
          activePayout: pick.activePayout,
          activePick: pick.activePick,
          activeLine: pick.activeLine,
          capperGrade: pick.capperGrade,
          relevantLine: relevantLine
        };
        if (pick.pickType === "Total Over") {
          overPickArray.push(pickObject)
        } else if (pick.pickType === "Total Under") {
          underPickArray.push(pickObject)
        } else if (pick.pickType === "Away Spread") {
          awaySpreadPickArray.push(pickObject)
        } else if (pick.pickType === "Home Spread") {
          homeSpreadPickArray.push(pickObject)
        } else if (pick.pickType === "Away Moneyline") {
          awayMLPickArray.push(pickObject)
        } else if (pick.pickType === "Home Moneyline") {
          homeMLPickArray.push(pickObject)
        } else {
          noPickArray.push(pickObject)
        };
      })
    }).then(function(){
      PickArrays().insert({
        EventID: game,
        OverPickArray: overPickArray,
        UnderPickArray: underPickArray,
        AwaySpreadPickArray: awaySpreadPickArray,
        HomeSpreadPickArray: homeSpreadPickArray,
        AwayMLPickArray: awayMLPickArray,
        HomeMLPickArray: homeMLPickArray,
        NoPickArray: noPickArray
      }, '*').then(function(arrays){
        Lines().where({EventID: arrays[0].EventID}).update({
          ArraysBuilt: true
        }, '*').then(function(built){
          console.log('pick arrays added for ', built[0].EventID)
        })
      })
    })
  },
  byId: function(id){
    return PickArrays().where({EventID: id}).then(function(arrays){
      return arrays
    });
  }
}
