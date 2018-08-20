angular
  .module('battleBookies')
  .factory('oddsService', ['$http', oddsService])

function oddsService ($http) {
  return {
    updateOdds: function() {
      return $http.get('/updateOdds').then(function(){
        console.log("odds updated")
      })
    },
    getNflLines: function(season) {
      return $http.get('/lines/season/' + season).then(function(lines){
        return lines.data
      })
    },
    getWeeklyNflLines: function(week) {
      return $http.get('/lines/' + week).then(function(lines){
        return lines.data
      })
    },
    getPicks: function(){
      return $http.get('/picks').then(function(picks){
        return picks.data
      })
    },
    getWeeklyPicks: function(week){
      return $http.get('/picks/' + week).then(function(picks){
        return picks.data
      })
    },
    getDates: function(season) {
      return $http.get('/weeks/' + season)
      .then(function(weeks) {
        return weeks.data;
      })
    },
    getSeasons: function() {
      return $http.get('/seasons')
      .then(function(seasons){
        return seasons.data;
      })
    }
  }
}
