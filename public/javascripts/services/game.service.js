angular
  .module('battleBookies')
  .factory('gameService', [$http, gameService])

function gameService ($http) {
  return {
    getArrays: function(game) {
      return $http.get('pullGame/' + game.EventID).then(function(result){
        return result
      })
    },
    getLineData: function(game){
      
    }
  }
}
