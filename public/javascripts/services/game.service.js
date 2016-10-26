angular
  .module('battleBookies')
  .factory('gameService', ['$http', gameService])

function gameService ($http) {
  return {
    getPickArrays: function(EventID) {
      return $http.get('/pullGame/' + EventID).then(function(result){
        return result.data
      })
    },
    getLineData: function(EventID){
      return $http.get('/line/' + EventID).then(function(result){
        return result.data
      })
    },
    getLineMoves: function(EventID){
      return $http.get('/linemove/' + EventID).then(function(result){
        return result.data
      })
    }
  }
}
