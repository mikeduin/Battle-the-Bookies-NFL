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
    var line = retObj.game;
    var startGrade = 10;
    var capperGrade;
    var bestLineAvail;
    var bestJuiceAvail;
    var pickID = pick.id;

    if (pick.pickType !== undefined) {
      if (pick.pickType === "Away Spread") {
        bestLineAvail = line.AwaySpreadBest;
        if (pick.activeSpread > bestLineAvail) {
          bestLineAvail = pick.activeSpread
        };
        startGrade -= (bestLineAvail - pick.activeSpread);
        var sprIndex = line.AwaySpreadIndex.spreads.indexOf(pick.activeSpread);
        bestJuiceAvail = line.AwaySpreadIndex.juices[sprIndex];
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
        bestLineAvail = line.HomeSpreadBest;
        if (pick.activeSpread > bestLineAvail) {
          bestLineAvail = pick.activeSpread
        };
        startGrade -= (bestLineAvail - pick.activeSpread);
        var sprIndex = line.HomeSpreadIndex.spreads.indexOf(pick.activeSpread);
        bestJuiceAvail = line.HomeSpreadIndex.juices[sprIndex];
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
        bestLineAvail = line.AwayMLBest;
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
        bestLineAvail = line.HomeMLBest;
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
        bestLineAvail = line.TotalLow;
        if (pick.activeTotal < bestLineAvail) {
          bestLineAvail = pick.activeTotal
        };
        startGrade -= (pick.activeTotal - bestLineAvail);
        var totIndex = line.TotalOverIndex.totals.indexOf(pick.activeTotal);
        bestJuiceAvail = line.TotalOverIndex.juices[totIndex];
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
        bestLineAvail = line.TotalHigh;
        if (pick.activeTotal > bestLineAvail) {
          bestLineAvail = pick.activeTotal
        };
        startGrade -= (bestLineAvail - pick.activeTotal);
        var totIndex = line.TotalUnderIndex.totals.indexOf(pick.activeTotal);
        bestJuiceAvail = line.TotalUnderIndex.juices[totIndex];
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
      };

      return Picks().where({id: pickID}).update({
        capperGrade: capperGrade,
        capperGraded: true,
        bestLineAvail: bestLineAvail,
        bestJuiceAvail: bestJuiceAvail
      }, '*').then(function(ret){
        return ret[0].EventID;
      })
    } else {
      return line.EventID;
    };
  }
}
