var knex = require('../db/knex');
var setCapperGrades = require('../modules/setCapperGrades.js');

function Lines () {
  return knex('lines')
}

function LineMoves() {
  return knex('line_moves')
}

function Picks() {
  return knex('picks')
}

Array.max = function(array){
  return Math.max.apply(Math, array)
};

Array.min = function(array){
  return Math.min.apply(Math, array)
};

module.exports = {

  setLineRanges: function(game) {
    LineMoves().where({EventID: game.EventID}).then(function(gameArrays){

      if (gameArrays.length < 1) {
        return
      };

      var homeSpreads = gameArrays[0].HomeSpreads;
      var homeSpreadJuices = gameArrays[0].HomeSpreadJuices;
      var awaySpreads = gameArrays[0].AwaySpreads;
      var awaySpreadJuices = gameArrays[0].AwaySpreadJuices;
      var homeMLs = gameArrays[0].HomeMLs;
      var awayMLs = gameArrays[0].AwayMLs;
      var totals = gameArrays[0].Totals;
      var totalOverJuices = gameArrays[0].TotalOverJuices;
      var totalUnderJuices = gameArrays[0].TotalUnderJuices;

      var awayMLValues = [];
      var homeMLValues = [];

      var awaySpreadValues = [];
      var awaySpreadBestJuices = [];
      var awaySpreadObject = {};

      var homeSpreadValues = [];
      var homeSpreadBestJuices = [];
      var homeSpreadObject = {};

      var totalValues = [];
      var totalOverBestJuices = [];
      var totalOverObject = {};
      var totalUnderBestJuices = [];
      var totalUnderObject = {};

      for (var i=0; i<awayMLs.length; i++){
        if (awayMLValues.indexOf(awayMLs[i]) === -1 && awayMLs[i] !== null) {
          awayMLValues.push(awayMLs[i])
        }
      };

      for (var i=0; i<homeMLs.length; i++){
        if (homeMLValues.indexOf(homeMLs[i]) === -1 && homeMLs[i] !== null) {
          homeMLValues.push(homeMLs[i])
        }
      };

      // This loops through the timelog of AwaySpreads and pushes each unique spread into the awaySpreadValues array

      for (var i=0; i<awaySpreads.length; i++) {
        if (awaySpreadValues.indexOf(awaySpreads[i]) === -1 && awaySpreads[i] !== null) {
          awaySpreadValues.push(awaySpreads[i])
        }
      };
      awaySpreadValues.sort();

      // This loops through each spread value and finds the best juice that was ever available for that spread, then writes the values to the awaySpreadObject

      for (var i=0; i<awaySpreadValues.length; i++) {
        var juicesArray = [];
        for (var j=0; j<awaySpreads.length; j++) {
          if (awaySpreads[j] === awaySpreadValues[i]) {
            juicesArray.push(awaySpreadJuices[j])
          };
        };
        var bestJuice = Array.max(juicesArray);
        awaySpreadBestJuices.push(bestJuice);
      };

      awaySpreadObject['spreads'] = awaySpreadValues;
      awaySpreadObject['juices'] = awaySpreadBestJuices;

      for (var i=0; i<homeSpreads.length; i++) {
        if (homeSpreadValues.indexOf(homeSpreads[i]) === -1 && homeSpreads[i] !== null) {
          homeSpreadValues.push(homeSpreads[i])
        }
      };
      homeSpreadValues.sort();

      for (var i=0; i<homeSpreadValues.length; i++) {
        var juicesArray = [];
        for (var j=0; j<homeSpreads.length; j++) {
          if (homeSpreads[j] === homeSpreadValues[i]) {
            juicesArray.push(homeSpreadJuices[j])
          };
        };
        var bestJuice = Array.max(juicesArray);
        homeSpreadBestJuices.push(bestJuice);
      };

      homeSpreadObject['spreads'] = homeSpreadValues;
      homeSpreadObject['juices'] = homeSpreadBestJuices;

      for (var i=0; i<totals.length; i++) {
        if (totalValues.indexOf(totals[i]) === -1 && totals[i] !== null) {
          totalValues.push(totals[i])
        }
      };
      totalValues.sort();

      for (var i=0; i<totalValues.length; i++) {
        var juicesArray = [];
        for (var j=0; j<totals.length; j++) {
          if (totals[j] === totalValues[i]) {
            juicesArray.push(totalOverJuices[j])
          };
        };
        var bestJuice = Array.max(juicesArray);
        totalOverBestJuices.push(bestJuice);
      };

      totalOverObject['totals'] = totalValues;
      totalOverObject['juices'] = totalOverBestJuices;

      for (var i=0; i<totalValues.length; i++) {
        var juicesArray = [];
        for (var j=0; j<totals.length; j++) {
          if (totals[j] === totalValues[i]) {
            juicesArray.push(totalUnderJuices[j])
          };
        };
        var bestJuice = Array.max(juicesArray);
        totalUnderBestJuices.push(bestJuice);
      };

      totalUnderObject['totals'] = totalValues;
      totalUnderObject['juices'] = totalUnderBestJuices;

      var awayMLLow = Array.min(awayMLValues);
      var awayMLHigh = Array.max(awayMLValues);
      var homeMLLow = Array.min(homeMLValues);
      var homeMLHigh = Array.max(homeMLValues);
      var homeSpreadLow = Array.min(homeSpreadValues);
      var homeSpreadHigh = Array.max(homeSpreadValues);
      var awaySpreadLow = Array.min(awaySpreadValues);
      var awaySpreadHigh = Array.max(awaySpreadValues);
      var totalHigh = Array.max(totalValues);
      var totalLow = Array.min(totalValues);

      Lines().where({EventID: game.EventID}).update({
        AwaySpreadIndex: awaySpreadObject,
        HomeSpreadIndex: homeSpreadObject,
        TotalOverIndex: totalOverObject,
        TotalUnderIndex: totalUnderObject,
        AwayMLBest: awayMLHigh,
        AwayMLWorst: awayMLLow,
        HomeMLBest: homeMLHigh,
        HomeMLWorst: homeMLLow,
        TotalHigh: totalHigh,
        TotalLow: totalLow,
        HomeSpreadBest: homeSpreadHigh,
        HomeSpreadWorst: homeSpreadLow,
        AwaySpreadBest: awaySpreadHigh,
        AwaySpreadWorst: awaySpreadLow,
        RangesSet: true
      }, '*').then(function(ret){
        console.log('line move objects have been set for ', ret[0].EventID);
        Picks().where({EventID: ret[0].EventID}).then(function(picks){
          picks.forEach(function(pick){
            setCapperGrades.setCapperGrades(pick);
          })
        })
      })
    })




    // LineMove.find({EventID: game.EventID}, function(err, gameArrays){
    //   if(err) {console.log(err)}
    //
    // }).then(function(gameArrays){
    //
    //   var homeSpreads = gameArrays[0].HomeSpreads;
    //   var homeSpreadJuices = gameArrays[0].HomeSpreadJuices;
    //   var awaySpreads = gameArrays[0].AwaySpreads;
    //   var awaySpreadJuices = gameArrays[0].AwaySpreadJuices;
    //   var homeMLs = gameArrays[0].HomeMLs;
    //   var awayMLs = gameArrays[0].AwayMLs;
    //   var totals = gameArrays[0].Totals;
    //   var totalOverJuices = gameArrays[0].TotalOverJuices;
    //   var totalUnderJuices = gameArrays[0].TotalUnderJuices;
    //
    //   var awayMLValues = [];
    //   var homeMLValues = [];
    //
    //   var awaySpreadValues = [];
    //   var awaySpreadBestJuices = [];
    //   var awaySpreadObject = {};
    //
    //   var homeSpreadValues = [];
    //   var homeSpreadBestJuices = [];
    //   var homeSpreadObject = {};
    //
    //   var totalValues = [];
    //   var totalOverBestJuices = [];
    //   var totalOverObject = {};
    //   var totalUnderBestJuices = [];
    //   var totalUnderObject = {};
    //
    //   for (var i=0; i<awayMLs.length; i++){
    //     if (awayMLValues.indexOf(awayMLs[i]) === -1 && awayMLs[i] !== null) {
    //       awayMLValues.push(awayMLs[i])
    //     }
    //   };
    //
    //   for (var i=0; i<homeMLs.length; i++){
    //     if (homeMLValues.indexOf(homeMLs[i]) === -1 && homeMLs[i] !== null) {
    //       homeMLValues.push(homeMLs[i])
    //     }
    //   };
    //
    //   // This loops through the timelog of AwaySpreads and pushes each unique spread into the awaySpreadValues array
    //
    //   for (var i=0; i<awaySpreads.length; i++) {
    //     if (awaySpreadValues.indexOf(awaySpreads[i]) === -1 && awaySpreads[i] !== null) {
    //       awaySpreadValues.push(awaySpreads[i])
    //     }
    //   };
    //   awaySpreadValues.sort();
    //
    //   // This loops through each spread value and finds the best juice that was ever available for that spread, then writes the values to the awaySpreadObject
    //
    //   for (var i=0; i<awaySpreadValues.length; i++) {
    //     var juicesArray = [];
    //     for (var j=0; j<awaySpreads.length; j++) {
    //       if (awaySpreads[j] === awaySpreadValues[i]) {
    //         juicesArray.push(awaySpreadJuices[j])
    //       };
    //     };
    //     var bestJuice = Array.max(juicesArray);
    //     awaySpreadBestJuices.push(bestJuice);
    //   };
    //
    //   awaySpreadObject['spreads'] = awaySpreadValues;
    //   awaySpreadObject['juices'] = awaySpreadBestJuices;
    //
    //   for (var i=0; i<homeSpreads.length; i++) {
    //     if (homeSpreadValues.indexOf(homeSpreads[i]) === -1 && homeSpreads[i] !== null) {
    //       homeSpreadValues.push(homeSpreads[i])
    //     }
    //   };
    //   homeSpreadValues.sort();
    //
    //   for (var i=0; i<homeSpreadValues.length; i++) {
    //     var juicesArray = [];
    //     for (var j=0; j<homeSpreads.length; j++) {
    //       if (homeSpreads[j] === homeSpreadValues[i]) {
    //         juicesArray.push(homeSpreadJuices[j])
    //       };
    //     };
    //     var bestJuice = Array.max(juicesArray);
    //     homeSpreadBestJuices.push(bestJuice);
    //   };
    //
    //   homeSpreadObject['spreads'] = homeSpreadValues;
    //   homeSpreadObject['juices'] = homeSpreadBestJuices;
    //
    //   for (var i=0; i<totals.length; i++) {
    //     if (totalValues.indexOf(totals[i]) === -1 && totals[i] !== null) {
    //       totalValues.push(totals[i])
    //     }
    //   };
    //   totalValues.sort();
    //
    //   for (var i=0; i<totalValues.length; i++) {
    //     var juicesArray = [];
    //     for (var j=0; j<totals.length; j++) {
    //       if (totals[j] === totalValues[i]) {
    //         juicesArray.push(totalOverJuices[j])
    //       };
    //     };
    //     var bestJuice = Array.max(juicesArray);
    //     totalOverBestJuices.push(bestJuice);
    //   };
    //
    //   totalOverObject['totals'] = totalValues;
    //   totalOverObject['juices'] = totalOverBestJuices;
    //
    //   for (var i=0; i<totalValues.length; i++) {
    //     var juicesArray = [];
    //     for (var j=0; j<totals.length; j++) {
    //       if (totals[j] === totalValues[i]) {
    //         juicesArray.push(totalUnderJuices[j])
    //       };
    //     };
    //     var bestJuice = Array.max(juicesArray);
    //     totalUnderBestJuices.push(bestJuice);
    //   };
    //
    //   totalUnderObject['totals'] = totalValues;
    //   totalUnderObject['juices'] = totalUnderBestJuices;
    //
    //   var awayMLLow = Array.min(awayMLValues);
    //   var awayMLHigh = Array.max(awayMLValues);
    //   var homeMLLow = Array.min(homeMLValues);
    //   var homeMLHigh = Array.max(homeMLValues);
    //   var homeSpreadLow = Array.min(homeSpreadValues);
    //   var homeSpreadHigh = Array.max(homeSpreadValues);
    //   var awaySpreadLow = Array.min(awaySpreadValues);
    //   var awaySpreadHigh = Array.max(awaySpreadValues);
    //   var totalHigh = Array.max(totalValues);
    //   var totalLow = Array.min(totalValues);

  //     Line.findOneAndUpdate({EventID: game.EventID}, {
  //       $set: {
  //         AwaySpreadIndex: awaySpreadObject,
  //         HomeSpreadIndex: homeSpreadObject,
  //         TotalOverIndex: totalOverObject,
  //         TotalUnderIndex: totalUnderObject,
  //         AwayMLBest: awayMLHigh,
  //         AwayMLWorst: awayMLLow,
  //         HomeMLBest: homeMLHigh,
  //         HomeMLWorst: homeMLLow,
  //         TotalHigh: totalHigh,
  //         TotalLow: totalLow,
  //         HomeSpreadBest: homeSpreadHigh,
  //         HomeSpreadWorst: homeSpreadLow,
  //         AwaySpreadBest: awaySpreadHigh,
  //         AwaySpreadWorst: awaySpreadLow,
  //         RangesSet: true
  //       }
  //     }, function(err){
  //       if (err) {console.log(err)};
  //
  //       console.log("line move objects have been set for ", game.EventID);
  //     });
  //   })
  // }
  }
}
