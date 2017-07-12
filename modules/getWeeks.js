var knex = require('../db/knex');

function Lines() {
  return knex('lines');
};

function sortNumber(a, b) {
  return a - b
};

module.exports = {
  getWeeks: function() {
    return Lines().pluck('Week').distinct().then(function(weeks){
      var weekNumbers = [];
      var newWeeks = [];
      for (i=0; i<weeks.length; i++) {
        var weekNumber = parseInt(weeks[i].substring(5));
        weekNumbers.push(weekNumber);
      };
      weekNumbers.sort(sortNumber);
      for (i=0; i<weekNumbers.length; i++) {
        var newWeek = "Week " + weekNumbers[i];
        if (newWeek !== 'Week NaN') {
          newWeeks.push(newWeek)
        };
      };
      return newWeeks;
    })
  }
}
