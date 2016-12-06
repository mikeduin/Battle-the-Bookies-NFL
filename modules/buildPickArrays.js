var mongoose = require('mongoose');
var Pick = mongoose.model('Pick');
var PickArray = mongoose.model('PickArray');
var Line = mongoose.model('Line');

module.exports = {

  buildPickArrays: function(game){
    var overPickArray = [];
    var underPickArray = [];
    var homeSpreadPickArray = [];
    var awaySpreadPickArray = [];
    var homeMLPickArray = [];
    var awayMLPickArray = [];
    var noPickArray = [];
    Pick.find({EventID: game.EventID}, function(err, picks){
      if(err) {console.log(err)}

    }).then(function(picks){
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

    }).then(function (){
      PickArray.findOneAndUpdate({EventID: game.EventID}, {
        $set: {
          EventID: game.EventID,
          OverPickArray: overPickArray,
          UnderPickArray: underPickArray,
          AwaySpreadPickArray: awaySpreadPickArray,
          HomeSpreadPickArray: homeSpreadPickArray,
          AwayMLPickArray: awayMLPickArray,
          HomeMLPickArray: homeMLPickArray,
          NoPickArray: noPickArray
        }
      }, {upsert: true}, function(err){
        if(err) {console.log(err)}

        console.log("arrays have been built for", game.EventID)

      })
    }).then(function(){
      Line.findOneAndUpdate({EventID: game.EventID}, {$set:
        {
          ArraysBuilt: true
        }
      }, function(err, updatedLine){
        if (err) {console.log(err)}

        console.log('arrays built set to true for', updatedLine.EventID)
      })
    })
  }

}
