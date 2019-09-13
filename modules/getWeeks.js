var knex = require('../db/knex');
var mainDb = knex.mainDb;
var userDb = knex.userDb;

function Lines() {
  return mainDb('lines');
};

function sortNumber(a, b) {
  return a - b
};

Array.max = function(array){
  return Math.max.apply(Math, array)
};

module.exports = {
  getWeeks: function(season) {
    return Lines()
      .where({season: season})
      .whereNot({WeekNumb: "PRE"})
      .whereNot({WeekNumb: "POST"})
      .pluck('Week').distinct().then(function(weeks){
      var weekNumbers = [];
      var newWeeks = [];
      for (i=0; i<weeks.length; i++) {
        if (weeks[i] !== 'Preseason' && weeks[i] !== 'Postseason'){
          var weekNumber = parseInt(weeks[i].substring(5));
          weekNumbers.push(weekNumber);
        }
      };
      var maxWeek = Array.max(weekNumbers);
      for (i=1; i<maxWeek+1; i++) {
        var newWeek = "Week " + i;
        if (newWeek !== 'Week NaN') {
          newWeeks.push(newWeek)
        };
      };
      return newWeeks;
    })
  }
}
