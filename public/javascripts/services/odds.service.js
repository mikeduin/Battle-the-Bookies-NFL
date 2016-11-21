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
    getNflLines: function() {
      return $http.get('/lines').then(function(lines){
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
    getDates: function() {
      return $http.get('/weeks')
      .then(function(weeks) {
        return weeks.data;
      })
    }
  }
}
