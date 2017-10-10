var knex = require('../db/knex');

function Lines() {
  return knex('lines');
};

function sortNumber(a, b) {
  return a - b
};

Array.max = function(array){
  return Math.max.apply(Math, array)
};

module.exports = {
  getWeeks: function() {
    return Lines().pluck('Week').distinct().then(function(weeks){
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
