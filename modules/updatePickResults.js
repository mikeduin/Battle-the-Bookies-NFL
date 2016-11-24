var mongoose = require('mongoose');
var Pick = mongoose.model('Pick');
var Result = mongoose.model('Result');

// This function looks for picks that have a finalPayout of ZERO (e.g., they have not been 'settled' yet) then checks to see if the Result of that pick's game is final. If the result IS final, it updates the picks with the HomeScore and AwayScore and sets 'Final' to true for that pick. THEN, it runs through each potential outcome based on PickType and updates the result variables accordingly.

module.exports = {

  updatePickResults: function(){
    Pick.find({finalPayout: 0}, function (err, picks){
      if (err) {console.log(err)}

    }).then(function(picks){
      picks.forEach(function(pick){
        var HomeScore;
        var AwayScore;
        Result.findOne({EventID: pick.EventID}, function (err, result){
          if(err) {next(err)};

          if(!result) {return};

          if(result.Final === true) {
            var HomeScore = result.HomeScore;
            var AwayScore = result.AwayScore;

            Pick.update({"_id": pick._id}, {
              HomeScore: HomeScore,
              AwayScore: AwayScore,
              Final: true
            }, function (err, pick) {
              if (err) {console.log(err)}

            })
          }
        }).then(function(result){
          Pick.find({EventID: result.EventID}, function(err, picks){
            if (err) {console.log(err)}

          }).then(function(picks){
            picks.forEach(function(pick){
              var activePayout = pick.activePayout;

              if (pick.Final === true) {

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
                    Pick.update({"_id": pick._id}, {
                      pickResult: "win",
                      resultBinary: 1,
                      finalPayout: activePayout,
                    }, function(err, result){
                      if (err) {console.log(err)}
                    })
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
                      Pick.update({"_id": pick._id}, {
                        pickResult: "push",
                        resultBinary: 0.5,
                        finalPayout: 0.00001,
                      }, function(err, result){
                        if (err) {console.log(err)}
                      })
                    }
                   else
                  {
                    Pick.update({"_id": pick._id}, {
                      pickResult: "loss",
                      resultBinary: 0,
                      finalPayout: -100,
                    }, function(err, result){
                      if (err) {console.log(err)}
                    })
                  }
                }
              })
            })
          })
        })
      })
    console.log('picks updated at ' + new Date())
  }
}
