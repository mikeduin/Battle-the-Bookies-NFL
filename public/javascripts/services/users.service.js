angular
  .module('battleBookies')
  .factory('usersService', ['$http', usersService])

function usersService ($http) {
  return {
    getAllUsers: function () {
      return $http.get('/users').then(function(users){
        return users.data
      })
    },
    getUser: function(username) {
      return $http.get('/users/' + username).then(function(user){
        return user.data
      })
    },
    getUserPicks: function(username){
      return $http.get('picks/' + username + '/all').then(function(result){
        return result.data
      })
    },
    getMatchups: function(){
      return $http.get('/matchups').then(function(result){
        return result.data
      })
    },
    getSeasonStats: function(username){
      return $http.get('/users/stats/' + username).then(function(result){
        return result.data
      })
    }
  }

}
