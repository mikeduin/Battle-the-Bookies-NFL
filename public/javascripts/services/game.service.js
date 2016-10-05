angular
  .module('battleBookies')
  .factory('gameService', ['$http', gameService])

function gameService ($http) {
  return {
    getPickArrays: function(game) {
      return $http.get('/pullGame/' + game.EventID).then(function(result){
        return result.data
      })
    },
    getLineData: function(game){
      return $http.get('/line/' + game.EventID).then(function(result){
        return result.data
      })
    }
  }
}
