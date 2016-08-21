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
    getPicks: function(){
      return $http.get('/picks').then(function(picks){
        return picks.data
      })
    },
    getDates: function() {
      return $http.get('/lines')
      .then(function(lines) {
        var dates = [];
        var games = lines.data;
        for (var i in games) {
          if (dates.indexOf(games[i].Week) === -1) {
            dates.push(games[i].Week)
          }
        }
        return dates;
      })
    },
    getDateNumbs: function() {
      return $http.get('/lines')
      .then(function(lines) {
        console.log(lines.data)
        var dateNumbs = [];
        var games = lines.data;
        for (var i in games) {
          if (dateNumbs.indexOf(games[i].DateNumb) === -1) {
            dateNumbs.push(games[i].DateNumb)
          }
        }
        console.log("datenumbs are: " + dateNumbs);
        return dateNumbs;
      })
    }
  }
}
