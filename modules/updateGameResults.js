var fetch = require('node-fetch');
var knex = require('../db/knex');

function Results () {
  return knex('results');
};

function Lines () {
  return knex('lines');
};

function Picks () {
  return knex('picks');
}

// This function updates game results.

module.exports = {

  updateGameResults: function() {
    fetch('https://jsonodds.com/api/results/nfl?oddType=Game&final=true', {
      method: 'GET',
      headers: {
        'x-api-Key': process.env.API_KEY
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
              }).then(function(){
                console.log('line has been updated with final score');
                Picks()
                  .where({EventID: game[0].EventID})
                  .whereNot({
                    Week: "Preseason",
                    Week: "Postseason"
                  })
                  .update({
                    HomeScore: game[0].HomeScore,
                    AwayScore: game[0].AwayScore,
                    Final: true
                }, '*').then(function(picks){
                  picks.forEach(function(pick){
                    var activePayout = pick.activePayout;
                    if (
                      ((pick.pickType === "Away Moneyline") && (pick.AwayScore > pick.HomeScore))
                      ||
                      ((pick.pickType === "Home Moneyline") && (pick.HomeScore > pick.AwayScore))
                      ||
                      ((pick.pickType === "Away Spread") && ((pick.activeSpread + pick.AwayScore) > pick.HomeScore))
                      ||
                      ((pick.pickType === "Home Spread") && ((pick.activeSpread + pick.HomeScore) > pick.AwayScore))
                      ||
                      ((pick.pickType === "Total Over") && ((pick.HomeScore + pick.AwayScore) > pick.activeTotal))
                      ||
                      ((pick.pickType === "Total Under") && ((pick.HomeScore + pick.AwayScore) < pick.activeTotal))
                    ) {
                      // 5.22 COMMENT: IF THERE IS AN ERROR HERE, KEEP IN REMIND THAT THIS USED TO BE id: pick._id ... TRY CHANGING BACK?
                        Picks().where({id: pick.id}).update({
                          pickResult: "win",
                          resultBinary: 1,
                          finalPayout: activePayout
                        }).then(function(){
                          console.log(pick.id, " has been graded a win")
                        });
                      } else if (
                        ((pick.pickType === "Away Moneyline") && (pick.AwayScore === pick.HomeScore))
                        ||
                        ((pick.pickType === "Home Moneyline") && (pick.HomeScore === pick.AwayScore))
                        ||
                        ((pick.pickType === "Away Spread") && ((pick.activeSpread + pick.AwayScore) === pick.HomeScore))
                        ||
                        ((pick.pickType === "Home Spread") && ((pick.activeSpread + pick.HomeScore) === pick.AwayScore))
                        ||
                        ((pick.pickType === "Total Over") && ((pick.HomeScore + pick.AwayScore) === pick.activeTotal))
                        ||
                        ((pick.pickType === "Total Under") && ((pick.HomeScore + pick.AwayScore) === pick.activeTotal))
                      ) {
                          Picks().where({id: pick.id}).update({
                            pickResult: "push",
                            resultBinary: 0.5,
                            finalPayout: 0.00000001
                          }).then(function(){
                            console.log(pick.id, " has been graded a push")
                          });
                      }
                       else
                      {
                        Picks().where({id: pick.id}).update({
                          pickResult: "loss",
                          resultBinary: 0,
                          finalPayout: -100
                        }).then(function(){
                          console.log(pick.id, " has been graded a loss")
                        });
                      };
                  })
                })
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
