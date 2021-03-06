angular
  .module('battleBookies')
  .factory('picksService', ['$http', 'authService', picksService])

function picksService ($http, authService) {
  return {
    submitPick: function(pick) {
      return $http.put('/picks', pick, {
        headers: {Authorization: 'Bearer ' + authService.getToken()}
      })
    },
    addTemplate: function(game) {
      return $http.post('/picks/addTemp', game, {
        headers: {Authorization: 'Bearer ' + authService.getToken()}
      })
    },
    checkSubmission: function(game){
      return $http.get('/picks/checkSubmission/' + game.EventID, {
        headers: {Authorization: 'Bearer ' + authService.getToken()}
      }).then(function(result){
        return result.data
      })
    },
    checkTemplates: function(){
      return $http.get('/checkTemplates').then(function(result){
        return result
      })
    },
    checkGametimes: function(){
      return $http.get('/checkGametimes').then(function(result){
        console.log(result)
      })
    },
    sumWeek: function(username, season, weeknumb) {
      return $http.get('/picks/' + username + '/' + season + '/' + weeknumb).then(function(result){
        var weekPicks = result.data;
        var total = 0;
        for (i=0; i<weekPicks.length; i++) {
          var pickPayout = weekPicks[i].finalPayout;
          total += pickPayout;
        };
        return total;
      })
    },
    sumWeeklyPicks: function (season, week) {
      return $http.get(`/picks/sumWeekly/${season}/${week}`).then(res => {
        return res.data;
      })
    },
    sumSeasonPicks: function(username, season) {
      return $http.get('/picks/' + username + '/' + season + '/all').then(function(result){
        var ytdPicks = result.data;
        var totalDollars = 0;
        var totalW = 0;
        var totalG = 0;
        for (i=0; i<ytdPicks.length; i++) {
          var pickPayout = ytdPicks[i].finalPayout;
          var resultBinary = ytdPicks[i].resultBinary;
          if (typeof resultBinary === 'number') {
            totalDollars += pickPayout;
            totalW += resultBinary;
            totalG += 1;
          };
        }
        return {
          totalDollars: totalDollars,
          totalW: totalW,
          totalG: totalG
        }
      })
    },
    sumAllPicks: function(username, year) {
      return $http.get('/picks/' + username + '/all').then(function(result){
        var ytdPicks = result.data;
        var totalDollars = 0;
        var totalW = 0;
        var totalG = 0;
        for (i=0; i<ytdPicks.length; i++) {
          var pickPayout = ytdPicks[i].finalPayout;
          var resultBinary = ytdPicks[i].resultBinary;
          if (typeof resultBinary === 'number') {
            totalDollars += pickPayout;
            totalW += resultBinary;
            totalG += 1;
          };
        }
        return {
          totalDollars: totalDollars,
          totalW: totalW,
          totalG: totalG
        }
      })
    },
    getPickStats: function(username, season){
      console.log('gets to getPickStats');
      return $http.get('/picks/' + username + '/stats/' + season).then(function(stats){
        return stats
      })
    },
    getWeeklyStats: function(username, season){
      return $http.get('/weeklyStats/' + username + '/' + season).then(function(result){
        return result
      })
    }
  }
}
