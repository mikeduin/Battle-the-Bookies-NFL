var knex = require ('../db/knex');
var moment = require('moment');
var setWeek = require('../modules/weekSetter.js');

var mainDb = knex.mainDb;
var userDb = knex.userDb;

function Lines() {
  return mainDb('lines');
};

module.exports = {
  allLines: function(season) {
    // hide triple-week setting in offseason
    // var week = setWeek.weekSetter(moment());
    // var week2 = setWeek.weekSetter(moment().add(1, 'w'));
    // var week3 = setWeek.weekSetter(moment().subtract(1, 'w'));
    return Lines()
    // .whereIn('Week', [week, week2, week3])
    .where({season: season})
    .whereNotIn('Week', ['Preseason', 'Postseason']);
  },

  wkLines: function(season, week) {
    if (week.length === 1) {
      week = "0"+week;
    } else {
      week = week;
    };
    return Lines().where({
      season: season,
      WeekNumb: week
    });
  },

  byID: function(id) {
    return Lines().where({EventID: id});
  },

  matchups: function() {
    return Lines().then(function(lines){
      var matchups = {};
      for (var i=0; i<lines.length; i++){
        var id = lines[i].EventID;
        var obj = {}

        matchups[id] = {
          "HomeAbbrev": lines[i].HomeAbbrev,
          "AwayAbbrev": lines[i].AwayAbbrev
        }
      };

      return matchups;
    })
  }

}
