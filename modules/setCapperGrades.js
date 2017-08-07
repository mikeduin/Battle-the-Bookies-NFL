var knex = require('../db/knex');

function Lines() {
  return knex('lines')
}

function Picks() {
  return knex('picks')
}

module.exports = {


  setCapperGrades: function(retObj){
    var pick = retObj.pick;
    var game = retObj.game;
    var startGrade = 10;
    var capperGrade;
    var bestLineAvail;
    var bestJuiceAvail;
    var pickID = pick.id;

    if (pick.pickType === "Away Spread") {
      bestLineAvail = line[0].AwaySpreadBest;
      if (pick.activeSpread > bestLineAvail) {
        bestLineAvail = pick.activeSpread
      };
      startGrade -= (bestLineAvail - pick.activeSpread);
      var sprIndex = line[0].AwaySpreadIndex.spreads.indexOf(pick.activeSpread);
      bestJuiceAvail = line[0].AwaySpreadIndex.juices[sprIndex];
      if (pick.activeLine > bestJuiceAvail) {
        bestJuiceAvail = pick.activeLine
      };
      if (bestJuiceAvail < 1) {
        capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
      } else {
        if (pick.activeLine < 1) {
          capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
        } else {
          capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
        }
      }
    } else if (pick.pickType === "Home Spread") {
      bestLineAvail = line[0].HomeSpreadBest;
      if (pick.activeSpread > bestLineAvail) {
        bestLineAvail = pick.activeSpread
      };
      startGrade -= (bestLineAvail - pick.activeSpread);
      var sprIndex = line[0].HomeSpreadIndex.spreads.indexOf(pick.activeSpread);
      bestJuiceAvail = line[0].HomeSpreadIndex.juices[sprIndex];
      if (pick.activeLine > bestJuiceAvail) {
        bestJuiceAvail = pick.activeLine
      };
      if (bestJuiceAvail < 1) {
        capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
      } else {
        if (pick.activeLine < 1) {
          capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
        } else {
          capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
        }
      }
    } else if (pick.pickType === "Away Moneyline") {
      bestLineAvail = line[0].AwayMLBest;
      bestJuiceAvail = 0;
      if (pick.activeLine > bestLineAvail) {
        bestLineAvail = pick.activeLine
      };
      if (bestLineAvail < 1) {
        startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
      } else {
        if (pick.activeLine < 1) {
          startGrade -= (((bestLineAvail - (pick.activeLine+200))/20)*0.5)
        } else {
          startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
        }
      }
      capperGrade = startGrade;
    } else if (pick.pickType === "Home Moneyline") {
      bestLineAvail = line[0].HomeMLBest;
      bestJuiceAvail = 0;
      if (pick.activeLine > bestLineAvail) {
        bestLineAvail = pick.activeLine
      };
      if (bestLineAvail < 1) {
        startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
      } else {
        if (pick.activeLine < 1) {
          startGrade -= (((bestLineAvail - (pick.activeLine+200))/20)*0.5)
        } else {
          startGrade -= (((bestLineAvail - pick.activeLine)/20)*0.5)
        }
      }
      capperGrade = startGrade;
    } else if (pick.pickType === "Total Over") {
      bestLineAvail = line[0].TotalLow;
      if (pick.activeTotal < bestLineAvail) {
        bestLineAvail = pick.activeTotal
      };
      startGrade -= (pick.activeTotal - bestLineAvail);
      var totIndex = line[0].TotalOverIndex.totals.indexOf(pick.activeTotal);
      bestJuiceAvail = line[0].TotalOverIndex.juices[totIndex];
      if (pick.activeLine > bestJuiceAvail) {
        bestJuiceAvail = pick.activeLine
      };
      if (bestJuiceAvail < 1) {
        capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
      } else {
        if (pick.activeLine < 1) {
          capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
        } else {
          capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
        }
      }
    } else if (pick.pickType === "Total Under"){
      bestLineAvail = line[0].TotalHigh;
      if (pick.activeTotal > bestLineAvail) {
        bestLineAvail = pick.activeTotal
      };
      startGrade -= (bestLineAvail - pick.activeTotal);
      var totIndex = line[0].TotalUnderIndex.totals.indexOf(pick.activeTotal);
      bestJuiceAvail = line[0].TotalUnderIndex.juices[totIndex];
      if (pick.activeLine > bestJuiceAvail) {
        bestJuiceAvail = pick.activeLine
      };
      if (bestJuiceAvail < 1) {
        capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
      } else {
        if (pick.activeLine < 1) {
          capperGrade = startGrade - (((bestJuiceAvail - (pick.activeLine+200))/5)*0.1)
        } else {
          capperGrade = startGrade - (((bestJuiceAvail - pick.activeLine)/5)*0.1)
        }
      }
    } else {
      console.log ("pick is null");
      return;
    };

    Picks().where({id: pickID}).update({
      capperGrade: capperGrade,
      capperGraded: true,
      bestLineAvail: bestLineAvail,
      bestJuiceAvail: bestJuiceAvail
    }, '*').then(function(ret){
      console.log(ret[0].EventID, ' has been updated with capperGrade')
      return ret[0].EventID;
    })
  }
}
