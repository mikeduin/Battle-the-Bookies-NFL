var mongoose = require('mongoose');
var Line = mongoose.model('Line');
var Result = mongoose.model('Result');

// This function runs every eight minutes and checks to see if a game is final and, if so, updates the line data with the final score and change's the game status

module.exports = {
  updateFinalScores: function(){
    Line.find({
      GameStatus: {
        $ne: "Final"
      }
    }, function(err, lines){
      if (err) {console.log(err)}
    }).then(function(lines){
      lines.forEach(function(line){
        Result.find({EventID: line.EventID}, function(err, result){
          if (err) {console.log(err)}

        }).then(function(result){
          if (result[0].Final === true) {
            Line.update({EventID: result[0].EventID}, {
              HomeScore: result[0].HomeScore,
              AwayScore: result[0].AwayScore,
              GameStatus: "Final"
            }, function(err, message){
              if(err) {console.log(err)}

              console.log("game final has been updated")
            })
          } else {
            console.log(result[0].EventID + " is not final")
          }
        })
      })
    })
  }
}
